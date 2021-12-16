import { ethers } from "ethers"
import { put, select } from "redux-saga/effects"
import { INetworkState } from "../reducers/network.reducer"
import { ITxRequestState, ITxRequestToken, TxRequestAction } from "../reducers/tx-request.reducer"
import ERC20Abi from "abis/erc20.abi.json"

export function* fetchTokenInfoSaga(action) {
	const address = action.address?.toLowerCase()
	const networkId = action.networkId
	if (!address || !networkId) return 0

	const txRequest: ITxRequestState = yield select((s: any) => s.txRequest)
	if (txRequest.loadingTokens.indexOf(address) > -1) return 0
	const foundToken = txRequest.tokens.find((token) => token.address == address && token.networkId == networkId)
	if (foundToken) {
		yield put({ type: TxRequestAction.UpdateToken, data: foundToken })
		return 0
	}

	/// Fetch token info from blockchain
	const network: INetworkState = yield select((s: any) => s.network)
	const thisNetwork = network.networks.find((net) => net.id == networkId)
	if (!thisNetwork) return 0
	yield put({ type: TxRequestAction.SetLoadingToken, address, trigger: true })
	try {
		const token = new ethers.Contract(address, ERC20Abi, thisNetwork.getProvider())
		const symbol = yield token.symbol()
		let decimals = yield token.decimals()
		if (decimals < 0) decimals = 0
		if (decimals > 18) throw new Error("Decimals overflow")
		const tokenData: ITxRequestToken = {
			networkId,
			address,
			symbol,
			decimals,
		}
		yield put({ type: TxRequestAction.UpdateToken, data: tokenData })
	} catch (e) {
		console.log(e)
		yield put({ type: TxRequestAction.SetLoadingToken, address, trigger: false })
	}
	return 1
}
