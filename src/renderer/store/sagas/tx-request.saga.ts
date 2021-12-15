import { getCurrentWindow } from "@electron/remote"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { TransactionModel } from "main/rpc/models/transaction.model"
import { INetworkState } from "../reducers/network.reducer"
import erc20AbiInfo from "abis/erc20.abi.info.json"
import { ITxRequest, TxRequestAction } from "../reducers/tx-request.reducer"
import _ from "lodash"
import { AbiInfo, IAbiMethodInfo } from "helpers/generate-abi-info.helper"
import { BigNumber, ethers } from "ethers"
import { put, select } from "redux-saga/effects"

const availableAbiInfo: AbiInfo = _.concat(erc20AbiInfo)
const currentWin = getCurrentWindow()

export function* txRequestSaga(action: any) {
	const currentTxRequests: any[] = yield select((s) => s.txRequest.transactions)
	if (currentTxRequests.length >= 20) throw new Error("Transactions count limit exceeded")
	const tx: TransactionModel = plainToClass(TransactionModel, action.transaction)
	if ((yield validate(tx)).length > 0) throw new Error("Transaction is not valid")
	const network: INetworkState = yield select((s) => s.network)
	let contractParams = []
	let info: IAbiMethodInfo
	if (tx.data) {
		const methodId = tx.data.slice(2, 10)
		if (methodId.length == 8) {
			info = availableAbiInfo.find((method) => method.id == methodId)
			if (info) {
				const dataChunks = tx.data.slice(10).match(/.{1,64}/g)
				contractParams = info.inputs.map((input, index) => {
					let value = null
					switch (input.type) {
						case "address":
							const address = "0x" + dataChunks[index].slice(64 - 40)
							ethers.utils.isAddress(address) ? (value = ethers.utils.getAddress(address)) : null
							break
						case "uint256":
							value = BigNumber.from(dataChunks[index]).toString()
							break
					}
					return {
						type: input.type,
						name: input.name,
						value,
					}
				})
			}
		}
	}
	const data: ITxRequest = {
		application: null,
		requestId: action.requestId,
		chainId: network.current.id,
		tx,
		info,
		contractParams,
	}
	yield put({ type: TxRequestAction.NewTransaction, data })
	currentWin.show()
	if (currentWin.isMinimized) currentWin.unmaximize()
	if (!currentWin.isFocused) {
		currentWin.focus()
		currentWin.center()
	}
	return true
}
