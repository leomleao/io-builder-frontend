import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { PROJECT_GET_LIST } from 'Constants/actionTypes';
import { getProjectListSuccess, getProjectListError } from './actions';

import todoData from '../../data/todos.json';
import { rsf } from '../firestore';

// const getProjectListRequest = async ownerId => {
// 	return await new Promise((success, fail) => {
// 		setTimeout(() => {
// 			success(todoData.data);
// 		}, 1000);
// 	})
// 		.then(response => response)
// 		.catch(error => error);
// };

function* getProjectListRequest() {
	const snapshot = yield call(rsf.firestore.getCollection, 'projects');
	let projects;
	snapshot.forEach(project => {
		projects = {
			...projects,
			[project.id]: project.data(),
		};
	});

	yield put(getProjectListSuccess(projects));
}

function* getProjectListItems() {
	try {
		const response = yield call(getProjectListRequest);
		yield put(getProjectListSuccess(response));
	} catch (error) {
		yield put(getProjectListError(error));
	}
}

export function* watchGetList() {
	yield takeEvery(PROJECT_GET_LIST, getProjectListItems);
}

export default function* rootSaga() {
	yield all([fork(watchGetList)]);
}
