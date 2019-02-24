import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
} from 'Constants/actionTypes';

export const getProjectList = ownerUid => ({
	type: PROJECT_GET_LIST,
});

export const getProjectListSuccess = items => ({
	type: PROJECT_GET_LIST_SUCCESS,
	payload: items,
});

export const getProjectListError = error => ({
	type: PROJECT_GET_LIST_ERROR,
	payload: error,
});
