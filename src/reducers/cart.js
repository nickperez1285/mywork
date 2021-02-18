import { auth } from "firebase";
import { actionTypes } from "redux-form";
import {
	SET_CART,
	SET_CART_ID,
	CLEAR_CART,
	EDIT_CART,
	ADD_USER_TO_CART,
	GET_CART,
	SET_ANNONYMOUS_CART,
	SET_CART_ADDRESS,
	SET_CART_ID_START,
	SET_CART_ID_FAIL,
	SET_CART_ID_FINISH,
	EDIT_CART_ITEM,
	INCREASE_CART_ITEM,
	DECREASE_CART_ITEM,
	UPDATE_CART,
} from "../actions";
export const initState = {
	cart_id: "",
	cart: [],
	total_price: 0,
	tax: 0,
	final_price: 0,
	user_id: "",
	store_id: "",
	store_address: "",
	store_phone_number: "",
	isFetching: false,
};

export const cartReducer = (state = initState, action) => {
	switch (action.type) {
		case SET_CART:
			// alert("Item Added To Cart");
			let total_price = state.total_price + action.payload.item_price * action.payload.item_quantity;
			let tax = state.tax + action.payload.item_price * 0.15 * action.payload.item_quantity;
			return {
				...state,
				cart: state.cart.concat(action.payload),
				total_price: total_price,
				tax: tax,
				// final_price: total_price + tax,
			};

		case SET_CART_ID_START:
			return { ...state, isFetching: true };

		case SET_CART_ID_FINISH:
			return {
				...state,
				cart_id: action.payload,
				isFetching: false,
			};
		case SET_CART_ID_FAIL:
			console.log(action.payload, " cart id fail error");
			return { ...state, isFetching: false, error: action.payload };

		case SET_CART_ADDRESS:
			// console.log(action.payload, "set cart address reducer");
			return {
				...state,
				store_address: action.payload,
				...action.payload,
			};
		// emptys carts
		case CLEAR_CART:
			return {
				...initState,
			};
		// DELETES ITEM FROM CART AND UPDATES CART PRICE
		case EDIT_CART:
			return {
				...state,
				cart: state.cart.filter((item) => item !== action.payload),
				total_price: state.total_price - action.payload.item_price * action.payload.item_quantity,
				tax: state.tax - 0.15 * action.payload.item_price * action.payload.item_quantity,
			};

		case DECREASE_CART_ITEM:
			const decItemIndex = state.cart.findIndex((item) => item.localId == action.payload.localId);

			let decItem = state.cart.find((i) => i.localId == action.payload.localId);
			let newDecItem =
				decItem.item_quantity > 1
					? Object.assign(decItem, { item_quantity: decItem.item_quantity - 1 })
					: Object.assign(decItem, { item_quantity: 1 });
			console.log(newDecItem.item_quantity, newDecItem.item_price, " new total");

			return {
				...state,
				cart: [
					...state.cart.slice(0, decItemIndex),
					{ ...state.cart[decItemIndex], newDecItem },
					...state.cart.slice(decItemIndex + 1),
				],
			};

		case INCREASE_CART_ITEM:
			const incItemIndex = state.cart.findIndex((item) => item.localId == action.payload.localId);

			const incItem = state.cart.find((i) => i.localId == action.payload.localId);
			const newIncItem = Object.assign(incItem, { item_quantity: incItem.item_quantity + 1 });
			return {
				...state,
				cart: [
					...state.cart.slice(0, incItemIndex),
					{ ...state.cart[incItemIndex], newIncItem },
					...state.cart.slice(incItemIndex + 1),
				],
			};

		//
		case EDIT_CART_ITEM:
			const editItemIndex = state.cart.findIndex((item) => item.localId == action.payload.localId);

			const editItem = state.cart.find((i) => i.localId == action.payload.localId);
			const newEditItem = Object.assign(editItem, action.payload.update);
			return {
				...state,
				cart: [
					...state.cart.slice(0, editItemIndex),
					{ ...state.cart[editItemIndex], newEditItem },
					...state.cart.slice(editItemIndex + 1),
				],
			};

		case ADD_USER_TO_CART:
			console.log(action.payload, "adduser to cart reducer");
			return {
				...state,
				user_id: action.payload,
			};

		case GET_CART:
			return {
				...state,
				total_price: parseInt(state.total_price),
				tax: parseInt(state.tax),
				final_price: state.total_price + state.tax,
			};

		// FINDS ITEM IN CART BY ID, REPLACES IT, UPDATES CART PRICES
		case UPDATE_CART:
			// const updateItemIndex = state.cart.findIndex((item) => item.localId == action.payload.localId);

			return {
				...state,
				...action.payload,
				total_price: state.cart.reduce((acc, itm) => acc + itm.item_price * itm.item_quantity, 0),
				tax: state.cart.reduce((acc, itm) => acc + itm.item_price * itm.item_quantity, 0) * 0.15,
			};
		case SET_ANNONYMOUS_CART:
			return {
				...state,
				cart_id: action.payload,
			};

		default:
			return state;
	}
};
