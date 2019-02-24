import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
} from 'Constants/actionTypes';

const INIT_STATE = {
	allTodoItems: null,
	projects: null,
	project: null,
	error: '',
	filter: null,
	searchKeyword: '',
	orderColumn: null,
	loading: false,
	categories: ['Flexbox', 'Sass', 'React'],
	selectedItems: [],
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case PROJECT_GET_LIST:
			return { ...state, loading: false };

		case PROJECT_GET_LIST_SUCCESS:
			return {
				...state,
				loading: true,
				project: action.payload,
				projects: action.payload,
			};

		case PROJECT_GET_LIST_ERROR:
			return { ...state, loading: true, error: action.payload };

		default:
			return { ...state };
	}
};
