import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
} from 'Constants/actionTypes';

const INIT_STATE = {
	allProjectItems: null,
	projects: null,
	error: '',
	loading: false,
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case PROJECT_GET_LIST:
			return { ...state, loading: false };

		case PROJECT_GET_LIST_SUCCESS:
			return {
				...state,
				loading: true,
				allProjectItems: action.payload,
				projectItems: action.payload,
			};

		case PROJECT_GET_LIST_ERROR:
			return { ...state, loading: true, error: action.payload };

		default:
			return { ...state };
	}
};
