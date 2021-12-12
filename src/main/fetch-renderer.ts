import { ipcMain } from "electron"
import { v4 as uuid } from "uuid"

export interface IFetchRendererData {
	id?: string
	method: string
	payload?: any
}

export interface IRendererResponse {
	result?: any
	error?: string
}
export function fetchRenderer(data: IFetchRendererData, timeoutSecs: number = 2): Promise<any> {
	data.id = uuid()
	return new Promise((resolve, reject) => {
		ipcMain.emit("__main-request", data)
		const _timeout = setTimeout(() => {
			reject(new Error("Request Timeout"))
			ipcMain.emit("__main-request-cancel", data.id)
			ipcMain.removeAllListeners(data.id)
		}, Math.floor(timeoutSecs * 1000))
		ipcMain.once(data.id, (e, res: IRendererResponse) => {
			clearTimeout(_timeout)
			if (res.error) {
				reject(new Error(res.error))
				return
			}
			resolve(res.result)
			return
		})
	})
}
