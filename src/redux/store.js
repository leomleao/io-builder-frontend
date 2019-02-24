import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';

import { reduxFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';

import { database } from '../firebase';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore'; // make sure you add this for firestore

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export function configureStore(initialState) {
	const store = createStore(
		reducers,
		initialState,
		compose(
			reactReduxFirebase(firebase, database),
			reduxFirestore(firebase, database),
			applyMiddleware(...middlewares),
			window.__REDUX_DEVTOOLS_EXTENSION__ &&
				window.__REDUX_DEVTOOLS_EXTENSION__(),
		),
	);

	sagaMiddleware.run(sagas, getFirebase);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextRootReducer = require('./reducers');
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}
