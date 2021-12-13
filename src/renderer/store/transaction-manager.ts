import { getCurrentWindow } from "@electron/remote"

let store
export function ApplyTransactionManager(_s) {
	store = _s
}

export function newTransaction(from, transaction, network) {
	const currentWin = getCurrentWindow()
	currentWin.show()
	currentWin.focus()
	currentWin.center()
}
