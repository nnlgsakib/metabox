import { AnyAction, Action } from "redux"

export enum TransactionAction {
	NewTransaction = "NewTransaction",
	UpdateTransaction = "UpdateTransaction",
	DeleteTransaction = "DeleteTransaction",
}

export interface ITransaction {
	id: string
	from: string
	to: string
	status: "pending" | "revert" | "success"
	data: any
	msg: string
	timestamp: number
}

const initialState: ITransaction[] = []

export function ReducerTransactions(
	state: ITransaction[] = initialState,
	action: AnyAction & Action<TransactionAction>,
): ITransaction[] {
	switch (action.type) {
		case TransactionAction.NewTransaction:
			return [action.data, ...state]
	}
	return state
}
