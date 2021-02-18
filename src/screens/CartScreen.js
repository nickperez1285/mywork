import { Directions } from "react-native-gesture-handler";

import React, { Component, useState, useEffect } from "react";
import {
	Image,
	ScrollView,
	Text,
	TextInput,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
	Button,
	Alert,
	SafeAreaView,
	FlatList,
	ActivityIndicator,
	NavigatorIOS,
} from "react-native";
import {
	getInventory,
	setCart,
	setCartItem,
	setCartID,
	getCart,
	clearCart,
	editCart,
	getItem,
	addUserToCart,
	getUser,
	setUser,
	getUserStripeID,
	getUserID,
	getQuote,
	setUserID,
	setAnnonymousCart,
	clearUser,
	updateUser,
	stripeFail,
	editCartItem,
	updateItem,
	updateCart,
	increaseCartItem,
	decreaseCartItem,
} from "../actions/index";
import { Card, CardItem, Header, Left, Right, Body, Icon, List, ListItem, Content, Container } from "native-base";

import { getUserToken, saveUserToken } from "../actions/auth";
import { connect, useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { userReducer } from "../reducers/user";
import { add, ceil } from "react-native-reanimated";
import AllAddressDrop from "../components/AllAddressDrop";
import { CommonActions } from "@react-navigation/native";
//  SIGNUP  BYPASSED ON LINE 102

const DISCOUNTCODE = "5OFF";
const DISCOUNT = -5; // must be negative value

const CartScreen = (props) => {
	const dispatch = useDispatch();

	// CURRENT APPLY COUPON BUTTON EVENT HANDLER
	const doStuff = () => {
		discount(DISCOUNTCODE, DISCOUNT);
		setState({
			...state,
			promoCode: "",
		});
		console.log(cartObj);
		// dispatch(clearCart());
		// dispatch(setUserID("mDoi18bmW9Nm26bFIn	0mN8TfrxW2"));
		// console.log(userOBJ.isFetching);
		// console.log(cartObj.cart[0].variants, "do stuff ");
	};

	const [state, setState] = useState({
		idCheck: false,
		user_id: "",
		items: [],
		total_price: 0.0,
		final_price: 0.0,
		subtotal: 0.0,
		tax: 0.0,
		total: 0.0,
		promoCode: "",
		user_stripe_id: "",
		isloggedIn: false,
		discountUsed: false,
	});

	const [maxUses, setCodeLimit] = useState(20);
	const [stripe, setStripe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { user_ID } = useSelector((u) => u.userReducer);
	const { user_stripe_id } = useSelector((s) => s.userReducer);
	const cartObj = useSelector((state) => state.cartReducer);
	const { cart } = useSelector((state) => state.cartReducer);
	const { tax } = useSelector((state) => state.cartReducer);
	const { total_price } = useSelector((state) => state.cartReducer);
	const storeAddress = useSelector((state) => state.cartReducer.store_address);
	const userOBJ = useSelector((s) => s.userReducer);
	const auth = useSelector((s) => s.authReducer);
	let final_price = state.final_price + tax + total_price;
	const [arr, setArr] = useState([]);

	const discount = (code, discount) => {
		const disc = {
			item_color: "none",
			item_size: 1,
			item_price: discount,
			item_quantity: 1,
			item_title: "SexyCakes DISCOUNT",
			add_ons: [{ name: "none", price: "0.00" }],
			variants: [{ name: "variant", variants: { name: "none", price: 0 } }],
			images: "discount.png",
			description: "DISCOUNT.",
		};
		if (cart) {
			if (state.promoCode == code && maxUses >= 1 && state.discountUsed) {
				dispatch(setCart(disc));
				setCodeLimit(maxUses - 1);
			} else {
				alert("Code Invalid ");
			}
		}
		return disc;
	};

	const handlePress = () => {
		const cartFinalPrice = total_price + tax;

		if (cart.length > 0) {
			//CHECK IF LOGGGED IN
			if (typeof auth !== undefined && auth.token !== "") {
				dispatch(getUser()).then((res) => {
					if (typeof res.user_stripe_id !== undefined && res.user_stripe_id !== "") {
						let loggedInInfo = {
							cart_id: "",
							user_id: user_ID,
							user_stripe_id: user_stripe_id,
							total_price: cartFinalPrice, //total_price + tax,
							store_id: "1", //*****SEXY CAKES  */,
							store_address: storeAddress.Store_street_address, // Store 'S' is caps
							store_phone_number: storeAddress.store_phone_number,
							items: cart,
						};

						dispatch(setCartID(loggedInInfo)).then((res) =>
							typeof res !== undefined ? props.navigation.navigate("Checkout Screen") : console.log("cart id not set")
						);
					} else {
						console.log("annon cart");
						let jason = {
							cart_id: "",
							total_price: total_price + tax,
							store_id: 1, //*****ONLY SEXY CAKES ,
							store_address: storeAddress.store_street_address,
							store_phone_number: storeAddress.store_phone_number,
							items: cart,
						};
						dispatch(setAnnonymousCart(jason));

						props.navigation.navigate("Checkout Form", {
							data: { localId: userOBJ.user_ID, phoneNumber: userOBJ.phoneNumber },
						});
						// props.navigation.navigate("Checkout Screen");
					}
				});
			} else {
				setIsLoading(false);

				props.navigation.navigate("SignIn");
			}
		} else {
			alert("cart empty");
		}
	};

	const editItem = (info) => {
		// BRINGS TO EDIT PAGE
		if (info.objectId !== undefined) {
			dispatch(setCartItem(info.objectId)); // PREPS EDIT PAGE WITH ORIGNAL INFO

			props.navigation.navigate("Edit Screen", { item: info });
		} else {
			alert("Item cannot be changed");
		}
	};

	const decrease = (e) => {
		// console.log(e, "e");
		dispatch(decreaseCartItem(e));
		dispatch(updateCart());
	};
	const increase = (e) => {
		// console.log(e.localId, "item");

		dispatch(increaseCartItem(e));
		dispatch(updateCart());
	};

	const addOnsArr = (item) => {
		let arr = [];
		if (item.add_ons.length > 0) {
			item.add_ons.map((i) => (i.name != "none" ? arr.push(i) : null));
		}
		return arr;
	};

	const varsArr = (item) => {
		let vararr = [];
		if (item.variants.length > 0 && item.variants.name != "none") {
			item.variants.map((vnt) => {
				// item.variants[indexOf(vnt)].map((v) => {

				vnt.variants.length > 0
					? vnt.variants.map((i) => {
							i.name != "none" ? vararr.push({ name: vnt.name, subName: i.name, price: vnt.price }) : null;
					  })
					: [];
			});
		}
		return vararr;
	};

	const renderItem = ({ item }) => {
		//THERE WILL ALWAYS BE ADDONS AND VARIANTS - DEFUALT VALUES ARE "none"

		let addOns = addOnsArr(item);
		// let vars = item.variants.length > 0 ? varsArr(item) : [];
		// let vars = varsArr(item);
		let vars = varsArr(item);

		return (
			<View style={styles.card} key={item.objectID}>
				<Image source={{ uri: item.images }} style={styles.img} cache="force-cache" />
				<View
					style={{
						flexGrow: 0.2,
						alignSelf: "flex-start",
					}}>
					<Text
						style={{
							// minHeight: 10,

							// flexShrink: 0.2,
							// width: "100%",
							fontSize: 16,
							flexWrap: "wrap",
							fontWeight: "bold",
							color: "#2c7bbf",
						}}>
						{item.item_quantity > 1 ? item.item_title + " x " + item.item_quantity : item.item_title}
					</Text>

					<Text style={{ flexShrink: 0.2, width: "100%", fontSize: 16, color: "#2c7bbf" }}>
						${(item.item_price + 0.0).toFixed(2)}
					</Text>
				</View>
				<Container
					style={{
						flexDirection: "row",
						// borderWidth: 2,
						width: "100%",
						alignItems: "flex-start",
						height: "50%",
						backgroundColor: "rgba(180, 180, 180, 0.0)",
					}}>
					<Content
						style={{
							flexDirection: "row",
							// borderWidth: 2,
						}}>
						<Text
							style={{
								flexGrow: 1,
								fontSize: 11,
								flexDirection: "column",
								alignSelf: "flex-start",
								color: "#2c7bbf",
								// borderWidth: 2,
							}}>
							{vars.length > 0 && (
								<Text>
									{vars.map(
										(vnt) =>
											vnt.name != "none" && (
												<Text>
													<Text style={{ fontWeight: "bold", color: "#2c7bbf" }}>{`${vnt.name + ": " + "\n"}`}</Text>
													<Text>{`${vnt.subName}` + (vnt.price ? `${" $" + vnt.price}` : "") + "\n"}</Text>
												</Text>
											)
									)}
								</Text>
							)}
							{addOns.length > 0 && (
								<Text>
									{addOns.length > 0 ? addOns.map((ao) => <Text>{ao.id + `${" $" + ao.price}` + "\n"}</Text>) : null}
								</Text>
							)}
						</Text>
					</Content>
					<View style={{ width: "20%", justifyContent: "flex-start", bottom: "35%" }}>
						<Button
							title="+"
							color="#2c7bbf"
							onPress={() => {
								increase(item);
							}}
						/>
						<Text style={{ alignSelf: "center" }}> </Text>
						<Button
							title="-"
							color="#2c7bbf"
							onPress={() => {
								decrease(item);
							}}
						/>
					</View>
				</Container>

				<TouchableOpacity style={styles.buttonX}>
					<Button
						title="Edit"
						onPress={() => {
							editItem(item);
						}}
					/>

					<Icon
						name="trash"
						style={{ color: "#2c7bbf" }}
						onPress={() => {
							dispatch(editCart(item));
							// console.log(item)
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	useEffect(() => {
		if (cartObj.isFetching == true) {
			setIsLoading(true);
		} else if (cartObj.isFetching == false) {
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, [cartObj, auth, userOBJ]);
	useEffect(() => {
		return console.log("cleanup");
	}, []);
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar hidden={false} barStyle="dark-content" />
			{isLoading !== false && (
				<View style={{ position: "absolute", justifyContent: "center", alignSelf: "center", zIndex: 1 }}>
					<ActivityIndicator style={{ height: "100%", backgroundColor: "black" }} />
				</View>
			)}
			{/* {isLoading === false && ( */}
			<View
				style={{
					display: "flex",
					flex: 1,
					// alignContent: "center",
					// flexDirection: "column",
					// borderWidth: 2,
					width: "100%",
				}}>
				{cart.length < 1 ? (
					<Text style={styles.empty}>Cart Empty</Text>
				) : (
					<View style={styles.menu}>
						<FlatList
							style={{
								flex: 2,
								width: "100%",
								// borderWidth: 2,
							}}
							data={cart}
							renderItem={renderItem}
							keyExtractor={(item) => item.objectID}
							horizontal={true}
							// scrollEnabled={false}
							directionalLockEnabled={true}
							vertical={false}
							numRows={1}
						/>

						<View
							onPress={() => {
								// update();
							}}
							style={styles.mainTop}>
							<View style={styles.applyInput}>
								<TextInput
									name="searchWord"
									onChangeText={(code) =>
										setState({
											...state,
											promoCode: code,
										})
									}
									style={{ width: "90%", fontSize: 18 }}
									placeholder="Promo Code  "
									value={state.promoCode}
									// placeholderStyle={{ color: "black" }}
									// placeholderTextColor="#2c7bbf"

									// style={styles.applyInput}
								/>
								<TouchableOpacity
									style={styles.applyCodeButton}
									onPress={() => {
										doStuff();
									}}>
									<Text style={styles.applyCodeButtonText}>></Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
				<View style={styles.main}>
					{/* <View style={styles.clear}>
					<Button title="Reset " onPress={() => dispatch(clearCart())} />
				</View> */}
					<View
						style={{
							// borderWidth: 1,
							// borderColor: "black",
							height: "50%",
							display: "flex",
							width: "90%",
							flexDirection: "row",
							justifyContent: "space-between",
						}}>
						<View style={styles.leftText}>
							<Text style={styles.ordersummary}>Order Summary</Text>
							<Text style={styles.boldText}>Subtotal</Text>
							<Text style={styles.subText}>Tax</Text>
							<Text style={styles.subText}>Delivery</Text>
							<Text style={styles.boldText}>Total</Text>
						</View>
						<View style={styles.rightText}>
							<Text style={styles.boldTextRight}>${total_price ? total_price.toFixed(2) : "0.00"}</Text>
							<Text style={styles.subTextRight}>${tax ? tax.toFixed(2) : "0.00"}</Text>
							<Text style={styles.subTextRight}>TBD</Text>
							<Text style={styles.boldText}>${final_price ? final_price.toFixed(2) : "0.00"}</Text>
						</View>
					</View>
					<TouchableOpacity onPress={() => handlePress()} style={styles.button}>
						<Text style={styles.checkoutButton}>Continue</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* // )} */}
		</SafeAreaView>
	);
};

const mapStateToProps = (global) => {
	return { global };
};

export default connect(mapStateToProps, {})(CartScreen);

const styles = StyleSheet.create({
	applyCodeButton: {
		// left: "%",
		bottom: "50%",
		// backgroundColor: "#7bbfff",
		// backgroundColor: "rgba(180, 180, 180, 0.4)",
		borderRadius: 25,
		alignContent: "center",
		alignSelf: "flex-end",
		justifyContent: "center",
	},
	applyCodeButtonText: {
		color: "#2c7bbf",
		fontWeight: "bold",
		alignContent: "center",
		bottom: "6%",
		fontSize: 20,
		// backgroundColor: "rgba(180, 180, 180, 0.6)",
		width: "30%",
		// height:
		// justifyContent: "center",

		// right: 20,
		alignSelf: "center",
		flexDirection: "row",
		// borderWidth: 1,
	},
	applyInput: {
		// alignContents: "center",

		height: "50%",
		width: "50%",
		// left: 20,
		borderRadius: 25,
		fontSize: 30,
		top: "20%",
		// borderWidth: 1,
		alignContent: "center",
		backgroundColor: "rgba(180, 180, 180, 0.4)",

		// borderColor: "smoke",
		// top: "30%",
		// backgroundColor: "#fafafa",
		alignSelf: "center",
		alignItems: "center",
		padding: 10,
		color: "#2c7bbf",
	},

	boldText: {
		fontWeight: "600",
		fontSize: 16,
		color: "#2c7bbf",

		// marginBottom: "-5%",
		// marginTop: "10%",
		// marginLeft: 5,
		// margin: 5
	},
	boldTextRight: {
		fontWeight: "600",
		color: "#2c7bbf",

		fontSize: 16,
		alignSelf: "flex-end",
		// marginBottom: "-5%",
		// marginTop: "10%",
		// marginLeft: 5,
		// margin: 5
	},
	buttonX: {
		// flexShrink: 0.1,
		width: "100%",
		// bottom: 15,
		alignSelf: "flex-end",
		// borderWidth: 2,
		// height: "10%",
		// borderWidth: 2,/

		color: "#2c7bbf",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	button: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "80%",
		backgroundColor: "rgba(180, 180, 180, 0.4)",
		borderRadius: 24,
		padding: 15,
		marginTop: "10%",
		bottom: "5%",

		// top: 50
	},
	checkoutButton: {
		fontSize: 17,
		color: "#2c7bbf",
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		// backgroundColor: "white",
		flexDirection: "column",
		backgroundColor: "#7bbfff",

		// borderWidth: 2,
		// bottom: 20,
	},
	cardMainText: {
		width: "95%",
		flexDirection: "column",
		alignSelf: "center",
		// backgroundColor: "rgba(180, 180, 180, 0.6)",

		// flex: 1,
		// borderWidth: 2,
	},
	clear: {
		bottom: 1,
		// left: 180,
		// bottom: 65,
	},
	card: {
		// display: "flex",
		flexGrow: 6.4,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		padding: 10,
		margin: 6,
		marginRight: 15,
		backgroundColor: "rgba(180, 180, 180, 0.4)",

		// backgroundColor: "white",
		shadowColor: "#000",
		width: 180,
		marginLeft: 5,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		// borderWidth: 2,
		shadowOpacity: 0.25,
		shadowRadius: 2.4,
		elevation: 5,
	},
	cardText: {
		flex: 1,
		width: "100%",
		fontSize: 18,
		backgroundColor: "rgba(180, 180, 180, 0.6)",

		// marginBottom: "15%",
	},
	cardTextSub: {
		flexShrink: 0.2,
		fontSize: 10,
		right: "133%",
		backgroundColor: "rgba(180, 180, 180, 0.6)",

		// borderWidth: 2,
		flexDirection: "column",

		// top: 1,
		// width: 50,
		justifyContent: "center",
		alignSelf: "flex-start",
	},
	cardTextSub2: {
		fontSize: 9,
		// right: 150,
		top: "30%",
		// width: 150,
		marginRight: 6,
		backgroundColor: "rgba(180, 180, 180, 0.6)",

		alignSelf: "center",
	},
	empty: {
		flexGrow: 3,
		alignSelf: "center",
		top: "25%",
		justifyContent: "center",
		// borderWidth: 2,
		borderColor: "black",
	},
	img: {
		width: "100%",
		height: "20%",
		resizeMode: "contain",
		borderTopRightRadius: 25,
		borderTopLeftRadius: 25,
		alignSelf: "center",
		// backgroundColor: "#F2F2F2",
		// marginBottom: 5,
		// resizeMode: "cover",
		zIndex: -1000,
		flexGrow: 0.8,
	},
	input: {},

	// itemsAdded: { , },
	main: {
		alignSelf: "center",
		display: "flex",
		flexDirection: "column",
		width: "100%",
		backgroundColor: "#7bbfff",

		justifyContent: "center",
		alignItems: "center",
		// height: "30%",
		marginBottom: "5%",
		flex: 1.5,
	},
	mainTop: {
		alignContent: "center",
		backgroundColor: "#7bbfff",
		// borderWidth: 2,
		width: "100%",
		flex: 0.3,
		justifyContent: "space-between",
	},
	menu: {
		height: "45%",
		width: "100%",
		paddingTop: "10%",
		// paddingBottom: 10,
		// margin: "5%",

		justifyContent: "space-evenly",
		// borderWidth: 1,
		flex: 3,

		// marginTop: "25%",
	},
	itemstext: {
		position: "absolute",
		// width: 110,
		height: 18,
		left: "9%",
		top: "17.5%",
		// fontFamily: 'Proxima Nova',
		fontStyle: "normal",
		fontWeight: "600",
		fontSize: 18,
		lineHeight: 18,
		color: "#000000",
	},
	label: {
		margin: 8,
	},
	leftText: {
		// position: "absolute",
		// width: 150,
		// display: "flex",
		// flexDirection:"column",
		color: "#2c7bbf",

		marginTop: "10%",
		alignSelf: "flex-end",
	},
	ordersummary: {
		fontStyle: "normal",
		color: "#2c7bbf",

		fontWeight: "600",
		fontSize: 18,
		lineHeight: 18,
	},
	rightText: {
		// position: "absolute",
		// width: 150,
		// display: "flex",
		// flexDirection: "column",
		// alignContent: "flex-end",
		marginTop: "10%",
		// marginBottom: "5%"
		alignSelf: "flex-end",
	},
	tax: {},

	searchbox: {
		// borderWidth: 1,
		// borderColor: "black",
		// borderRadius: 25,
		height: 35,
		top: 77,
		position: "absolute",
		width: "50%",
		height: 35,
		left: 27,
	},
	subText: {
		// left: 10,
		// marginBottom: "10%",
		fontSize: 17,
		color: "#959595",
	},
	subTextRight: {
		// left: 10,
		// marginBottom: "10%",
		alignSelf: "flex-end",
		fontSize: 15,
		color: "#959595",
	},
});
