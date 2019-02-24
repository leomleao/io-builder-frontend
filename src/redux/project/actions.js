import {
	PROJECT_GET_LIST,
	PROJECT_GET_LIST_SUCCESS,
	PROJECT_GET_LIST_ERROR,
	PROJECT_ADD,
	PROJECT_ADD_SUCCESS,
	PROJECT_ADD_ERROR,
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

export const addProject = owner => ({
	type: PROJECT_ADD,
	payload: owner,
});

export const addProjectSuccess = newProject => ({
	type: PROJECT_ADD_SUCCESS,
	payload: newProject,
});

export const addProjectError = error => ({
	type: PROJECT_ADD_ERROR,
	payload: error,
});
