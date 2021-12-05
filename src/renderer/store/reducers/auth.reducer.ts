import { createReducer, AnyAction } from "@reduxjs/toolkit"

export enum AuthAction {
	SetPassword = "SetPassword",
}

export interface IAuthState {
	password: string | null
}

const initialState: IAuthState = {
	password: null,
}

export const ReducerAuth = createReducer<IAuthState>(initialState, (builder) => {
	builder.addCase(AuthAction.SetPassword, (state, action: AnyAction) => {
		state.password = action.data
	})
})
