import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./src/reducers/index";
import AsyncStorage from "@react-native-community/async-storage";
import thunk from "redux-thunk";
import { userReducer, inventoryReducer } from "./src/reducers/user";
import { cartReducer } from "./src/reducers/cart";
import { orderReducer } from "./src/reducers/order";
import { locationReducer } from "./src/reducers/location";
import * as actionCreators from "./src/actions/index";

const logger = (store) => (next) => (action) => {
	console.log("dispatching", action.type);
	let result = next(action);
	return result;
};

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	whiteList: ["userReducer", "inventoryReducer", "itemReducer", "algoliaReducer"],
	// blacklist: ["cartReducer"],

	// or blacklist to exclude specific reducers
};
// const composeEnhancers = composeWithDevTools(options);
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 5 });
const presistedReducer = persistReducer(persistConfig, rootReducer);
// const store = createStore(presistedReducer, composeEnhancers(applyMiddleware(thunk, logger)));
const store = createStore(presistedReducer, composeEnhancers(applyMiddleware(thunk)));
const persistor = persistStore(store);

export { store, persistor };
