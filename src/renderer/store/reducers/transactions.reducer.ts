import { createReducer, AnyAction } from "@reduxjs/toolkit"

export enum TransactionsAction {
	NewTransaction = "transactions/NewTransaction",
	UpdateTransaction = "transactions/UpdateTransaction",
}

export enum TransactionStatus {
	Pending,
	Reverted,
	Success,
}

export interface ITransaction {
	application?: string
	chainId: number
	requestId: string
	account: string
	hash: string
	status: TransactionStatus
	timestamp: number
	method?: string
	token?: any
	value: number
	amount?: number
}

export interface ITransactionsState {
	[chainId: number]: ITransaction[]
}

const initialState: ITransactionsState = {}

export const ReducerTransactions = createReducer<ITransactionsState>(initialState, (builder) => {
	builder.addCase(TransactionsAction.NewTransaction, (state, action: AnyAction) => {
		const transaction: ITransaction = action.data
		if (!state.hasOwnProperty(transaction.chainId)) state[transaction.chainId] = [transaction]
		else state[transaction.chainId].unshift(transaction)
	})
	builder.addCase(TransactionsAction.UpdateTransaction, (state, action: AnyAction) => {
		const transaction: ITransaction = action.data
		if (state.hasOwnProperty(transaction.chainId)) {
			state[transaction.chainId] = state[transaction.chainId].map((tx) => {
				if (tx.requestId == action.data?.requestId) {
					return { ...tx, ...action.data }
				}
				return tx
			})
		}
	})
})
