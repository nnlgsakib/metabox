import { createTransform } from "redux-persist"
import { Account, IAccount, IWallet, Wallet } from "renderer/models/wallet.model"

export const walletsTransform = createTransform(
	(inboundState) => inboundState,
	(outboundState: IWallet[]) => {
		return outboundState.map((w) => {
			const accounts: Account[] = w.accounts.map(
				(a: IAccount) => new Account(a.id, a.index, a.name, a.address, a.privateKey),
			)
			const wallet = new Wallet(w.id, w.name, w.mnemonic as string)
			wallet.accounts = accounts
			return wallet
		})
	},
	{ whitelist: ["list"] },
)
