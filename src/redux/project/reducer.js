import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
	PROJECT_ADD,
	PROJECT_SAVE,
	PROJECT_SAVE_SUCCESS,
	PROJECT_SAVE_ERROR,
	PROJECT_EDIT,
	PROJECT_EDIT_SUCCESS,
	PROJECT_EDIT_ERROR,
} from 'Constants/actionTypes';

import uuid from 'uuid/v4';

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
			if (action.payload !== '' && !state.newProject) {
				return {
					...state,
					loading: true,
					newProject: {
						guid: uuid(),
						name: null,
						owner: action.payload,
						carrier: {
							guid: uuid(),
							articleNo: null,
							name: null,
							projectArticles: [],
						},
					},
				};
			} else {
				return { ...state, loading: true };
			}

		case PROJECT_SAVE:
			return { ...state, loading: false };

		case PROJECT_SAVE_SUCCESS:
			return {
				...state,
				loading: true,
				newProject: action.payload,
			};

		case PROJECT_SAVE_ERROR:
			return { ...state, loading: true, error: action.payload };

		case PROJECT_EDIT:
			if (action.payload.field === '' || action.payload.value === '') {
				return {
					...state,
					loading: true,
					todoItems: state.allTodoItems,
					filter: null,
				};
			} else {
				const filteredItems = state.allTodoItems.filter(
					item => item[action.payload.column] === action.payload.value,
				);
				return {
					...state,
					loading: true,
					todoItems: filteredItems,
					filter: {
						column: action.payload.column,
						value: action.payload.value,
					},
				};
			}

		case PROJECT_EDIT_SUCCESS:
			return {
				...state,
				loading: true,
				newProject: action.payload,
			};

		case PROJECT_EDIT_ERROR:
			return { ...state, loading: true, error: action.payload };

		default:
			return { ...state };
	}
};
