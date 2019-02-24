import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
} from 'Constants/actionTypes';

export const getProjectList = ownerUid => ({
	type: PROJECT_GET_LIST,
	payload: ownerUid,
});

export const getProjectListSuccess = projects => ({
	type: PROJECT_GET_LIST_SUCCESS,
	payload: projects,
});

export const getProjectListError = error => ({
	type: PROJECT_GET_LIST_ERROR,
	payload: error,
});
