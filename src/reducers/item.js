import {
	GET_ITEM,
	SET_ITEM,
	SET_ITEM_VARIANTS,
	SET_ITEM_ADDON,
	ADD_IMAGE,
	SET_ITEM_STATUS,
	UPDATE_ITEM,
	EDIT_ITEM,
	START_SET_ITEM,
} from "../actions";

export const initState = {
	itemReady: false,
	itemID: "",
	item_color: "",
	item_price: 0,
	item_quantity: 0,
	item_size: "",
	item_title: "",
	item_info: {},
	variants: [],
	add_ons: [],
	store_address: {},
	images: [],
	name: "",
	base_price: "",
	description: "",
	objectID: "",
	selections: [],
	localId: "",
};

export const itemReducer = (state = initState, action) => {
	switch (action.type) {
		case SET_ITEM:
			// console.log(action.info, " set item reducer ");

			return {
				...state,

				itemID: action.payload,
				item_price: action.info.base_price,
				item_quantity: action.info.quantity,
				item_title: action.info.name,
				itemReady: true,
				...action.info,
			};

		case GET_ITEM:
			return {
				...state,
			};

		case UPDATE_ITEM:
			return {
				...state,
				...action.payload,
			};

		case EDIT_ITEM:
			return {
				...state,
				...action.payload,
			};

		case SET_ITEM_VARIANTS:
			return {
				...state,
				variants: action.payload,
			};

		case SET_ITEM_ADDON:
			return {
				...state,
				add_ons: action.payload,
			};
		case START_SET_ITEM:
			return {
				...state,
				itemReady: false,
			};

		case SET_ITEM_STATUS:
			return {
				...state,
				itemReady: action.payload,
			};
		case ADD_IMAGE:
			return {
				...state,
				images: [state.images + action.payload],
			};
		default:
			return state;
	}
};
