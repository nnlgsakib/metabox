import { createReducer, AnyAction } from "@reduxjs/toolkit"
import { ipcRenderer } from "electron"
import { IAbiMethodInfo } from "helpers/generate-abi-info.helper"
import { TransactionModel } from "main/rpc/models/transaction.model"
import { IAccount } from "renderer/models/wallet.model"

export enum TxRequestAction {
	NewTransaction = "NewTransaction",
	UpdateTransaction = "UpdateTransaction",
	RejectTransaction = "RejectTransaction",
	RejectAll = "RejectAll",
}

export interface ITxRequestContractParam {
	type: string
	name: string
	value: string
}

export interface ITxRequest {
	/// application name provided by backend
	account: IAccount
	application: {
		pid: number
		name: string
	}
	chainId: number
	requestId: string
	tx: TransactionModel
	token?: {
		symbol: string
		decimals: number
	}
	info: IAbiMethodInfo | null
	contractParams: ITxRequestContractParam[]
}

export interface ITxRequestState {
	transactions: ITxRequest[]
}

const initialState: ITxRequestState = {
	transactions: [],
}

export const ReducerTxRequest = createReducer<ITxRequestState>(initialState, (builder) => {
	builder.addCase(TxRequestAction.NewTransaction, (state, action: AnyAction) => {
		state.transactions.push(action.data)
	})
	builder.addCase(TxRequestAction.RejectTransaction, (state, action: AnyAction) => {
		ipcRenderer.send(action.requestId, { error: "MetaBox user rejected the transaction" })
		state.transactions = state.transactions.filter((tx) => tx.requestId != action.requestId)
	})
	builder.addCase(TxRequestAction.RejectAll, (state) => {
		for (const tx of state.transactions) {
			ipcRenderer.send(tx.requestId, { error: "MetaBox user rejected the transaction" })
		}
		state.transactions = []
	})
})
