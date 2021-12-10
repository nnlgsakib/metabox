import { createReducer, AnyAction } from "@reduxjs/toolkit"

export enum BalanceAction {
	SetBalance = "SetBalance",
}

export interface IBalanceState {
	[networkId: number]: { [tokenAddress: string]: number }
}

const initialState: IBalanceState = {}

export const ReducerAuth = createReducer<IBalanceState>(initialState, (builder) => {
	builder.addCase(BalanceAction.SetBalance, (state, action: AnyAction) => {
		state[action.networkId][action.address] = action.balance
	})
})
