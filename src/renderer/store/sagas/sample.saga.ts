import { put, takeLatest, select } from "redux-saga/effects"
import { SagaAction } from "../root.saga"

export function* SampleSaga(action) {
	yield put({ type: SagaAction.Sample })
}
