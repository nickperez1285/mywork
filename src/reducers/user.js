import {
	GET_USER,
	GET_USER_START,
	GET_USER_FAIL,
	GET_USER_FINISH,
	SET_USER,
	SET_USERID,
	CLEAR_USER,
	SET_USER_STRIPE_ID,
	GET_USER_STRIPE_ID,
	ADD_USER_CARD,
	UPDATE_USER,
	SET_USER_INFO,
	ADD_USER_ADDRESS,
	GET_USER_ID,
	ADD_USER_INFO,
	GET_ALL_ADDRESSES,
	SET_SELECTED_ADDRESS,
	SET_CARD,
	GET_USER_CARDS,
	SELECT_CARD,
	GET_USER_INFO,
	DEFAULT_ADDRESS,
} from "../actions/index";
import { PURGE, REHYDRATE } from "redux-persist";
export const initState = {
	isFetching: false,
	loggedIn: false,
	user_stripe_id: "",
	user_ID: "",
	phoneNumber: "415-5555555",
	first_name: "",
	last_name: "",
	cards: [],
	image: "",
	profile_image: "",
	selectedAddress: {
		addressType: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		zipCode: "",
	},
	customer_addresses: [],
	selectedCard: "",
	dormRoomNumber: "",
	dormName: "",
};

export const userReducer = (state = initState, action) => {
	// Object.assign({}, state, {
	// 	address: action.payload
	// 	})
	switch (action.type) {
		// sets user addres only
		case GET_USER_ID:
			// console.log("User ID :", action.payload);
			return {
				...state,
				user_ID: action.payload,
			};
		case GET_USER_INFO:
			return {
				...state,
				...action.payload,
			};

		case SET_USER:
			return { ...action.payload, loggedIn: true };
		// COMES FROM CHECKOUT SIGN UP
		case SET_USER_INFO:
			if (action.payload.user_stripe_id != undefined) {
				return { ...state, ...action.payload, loggedIn: true };
			} else {
				return { ...state, ...action.payload, loggedIn: false };
			}

		case SET_USERID:
			console.log("user id set");
			return {
				...state,
				user_ID: action.payload,
				loggedIn: true,
			};
		case SET_USER_STRIPE_ID:
			console.log("stripe id set", action.payload);
			return {
				...state,
				user_stripe_id: action.payload,
				loggedIn: true,
			};

		case GET_USER_STRIPE_ID:
			//pulls from local storage if exists
			// console.log("stripe id", action.payload);
			return {
				...state,
			};

		case GET_USER_FINISH:
			return {
				...state,
				isFetching: false,
			};
		case GET_USER_START:
			return {
				...state,
				isFetching: true,
			};
		case GET_USER_FAIL:
			console.log(action.payload, " get user fail ");
			return {
				...state,
				isFetching: false,
			};

		case GET_USER:
			console.log(action.id, " getuser id  reducer  ");

			let info = action.payload;
			return {
				...state,
				user_ID: action.id,
				phoneNumber: info.phoneNumber,
				loggedIn: action.loggedIn,
				isFetching: false,

				...info,
			};

		case UPDATE_USER:
			return { ...state, ...action.payload };
		case GET_USER_CARDS:
			console.log(action.payload.length, " ccs in user reducer");

			return {
				...state,
				cards: action.payload,
			};

		case ADD_USER_CARD:
			return {
				...state,
				// cards: state.cards + action.payload,
			};

		case SET_CARD:
			let num = { card: action.payload.values.number, type: action.payload.values.type };
			return {
				...state,
				cards: [state.cards, num],
			};
		case SET_SELECTED_ADDRESS:
			let address = {
				addressType: "other",
				addressLine1: action.payload.addressLine1,
				addressLine2: action.payload.addressLine2,
				city: action.payload.city,
				state: action.payload.state,
				zipCode: action.payload.zipCode,
			};
			return {
				...state,
				selectedAddress: action.payload,
			};

		case ADD_USER_ADDRESS:
			return {
				...state,
				customer_addresses: state.customer_addresses.concat(action.payload),
			};

		case ADD_USER_INFO:
			let add = Object.assign(
				{},
				{
					addressType: action.payload.addressType,
					state: action.payload.state,
					city: action.payload.city,
					addressLine1: action.payload.addressLine1,
					addressLine2: action.payload.addressLine2,
					zipCode: action.payload.zipCode,
				}
			);
			return {
				...state,

				first_name: action.payload.first_name,
				last_name: action.payload.last_name,
				loggedIn: true,
				user_ID: action.payload.user_ID,
				user_stripe_id: action.payload.user_stripe_id,
				phoneNumber: action.payload.phone,
				customer_addresses: [add],
			};
		case GET_ALL_ADDRESSES:
			return {
				...state,
				customer_addressessses: action.payload,
			};
		case CLEAR_USER:
			return {
				...initState,
			};
		case SELECT_CARD:
			console.log("card selected reducer");
			return {
				...state,
				selectedCard: action.payload,
			};
		case PURGE:
			return {
				...initState,
			};
		case DEFAULT_ADDRESS:
			return {
				...state,
				selectedAddress: action.payload,
			};

		default:
			return state;
	}
};
