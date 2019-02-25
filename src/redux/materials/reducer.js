import {
	MATERIALS_GET,
	MATERIALS_GET_SUCCESS,
	MATERIALS_GET_ERROR,
} from 'Constants/actionTypes';

import uuid from 'uuid/v4';

const INIT_STATE = {
	material: null,
	error: '',
	loading: false,
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case MATERIALS_GET:
			return { ...state, loading: false };

		case MATERIALS_GET_SUCCESS:
			return {
				...state,
				loading: true,
				material: action.payload,
			};

		case MATERIALS_GET_ERROR:
			return { ...state, loading: true, error: action.payload };

		default:
			return { ...state };
	}
};
