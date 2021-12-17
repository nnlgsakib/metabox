import { takeLatest } from "redux-saga/effects"
import { approveTxRequestSaga } from "./sagas/approve-tx-request.saga"
import { fetchBalanceSaga } from "./sagas/fetch-balance.saga"
import { fetchTokenInfoSaga } from "./sagas/fetch-token-info.saga"
import { txRequestSaga } from "./sagas/tx-request.saga"

export enum SagaAction {
	FetchBalance = "saga/FetchBalance",
	PutTxRequest = "saga/PutTxRequest",
	FetchTokenInfo = "saga/FetchTokenInfo",
	ApproveTxRequest = "saga/ApproveTxRequest",
}

export function* RootSaga() {
	yield takeLatest(SagaAction.FetchBalance, fetchBalanceSaga)
	yield takeLatest(SagaAction.PutTxRequest, txRequestSaga)
	yield takeLatest(SagaAction.FetchTokenInfo, fetchTokenInfoSaga)
	yield takeLatest(SagaAction.ApproveTxRequest, approveTxRequestSaga)
}
