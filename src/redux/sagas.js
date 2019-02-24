import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import todoSagas from './todo/saga';
import projectSagas from './project/saga';

export default function* rootSaga(getState) {
	yield all([authSagas(), todoSagas(), projectSagas()]);
}
