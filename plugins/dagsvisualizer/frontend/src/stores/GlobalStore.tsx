import { action, makeObservable, observable } from 'mobx';
import {Moment} from 'moment';
import TangleStore, { tangleVertex } from "./TangleStore";
import UTXOStore, { utxoVertex } from "./UTXOStore";
import BranchStore, { branchVertex } from "./BranchStore";

export class searchResult {
    messages: Array<tangleVertex>;
    txs:      Array<utxoVertex>;
	branches: Array<branchVertex>;
}

export class GlobalStore {
    @observable searchStartingTime: number;
    @observable searchEndingTime: number;

    tangleStore: TangleStore;
    utxoStore: UTXOStore;
    branchStore: BranchStore;

    constructor(tangleStore: TangleStore, utxoStore: UTXOStore, branchStore: BranchStore) {
        makeObservable(this);

        this.tangleStore = tangleStore;
        this.utxoStore = utxoStore;
        this.branchStore = branchStore;
    }

    syncWithMsg = () => {
        let msg = this.tangleStore.selectedMsg;
        if (!msg) return;

        if (msg.isTx) {
            this.utxoStore.selectTx(msg.txID);
        }
        this.branchStore.selectBranch(msg.branchID);
    }

    syncWithTx = () => {
        let tx = this.utxoStore.selectedTx;
        if (!tx) return;

        let msg = this.tangleStore.getTangleVertex(tx.msgID);
        if (msg) {
            this.tangleStore.selectMsg(tx.msgID);
        }

        let branch = this.branchStore.getBranchVertex(tx.branchID);
        if (branch) {
            this.branchStore.selectBranch(tx.branchID);
        }
    }

    syncWithBranch = () => {
        let branch = this.branchStore.selectedBranch;
        if (!branch) return;

        // iterate messages to highlight all messages lies in that branch
        let msgs = this.tangleStore.getMsgsFromBranch(branch.ID);
        this.tangleStore.clearSelected();
        this.tangleStore.highlightMsgs(msgs);

        let txs = this.utxoStore.getTxsFromBranch(branch.ID);
        this.utxoStore.clearSelected(true);
        this.utxoStore.highlightTxs(txs);
    }

    clearSync = () => {
        this.tangleStore.clearSelected();
        this.tangleStore.clearHighlightedMsgs();
        this.utxoStore.clearSelected(true);
        this.utxoStore.clearHighlightedTxs();
        this.branchStore.clearSelected(true);
    }

    @action
    updateExplorerAddress = (addr: string) => {
        this.tangleStore.updateExplorerAddress(addr);
        this.branchStore.updateExplorerAddress(addr);
        this.utxoStore.updateExplorerAddress(addr);
    }

    @action
    updateSearchStartingTime = (dateTime: Moment) => {
        this.searchStartingTime = dateTime.unix();
    }

    @action
    updateSearchEndingTime = (dateTime: Moment) => {
        this.searchEndingTime = dateTime.unix();
    }

    @action
    searchAndDrawResults = async () => {
        try {
            let res = await fetch(`/api/dagsvisualizer/search/${this.searchStartingTime}/${this.searchEndingTime}`);
            let result: searchResult = await res.json();
            this.stopDrawNewVertices();
            this.clearGraphs();

            result.messages.forEach((msg) => {
                this.tangleStore.drawVertex(msg);
            })

            result.txs.forEach((tx) => {
                this.utxoStore.drawVertex(tx);
            })

            result.branches.forEach((branch) => {
                this.branchStore.drawVertex(branch);
            })

        } catch (err) {
            console.log("Fail to fetch messages/txs/branches with the given interval", err);
        }
        return
    }

    @action
    clearSearchAndResume = () => {
        this.clearGraphs();

        // re-draw all existed latest vertices.
        this.tangleStore.drawExistedMsgs();
        this.utxoStore.drawExistedTxs();
        this.branchStore.drawExistedBranches();

        this.drawNewVertices();
    }

    drawNewVertices() {
        // resume need redraw all existed vertices
        this.tangleStore.updateDrawStatus(true);
        this.utxoStore.updateDrawStatus(true);
        this.branchStore.updateDrawStatus(true);
    }

    stopDrawNewVertices() {
        this.tangleStore.updateDrawStatus(false);
        this.utxoStore.updateDrawStatus(false);
        this.branchStore.updateDrawStatus(false);
    }

    clearGraphs() {
        this.tangleStore.clearGraph();
        this.branchStore.clearGraph();
        this.utxoStore.clearGraph();
    }
}

export default GlobalStore;