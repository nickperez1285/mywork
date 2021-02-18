import {
	GET_STORES_START,
	GET_STORES_SUCCESS,
	GET_STORES_FAIL,
	SET_STORE_ADDRESS,
} from "../actions";

export const initState = {
	storeData: "",
	isFetching: false,
	coords: "",
	query: "",
	radius: "",
	zip: "",
	selected_address: "",
};
export const algoliaReducer = (state = initState, action) => {
	switch (action.type) {
		case GET_STORES_START:
			return {
				...state,
				error: "",
				isFetching: true,
			};
		case GET_STORES_SUCCESS:
			return {
				...state,
				error: "",
				isFetching: false,
				storeData: action.payload,
				coords: action.coords,
				zip: action.zip,
				// searchWrd: action.query
			};

		case GET_STORES_FAIL:
			return {
				...state,
				error: action.payload,
				isFetching: false,
			};
		case SET_STORE_ADDRESS:
			return {
				...state,
				selected_address: action.payload,
			};
		default:
			return state;
	}
};
