import {
	GET_ORDER_ID,
	SET_ORDER_ID,
	SET_ORDER_RECEIPT,
	GET_ORDER_RECEIPT,
	UPDATE_ORDER,
	GET_ALL_ORDERS,
	GET_ORDER_INFO,
	GET_QUOTE,
	CHARGE_STRIPE,
	CREATE_ORDER_ID,
	CREATE_DELIVERY,
	PAY_STATUS,
	EMAIL_DORM,
	DELIVERY_START,
	DELIVERY_FAIL,
	CLEAR_ORDERS,
	DELIVERY_FINISH,
	CHARGE_STRIPE_FAIL,
} from "../actions";

export const initState = {
	order_id: "",
	delivery_id: "", //will be postmates' quote_id from createQuote
	quote_id: "",
	store_id: 1,
	user_stripe_id: "",
	first_name: "",
	last_name: "",
	phone: "",
	customer_address: "",
	total_price: 0.0, // add from array of items
	delivery_fee: 0.0, //obtained from createQuote"
	store_address: "",
	order_status: "pending", //get order status from getDeliveryStatusForDifferentService ignore the naming for now
	items: [],
	receipt: [],
	dormDelivery: false,
	orderedItems: [],
	orderedItemInfo: [],
	stripe_data: [],
	delivery_data: [],
	payStatus: "",
	stripe_message: "",
	isFetching: false,
	delivery_status: "",
	kitchen_delivery_id: "",
};

export const orderReducer = (state = initState, action) => {
	switch (action.type) {
		case SET_ORDER_ID:
			console.log(action.payload, "order id  set");

			return {
				...state,
				order_id: action.payload,
			};

		case GET_ORDER_ID:
			return {
				...state,
				orderedItemInfo: action.payload,
			};

		case SET_ORDER_RECEIPT:
			return {
				...state,
				receipt: action.payload,
			};

		case GET_ORDER_RECEIPT:
			return {
				...state.receipt,
			};
		case UPDATE_ORDER:
			if (action.payload == "dormDelivery") {
				return {
					...state,
					dormDelivery: true,
					...action.payload,
				};
			} else {
				return {
					...state,
					dormDelivery: false,
					...action.payload,
				};
			}

		case GET_ALL_ORDERS:
			console.log(action.payload.all_orders.length, "found orders");
			return {
				...state,
				orderedItems: action.payload.all_orders,
			};

		case GET_ORDER_INFO:
			// console.log(action.payload);
			return {
				...state,
				orderedItemInfo: action.payload,
			};
		case GET_QUOTE:
			return {
				...state,
				quote_id: action.payload.quote_id,
				delivery_id: action.payload.quote_id,
				delivery_fee: action.payload.fee / 100,
			};

		case CHARGE_STRIPE:
			console.log(action.payload.data.status, "charge stripe  response in  orderReducer");
			return {
				...state,
				stripe_data: action.payload.data,
				stripe_message: action.payload.message,
			};

		case CHARGE_STRIPE_FAIL:
			return {
				...state,
				stripe_message: "fail",
			};

		case CREATE_ORDER_ID:
			console.log(action.payload, "order id received  IN REDUCER");
			return {
				...state,
				order_id: action.payload,
				orderIDStatus: action.status,
			};
		case CREATE_DELIVERY:
			// console.log(action.payload, 'data for create delivery')
			return {
				...state,

				delivery_data: action.payload,
			};

		case CLEAR_ORDERS:
			// console.log(action.payload, 'data for create delivery')
			return {
				...initState,
			};

		case PAY_STATUS:
			console.log(state.stripe_data.status, "pay status ");
			return {
				...state,
			};

		case EMAIL_DORM:
			console.log(action.payload, "email doorm ");
			return {
				...state,
			};
		case DELIVERY_START:
			return {
				...state,
				isFetching: true,
			};
		case DELIVERY_FINISH:
			return {
				...state,
				isFetching: false,
				delivery_data: action.payload,
				delivery_status: action.payload.kitchen_status,
				kitchen_delivery_id: action.payload.kitchen_delivery_id,
				delivery_id: action.payload.kitchen_delivery_id,
				quote_id: action.payload.quote_id,
			};
		case DELIVERY_FAIL:
			return {
				...state,
				isFetching: false,
				delivery_status: "fail",
			};

		default:
			return state;
	}
};
