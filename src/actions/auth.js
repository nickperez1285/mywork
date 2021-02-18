export const SAVE_TOKEN = "SAVE_TOKEN";
export const LOADING = "LOADING";
export const ERROR = "ERROR";
export const REMOVE_TOKEN = "REMOVE_TOKEN";
export const GET_TOKEN = "GET_TOKEN";
import AsyncStorage from "@react-native-community/async-storage";
import { setUserID } from "./index";

export const getToken = (token) => (dispatch) => {
	dispatch({
		type: "GET_TOKEN",
		payload: JSON.parse(token),
	});
};

export const saveToken = (token) => {
	return async (dispatch, getState) => {
		try {
			dispatch({ type: "SAVE_TOKEN", payload: token });
		} catch (err) {
			console.log(err);
		}
	};
};

export const removeToken = () => ({
	type: "REMOVE_TOKEN",
});

export const loading = (bool) => ({
	type: "LOADING",
	isLoading: bool,
});

export const error = (error) => ({
	type: "ERROR",
	error,
});

export const getUserToken = () => (dispatch) =>
	AsyncStorage.getItem("KEY")
		.then((data) => {
			dispatch(loading(false));
			dispatch(getToken(data));
			return data;
		})
		.catch((err) => {
			dispatch(loading(false));
			dispatch(error(err.message || "ERROR"));
		});

export const saveUserToken = (data) => (dispatch) => {
	const user_data = { id: data.localId, token: data.idToken, isNewUser: data.isNewUser, ...data };
	AsyncStorage.setItem("KEY", JSON.stringify(user_data))
		.then((data) => {
			dispatch(loading(false));
			console.log(user_data.localId, user_data.isNewUser);
			dispatch(setUserID(user_data.localId, user_data.isNewUser));
			dispatch(saveToken(user_data));
		})
		.catch((err) => {
			dispatch(loading(false));
			dispatch(error(err.message || "ERROR"));
		});
};

export const removeUserToken = () => (dispatch) =>
	AsyncStorage.removeItem("KEY")
		.then((data) => {
			dispatch(loading(false));
			dispatch(removeToken(data));
		})
		.catch((err) => {
			dispatch(loading(false));
			dispatch(error(err.message || "ERROR"));
		});
