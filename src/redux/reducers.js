import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import todoApp from './todo/reducer';
import projectApp from './project/reducer';
import { firestoreReducer } from 'redux-firestore';

const reducers = combineReducers({
	menu,
	settings,
	authUser,
	todoApp,
	projectApp,
	firestore: firestoreReducer,
});

export default reducers;
