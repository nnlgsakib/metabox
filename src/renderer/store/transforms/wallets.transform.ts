import { createTransform } from "redux-persist"
import { Account, IAccount, IWallet, Wallet } from "renderer/models/wallet.model"
import { IWalletsState } from "../reducers/wallets.reducer"

export const walletsTransform = createTransform(
	// transform state on its way to being serialized and persisted.
	(inboundState, key) => {
		// convert mySet to an Array.
		//   return new Array(inboundState);
		console.log("inbound")
		return inboundState
	},
	// transform state being rehydrated
	(outboundState: IWalletsState, key) => {
		console.log(outboundState)
		// convert mySet back to a Set.
		const list = outboundState.list.map((w) => {
			const accounts: Account[] = w.accounts.map(
				(a: IAccount) => new Account(a.id, a.index, a.name, a.address, a.privateKey),
			)
			const wallet = new Wallet(w.id, w.name, w.mnemonic as string)
			wallet.accounts = accounts
			return wallet
		})
		list.forEach((w) => console.log(`type :::: `, typeof w))
		return { ...outboundState, list }
	},
	// define which reducers this transform gets called for.
	{ whitelist: ["wallets"] },
)
