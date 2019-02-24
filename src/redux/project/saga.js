import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { PROJECT_ADD, PROJECT_GET_LIST } from 'Constants/actionTypes';
import {
	getProjectListSuccess,
	getProjectListError,
	addProjectSuccess,
	addProjectError,
} from './actions';
// import colRef from 'redux-saga-firebase';

import firebase from 'firebase/app';
import 'firebase/firestore'; // make sure you add this for firestore

import rsf from '../firestore';
import uuid from 'uuid/v4';
// const getProjectListRequest = async () => {
// 	return await new Promise((success, fail) => {
// 		setTimeout(() => {
// 			success(todoData.data);
// 		}, 1000);
// 	})
// 		.then(response => response)
// 		.catch(error => error);
// };

// const getProjectListRequest = async () => {
// 	console.log('LAROUUUU');
// 	return await new Promise(async (success, fail) => {
// 		const snapshot = await rsf.firestore.getCollection('projects');
// 		const snapshot = yield call(rsf.firestore.getCollection, 'users');
// 		let projects;
// 		console.info(snapshot);
// 		// await snapshot.docs.forEach(project => {
// 		// 	projects = {
// 		// 		...projects,
// 		// 		[project.id]: project.data(),
// 		// 	};
// 		// });
// 		success(projects);
// 	})
// 		.then(projects => projects)
// 		.catch(error => error);
// };

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

const addProjectRequest = async ownerUid => {
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

function* addProject({ payload }) {
	try {
		const response = yield call(addProjectRequest, payload);
		yield put(addProjectSuccess(response));
	} catch (error) {
		yield put(addProjectError(error));
	}
}

export function* watchGetList() {
	yield takeEvery(PROJECT_GET_LIST, getProjectListItems);
}

export function* wathcAddProject() {
	yield takeEvery(PROJECT_ADD, addProject);
}

export default function* rootSaga() {
	yield all([fork(watchGetList), fork(wathcAddProject)]);
}
