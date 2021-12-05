import { AnyAction, Action } from "redux"

export enum WalletsAction {
	NewWallet = "NewWallet",
	NewAccount = "NewAccount",
	DeleteWallet = "DeleteWallet",
	DeleteAccount = "DeleteAccount",
}

export interface IAccount {
	name: string
	address: string
	privateKey: string
	fingerprint?: string
	parentFingerprint?: string
}

export interface IWallet {
	id: string
	name: string
	mnemonic: string
	accounts: IAccount[]
}

const initialState: IWallet[] = []

export function ReducerWallets(
	state: IWallet[] = initialState,
	action: AnyAction & Action<WalletsAction>,
): IWallet[] {
	switch (action.type) {
		case WalletsAction.NewWallet:
			return state.concat(action.data)
	}
	return state
}
