import { createReducer, AnyAction } from "@reduxjs/toolkit"

export enum AuthAction {
	SetPassword = "SetPassword",
}

export interface IAuthState {
	password: string | null
	passwordHash: string | null
}

const initialState: IAuthState = {
	password: null,
	passwordHash: null,
}

export const ReducerAuth = createReducer<IAuthState>(initialState, (builder) => {
	builder.addCase(AuthAction.SetPassword, (state, action: AnyAction) => {
		if (action.password) state.password = action.password
		if (action.passwordHash) state.passwordHash = action.passwordHash
	})
})
