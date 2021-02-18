import {
	GET_INVENTORY_START,
	GET_INVENTORY_SUCCESS,
	GET_INVENTORY_FAIL,
	GET_INVENTORY_RESET,
	SET_INVENTORY_ID,
} from "../actions";

export const initState = {
	isFetching: false,
	inventoryID: "",
	searchWord: "",
	inventory: [],
	error: "",
};

export const inventoryReducer = (state = initState, action) => {
	switch (action.type) {
		case GET_INVENTORY_START:
			return {
				...state,
				error: "",
				isFetching: true,
			};
		case GET_INVENTORY_SUCCESS:
			return {
				...state,
				inventory: action.payload,
				inventoryID: action.inventoryID,
				searchWord: action.searchWord,
				error: "",
				isFetching: false,
			};
		case GET_INVENTORY_FAIL:
			return {
				...state,
				error: action.payload,
				isFetching: false,
			};

		case GET_INVENTORY_RESET:
			return {
				...state,
				inventory: initState.inventory,
			};
		case SET_INVENTORY_ID:
			return {
				...state,
				inventoryID: action.payload,
			};
		default:
			return state;
	}
};
