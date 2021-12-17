import { ipcRenderer } from "electron"
import { ethers } from "ethers"
import { put, select } from "redux-saga/effects"
import { Wallet } from "renderer/models/wallet.model"
import { ITransaction, TransactionsAction, TransactionStatus } from "../reducers/transactions.reducer"
import { ITxRequestState, TxRequestAction } from "../reducers/tx-request.reducer"
import _ from "lodash"

export function* approveTxRequestSaga(action) {
	const { requestId, details } = action
	const txRequest: ITxRequestState = yield select((s: any) => s.txRequest)

	const request = txRequest.transactions.find((tx) => tx.requestId == requestId)
	if (!requestId || !request) return 0

	const ___password = yield select((s: any) => s.auth.password)
	const network = yield select((s: any) => s.network.networks.find((net) => net.id == request.chainId))
	if (!___password || !network) return 0

	/// Lock the transaction request to avoid duplication in the call .
	if (txRequest.pendingRequests.indexOf(requestId) > -1) return 0
	yield put({ type: TxRequestAction.SetPendingRequest, requestId, trigger: true })

	let privateKey: string, wallet: ethers.Wallet
	try {
		try {
			privateKey = Wallet.decrypt(request.account.privateKey, ___password)
			wallet = new ethers.Wallet(privateKey)
		} catch (e) {
			throw new Error("Error on decodeing account's private key")
		}

		const response: ethers.providers.TransactionResponse = yield wallet.sendTransaction(request.tx as any)
		ipcRenderer.send(requestId, { result: response })
		const transaction: ITransaction = {
			requestId,
			chainId: request.chainId,
			application: request.application ? request.application.name : undefined,
			hash: response.hash,
			timestamp: response.timestamp,
			status: TransactionStatus.Pending,
			account: request.account.id,
			method: request.info ? request.info.name : undefined,
			token: details.token ? details.token : undefined,
			value: details.value,
			// amount of token in decimals
			amount: details.token ? details.amount : undefined,
		}
		yield put({ type: TransactionsAction.NewTransaction, data: transaction })
		/// Just removing the transaction request from requests (not reject)
		yield put({ type: TxRequestAction.RejectTransaction, feedback: false, requestId })
		try {
			yield response.wait(1)
			yield put({
				type: TransactionsAction.UpdateTransaction,
				data: { requestId, status: TransactionStatus.Success },
			})
		} catch (e) {
			yield put({
				type: TransactionsAction.UpdateTransaction,
				data: { requestId, status: TransactionStatus.Reverted },
			})
		}
	} catch (e) {
		yield put({ type: TxRequestAction.SetError, requestId, error: e.message })
	} finally {
		// Unlocking the request
		yield put({ type: TxRequestAction.SetPendingRequest, requestId, trigger: true })
	}

	return 1
}
