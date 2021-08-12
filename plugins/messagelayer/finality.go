package messagelayer

import (
	"sync"

	"github.com/iotaledger/hive.go/events"

	"github.com/iotaledger/goshimmer/packages/consensus/finality"
	"github.com/iotaledger/goshimmer/packages/tangle"
)

var finalityGadget finality.Gadget
var finalityOnce sync.Once

func FinalityGadget() finality.Gadget {
	finalityOnce.Do(func() {
		Tangle()
	})
	return finalityGadget
}

func configureFinality() {
	Tangle().ApprovalWeightManager.Events.MarkerWeightChanged.Attach(events.NewClosure(func(e *tangle.MarkerWeightChangedEvent) {
		if err := finalityGadget.HandleMarker(e.Marker, e.Weight); err != nil {
			plugin.LogError(err)
		}
	}))
	Tangle().ApprovalWeightManager.Events.BranchWeightChanged.Attach(events.NewClosure(func(e *tangle.BranchWeightChangedEvent) {
		if err := finalityGadget.HandleBranch(e.BranchID, e.Weight); err != nil {
			plugin.LogError(err)
		}
	}))
}
