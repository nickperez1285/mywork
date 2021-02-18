import { createStore, combineReducers, compose } from "redux";
import { locationReducer } from "./location.js";
import { algoliaReducer } from "./algolia.js";
import { inventoryReducer } from "./inventory.js";
import { cartReducer } from "./cart.js";
import { itemReducer } from "./item.js";
import { userReducer } from "./user.js";
import { orderReducer } from "./order.js";
import { authReducer } from "./auth.js";
import { reducer as formReducer } from "redux-form";
import { LOGOUT } from "../actions/index.js";
import AsyncStorage from "@react-native-community/async-storage";

// import { root } from "npm";

const appReducer = combineReducers({
	locationReducer,
	algoliaReducer,
	inventoryReducer,
	cartReducer,
	itemReducer,
	userReducer,
	orderReducer,
	authReducer,
	form: formReducer,
});

const rootReducer = (state, action) => {
	if (action.type === LOGOUT) {
		//clear redux persist state

		AsyncStorage.removeItem(`persist:root`);
		//clear state
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
