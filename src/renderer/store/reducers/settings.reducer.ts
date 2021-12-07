import { createReducer, AnyAction } from "@reduxjs/toolkit"

export enum SettingsAction {
	SwitchTheme = "SwitchTheme",
}

export interface ISettingsState {
	theme: "dark" | "light"
}

const initialState: ISettingsState = {
	theme: "light",
}

export const ReducerSettings = createReducer<ISettingsState>(initialState, (builder) => {
	builder.addCase(SettingsAction.SwitchTheme, (state, action: AnyAction) => {
		state.theme = state.theme == "light" ? "dark" : "light"
	})
})
