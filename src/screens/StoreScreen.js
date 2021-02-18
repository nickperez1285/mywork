import React, { useState, useEffect } from "react";
import {
	Image,
	FlatList,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	SafeAreaView,
	Keyboard,
} from "react-native";
import { Button, Card, CardItem, Text, Footer } from "native-base";
import { connect, useSelector, useDispatch } from "react-redux";
import {
	getInventory,
	setInventoryID,
	setCartItem,
	getLocation,
	getStores,
	getUserID,
	getUserStripeID,
	getUser,
	setItemAddress,
	setStoreAddress,
	setUserID,
	setSelectedAddress,
	getInventoryReset,
	clearUser,
	updateUser,
	setUserInfo,
	getUserInfo,
} from "../actions/index";
import Loader from "../components/Loader";
import { persistor } from "../../persist";
import { NavigationContainer, useRoute, useNavigationState } from "@react-navigation/native";

const StoreScreen = (props) => {
	const [state, setState] = useState({
		inventory: [],
		searchState: false,
		searchWord: "",
		storeID: 1, //TEMPORARY FOR SEXY CAKES
	});

	const dispatch = useDispatch();
	const inv = useSelector((s) => s.inventoryReducer);
	const orders = useSelector((s) => s.orderReducer.order_id);
	// const { inventory } = useSelector((s) => s.inventoryReducer);
	const [inventory, setInventory] = useState(inv.inventory);
	const usr = useSelector((s) => s.userReducer);
	const item = useSelector((s) => s.itemReducer);
	const stores = useSelector((s) => s.algoliaReducer.storeData);

	//********TEMP REDIRECT CODE **************

	const [init, setInit] = useState(false);
	const fetchState = () => {
		console.log("fetchstate");

		if (inv.inventory.length < 1 || state.inventory.length < 1) {
			dispatch(getInventory(1));
			dispatch(getStores(70118));
		}

		setState({ ...state, storeID: 1, inventory: inv.inventory, searchState: false });
		setInit(true);
	};
	useEffect(() => {
		// IF LOCAL STATE  HAS NO ITEMS,
		if (state.inventory.length < 1 || init == false) {
			setState({ ...state, searchState: true });

			fetchState();
		}
	}, [inv.inventory, props.store.authReducer]);

	//********TEMP REDIRECT CODE **************
	// useEffect(() => {
	// 	if (state.storeID != inv.inventoryID) {
	// 		console.log("feching");
	// 		updateState();
	// 	}
	// }, [state.storeID]);

	// useEffect(() => {
	// 	if (state.searchState) {
	// 		setInventory(inv.inventory);
	// 	}
	// }, [inv.inventory]);

	// const updateState = () => {
	// 	dispatch(getInventory(1));

	// 	setState({
	// 		...state,
	// 		storeID: inv.inventoryID,
	// 		inventory: inv.inventory,
	// 		searchState: false,
	// 	});
	// };

	// RESETS SEARCH AND CLOSES KEYBOARD
	// const update = () => {
	// 	Keyboard.dismiss();
	// 	setState({
	// 		searchState: true,
	// 	});
	// 	if (state.searchWord !== null) {
	// 		dispatch(getInventory(1, state.searchWord));
	// 	} else {
	// 		dispatch(getInventory(1, ""));
	// 		setInventory(inv.inventory);
	// 	}
	// 	setState({ ...state, searchState: false, searchWord: "" });
	// };

	const handlePress = (it) => {
		dispatch(setCartItem(it.objectID));
		console.log("edit ");

		props.store.itemReducer.itemReady ? props.navigation.navigate("Product Page") : console.log("no item found");
	};

	// function cacheImages(images) {
	// 	return images.map(image => {
	// 	  if (typeof image === 'string') {
	// 		return Image.prefetch(image);
	// 	  } else {
	// 		return Asset.fromModule(image).downloadAsync();
	// 	  }
	// 	});
	//   }
	const routesLength = useNavigationState((state) => state);

	const renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={{
					height: "100%",
					margin: "1%",
					padding: "1%",
					flex: 1,
					// borderWidth: 2,
					borderRadius: 20,
				}}
				onPress={() => handlePress(item)}>
				<Card
					style={{
						flex: 1,
						justifyContent: "flex-end",
						// borderWidth: 2,
						backgroundColor: "rgba(180, 180, 180, 0.4)",

						borderRadius: 20,
					}}
					key={item.objectID}>
					<CardItem style={styles.cardContent}>
						<Image
							style={styles.img}
							source={{
								uri: item.images,
							}}
							cache="force-cache"
						/>
					</CardItem>

					<CardItem style={styles.cardBottom}>
						<Text style={styles.cardText}>{item.name}</Text>
						<Text style={styles.cardPrice}>${item.base_price.toFixed(2)}</Text>
					</CardItem>
				</Card>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* <TouchableOpacity onPress={() => update()} style={styles.searchbox}>
				<View style={styles.inputBox}>
					<View style={styles.srch}>
						<Image
							style={{ bottom: 20, height: 30, width: 29 }}
							source={require("../../assets/img/search.png")}
						/>
					</View>

					<TextInput
						name="searchWord"
						value={state.searchWord}
						onChangeText={(search) => {
							var newInv = inv.inventory.filter((item) => {
								return item.name.includes(search);
							});
							// }}
							// console.log(newInv)
							setInventory(newInv);
							setState({ ...state, searchWord: search });
						}}
						placeholder="search items"
						style={styles.input}
					/>
				</View>
			</TouchableOpacity> */}
			<View style={{ width: "98%" }}>
				{inv ? (
					<FlatList
						data={inv.inventory}
						renderItem={renderItem}
						keyExtractor={(item) => item.objectID}
						// extraData={inventory}
						horizontal={false}
						numColumns={2}
					/>
				) : (
					console.log("no inventory found")
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	brandname: {
		height: 33,
		left: 40,
		top: 20,
		color: "black",
	},
	card: {},
	cardBottom: {
		// padding: 10,
		// width: "100%",
		zIndex: -2,
		borderRadius: 1,
		justifyContent: "space-between",
		// alignItems: "flex-start",
		backgroundColor: "rgba(180, 180, 180, 0.0)",

		alignSelf: "flex-start",
		flexDirection: "column",
		flex: 1,
		// top: 1,
		// top: 10,
		borderRadius: 20,
		height: "20%",
		// borderWidth: 2,
	},
	cardBtn: {
		height: 50,
	},
	cardPrice: {
		color: "#ab5c0a",
		fontWeight: "bold",

		justifyContent: "flex-end",
		// margin: 5,
		// borderWidth: 2,
		flexShrink: 1,
		alignSelf: "flex-start",
	},
	cardText: {
		// flexWrap: "wrap",
		fontWeight: "bold",
		fontSize: 14,
		// alignSelf: "flex-start",
		zIndex: 2,
		flexShrink: 1,
		color: "#8e6349",
		// borderWidth: 2,

		// borderRadius: 25,

		// backgroundColor: "#64bacb",
	},
	cardContent: {
		backgroundColor: "rgba(180, 180, 180, 0.0)",

		zIndex: -1,
		flex: 1,
		borderRadius: 15,
		justifyContent: "center",
		// opacity: 0.5,
		// height: "90%",
		// borderWidth: 2,
	},

	checkboxes: {
		display: "flex",
		flexDirection: "row",
	},
	checkboxes: {
		flexDirection: "row",
		top: 15,
	},
	container: {
		flex: 1,
		backgroundColor: "#7bbfff",
		alignItems: "center",
	},

	input: {
		height: 40,
		width: "95%",
		left: 55,
		bottom: 30,
	},
	inputBox: {
		width: "95%",
		bottom: 10,
		borderWidth: 1,
		borderColor: "#f5f5f5",
		borderRadius: 25,
		backgroundColor: "#f5f5f5",
	},
	img: {
		width: 100,
		height: 100,
		alignSelf: "center",
		resizeMode: "contain",
		padding: -50,
		zIndex: -10,
		margin: -16,
		zIndex: 5,
		// flexGrow: 1,
	},
	itemCards: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		alignContent: "center",
		flexWrap: "wrap",
		// paddingLeft: 10,
		// paddingRight: 10,
		// top: 20,
	},
	searchbox: {
		flexDirection: "row",
		right: 5,
		height: 42,
		bottom: 25,
		margin: 10,
		top: 5,
		backgroundColor: "#7bbfff",
	},

	srch: {
		top: 24,
		width: 4,
		left: 10,
		bottom: 10,

		// borderRadius: 20,
		// color: "#c8c7cc",
	},
});

const mapStateToProps = (store) => {
	return {
		store,
	};
};
// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		doWork: () => [dispatch(getLocation(70118)), dispatch(getStores(70118))],
// 	};
// };
export default connect(mapStateToProps, { getInventory, getLocation, getStores })(StoreScreen);
