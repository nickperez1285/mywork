import { SAVE_TOKEN, LOADING, ERROR, REMOVE_TOKEN, GET_TOKEN } from "../actions/auth";

export const initState = {
	token: "",
	id: "",
	isNewUser: "",
};

export const authReducer = (state = initState, action) => {
	switch (action.type) {
		case GET_TOKEN:
			console.log(action.payload.localId, "get token auth reducer");
			return {
				state,
			};

		case REMOVE_TOKEN: {
			return { ...initState };
		}
		case SAVE_TOKEN: {
			console.log(action.payload.id, "auth reducer ");
			return {
				token: action.payload.idToken,
				...action.payload,
			};
		}

		default:
			return state;
	}
};
