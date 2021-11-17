package tangle

import (
	"math"
	"sync"
	"time"

	"github.com/cockroachdb/errors"
	"github.com/iotaledger/hive.go/events"
	"github.com/iotaledger/hive.go/identity"
	"github.com/iotaledger/hive.go/typeutils"
	"go.uber.org/atomic"

	"github.com/iotaledger/goshimmer/packages/clock"
	"github.com/iotaledger/goshimmer/packages/tangle/schedulerutils"
)

const (
	// MaxDeficit is the maximum cap for accumulated deficit, i.e. max bytes that can be scheduled without waiting.
	// It must be >= MaxMessageSize.
	MaxDeficit = MaxMessageSize
	// MinMana is the minimum amount of Mana needed to issue messages.
	// MaxMessageSize / MinMana is also the upper bound of iterations inside one schedule call, as such it should not be too small.
	MinMana float64 = 1.0
	// oldMessageThreshold defines the threshold at which consider the message too old to be scheduled.
	oldMessageThreshold = 5 * time.Minute
	// manaCacheLifeTime time after which the mana vector should be refreshed
	manaCacheLifeTime = 5 * time.Second
)

// ErrNotRunning is returned when a message is submitted when the scheduler has been stopped.
var ErrNotRunning = errors.New("scheduler stopped")

// SchedulerParams defines the scheduler config parameters.
type SchedulerParams struct {
	MaxBufferSize               int
	Rate                        time.Duration
	AccessManaRetrieveFunc      func(identity.ID) float64
	TotalAccessManaRetrieveFunc func() float64
	AccessManaMapRetrieverFunc  func() map[identity.ID]float64
}
type AccessManaCache struct {
	rawAccessManaVector     map[identity.ID]float64
	updatedAccessManaVector map[identity.ID]float64
	cacheRefreshTime        time.Time
	tangle                  *Tangle
}

// Scheduler is a Tangle component that takes care of scheduling the messages that shall be booked.
type Scheduler struct {
	Events *SchedulerEvents

	tangle          *Tangle
	ticker          *time.Ticker
	started         typeutils.AtomicBool
	stopped         typeutils.AtomicBool
	accessManaCache AccessManaCache
	mu              sync.Mutex
	buffer          *schedulerutils.BufferQueue
	deficits        map[identity.ID]float64
	rate            *atomic.Duration

	shutdownSignal chan struct{}
	shutdownOnce   sync.Once
}

// NewScheduler returns a new Scheduler.
func NewScheduler(tangle *Tangle) *Scheduler {
	if tangle.Options.SchedulerParams.AccessManaMapRetrieverFunc == nil || tangle.Options.SchedulerParams.AccessManaRetrieveFunc == nil || tangle.Options.SchedulerParams.TotalAccessManaRetrieveFunc == nil {
		panic("scheduler: the option AccessManaMapRetrieverFunc and AccessManaRetriever and TotalAccessManaRetriever must be defined so that AccessMana can be determined in scheduler")
	}

	// maximum buffer size (in bytes)
	maxBuffer := tangle.Options.SchedulerParams.MaxBufferSize
	// maximum access mana-scaled inbox length
	maxQueue := float64(maxBuffer) / float64(tangle.LedgerState.TotalSupply())

	accessManaCache := AccessManaCache{
		tangle: tangle,
	}
	accessManaCache.refreshCacheIfNecessary()

	return &Scheduler{
		Events: &SchedulerEvents{
			MessageScheduled: events.NewEvent(MessageIDCaller),
			MessageDiscarded: events.NewEvent(MessageIDCaller),
			NodeBlacklisted:  events.NewEvent(NodeIDCaller),
			Error:            events.NewEvent(events.ErrorCaller),
		},
		tangle:          tangle,
		accessManaCache: accessManaCache,
		rate:            atomic.NewDuration(tangle.Options.SchedulerParams.Rate),
		ticker:          time.NewTicker(tangle.Options.SchedulerParams.Rate),
		buffer:          schedulerutils.NewBufferQueue(maxBuffer, maxQueue),
		deficits:        make(map[identity.ID]float64),
		shutdownSignal:  make(chan struct{}),
	}
}

// Start starts the scheduler.
func (s *Scheduler) Start() {
	s.started.Set()
	// start the main loop
	go s.mainLoop()
}

// Running returns true if the scheduler has started.
func (s *Scheduler) Running() bool {
	return s.started.IsSet()
}

// Shutdown shuts down the Scheduler.
// Shutdown blocks until the scheduler has been shutdown successfully.
func (s *Scheduler) Shutdown() {
	s.shutdownOnce.Do(func() {
		// lock the scheduler to make sure that any Submit() has been finished
		s.mu.Lock()
		defer s.mu.Unlock()
		s.stopped.Set()
		close(s.shutdownSignal)
	})
}

// Setup sets up the behavior of the component by making it attach to the relevant events of the other components.
func (s *Scheduler) Setup() {
	// pass booked messages to the scheduler
	s.tangle.ApprovalWeightManager.Events.MessageProcessed.Attach(events.NewClosure(func(messageID MessageID) {
		// avoid scheduling old messages
		skipScheduler := false
		s.tangle.Storage.Message(messageID).Consume(func(message *Message) {
			skipScheduler = clock.Since(message.IssuingTime()) > oldMessageThreshold
		})
		if skipScheduler {
			s.tangle.Storage.MessageMetadata(messageID).Consume(func(messageMetadata *MessageMetadata) {
				messageMetadata.SetScheduledBypass(true)
			})
			return
		}

		if err := s.SubmitAndReady(messageID); err != nil {
			if !errors.Is(err, schedulerutils.ErrBufferFull) &&
				!errors.Is(err, schedulerutils.ErrInboxExceeded) &&
				!errors.Is(err, schedulerutils.ErrInsufficientMana) {
				s.Events.Error.Trigger(errors.Errorf("failed to submit to scheduler: %w", err))
			}
		}
	}))

	s.Start()
}

// SetRate sets the rate of the scheduler.
func (s *Scheduler) SetRate(rate time.Duration) {
	// only update the ticker when the scheduler is running
	if !s.stopped.IsSet() {
		s.ticker.Reset(rate)
		s.rate.Store(rate)
	}
}

// Rate gets the rate of the scheduler.
func (s *Scheduler) Rate() time.Duration {
	return s.rate.Load()
}

// NodeQueueSize returns the size of the nodeIDs queue.
func (s *Scheduler) NodeQueueSize(nodeID identity.ID) int {
	s.mu.Lock()
	defer s.mu.Unlock()

	nodeQueue := s.buffer.NodeQueue(nodeID)
	if nodeQueue == nil {
		return 0
	}
	return nodeQueue.Size()
}

// NodeQueueSizes returns the size for each node queue.
func (s *Scheduler) NodeQueueSizes() map[identity.ID]int {
	s.mu.Lock()
	defer s.mu.Unlock()

	nodeQueueSizes := make(map[identity.ID]int)
	for _, nodeID := range s.buffer.NodeIDs() {
		size := s.buffer.NodeQueue(nodeID).Size()
		nodeQueueSizes[nodeID] = size
	}
	return nodeQueueSizes
}

// Submit submits a message to be considered by the scheduler.
// This transactions will be included in all the control metrics, but it will never be
// scheduled until Ready(messageID) has been called.
func (s *Scheduler) Submit(messageID MessageID) (err error) {
	if !s.tangle.Storage.Message(messageID).Consume(func(message *Message) {
		s.mu.Lock()
		defer s.mu.Unlock()
		err = s.submit(message)
	}) {
		err = errors.Errorf("failed to get message '%x' from storage", messageID)
	}
	return err
}

// Unsubmit removes a message from the submitted messages.
// If that message is already marked as ready, Unsubmit has no effect.
func (s *Scheduler) Unsubmit(messageID MessageID) (err error) {
	if !s.tangle.Storage.Message(messageID).Consume(func(message *Message) {
		s.mu.Lock()
		defer s.mu.Unlock()

		s.unsubmit(message)
	}) {
		err = errors.Errorf("failed to get message '%x' from storage", messageID)
	}
	return err
}

// Ready marks a previously submitted message as ready to be scheduled.
// If Ready is called without a previous Submit, it has no effect.
func (s *Scheduler) Ready(messageID MessageID) (err error) {
	if !s.tangle.Storage.Message(messageID).Consume(func(message *Message) {
		s.mu.Lock()
		defer s.mu.Unlock()

		s.ready(message)
	}) {
		err = errors.Errorf("failed to get message '%x' from storage", messageID)
	}
	return err
}

// SubmitAndReady submits the message to the scheduler and marks it ready right away.
func (s *Scheduler) SubmitAndReady(messageID MessageID) (err error) {
	if !s.tangle.Storage.Message(messageID).Consume(func(message *Message) {
		s.mu.Lock()
		defer s.mu.Unlock()

		err = s.submit(message)
		if err == nil {
			s.ready(message)
		}
	}) {
		err = errors.Errorf("failed to get message '%x' from storage", messageID)
	}
	return err
}

// Clear removes all submitted messages (ready or not) from the scheduler.
// The MessageDiscarded event is triggered for each of these messages.
func (s *Scheduler) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()

	for q := s.buffer.Current(); q != nil; q = s.buffer.Next() {
		s.buffer.RemoveNode(q.NodeID())
		for _, id := range q.IDs() {
			s.Events.MessageDiscarded.Trigger(MessageID(id))
		}
	}
}

func (s *Scheduler) submit(message *Message) error {
	if s.stopped.IsSet() {
		return ErrNotRunning
	}

	nodeID := identity.NewID(message.IssuerPublicKey())
	nodeMana := s.accessManaCache.GetCachedMana(nodeID)

	if nodeMana < MinMana {
		s.Events.MessageDiscarded.Trigger(message.ID())
		return schedulerutils.ErrInsufficientMana
	}

	err := s.buffer.Submit(message, s.accessManaCache)
	if err != nil {
		s.Events.MessageDiscarded.Trigger(message.ID())
	}
	if errors.Is(err, schedulerutils.ErrInboxExceeded) {
		s.Events.NodeBlacklisted.Trigger(nodeID)
	}
	return err
}

func (s *Scheduler) unsubmit(message *Message) {
	s.buffer.Unsubmit(message)
}

func (s *Scheduler) ready(message *Message) {
	s.buffer.Ready(message)
}

func (s *Scheduler) schedule() *Message {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.updateActiveNodesList(s.accessManaCache.rawAccessManaVector)

	start := s.buffer.Current()
	// no messages submitted
	if start == nil {
		return nil
	}

	var schedulingNode *schedulerutils.NodeQueue
	rounds := math.MaxInt32
	now := clock.SyncedTime()
	for q := start; ; {
		nodeMana := s.accessManaCache.GetCachedMana(q.NodeID())
		// clear the node from the queue, if its mana dropped below MinMana
		if nodeMana < MinMana {
			delete(s.deficits, q.NodeID())
			s.buffer.RemoveNode(q.NodeID())
			q = s.buffer.Current()
			if q == start {
				break
			}
			continue
		}

		msg := q.Front()
		// a message can be scheduled, if it is ready, and its issuing time is not in the future
		if msg != nil && !now.Before(msg.IssuingTime()) {
			// compute how often the deficit needs to be incremented until the message can be scheduled
			remainingDeficit := math.Dim(float64(msg.Size()), s.getDeficit(q.NodeID()))
			// find the first node that will be allowed to schedule a message
			if r := int(math.Ceil(remainingDeficit / nodeMana)); r < rounds {
				rounds = r
				schedulingNode = q
			}
		}

		q = s.buffer.Next()
		if q == start {
			break
		}
	}

	// if there is no node with a ready message, we cannot schedule anything
	if schedulingNode == nil {
		return nil
	}

	if rounds > 0 {
		// increment every node's deficit for the required number of rounds
		for q := start; ; {
			s.updateDeficit(q.NodeID(), float64(rounds)*s.accessManaCache.GetCachedMana(q.NodeID()))

			q = s.buffer.Next()
			if q == start {
				break
			}
		}
	}

	// increment the deficit for all nodes before schedulingNode one more time
	for q := start; q != schedulingNode; q = s.buffer.Next() {
		s.updateDeficit(q.NodeID(), s.accessManaCache.GetCachedMana(q.NodeID()))
	}

	// remove the message from the buffer and adjust node's deficit
	msg := s.buffer.PopFront()
	nodeID := identity.NewID(msg.IssuerPublicKey())
	s.updateDeficit(nodeID, -float64(msg.Size()))

	return msg.(*Message)
}

func (s *Scheduler) updateActiveNodesList(manaCache map[identity.ID]float64) {
	currentNode := s.buffer.Current()
	// use counter to avoid infinite loop in case the start element is removed
	activeNodes := s.buffer.NumActiveNodes()
	// remove nodes that don't have mana and have empty queue
	// this allows nodes with zero mana to issue messages, however nodes will only accumulate their deficit
	// when there are messages in the node's queue
	for i := 0; i < activeNodes; i++ {
		if nodeMana, exists := manaCache[currentNode.NodeID()]; (!exists || nodeMana < MinMana) && currentNode.Size() == 0 {
			s.buffer.RemoveNode(currentNode.NodeID())
			delete(s.deficits, currentNode.NodeID())
			currentNode = s.buffer.Current()
		} else {
			currentNode = s.buffer.Next()
		}
	}

	// update list of active nodes with accumulating deficit
	for nodeID, nodeMana := range manaCache {
		if nodeMana < MinMana {
			continue
		}
		if _, exists := s.deficits[nodeID]; !exists {
			s.deficits[nodeID] = 0
			s.buffer.InsertNode(nodeID)
		}
	}
}

// mainLoop periodically triggers the scheduling of ready messages.
func (s *Scheduler) mainLoop() {
	defer s.ticker.Stop()

loop:
	for {
		select {
		// every rate time units
		case <-s.ticker.C:
			// TODO: pause the ticker, if there are no ready messages
			if msg := s.schedule(); msg != nil {
				s.tangle.Storage.MessageMetadata(msg.ID()).Consume(func(messageMetadata *MessageMetadata) {
					if messageMetadata.SetScheduled(true) {
						s.Events.MessageScheduled.Trigger(msg.ID())
					}
				})
			}

		// on close, exit the loop
		case <-s.shutdownSignal:
			break loop
		}
	}

	// remove all unscheduled messages
	s.Clear()
}

func (s *Scheduler) getDeficit(nodeID identity.ID) float64 {
	return s.deficits[nodeID]
}

func (s *Scheduler) updateDeficit(nodeID identity.ID, d float64) {
	deficit := s.deficits[nodeID] + d
	if deficit < 0 {
		// this will never happen and is just here for debugging purposes
		panic("scheduler: deficit is less than 0")
	}
	s.deficits[nodeID] = math.Min(deficit, MaxDeficit)
}

// GetCachedMana returns cached access mana value for a given node and refreshes mana vectors if they exired
// currently returns at least MinMana
func (a *AccessManaCache) GetCachedMana(id identity.ID) float64 {
	a.refreshCacheIfNecessary()

	if mana, ok := a.updatedAccessManaVector[id]; ok && mana >= MinMana {
		return mana
	}
	// always return at least MinMana
	a.updatedAccessManaVector[id] = MinMana
	return a.updatedAccessManaVector[id]
}

func (a *AccessManaCache) refreshCacheIfNecessary() {
	if time.Since(a.cacheRefreshTime) > manaCacheLifeTime {
		a.rawAccessManaVector = a.tangle.Options.SchedulerParams.AccessManaMapRetrieverFunc()
		a.updatedAccessManaVector = a.rawAccessManaVector
		a.cacheRefreshTime = time.Now()
	}
}

// endregion ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// region SchedulerEvents /////////////////////////////////////////////////////////////////////////////////////////////

// SchedulerEvents represents events happening in the Scheduler.
type SchedulerEvents struct {
	// MessageScheduled is triggered when a message is ready to be scheduled.
	MessageScheduled *events.Event
	MessageDiscarded *events.Event
	NodeBlacklisted  *events.Event
	Error            *events.Event
}

// NodeIDCaller is the caller function for events that hand over a NodeID.
func NodeIDCaller(handler interface{}, params ...interface{}) {
	handler.(func(identity.ID))(params[0].(identity.ID))
}

// endregion ///////////////////////////////////////////////////////////////////////////////////////////////////////////
