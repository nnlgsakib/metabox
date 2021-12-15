import { takeLatest } from "redux-saga/effects"
import { fetchBalanceSaga } from "./sagas/fetch-balance.saga"
import { txRequestSaga } from "./sagas/tx-request.saga"

export enum SagaAction {
	FetchBalance = "FetchBalance",
	PutTxRequest = "PutTxRequest",
}

export function* RootSaga() {
	yield takeLatest(SagaAction.FetchBalance, fetchBalanceSaga)
	yield takeLatest(SagaAction.PutTxRequest, txRequestSaga)
}
