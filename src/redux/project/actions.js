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

export const saveProject = owner => ({
	type: PROJECT_SAVE,
	payload: owner,
});

export const saveProjectSuccess = newProject => ({
	type: PROJECT_SAVE_SUCCESS,
	payload: newProject,
});

export const saveProjectError = error => ({
	type: PROJECT_SAVE_ERROR,
	payload: error,
});

export const editProject = (field, value) => ({
	type: PROJECT_EDIT,
	payload: { field, value },
});

export const editProjectSuccess = project => ({
	type: PROJECT_EDIT_SUCCESS,
	payload: project,
});

export const editProjectError = error => ({
	type: PROJECT_EDIT_ERROR,
	payload: error,
});
