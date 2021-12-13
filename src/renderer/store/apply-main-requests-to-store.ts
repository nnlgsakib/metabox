import { Store } from "@reduxjs/toolkit"
import { ipcMain } from "@electron/remote"
import { ipcRenderer } from "electron"
import { IFetchRendererData } from "main/fetch-renderer"
import { IWalletsState } from "./reducers/wallets.reducer"
import { IpcMainEvent } from "electron"
import { INetworkState } from "./reducers/network.reducer"
import { newTransaction } from "./transaction-manager"

const WALLET_ERROR = "Wallet caused an unknown error"

function responserFactory(event: IFetchRendererData & IpcMainEvent): Array<(dataOrErrorMsg: any) => void> {
	return [
		/// returns resolve function as the first param of the returned array
		(data: any) => {
			ipcRenderer.send(event.id, { result: data })
			return 1
		},
		/// returns reject function as the second param of the returned array
		(errorMsg: string) => {
			ipcRenderer.send(event.id, { error: errorMsg })
			return 0
		},
	]
}

const isDev = process.env.NODE_ENV == "development"
export function ApplyMainRequestsToStore(store: Store) {
	ipcMain.on("__main-request", async (event: IFetchRendererData & IpcMainEvent) => {
		function getWallets(): IWalletsState {
			return store.getState().wallets
		}
		function getNetwork(): INetworkState {
			return store.getState().network
		}
		if (isDev) console.log("new main request : ", event)

		const [resolve, reject] = responserFactory(event)
		if (!store.getState().auth.password) reject("Wallet is locked")
		let network: INetworkState
		let wallets: IWalletsState
		switch (event.method) {
			case "eth_chainId":
				network = getNetwork()
				return resolve(await network.current.getProvider().network.chainId)
			case "eth_accounts":
				wallets = getWallets()
				if (!wallets.selectedWallet || wallets.list.length == 0) return reject("User has no wallet")
				const currentWallet = wallets.list.find((w) => w.id == wallets.selectedWallet)
				if (!currentWallet) return reject(WALLET_ERROR)
				return resolve(currentWallet.accounts.map((a) => a.address))
			case "eth_estimateGas":
				network = getNetwork()
				return resolve((await network.current.getProvider().estimateGas(event.payload.transaction)).toString())
			case "eth_call":
				network = getNetwork()
				return resolve(await network.current.getProvider().call(event.payload.transaction))
			case "eth_sendTransaction":
				newTransaction(1, 1, 1)
				return resolve(true)
			default:
				reject(WALLET_ERROR)
		}
	})
}
