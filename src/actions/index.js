import axios from "axios";
import algoliasearch from "algoliasearch";
import AsyncStorage from "@react-native-community/async-storage";
import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { add, exp } from "react-native-reanimated";
import { getStateFromPath } from "@react-navigation/native";
import { bindActionCreators } from "redux";
import { getUserToken } from "./auth";

export const GET_LOCATION_START = "GET_LOCATION_START";
export const GET_LOCATION_SUCCESS = "GET_LOCATION_SUCCESS";
export const GET_LOCATION_FAIL = "GET_LOCATION_FAIL";

export const GET_STORES_START = "GET_STORES_START";
export const GET_STORES_SUCCESS = "GET_STORES_SUCCESS";
export const GET_STORES_FAIL = "GET_STORES_FAIL";
export const SET_STORE_ADDRESS = "SET_STORE_ADDRESS";

export const GET_INVENTORY_START = "GET_INVENTORY_START";
export const GET_INVENTORY_SUCCESS = "GET_INVENTORY_SUCCESS";
export const GET_INVENTORY_FAIL = "GET_INVENTORY_FAIL";
export const GET_INVENTORY_RESET = "GET_INVENTORY_RESET";
export const SET_INVENTORY_ID = "SET_INVENTORY_ID";
export const UPDATE_REDUX = "UPDATE_REDUX";
export const SET_CART = "SET_CART";
export const CLEAR_ORDERS = "CLEAR_ORDERS";

export const GET_CART = "GET_CART";
export const CLEAR_CART = "CLEAR_CART";
export const EDIT_CART = "EDIT_CART";
export const ADD_USER_TO_CART = "ADD_USER_TO_CART";
export const SET_CART_ADDRESS = "SET_CART_ADDRESS";

export const GET_ITEM = "GET_ITEM";
export const ADD_IMAGE = "ADD_IMAGE";
export const SET_ITEM = "SET_ITEM";
export const SET_USER = "SET_USER";
export const SET_USER_INFO = "SET_USER_INFO";
export const GET_USER_INFO = "GET_USER_INFO";
export const SET_USERID = "SET_USERID";
export const SET_USER_STRIPE_ID = "SET_USER_STRIPE_ID";
export const GET_USER_STRIPE_ID = "GET_USER_STRIPE_ID";
export const GET_USER = "GET_USER";
export const SET_CARD = "SET_CARD";
export const GET_USER_ID = "GET_USER_ID";
export const ADD_USER_CARD = "ADD_USER_CARD";
export const GET_USER_CARDS = "GET_USER_CARDS";
export const ADD_USER_ADDRESS = "ADD_USER_ADDRESS";
export const ADD_USER_INFO = "ADD_USER_INFO";
export const SET_SELECTED_ADDRESS = "SET_SELECTED_ADDRESS";
export const CLEAR_USER = "CLEAR_USER";
export const SET_ORDER_ID = "SET_ORDER_ID";
export const GET_ORDER_ID = "GET_ORDER_ID";
export const GET_ORDER_INFO = "GET_ORDER_INFO";
export const GET_ALL_ORDERS = "GET_ALL_ORDERS";
export const GET_ORDER_RECEIPT = "GET_ORDER_RECEIPT";
export const SET_ORDER_RECEIPT = "SET_ORDER_RECEIPT";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const CREATE_ORDER_ID = "CREATE_ORDER_ID";
export const GET_QUOTE = "GET_QUOTE";
export const SET_ANNONYMOUS_CART = "SET_ANNONYMOUS_CART";
export const DEFAULT_ADDRESS = "DEFAULT_ADDRESS";
export const SET_ITEM_VARIANTS = "SET_ITEM_VARIANTS";
export const SET_ITEM_STATUS = "SET_ITEM_STATUS";
export const EDIT_ITEM = "EDIT_ITEM";
export const EDIT_CART_ITEM = "EDIT_CART_ITEM";
export const DECREASE_CART_ITEM = "DECREASE_CART_ITEM";
export const INCREASE_CART_ITEM = "INCREASE_CART_ITEM";
export const UPDATE_CART = "UPDATE_CART";
export const SET_ITEM_ADDON = "SET_ITEM_ADDON";

export const UPDATE_USER = "UPDATE_USER";

export const GET_ALL_ADDRESSES = "GET_ALL_ADDRESSES";
export const SELECT_CARD = "SELECT_CARD";
export const CHARGE_STRIPE = "CHARGE_STRIPE";
export const CHARGE_STRIPE_FAIL = "CHARGE_STRIPE_FAIL";

export const CREATE_DELIVERY = "CREATE_DELIVERY";
export const PAY_STATUS = "PAY_STATUS";
export const EMAIL_DORM = "EMAIL_DORM";
export const LOGOUT = "LOGOUT";
export const UPDATE_ITEM = "UPDATE_ITEM";
import { removeUserToken } from "./auth";
import { Alert } from "react-native";
const searchClient = algoliasearch("6U6YMVK0BE", "4bed45eb16c3755cdd2192c4f33b8e4c");

const index2 = searchClient.initIndex("sexycakes_menu");
// const index2 = searchClient.initIndex("dev_ULA");
const index = searchClient.initIndex("sexycakes_stores");
// const index = searchClient.initIndex("stores");

// const clientClient = algoliasearch('CLIENT_ID', 'API_KEY')
// const clientDatabase = clientClient.initIndex('CLIENT DATABASE')
export const logOut = () => (dispatch) => {
	dispatch({ type: LOGOUT });
	console.log("logging out index ");
	dispatch(removeUserToken());

	dispatch(clearUser());
	dispatch(clearOrders());
};

export const getOrderID = (id) => {
	return async (dispatch) => {
		try {
			let url = `http://us-central1-saymile-a29fa.cloudfunctions.net/api/getOrder/${id}`;
			const res = await fetch(url, {
				method: "GET",
				mode: "cors",
			});
			const data = await res.json();
			dispatch({
				type: GET_ORDER_ID,
				payload: data,
			});
			data.then((x) => console.log(x, "x"));
		} catch (err) {
			console.log(JSON.parse(err), "order id fail");
		}
	};
};

export const getAllOrders = (userStripeId) => {
	return async (dispatch, getState) => {
		try {
			let url = `http://us-central1-saymile-a29fa.cloudfunctions.net/api/getOrderFromUser/${userStripeId}`;

			const res = await fetch(url, {
				method: "GET",
				mode: "cors",
			});
			const dat = await res.json();

			dispatch({
				type: GET_ALL_ORDERS,
				payload: dat,
			});
			return getState().orderReducer.orderedItems;
		} catch (err) {
			console.log(err, "get info fail ");
		}
	};
};
export const setOrderID = (id) => (dispatch) => {
	dispatch({
		type: SET_ORDER_ID,
		payload: id,
	});
	console.log("order id request received ");
};
export const updateOrder = (info) => (dispatch) => {
	dispatch({
		type: UPDATE_ORDER,
		payload: info,
	});
};

export const createOrderID = (info) => {
	return async (dispatch) => {
		try {
			let body = {
				order_id: "",
				customer_address: info.customer_address, // if no selected address, defaults to the last one provided [this.]
				delivery_fee: info.delivery_fee, //determined by checkdelivery function
				delivery_id: info.delivery_id, //set in  postmates' quote_id from createQuote
				first_name: info.first_name,
				items: info.items,
				last_name: info.last_name,
				order_status: "pending", //get order status from getDeliveryStatusForDifferentService ignore the naming for now
				phone: info.phone,
				store_address: info.store_address, //need to decide if all items will comefrom same store address
				store_id: info.store_id, //store id of first item in cart
				total_price: info.total_price,
				user_stripe_id: info.user_stripe_id,
			};
			// console.log(JSON.stringify(body), "create order id index");
			const res = await fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/createOrder", {
				method: "POST",
				mode: "cors",
				body: JSON.stringify(body),
			});

			const data = await res.json();
			dispatch({
				type: CREATE_ORDER_ID,
				payload: data.order_id,
			});
			console.log("create order id success");
		} catch (err) {
			console.log(err, "create order id   fail");
		}
		return "done";
	};
};

export const getOrderInfo = (orderid) => (dispatch) => {
	let url = `http://us-central1-saymile-a29fa.cloudfunctions.net/api/getOrder/${id}`;
	fetch(url, {
		method: "GET",
		mode: "cors",
	})
		.then((res) => {
			res.json().then((data) => {
				dispatch({
					type: GET_ORDER_INFO,
					payload: data,
					id: id,
				});
			});
		})
		.catch((err) => {
			err.json.then((dat2) => {
				console.log(dat2, "get info fail ");
			});
		});
};
export const getQuote = (pickUp, dropOff, stripe_id) => {
	return async (dispatch, getState) => {
		try {
			const { addressLine1, city, state } = dropOff;
			const { Store_street_address, store_city, store_state } = pickUp;
			const dropoff_address = addressLine1 + "," + city + "," + state;
			const pickup_address = Store_street_address + "," + store_city + "," + store_state; //Store address of first item in cart (set in products.js)

			const addresses = {
				pickup_address: pickup_address,
				dropoff_address: dropoff_address,
				user_stripe_id: stripe_id,
			};
			console.log(dropoff_address, "get quote dropopp off address");
			console.log(pickup_address, "get quote pickup address");
			console.log(stripe_id, "get quote stripeid ");
			const res = await fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/createQuote", {
				method: "POST",
				body: JSON.stringify(addresses),
				// body: JSON.stringify({"pickup_address":"2500 North Mayfair Road, New Orleans, LA","dropoff_address":"2600 North Mayfair Road, New orleans, LA", "user_stripe_id":"cus_IBypu0TU00YWwP"}),
			});
			const data = await res.json();
			console.log(data.fee, "getquote succceeded ");
			console.log(data.quote_id, " delivery id index");
			if (data.fee !== undefined) {
				dispatch({
					type: GET_QUOTE,
					payload: data,
				});
			} else {
				alert("Address Not Deliverable"), dispatch(setDefaultAddress());
			}
		} catch (err) {
			alert("Please try again .Address not deliverable ");
			console.log(err, "get quote id  fail ");
		}
	};
};

export const DELIVERY_START = "DELIVERY_START";
export const DELIVERY_FAIL = "DELIVERY_FAIL";
export const DELIVERY_FINISH = "DELIVERY_FINISH";

export const startDelivery = () => ({ type: DELIVERY_START });
export const failDelivery = (error) => ({
	type: DELIVERY_FAIL,
	payload: error,
});
export const finishDelivery = (data) => ({
	type: DELIVERY_FINISH,
	payload: data,
});
export const createDelivery = (info) => {
	return async (dispatch) => {
		dispatch(startDelivery());
		try {
			const { addressLine1, city, state } = info.dropoff_address;
			const { Store_street_address, store_city, store_state } = info.pickup_address;
			const dropoff_address = addressLine1 + ", " + city + ", " + state;
			const pickup_address = Store_street_address + ", " + store_city + ", " + store_state;
			console.log(dropoff_address, "create delivery dropoff address");
			const obj = {
				pickup_name: info.pickup_name,
				// pickup_address: "2500 North Mayfair Road, Wauwatosa, WI",
				pickup_address: pickup_address,
				pickup_phone_number: info.pickup_phone_number,
				dropoff_name: info.dropoff_name,
				dropoff_address: dropoff_address,
				dropoff_phone_number: info.dropoff_phone_number,
				quote_id: info.quote_id,
				manifest_items: info.manifest_items,
				manifest: "manifest",
				user_stripe_id: info.user_stripe_id,
				order_type: info.order_type,
			};
			console.log(JSON.stringify(obj), "create delivery ");
			// console.log(obj, "create delivery ");
			const result = await fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/createDelivery", {
				method: "POST",
				body: JSON.stringify(obj),
				mode: "cors",
			});
			const data = await result.json();
			console.log(Object.keys(data), "status reposnse ");

			if (data.created) {
				dispatch(finishDelivery(data));

				console.log("sucessful delivery");
			}
			return data;
		} catch (error) {
			console.log(error);
			dispatch(failDelivery(error));
		}
	};
};

export const getUserCards = (stripeID) => {
	return async (dispatch, getState) => {
		try {
			const result = await fetch(`https://us-central1-saymile-a29fa.cloudfunctions.net/api/listAllCards/${stripeID}`, {
				method: "GET",
				mode: "cors",
			});
			const data = await result.json();

			dispatch({
				type: GET_USER_CARDS,
				payload: data.response.data,
			});
			return data.response.data;
		} catch (error) {
			console.log("CARDS IMPORT FAILED");
			console.log(error);
		}
	};
};
export const selectCard = (card) => (dispatch) => {
	dispatch({
		type: SELECT_CARD,
		payload: card,
	});
	console.log("CARD SELECTED");
};

export const chargeStripe = (stripe_id, itemsArr, card_id, amount_to_charge, delivery_fee) => {
	return async (dispatch) => {
		try {
			// const price = () => {
			// 	const x = amount_to_charge % 1;
			// 	if (x > 0) {
			// 		return parseInt(amount_to_charge * 100);
			// 	} else {
			// 		return amount_to_charge;
			// 	}
			const price = () => {
				return parseFloat(amount_to_charge).toFixed(2);
			};

			const order = {
				user_stripe_id: stripe_id,
				store_items: itemsArr,
				card_id: card_id,
				amount_to_charge: price(),
				delivery_fee: delivery_fee,
			};
			// console.log(JSON.stringify(order), "order from index");

			const res = await fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/chargeStripeID", {
				method: "POST",
				mode: "cors",
				body: JSON.stringify(order),
			});
			const data = await res.json();
			dispatch({
				type: CHARGE_STRIPE,
				payload: data,
			});
			// dispatch(getAllOrders(stripe_id));

			return data;
		} catch (error) {
			dispatch(stripeFail());
			console.log("Charge stripe FAILED");
		}
	};
};
export const stripeFail = () => (dispatch) => {
	console.log("charge fail index");
	dispatch({ type: CHARGE_STRIPE_FAIL, payload: "fail" });
};
export const emailDorm = (orderID) => {
	return async (dispatch) => {
		try {
			const res = await fetch(
				`http://us-central1-saymile-a29fa.cloudfunctions.net/api/sendOrderEmailForDorm/${orderID}`,
				{
					method: "POST",
					mode: "cors",
					// body: JSON.stringify(order)
				}
			);

			const data = await res.json();
			dispatch({
				type: EMAIL_DORM,
				payload: data,
			});

			return data;
		} catch (error) {
			console.log("EMAIL DORM  FAILED");
			console.log(error);
		}
	};
};

export const payStatus = () => (dispatch) => {
	dispatch({
		type: PAY_STATUS,
	});
};

export const getOrderReceipt = (id) => {
	return {
		type: GET_ORDER_RECEIPT,
		payload: id,
	};
};
export const setOrderReceipt = (info) => {
	return {
		type: SET_ORDER_RECEIPT,
		payload: info,
	};
};

// export const getAllAddresses = (id) => {
// 	// console.log(JSON.stringify({user_id:id}))
// 	return async (dispatch) => {
// 		try {
// 			const res = await fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/getUser", {
// 				method: "POST",
// 				body: JSON.stringify({ user_id: id }),
// 			});
// 			// console.log(res, ' get all addresses s')
// 			const data = await res.json();
// 			// console.log(data, 'dara')
// 			dispatch({
// 				type: GET_ALL_ADDRESSES,
// 				payload: data.user_data.customer_addresses,
// 			});
// 		} catch (err) {
// 			console.log(err, "get user fail ");
// 		}
// 	};
// };
export const clearUser = () => {
	return async (dispatch, getState) => {
		// AsyncStorage.clear();
		const data = AsyncStorage.removeItem("USER");
		data.then((dat) => console.log(dat, " clear user res index "));
		dispatch({
			type: CLEAR_USER,
		});
		Alert.alert(
			"",
			"Signed Out",
			// + `${final_price.toFixed(2)}`,
			[
				{
					text: "OK",
					onPress: () => {
						console.log("ok");
					},
				},
			]
		);
		return data;
	};
};
export const setUser = (address, loginStatus) => (dispatch) => {
	return {
		type: SET_USER,
		payload: address,
	};
};

// SETS USER INFO IN LOCAL STORAGE
export const setUserInfo = (info) => (dispatch) => {
	// AsyncStorage.setItem("USER_INFO", JSON.stringify(i));
	// console.log(info, " set user info index ");
	dispatch({
		type: SET_USER_INFO,
		payload: info,
	});

	// dispatch(getUserInfo());
};

// DISPATCH WIHTIN ACTIONS INDEX<.GETS USER INFO FROM LOCAL STORAGE , IF EXISTS, SETS TO STATE
// export const getUserInfo = (userid) => {
// 	return async (dispatch, getstate) => {
// 		try {
// 			const data = await AsyncStorage.getItem("USER_INFO");
// 			// const arr = await data.filter((i) => {
// 			// 	return i != undefined;
// 			// });
// 			// console.log(arr, "data in index ");
// 			dispatch({
// 				type: GET_USER_INFO,
// 				payload: data,
// 			});
// 			// return data;
// 			// }}
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	};
// };

export const updateUser = (obj) => (dispatch) => {
	dispatch({
		type: UPDATE_USER,
		payload: obj,
	});
};

export const setUserStripeID = (id) => (dispatch) => {
	return async (dispatch) => {
		try {
			AsyncStorage.setItem("STRIPE_ID", id);
			dispatch({
				type: SET_USER_STRIPE_ID,
				payload: id,
			});
			dispatch(updateUser({ loggedIn: true }));
			return id;
		} catch (er) {
			console.log(er);
		}
	};
};
export const getUserStripeID = () => (dispatch) => {
	return AsyncStorage.getItem("STRIPE_ID")
		.then((i) => {
			dispatch({
				type: GET_USER_STRIPE_ID,
				// payload: i,
			});
			return i;
		})
		.catch((err) => {
			console.log(err, "no LOCAL ID found ");
		});
};

export const setSelectedAddress = (address) => (dispatch) => {
	console.log(address, "set selected address");

	dispatch({ type: SET_SELECTED_ADDRESS, payload: address });
};

export const setDefaultAddress = (address) => {
	return async (dispatch, getState) => {
		const user = getState().userReducer;
		let addr = {};
		if (!address) {
			//IF MORE THAN 1 ADDRESS,DEFAULT TO  LAST ADDRESS INPUT
			if (user.customer_addresses.length > 1) {
				addr = user.customer_addresses[user.customer_addresses.length - 1];
			} else {
				addr = user.customer_addresses[0];
			}
		}
		addr !== undefined
			? dispatch(setSelectedAddress(addr))
			: console.log("  default address set or returned undefined  ");

		console.log(addr, " index set defualt add");
		return addr;
	};
};

export const setStoreAddress = (address) => (dispatch) => {
	dispatch({ type: SET_STORE_ADDRESS, payload: address });
};

//INSERTS AND OVERWRITES NEW USER INFO in firebase
export const addUserInfo = (info) => (dispatch) => {
	// Sets firesbase info as nested object,
	// {addressType: "shipping"}
	const body = {
		addressLine1: info.addressLine1,
		addressLine2: info.addressLine2,
		city: info.city,
		first_name: info.first_name,
		last_name: info.last_name,
		state: info.state,
		addressType: "billing",
		zipCode: info.zipCode,
		user_id: info.user_id,
		phone: info.phone,
	};
	// Will only add everything before zip code to actual db
	fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/addUserInfo", {
		method: "POST",
		body: JSON.stringify(body),
	})
		.then((res) => {
			res.json().then((dat) => {
				dispatch({
					type: ADD_USER_INFO,
					payload: info,
					status: dat,
				});
			});
		})
		.catch((err) => {
			err.json().then((dat) => {
				console.log(dat, "get user fail ");
			});
		});
};

export const getUserID = () => (dispatch) => {
	return AsyncStorage.getItem("USER")
		.then((i) => {
			dispatch({
				type: GET_USER_ID,
				payload: i,
			});
			return i;
		})

		.catch((err) => {
			console.log(err, "no LOCAL ID found ");
		});
};

export const setUserID = (id, isNew) => {
	return async (dispatch, getState) => {
		try {
			const ids = await AsyncStorage.setItem("USER", id);
			dispatch({
				type: SET_USERID,
				payload: ids,
			});
			if (isNew === false) {
				dispatch(getUser());
			}

			return id;
		} catch (err) {
			console.log(err);
		}
	};
};

export const GET_USER_START = "GET_USER_START";
export const GET_USER_FAIL = "GET_USER__FAIL";
export const GET_USER_FINISH = "GET_USER_FINISH";
//  LOOKS FOR USER ID IN LOCAL STORAGE, IF FOUND , QUERIES USER INFO FROM FIRE BASE AND SAVES IT TO LOCAL STORAGE L
export const getUserStart = () => (dispatch) => {
	dispatch({ type: GET_USER_START });
};
export const getUserFail = (msg) => (dispatch) => {
	dispatch({ type: GET_USER_FAIL, payload: msg });
	dispatch(getUserFinish);
};
export const getUserFinish = () => (dispatch) => {
	dispatch({ type: GET_USER_FINISH });
};

export const getUser = (id) => {
	return async (dispatch) => {
		try {
			dispatch(getUserStart());

			const ids = await AsyncStorage.getItem("USER");
			if (ids !== null) {
				const body = JSON.stringify({ user_id: ids });
				const res = await fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/getUser", {
					method: "POST",
					mode: "cors",
					body: body,
				});
				const data = await res.json();
				console.log(data.user_data.user_stripe_id, "-stripeID", "index get user data");
				// if (data.user_data.user_stripe_id) {

				dispatch({
					type: GET_USER,
					payload: data.user_data,
					id: ids,
					loggedIn: true,
				});
				// console.log(dispatch(getUserToken()), "getuser token ");
				// dispatch(setUserInfo(data.user_data));
				return data.user_data;
			} else {
				console.log("get user in index not found");
			}
			dispatch(getUserFinish);
			// else {
			// 	dispatch({
			// 		type: GET_USER,
			// 		payload: data.user_data,
			// 		id: ids,
			// 		loggedIn: false,
			// 	});
			// }
		} catch (err) {
			console.log(err, "get user fail ");
			dispatch(getUserFinishFail(err));
		}
	};
};

export const setCard = (c) => (dispatch) => {
	console.log("setting");
	dispatch({
		type: SET_CARD,
		payload: c,
	});
};
export const addUserCard = (user_stripe_id, stripeTokenOrCard) => {
	return async (dispatch, getState) => {
		try {
			const url = "http://us-central1-saymile-a29fa.cloudfunctions.net/api/addCard";
			const res = await fetch(url, {
				method: "PUT",
				body: JSON.stringify({
					user_stripe_id: user_stripe_id,
					stripeToken: stripeTokenOrCard,
				}),
			});
			const data = await res.json();
			if (res.status == 200) {
				Alert.alert(
					"",
					"Card Added",
					// + `${final_price.toFixed(2)}`,
					[
						{
							text: "OK",
							onPress: () => {
								console.log("ok");
							},
						},
					]
				);
			} else {
				alert("Card Not Saved", data.error.decline_code);
			}

			dispatch({
				type: ADD_USER_CARD,
				payload: data,
			});
			const user = getState().userReducer.user_stripe_id;
			dispatch(getUserCards(user));
			return data;
		} catch (error) {
			throw console.log(error);
		}
	};
};

export const addUserAddress = (info) => {
	return async (dispatch, getState) => {
		try {
			const body = {
				id: info.id,
				addressType: "shipping",
				addressLine1: info.addressLine1,
				addressLine2: info.addressLine2,
				city: info.city,
				state: info.state,
				zipCode: info.zipCode,
			};

			const result = await fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/addNewAddress", {
				method: "PUT",
				body: JSON.stringify(body),
				mode: "cors",
			});
			const data = await result.json();
			dispatch({
				type: ADD_USER_ADDRESS,
				payload: body,
				// }).then(x =>{ dispatch()})
			});
			dispatch(getUser());
			Alert.alert(
				"Success",
				"Address Saved",
				// + `${final_price.toFixed(2)}`,
				[
					{
						text: "OK",
						onPress: () => {
							console.log("ok");
						},
					},
				]
			);
			return data;
		} catch (error) {
			alert("Address Not Saved");
			console.log(error);
		}
	};
};

export const SET_CART_ID_START = "SET_CART_ID_START";
export const SET_CART_ID_FAIL = "SET_CART_ID_FAIL";
export const SET_CART_ID_FINISH = "SET_CART_ID_FINISH";

export const startFetchCart = () => ({ type: SET_CART_ID_START });
export const failFetchCart = (error) => (dispatch) => {
	return {
		type: SET_CART_ID_FAIL,
		payload: error,
	};
};

export const finishFetchCart = (data) => {
	return async (dispatch, getState) => {
		dispatch({
			type: SET_CART_ID_FINISH,
			payload: data,
		});

		if (data !== "") {
			const user = getState().userReducer.user_ID;
			dispatch(addUserToCart(user, data));
		}
	};
};
export const setCartID = (info) => {
	return async (dispatch, getState) => {
		dispatch(startFetchCart());

		try {
			const res = await fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/createCart", {
				method: "POST",
				mode: "cors",
				body: JSON.stringify(info),
			});
			const data = await res.json();

			dispatch(finishFetchCart(data.cart_id));
			const cartID = getState().cartReducer.cart_id;

			return cartID;
		} catch (err) {
			dispatch(failFetchCart(err));
		}
	};
};

export const setAnnonymousCart = (info) => (dispatch) => {
	let obj = {
		cart_id: "",
		total_price: info.total_price,
		store_id: info.store_id, //*****ONLY SEXY CAKES ,
		store_address: [info.storeAddress],
		store_phone_number: [info.store_phone_number],
		items: [info.items],
	};

	fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/createAnnonymousCart", {
		method: "POST",
		mode: "cors",
		body: JSON.stringify(obj),
	})
		.then((res) => {
			res.json().then((data) => {
				dispatch({
					type: SET_ANNONYMOUS_CART,
					payload: data.cart_id,
				}),
					console.log(data, " annonymous cart id set from index ");
			});
		})
		.catch((err) => {
			console.log(err, "fail ");
		});
};
// ADDS  ITEM OBJECT TO  CART

export const setCart = (item) => (dispatch, getState) => {
	dispatch({
		type: SET_CART,
		payload: item,
	});

	// const res = getState().cartReducer.cart;
	// console.log("item added to cart");

	// return res;
};

// SET IN PRODUCT SCREEN WHEN ITEM SELETED
export const setCartAddress = (item) => (dispatch) => {
	dispatch({
		type: SET_CART_ADDRESS,
		payload: item,
	});
};
export const clearCart = () => {
	return {
		type: CLEAR_CART,
	};
};
export const editCart = (item) => {
	return {
		type: EDIT_CART,
		payload: item,
	};
};

export const getCart = (id) => {
	return {
		type: GET_CART,
		payload: id,
	};
};

export const addUserToCart = (userID, cartID) => {
	return async (dispatch) => {
		try {
			const body = JSON.stringify({
				user_id: userID,
				cart_id: cartID,
			});
			// console.log(body, " body assign to cart  Actions.INDEX ");

			const res = await fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/assignCartTo", {
				method: "POST",
				mode: "cors",
				body: body,
			});

			const data = await res.json();
			return (
				data.sucess,
				dispatch({
					type: ADD_USER_TO_CART,
					payload: userID,
				})
			);
		} catch (err) {
			console.log(err, "add user to cart fail ");
		}
	};
};

export const getInventoryReset = () => {
	return {
		type: GET_INVENTORY_RESET,
	};
};
export const setInventoryID = (id) => (dispatch) => {
	dispatch({
		type: SET_INVENTORY_ID,
		payload: id,
	});
};

export const getItem = (itemID) => (dispatch) => {
	dispatch({
		type: "GET_ITEM",
		payload: itemID,
	});
};

export const START_SET_ITEM = "START_SET_ITEM";
export const startSetCartItem = () => (dispatch) => {
	dispatch({ type: START_SET_ITEM });
};
// SEARCHES INVENTORY FOR ITEM ID THEN ADDS ITEM to State
export const setCartItem = (itemID) => {
	return (dispatch, getState) => {
		dispatch(startSetCartItem);
		const inv = getState().inventoryReducer;
		// const address = getState().algoliaReducer.selected_address;

		const res = inv.inventory.find((i) => {
			// console.log(i, itemID, "setcartitem");

			return i.objectID == itemID;
		});
		if (typeof res !== undefined) {
			dispatch({ type: SET_ITEM, payload: itemID, info: res });
			return res;
		} else {
			console.log("no item found");
			dispatch(setItemStatus(false));
		}
	};
};

//

export const editCartItem = (localId, update) => (dispatch, getState) => {
	//edit/remove item from cart, set the item back in item state, add back the new  item
	// find item within cart, make updated copy , remap cart
	// const cart = getState().cartReducer.cart;

	dispatch({
		type: EDIT_CART_ITEM,
		payload: { localId: localId, update: update },
	});
	dispatch(updateCart());

	// console.log(getState());
};
//

export const updateCart = (updatedItem) => (dispatch, getState) => {
	//CALCULATES CURRENT STATE OF CART

	dispatch({ type: UPDATE_CART, payload: updatedItem });
};
export const decreaseCartItem = (item) => (dispatch, getState) => {
	dispatch({
		type: DECREASE_CART_ITEM,
		payload: item,
	});

	// const item = getState().cartReducer.cart.find((i) => i.localId === itemLocalID);
	// updateCart(item);
};
export const increaseCartItem = (item) => (dispatch, getState) => {
	// NEEDS LOCAL ID
	dispatch({
		type: INCREASE_CART_ITEM,
		payload: item,
	});
	// updateCart(item);
	// const cart = getState().cartReducer.cart;
	// return cart;
};

export const updateItem = (item) => (dispatch) => {
	dispatch({
		type: UPDATE_ITEM,
		payload: item,
	});
};

export const setItemStatus = (status) => (dispatch) => {
	dispatch({
		type: "SET_ITEM_STATUS",
		payload: status,
	});
};
export const setItemAddOn = (itemID, addOns) => (dispatch) => {
	dispatch({
		type: "SET_ITEM_ADDON",
		payload: addOns,
	});
};

export const setItemVariants = (itemID, variants) => (dispatch) => {
	dispatch({
		type: "SET_ITEM_VARIANTS",
		payload: variants,
	});
};

// export const getInventory = (inventoryID, query = "new") => (dispatch) => {
// 	dispatch({
// 		type: "GET_INVENTORY_START",
// 	});

// 	index2
// 		.search(`${query}`, {
// 			filters: `inventory: ${inventoryID}`,
// 		})

// index2.setSettings({
// 	attributesForFaceting: ["inventory"],
// });

// export const getInventory = (inventoryID = 1, query) => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch({
// 				type: "GET_INVENTORY_START",
// 			});
// 			const res = await index2.search(`${query}`, {
// 				filters: `inventory:${inventoryID}`,
// 			});
// 			const hits = await res({ hits });
// 			dispatch({
// 				type: GET_INVENTORY_SUCCESS,
// 				payload: hits,
// 				inventoryID: inventoryID,
// 				searchWord: `${query}`,
// 			});
// 		} catch (err) {
// 			dispatch({
// 				type: GET_INVENTORY_FAIL,
// 				payload: err,
// 			});
// 		}
// 	};
// };
export const getInventory = (inventoryID = 1, query) => (dispatch) => {
	dispatch({
		type: "GET_INVENTORY_START",
	});
	if (query) {
		return index2
			.search(`${query}`, {
				filters: `inventory:${inventoryID}`,
			})
			.then(({ hits }) => {
				return dispatch({
					type: GET_INVENTORY_SUCCESS,
					payload: hits,
					inventoryID: inventoryID,
					searchWord: `${query}`,
				});
			})
			.catch((err) => {
				dispatch({
					type: GET_INVENTORY_FAIL,
					payload: `${err.res.state} ${err.res.data}`,
				});
			});
	} else {
		return index2
			.search("", {
				filters: `inventory:${inventoryID}`,
			})
			.then(({ hits }) => {
				return dispatch({
					type: GET_INVENTORY_SUCCESS,
					payload: hits,
					inventoryID: inventoryID,
					searchWord: `${query}`,
				});
			})
			.catch((err) => {
				dispatch({
					type: GET_INVENTORY_FAIL,
					payload: `${err}`,
				});
			});
	}
};

export const getLocation = (zipcode) => (dispatch) => {
	dispatch({
		type: "GET_LOCATION_START",
	});
	axios
		.get(
			"https://maps.googleapis.com/maps/api/geocode/json?address=" +
				`${zipcode}` +
				"&key=" +
				"AIzaSyCwtannuv4k05C4ZfPRoRmKKvbyIsKtT - s"
		)
		.then((res) => {
			dispatch({
				type: GET_LOCATION_SUCCESS,
				payload: res.data,
				zip: zipcode,
			});
		})
		.catch((err) =>
			dispatch({
				type: GET_LOCATION_FAIL,
				payload: `${err}`,
			})
		);
};
// export const addImage = (image) => (dispatch) => {

// 	return async (dispatch) => {
// 		try {
// 			const body = JSON.stringify({
// 				user_id: userID,
// 				: image,
// 			});
// 			const res = await fetch(
// 				"http://us-central1-saymile-a29fa.cloudfunctions.net/api/addProfileImage",
// 				{
// 					method: "POST",
// 					mode: "cors",
// 					body: body,
// 				}
// 			);

// 			const data = await res.json();
// 			dispatch({ type: ADD_IMAGE, payload: IMAGE });
// 			console.log(data, " assign to cart  Actions.INDEX ");
// 		} catch (err) {
// 			console.log(err, "add user to cart fail ");
// 		}
// 	};
// };
// };
export const clearOrders = () => (dispatch, getState) => {
	dispatch({ type: CLEAR_ORDERS });
	return getState().orderReducer;
};

export const getStores = (zipcode, query) => (dispatch) => {
	dispatch({
		type: "GET_STORES_START",
	});

	axios
		.get(
			"https://maps.googleapis.com/maps/api/geocode/json?address=" +
				`${zipcode}` +
				"&key=" +
				"AIzaSyCwtannuv4k05C4ZfPRoRmKKvbyIsKtT - s"
		)
		.then((res) => {
			const loc = res.data.results[0].geometry.location;

			if (query) {
				index
					.search(`${query}`, {
						aroundLatLng: `${loc.lat},${loc.lng}`,
						// aroundLatLng:${,
						aroundRadius: 100000, // 1000 km
					})
					.then(({ hits }) => {
						dispatch({
							type: GET_STORES_SUCCESS,
							payload: hits,
							coords: `${loc.lat},${loc.lng}`,
							zip: `${zipcode}`,
						});
					})
					.catch((err) => {
						console.log(err);
						dispatch({
							type: GET_STORES_FAIL,
							payload: err,
						});
					});
			} else {
				index
					.search("", {
						aroundLatLng: `${loc.lat},${loc.lng}`,
						// aroundLatLng: '37.5685247, -122.367428',
						aroundRadius: 100000, // 1000 km
					})
					.then(({ hits }) => {
						dispatch({
							type: GET_STORES_SUCCESS,
							payload: hits,
							coords: `${loc.lat},${loc.lng}`,
							zip: `${zipcode}`,
						});
					})
					.catch((err) => {
						dispatch({
							type: GET_STORES_FAIL,
							payload: err,
						});
					});
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

// export const inventoryReady = ()=> dispatch => {
// 	return{

// 	}
