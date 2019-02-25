import {
	MATERIALS_GET,
	MATERIALS_GET_SUCCESS,
	MATERIALS_GET_ERROR,
} from 'Constants/actionTypes';

export const getMaterial = materialsId => ({
	type: MATERIALS_GET,
	payload: materialsId,
});

export const getMaterialSuccess = material => ({
	type: MATERIALS_GET_SUCCESS,
	payload: material,
});

export const getMaterialError = error => ({
	type: MATERIALS_GET_ERROR,
	payload: error,
});
