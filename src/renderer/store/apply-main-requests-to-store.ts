import { Store } from "@reduxjs/toolkit"
import { ipcMain } from "@electron/remote"
import { ipcRenderer } from "electron"
import { IFetchRendererData } from "main/fetch-renderer"
import { IWalletsState } from "./reducers/wallets.reducer"
import { IpcMainEvent } from "electron"

const WALLET_ERROR = "Wallet caused an unknown error"

function responserFactory(event: IFetchRendererData & IpcMainEvent): Array<(dataOrErrorMsg: any) => void> {
	return [
		/// returns resolve function as the first param of the returned array
		(data: any) => {
			ipcRenderer.send(event.id, { result: data })
		},
		/// returns reject function as the second param of the returned array
		(errorMsg: string) => {
			ipcRenderer.send(event.id, { error: errorMsg })
		},
	]
}
const isDev = process.env.NODE_ENV == "development"
export function ApplyMainRequestsToStore(store: Store) {
	ipcMain.on("__main-request", (event: IFetchRendererData & IpcMainEvent) => {
		if (isDev) console.log("new main request : ", event)

		const [resolve, reject] = responserFactory(event)
		switch (event.method) {
			case "eth_accounts":
				const wallets: IWalletsState = store.getState().wallets
				if (!wallets.selectedWallet || wallets.list.length == 0) {
					reject("User has no wallet")
					return
				}
				const currentWallet = wallets.list.find((w) => w.id == wallets.selectedWallet)
				if (!currentWallet) {
					reject(WALLET_ERROR)
					return
				}
				resolve(currentWallet.accounts.map((a) => a.address))
				return
		}
		reject(WALLET_ERROR)
	})
}
