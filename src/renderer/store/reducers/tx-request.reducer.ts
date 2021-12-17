import { createReducer, AnyAction } from "@reduxjs/toolkit"
import { ipcRenderer } from "electron"
import { IAbiMethodInfo } from "helpers/generate-abi-info.helper"
import { TransactionModel } from "main/rpc/models/transaction.model"
import { IAccount } from "renderer/models/wallet.model"

export enum TxRequestAction {
	NewTransaction = "TxRequest/NewTransaction",
	UpdateTransaction = "TxRequest/UpdateTransaction",
	RejectTransaction = "TxRequest/RejectTransaction",
	RejectAll = "TxRequest/RejectAll",
	UpdateToken = "TxRequest/UpdateToken",
	SetLoadingToken = "TxRequest/SetLoadingToken",
	SetPendingRequest = "TxRequest/SetPendingRequest",
	SetError = "TxRequest/SetError",
}

export interface ITxRequestContractParam {
	type: string
	name: string
	value: string
}

export interface ITxRequest {
	account: IAccount
	/// application provided by backend
	application: {
		pid: number
		name: string
	}
	chainId: number
	requestId: string
	tx: TransactionModel
	info: IAbiMethodInfo | null
	contractParams: ITxRequestContractParam[]
}

export interface ITxRequestToken {
	address: string
	networkId: number
	symbol: string
	decimals: number
}

export interface ITxRequestState {
	loadingTokens: string[]
	transactions: ITxRequest[]
	tokens: ITxRequestToken[]
	pendingRequests: string[]
	errors: { [requestId: string]: string | null }
}

const initialState: ITxRequestState = {
	loadingTokens: [],
	transactions: [],
	tokens: [],
	pendingRequests: [],
	errors: {},
}

export const ReducerTxRequest = createReducer<ITxRequestState>(initialState, (builder) => {
	builder.addCase(TxRequestAction.NewTransaction, (state, action: AnyAction) => {
		state.transactions.push(action.data)
	})
	builder.addCase(TxRequestAction.RejectTransaction, (state, action: AnyAction) => {
		if (!action.hasOwnProperty("feedback") || action.feedback)
			ipcRenderer.send(action.requestId, { error: "MetaBox user rejected the transaction" })
		state.transactions = state.transactions.filter((tx) => tx.requestId != action.requestId)
	})
	builder.addCase(TxRequestAction.RejectAll, (state) => {
		for (const tx of state.transactions) {
			ipcRenderer.send(tx.requestId, { error: "MetaBox user rejected the transaction" })
		}
		state.transactions = []
	})
	builder.addCase(TxRequestAction.UpdateToken, (state, action: AnyAction & { data: ITxRequestToken }) => {
		const token = action.data
		const findCurrent = state.tokens.find((t) => t.networkId == token.networkId && t.address == token.address)
		if (!findCurrent) state.tokens.push(token)
	})
	builder.addCase(
		TxRequestAction.SetLoadingToken,
		(state, action: AnyAction & { address: string; trigger: boolean }) => {
			if (action.trigger == false && state.loadingTokens.indexOf(action.address) > -1)
				state.loadingTokens = state.loadingTokens.filter((t) => t != action.address)
			if (action.trigger == true && state.loadingTokens.indexOf(action.address) == -1)
				state.loadingTokens.push(action.address)
		},
	)
	builder.addCase(
		TxRequestAction.SetPendingRequest,
		(state, action: AnyAction & { requestId: string; trigger: boolean }) => {
			if (action.trigger == false && state.pendingRequests.indexOf(action.requestId) > -1)
				state.pendingRequests = state.pendingRequests.filter((t) => t != action.requestId)
			if (action.trigger == true && state.pendingRequests.indexOf(action.requestId) == -1)
				state.pendingRequests.push(action.requestId)
		},
	)
	builder.addCase(
		TxRequestAction.SetError,
		(state, action: AnyAction & { requestId: string; error: string | null }) => {
			state.errors[action.requestId] = action.error
		},
	)
})
