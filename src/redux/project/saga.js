import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { PROJECT_GET_LIST } from 'Constants/actionTypes';
import { getProjectListSuccess, getProjectListError } from './actions';

import rsf from '../firestore';
import todoData from '../../data/todos.json';

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

function* getProjectListRequest(ownerId) {
	console.info(ownerId);
	const userProjects = yield call(
		rsf.firestore.getDocument,
		'projects/' + ownerId,
	);

	return userProjects.data().projects;
}

function* getProjectListItems({ payload }) {
	try {
		const response = yield call(getProjectListRequest, payload);
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
