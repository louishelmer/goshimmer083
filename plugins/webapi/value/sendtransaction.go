package value

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/iotaledger/goshimmer/packages/clock"
	"github.com/iotaledger/goshimmer/packages/ledgerstate"
	"github.com/iotaledger/goshimmer/packages/tangle"
	"github.com/iotaledger/goshimmer/plugins/messagelayer"
	"github.com/labstack/echo"
)

var sendTxMu sync.Mutex

// sendTransactionHandler sends a transaction.
func sendTransactionHandler(c echo.Context) error {
	sendTxMu.Lock()
	defer sendTxMu.Unlock()

	var request SendTransactionRequest
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, SendTransactionResponse{Error: err.Error()})
	}

	// parse tx
	tx, _, err := ledgerstate.TransactionFromBytes(request.TransactionBytes)
	if err != nil {
		return c.JSON(http.StatusBadRequest, SendTransactionResponse{Error: err.Error()})
	}

	// check transaction validity
	if valid, err := messagelayer.Tangle().LedgerState.CheckTransaction(tx); !valid {
		return c.JSON(http.StatusBadRequest, SendTransactionResponse{Error: err.Error()})
	}

	// check if transaction is too old
	if tx.Essence().Timestamp().Before(clock.SyncedTime().Add(-tangle.MaxReattachmentTimeMin)) {
		return c.JSON(http.StatusBadRequest, SendTransactionResponse{Error: fmt.Sprintf("transaction timestamp is older than MaxReattachmentTime (%s) and cannot be issued", tangle.MaxReattachmentTimeMin)})
	}

	// if transaction is in the future we wait until the time arrives
	if tx.Essence().Timestamp().After(clock.SyncedTime()) {
		time.Sleep(tx.Essence().Timestamp().Sub(clock.SyncedTime()) + 1*time.Nanosecond)
	}

	issueTransaction := func() (*tangle.Message, error) {
		msg, e := messagelayer.Tangle().IssuePayload(tx)
		if e != nil {
			return nil, c.JSON(http.StatusBadRequest, SendTransactionResponse{Error: e.Error()})
		}
		return msg, nil
	}

	_, err = messagelayer.AwaitMessageToBeBooked(issueTransaction, tx.ID(), maxBookedAwaitTime)
	if err != nil {
		return c.JSON(http.StatusBadRequest, SendTransactionResponse{Error: err.Error()})
	}
	return c.JSON(http.StatusOK, SendTransactionResponse{TransactionID: tx.ID().Base58()})
}

// SendTransactionRequest holds the transaction object(bytes) to send.
type SendTransactionRequest struct {
	TransactionBytes []byte `json:"txn_bytes"`
}

// SendTransactionResponse is the HTTP response from sending transaction.
type SendTransactionResponse struct {
	TransactionID string `json:"transaction_id,omitempty"`
	Error         string `json:"error,omitempty"`
}
