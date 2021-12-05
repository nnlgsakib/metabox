import { AnyAction, Action } from "redux"

export enum SettingsAction {
	SetTheme = "SetTheme",
}

export interface ISettingsState {
	theme: "dark" | "light"
}

const initialState: ISettingsState = {
	theme: "light",
}

export function ReducerSettings(
	state: ISettingsState = initialState,
	action: AnyAction & Action<SettingsAction>,
): ISettingsState {
	switch (action.type) {
		case SettingsAction.SetTheme:
			return { ...state, theme: action.data }
	}
	return state
}
