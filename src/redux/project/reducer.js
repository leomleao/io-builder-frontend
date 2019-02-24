import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
	PROJECT_ADD,
	PROJECT_ADD_SUCCESS,
	PROJECT_ADD_ERROR,
} from 'Constants/actionTypes';

import currentDB from '../../data/currentDB';

const INIT_STATE = {
	allProjects: null,
	projects: null,
	newProject: null,
	error: '',
	filter: null,
	searchKeyword: '',
	orderColumn: null,
	loading: false,
	categories: ['Flexbox', 'Sass', 'React'],
	selectedItems: [],
	totalPage: 1,
	totalItemCount: 0,
	isLoading: true,
	suggestions: currentDB,
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case PROJECT_GET_LIST:
			return { ...state, loading: false };

		case PROJECT_GET_LIST_SUCCESS:
			return {
				...state,
				loading: true,
				projects: action.payload,
			};

		case PROJECT_GET_LIST_ERROR:
			return { ...state, loading: true, error: action.payload };

		case PROJECT_ADD:
			return { ...state, loading: false };

		case PROJECT_ADD_SUCCESS:
			return {
				...state,
				loading: true,
				newProject: action.payload,
			};

		case PROJECT_ADD_ERROR:
			return { ...state, loading: true, error: action.payload };

		default:
			return { ...state };
	}
};
