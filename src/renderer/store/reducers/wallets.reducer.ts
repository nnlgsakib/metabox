import { createReducer, AnyAction } from "@reduxjs/toolkit"
import { Account, Wallet } from "renderer/models/wallet.model"

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
		let account: Account
		let wallet: Wallet
		state.list = state.list.map((w) => {
			if (w.id == action.walletId) {
				account = w.newAccount(`Account ${w.getLastIndex() + 2}`, action.password)
				wallet = w
			}
			return wallet
		})
		if (account && wallet) {
			state.selectedAccount = account.id
			state.selectedWallet = wallet.id
		}
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
