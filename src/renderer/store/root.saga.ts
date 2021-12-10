import { takeLatest } from "redux-saga/effects"
import { fetchBalanceSaga } from "./sagas/fetch-balance.saga"

export enum SagaAction {
	FetchBalance = "FetchBalance",
}

export function* RootSaga() {
	yield takeLatest(SagaAction.FetchBalance, fetchBalanceSaga)
}
