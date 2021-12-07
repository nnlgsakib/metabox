import { createReducer, AnyAction } from "@reduxjs/toolkit"
import { IWallet, Wallet } from "renderer/models/wallet.model"

export enum WalletsAction {
	NewWallet = "NewWallet",
	NewAccount = "NewAccount",
	DeleteWallet = "DeleteWallet",
	DeleteAccount = "DeleteAccount",
	SelectWallet = "SelectWallet",
	SelectAccount = "SelectAccount",
}

export interface IWalletsState {
	list: Wallet[]
	selectedWallet: string | null // wallet id
	selectedAccount: string | null // account id
}

const initialState: IWalletsState = {
	list: [],
	selectedWallet: null,
	selectedAccount: null,
}

export const ReducerWallets = createReducer<IWalletsState>(initialState, (builder) => {
	builder.addCase(WalletsAction.NewWallet, (state, action: AnyAction) => {
		state.list.push(action.wallet)
	})
	builder.addCase(WalletsAction.NewAccount, (state, action: AnyAction) => {
		state.list = state.list.map((wallet) => {
			if (wallet.id == action.walletId) {
				wallet.newAccount(`Account ${wallet.getLastIndex() + 2}`, action.password)
			}
			return wallet
		})
	})
	builder.addCase(WalletsAction.SelectWallet, (state, action: AnyAction) => {
		const wallet = state.list.find((w) => w.id == action.walletId)
		if (wallet && wallet.accounts.length > 0) {
			state.selectedWallet = action.walletId
			state.selectedAccount = wallet.accounts[0].id
		}
	})
	builder.addCase(WalletsAction.SelectAccount, (state, action: AnyAction) => {
		state.selectedAccount = action.accountId
	})
})
