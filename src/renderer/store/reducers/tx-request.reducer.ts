import { createReducer, AnyAction } from "@reduxjs/toolkit"
import { IAbiMethodInfo } from "helpers/generate-abi-info.helper"
import { TransactionModel } from "main/rpc/models/transaction.model"

export enum TxRequestAction {
	NewTransaction = "NewTransaction",
	UpdateTransaction = "UpdateTransaction",
	DeleteTransaction = "DeleteTransaction",
}

export interface ITxRequestContractParam {
	type: string
	name: string
	value: string
}

export interface ITxRequest {
	/// application name provided by backend
	application: string | undefined | null
	chainId: number
	requestId: string
	tx: TransactionModel
	info: IAbiMethodInfo | null
	contractParams: ITxRequestContractParam[]
}

export interface ITxRequestState {
	current: number
	transactions: any[]
}

const initialState: ITxRequestState = {
	current: 0,
	transactions: [],
}

export const ReducerTxRequest = createReducer<ITxRequestState>(initialState, (builder) => {
	builder.addCase(TxRequestAction.NewTransaction, (state, action: AnyAction) => {
		state.transactions.push(action.data)
		console.log(`new transaction request : `, action.data)
	})
})
