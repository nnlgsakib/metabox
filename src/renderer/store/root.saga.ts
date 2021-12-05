import { takeLatest } from "redux-saga/effects"
import { SampleSaga } from "./sagas/sample.saga"

export enum SagaAction {
	Sample = "Sample",
}

export function* RootSaga() {
	yield takeLatest(SagaAction.Sample, SampleSaga)
}
