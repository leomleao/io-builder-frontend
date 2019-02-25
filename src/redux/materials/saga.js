import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { MATERIALS_GET } from 'Constants/actionTypes';
import { getMaterialSuccess, getMaterialError } from './actions';

// import firebase from 'firebase/app';
// import 'firebase/firestore'; // make sure you add this for firestore

import rsf from '../firestore';
// import uuid from 'uuid/v4';

function* getMaterialRequest(materialId) {
	try {
		const snapshot = yield call(
			rsf.firestore.getDocument,
			'materials/' + materialId.replace(/\//g, '_'),
		);
		const material = snapshot.data();

		return material;
	} catch (error) {
		console.error(error);
	}
}

function* getMaterial({ payload }) {
	try {
		const response = yield call(getMaterialRequest, payload);
		yield put(getMaterialSuccess(response));
	} catch (error) {
		yield put(getMaterialError(error));
	}
}

export function* watchGetList() {
	yield takeEvery(MATERIALS_GET, getMaterial);
}

export default function* rootSaga() {
	yield all([fork(watchGetList)]);
}
