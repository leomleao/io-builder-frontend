import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { PROJECT_SAVE, PROJECT_GET_LIST } from 'Constants/actionTypes';
import {
	getProjectListSuccess,
	getProjectListError,
	saveProjectSuccess,
	saveProjectError,
} from './actions';
// import colRef from 'redux-saga-firebase';

import firebase from 'firebase/app';
import 'firebase/firestore'; // make sure you add this for firestore

import rsf from '../firestore';
import uuid from 'uuid/v4';

function* getProjectListRequest(ownerUid) {
	try {
		const snapshot = yield call(
			rsf.firestore.getCollection,
			firebase
				.firestore()
				.collection('projects')
				.where('owner', '==', ownerUid),
		);
		let projects = [];
		snapshot.forEach(project => {
			projects = [...projects, project.data()];
		});
		return projects;
	} catch (error) {
		console.error(error);
	}
}

const saveProjectRequest = async ownerUid => {
	const newProject = {
		guid: uuid(),
		name: null,
		owner: ownerUid,
		carrier: {
			guid: uuid(),
			articleNo: null,
			name: null,
			projectArticles: [],
		},
	};
	return await new Promise((success, fail) => {
		setTimeout(() => {
			success(newProject);
		}, 1000);
	})
		.then(response => response)
		.catch(error => error);
};

function* getProjectListItems({ payload }) {
	try {
		const response = yield call(getProjectListRequest, payload);
		yield put(getProjectListSuccess(response));
	} catch (error) {
		yield put(getProjectListError(error));
	}
}

function* saveProject({ payload }) {
	try {
		const response = yield call(saveProjectRequest, payload);
		yield put(saveProjectSuccess(response));
	} catch (error) {
		yield put(saveProjectError(error));
	}
}

export function* watchGetList() {
	yield takeEvery(PROJECT_GET_LIST, getProjectListItems);
}

export function* wathcAddProject() {
	yield takeEvery(PROJECT_SAVE, saveProject);
}

export default function* rootSaga() {
	yield all([fork(watchGetList), fork(wathcAddProject)]);
}
