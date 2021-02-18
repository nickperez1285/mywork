import React, { Component, useState, useEffect } from "react";
import { CommonActions } from "@react-navigation/native";

import { Image, StyleSheet, View } from "react-native";
import {
	Container,
	Header,
	Content,
	Card,
	CardItem,
	Thumbnail,
	Left,
	Body,
	Right,
	Item,
	Title,
	Footer,
	FooterTab,
	Label,
	Text,
	Button,
	ListItem,
	List,
	Radio,
	CheckBox,
	Icon,
	Picker,
	Form,
} from "native-base";
import { useSelector, useDispatch, connect } from "react-redux";
import {
	setCart,
	getItem,
	getInventory,
	getUser,
	clearCart,
	setCartAddress,
	setSelectedAddress,
	setCartItem,
	editCartItem,
	updateItem,
	editCart,
	updateCart,
} from "../actions/index.js";
import DropDownPicker from "react-native-dropdown-picker";
import { images } from "../constants/images.js";
import { SafeAreaView } from "react-navigation";
import { add, or } from "react-native-reanimated";

const EditScreen = (props) => {
	const [state, setState] = useState({
		ID: "",
		prodInfo: {
			key: "val",
		},
		add_ons: [{ name: "none", price: 0, RNchecked: false }],
		// variants: [{ name: "variant", variants: { name: "", price: 0 } }],
		variants: [],
		// variants: item.variants,
		selected_add_ons: [],
		selected_variants: { variants: [] },
		storeID: "",
		productInfo: { key: "" },
	});
	const [ready, setReady] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();
	const itm = useSelector((i) => i.itemReducer);
	const productID = useSelector((globalState) => globalState.itemReducer.itemID);
	const stores = useSelector((s) => s.algoliaReducer.storeData);

	const cart = useSelector((s) => s.cartReducer);
	// ORIGINAL ITEM  WITH ALL AVAILABLE OPTIONS
	const item = itm;

	// ITEM CURRENTLY IN CART  WITH SELECTED OPTIONS
	var cartItem = cart.cart.find((i) => i.localId == props.route.params.item.localId);

	useEffect(() => {
		if (!ready) {
			init();
		}
	}, [cart, itm, ready, props.route]);
	const init = () => {
		console.log("init");

		setState({
			...state,
			productInfo: [itm],
			add_ons: addOnPreSelect(),
			variants: itm.variants
				? itm.variants.map((v, idx) =>
						Object.assign(v, { id: idx }, { variants: v.variants.map((i, ix) => ({ ...i, id: idx + "." + ix })) })
				  )
				: [],
			selected_variants: props.route.params.item.variants ? props.route.params.item.variants : [],
			selected_add_ons: props.route.params.item.add_ons ? props.route.params.item.add_ons : [],
			images: itm.images,
		});
		const amount = props.route.params.item.item_quantity;
		setQuantity(amount);
		setReady(true);
	};
	const addOnPreSelect = () => {
		const namesArr = cartItem.add_ons.map((ao) => {
			return ao.id;
		});
		let addOnArr = [];
		item.add_ons.map((ao) => {
			const itm = namesArr.includes(ao.name)
				? Object.assign(ao, { id: ao.name }, { RNchecked: true })
				: Object.assign(ao, { id: ao.name }, { RNchecked: false });
			addOnArr.push(itm);
		});
		// console.log(addOnArr, " addons arr");

		setState({ ...state, selected_add_ons: addOnArr });
		return addOnArr;
	};

	const addOnChunk = state.selected_add_ons.map((ao) => {
		ao.RNchecked == true ? ao : null;
	});

	const addItem = (it) => {
		const add_ons = addOnChunk.length > 0 ? state.selected_add_ons : [{ name: "none", price: "0.00" }];
		const variants =
			itm.variants.length > 0 ? state.selected_variants : [{ name: "none", variants: [{ name: "none", price: 0 }] }];
		var finalPrice =
			itm.variants.length > 0
				? state.selected_add_ons.reduce((acc, item) => acc + parseFloat(item.price), parseFloat(it.base_price)) +
				  state.selected_variants.reduce((acc, itm) => acc + parseFloat(itm.price), 0)
				: state.selected_add_ons.reduce((acc, item) => acc + parseFloat(item.price), parseFloat(it.base_price));

		let orderItem = {
			localId: cartItem.localId,
			objectId: it.objectID,
			item_color: "none",
			item_size: 1,
			item_price: parseFloat(finalPrice),
			item_quantity: quantity,
			item_title: it.name,
			add_ons: add_ons,
			variants: variants,
			images: it.images,
			description: it.description,
		};
		// console.log(finalPrice);
		// console.log(state.variants, " variants edit screen");

		dispatch(editCartItem(cartItem.localId, orderItem));
		props.navigation.dispatch(
			CommonActions.reset({
				index: 1,
				routes: [
					{ name: "Home" },
					{
						name: "Cart Screen",
					},
				],
			})
		);
	};

	const toggleAddOn = (item) => {
		if (ready) {
			let selectedNames = state.selected_add_ons.map((ao) => ao.name);
			let arr = [...state.selected_add_ons];
			if (selectedNames.includes(item.name)) {
				arr.splice(arr.indexOf(item), 1);
			} else if (selectedNames.includes(item) == false) {
				arr.push(item);
			}

			setState({ ...state, selected_add_ons: arr });
		}
	};

	const increase = () => {
		let i = quantity + 1;

		setQuantity(i);
	};

	const decrease = () => {
		let i = quantity - 1;
		i > 0 ? setQuantity(i) : 0;
	};

	const toggleVariants = (item, idx, idx2) => {
		let select = state.selected_variants;
		let thisVariant = state.variants[idx];
		let name = thisVariant.name;
		let subVariants = thisVariant.variants;
		let variant = subVariants[idx2];
		let obj = { name: name, variants: [{ ...variant, RNchecked: true }], price: variant.price };
		let filtered = select.filter((i) => i.name != name);
		filtered.push(obj);

		setState({ ...state, selected_variants: filtered });
	};

	useEffect(() => {
		return console.log("unmount ");
	}, []);

	return (
		<SafeAreaView
			style={{ flexGrow: 1, flexDirection: "column", backgroundColor: "white" }}
			alwaysBounceVertical={false}>
			<View
				style={{
					flexGrow: 1,
					zIndex: 100,
					// borderWidth: 4,
				}}>
				<Content
					style={{ flex: 1, width: "98%", alignSelf: "center", borderColor: "#7bbfff" }}
					alwaysBounceVertical={false}>
					<Thumbnail
						square
						style={{
							backgroundColor: "#7bbfff",
							flex: 0.4,
							// bottom: "4%",
							width: 450,
							height: 200,
							resizeMode: "contain",
							marginTop: 10,
							marginBottom: 10,
							alignSelf: "center",
						}}
						source={{
							uri: item.images,
						}}
					/>
					<CardItem
						style={{
							borderRadius: 25,
							flexDirection: "column",
							flex: 2,
							paddingTop: 10,
							paddingTop: "1%",
							height: "25%",
							borderColor: "#7bbfff",

							bottom: "2%",
						}}>
						<Body
							style={{
								flex: 1,
								flexDirection: "row",
								width: "100%",
								height: "100%",
								justifyContent: "space-between",
								borderRadius: 25,
								// borderWidth: 2,
							}}>
							<Text
								bold
								style={{
									zIndex: 100,
									fontWeight: "bold",
									fontSize: 20,
									// width: "100%",
									height: "130%",
									zIndex: 100,
									flexGrow: 1,
									flexWrap: "wrap",
									// borderWidth: 2,
								}}>
								{item.name}
							</Text>

							<Text style={{ fontSize: 18, right: 10, height: "150%", bottom: 2 }}>${item.base_price}</Text>
						</Body>
						<Body style={{ flexGrow: 5, alignContent: "center", height: "100%" }}>
							<Text style={styles.topTextDescription} note>
								{item.description}
							</Text>
						</Body>
					</CardItem>
					{state.variants.length > 0 && (
						<List style={styles.variants}>
							{itm.variants
								? itm.variants.map((vnt, idx) => (
										<List style={styles.variantsContainer} key={idx}>
											<ListItem style={{ alignContent: "center", justifyContent: "space-between" }} itemHeader first>
												<Text
													style={{
														fontSize: 17,
														fontWeight: "bold",
													}}
													note>
													{vnt.name}
												</Text>
												<View style={styles.required}>
													<Text style={{ borderRadius: 20 }}>Required</Text>
												</View>
											</ListItem>
											<View>
												{vnt.variants.map((it, ix) => (
													<ListItem
														onPress={(e) => {
															toggleVariants(vnt, idx, ix);
														}}
														key={ix}
														style={{
															justifyContent: "space-between",
															// borderWidth: 2,
															// width: "100%",
														}}
														itemHeader
														first>
														<Text style={{ fontSize: 16 }}> {`${it.name}`}</Text>

														<View style={styles.variantsSub}>
															<Text
																style={{
																	fontSize: 16,
																}}>
																{it.price > 0 ? `${"$" + it.price + " "}` : ""}
															</Text>
															<CheckBox
																onPress={() => {
																	toggleVariants(vnt, idx, ix);
																}}
																checked={state.selected_variants.map((v) => v.variants.map((i) => i.name)) == it.name}
																style={{ color: "#7bbfff" }}
																color="#7bbfff"
															/>
														</View>
													</ListItem>
												))}
											</View>
										</List>
								  ))
								: null}
						</List>
					)}
					<View
						style={{
							// bottom: "3%"
							top: ".1%",

							justifyContent: "space-between",
							flexDirection: "column",
							flex: 13,
							borderRadius: 20,
							bottom: "1%",
							borderWidth: 2,
							height: "100%",
							borderColor: "#7bbfff",

							// margin: 20,
						}}>
						<List
							style={{
								backgroundColor: "#fafafa",
								borderRadius: 25,
								// borderWidth: 2,
								width: "100%",
								// height: "98%",

								flexShrink: 1,
								// flexWrap: "wrap",
							}}>
							<ListItem style={{}} itemHeader first>
								<Text style={{ fontSize: 20, fontWeight: "bold", alignContent: "center" }} note>
									Add Ons
								</Text>
							</ListItem>
							{state.add_ons &&
								state.add_ons.map((addon) => {
									return (
										// <List>
										<ListItem
											onPress={() => {
												toggleAddOn(addon);
											}}
											style={{
												// fontSize: 15,
												justifyContent: "space-between",
												alignContent: "center",
											}}
											itemHeader
											first>
											<Text
												style={{
													fontSize: 15,
												}}>
												{addon.name}
											</Text>

											<View
												style={{
													flexDirection: "row",
												}}>
												<Text
													style={{
														fontSize: 16,
													}}>
													{"$" + addon.price + " "}
												</Text>
												<CheckBox
													onPress={() => {
														toggleAddOn(state.add_ons[state.add_ons.indexOf(addon)]);
													}}
													// checked={state.add_ons[state.add_ons.indexOf(addon)].RNchecked}
													checked={state.selected_add_ons.map((ao) => ao.name).includes(addon.name) || false}
													color="#7bbfff"
												/>
											</View>
										</ListItem>
										// </List>
									);
								})}
						</List>
					</View>
				</Content>
			</View>
			<CardItem
				style={{
					flex: 0.09,
					// marginTop: 100,
					// zIndex: 1000,
					width: "100%",
					justifyContent: "space-between",
					alignContent: "flex-end",
					// borderWidth: 2,
					// position: "absolute",
					// height: "10%",
					bottom: ".1%",
				}}>
				<Button
					style={{
						borderColor: "#f5f5f5",
						backgroundColor: "#f5f5f5",
						borderRadius: 25,
						borderWidth: 5,
						height: 44,
						// bottom: "60%",
						width: "45%",
					}}>
					<Button
						style={{ bottom: 5, height: 25, backgroundColor: "#f5f5f5", borderRadius: 25 }}
						onPress={() => {
							decrease();
						}}>
						<Text style={{ color: "#7bbfff" }}> - </Text>
					</Button>
					<Text style={{ fontStyle: "bold", color: "black" }}> {quantity} </Text>

					<Button
						style={{ bottom: 5, height: 27, backgroundColor: "#f5f5f5", borderRadius: 25 }}
						onPress={() => {
							increase();
						}}>
						<Text style={{ color: "#7bbfff" }}> + </Text>
					</Button>
				</Button>

				<Button
					onPress={() => {
						if (itm.variants.length > 0) {
							if (state.selected_variants.length < itm.variants.length) {
								alert("please select variant");
							} else {
								addItem(item);
							}
						} else {
							addItem(item);
						}
					}}
					style={{
						backgroundColor: "#7bbfff",
						zIndex: -10,
						justifyContent: "center",
						borderRadius: 25,
						// flex: 1,
						width: "45%",
						alignContent: "flex-end",
						// marginLeft: "5%",
						// marginRight: "5%",
						alignItems: "center",
						// bottom: 3,
						alignSelf: "center",
						// borderWidth: 2,
						// top: "10%",
					}}>
					<Text style={{ alignItems: "center", color: "white" }}>SAVE</Text>
				</Button>

				{/* </Item> */}
			</CardItem>
		</SafeAreaView>
	);
};

const mapStateToProps = (globalState) => {
	return { globalState };
};
export default connect(mapStateToProps, {})(EditScreen);
const styles = StyleSheet.create({
	// allAddOns: { top: 10 },
	A: {
		// height:200
		// height: "20%",
		borderRadius: 20,
	},
	content: {
		flex: 1,
		width: "98%",
		alignSelf: "center",
		borderColor: "#7bbfff",
	},
	mainImg: {
		backgroundColor: "#7bbfff",
		flex: 0.4,
		// bottom: "4%",
		width: 450,
		height: 200,
		resizeMode: "contain",
		marginTop: 10,
		marginBottom: 10,
		alignSelf: "center",
	},
	required: {
		fontSize: 20,
		right: 5,
		width: "25%",
		backgroundColor: "#7bbfff",
		alignSelf: "flex-end",
		padding: 5,
		borderRadius: 15,
	},
	topText: {
		borderRadius: 25,
		flexDirection: "column",
		flex: 2,
		paddingTop: 10,
		paddingTop: "1%",
		height: "25%",
		borderColor: "#7bbfff",

		bottom: "2%",
		// borderWidth: 2,
	},
	topTextBody: {
		flex: 1,
		flexDirection: "row",
		width: "100%",
		height: "100%",
		justifyContent: "space-between",
		borderRadius: 25,
		// borderWidth: 2,
	},
	topTextDescription: {
		alignSelf: "center",
		fontSize: 17,
		// height: "200%",
		flexWrap: "wrap",
		margin: 2,
		// borderWidth: 2,
	},
	topTextName: {
		zIndex: 10000,
		fontWeight: "bold",
		fontSize: 20,
		height: "200%",
		zIndex: 100,
		flexGrow: 10,
		flexWrap: "wrap",
		// borderWidth: 2,
	},
	// variants: {
	// 	top: ".1%",
	// 	flexDirection: "row",
	// 	flexShrink: 6,
	// 	height: "100%",
	// 	width: "100%",
	// 	borderWidth: 3,
	// 	bottom: "1%",
	// 	marginBottom: 10,
	// 	justifyContent: "space-between",
	// 	borderRadius: 25,
	// 	flexDirection: "column",

	// 	borderColor: "#7bbfff",
	// },
	variantsSub: {
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "flex-end",
	},
	variantsContainer: {
		top: ".1%",
		flexDirection: "row",
		flexShrink: 6,
		// height: "100%",
		width: "100%",
		borderWidth: 2,
		bottom: "1%",
		marginBottom: 10,
		justifyContent: "space-between",
		borderRadius: 25,
		flexDirection: "column",

		borderColor: "#7bbfff",
	},
	varsList: {
		// flex: 2,
		// height: 200,
		// top: "2%",
		// borderWidth: 2,
		flexDirection: "row",

		justifyContent: "space-between",
		width: "100%",
		alignContent: "center",
	},
	varsListOutter: {
		flexDirection: "column",
		position: "absolute",

		// bottom: "3%",
		height: "100%",
		// borderWidth: 2,
		width: "100%",
		// borderRadius: 20,
		alignSelf: "center",
		// borderColor: "#7bbfff",
		flexDirection: "row",
	},
	varsListTop: {
		flexDirection: "row",
		flex: 3,
		bottom: "3%",
		height: "100%",
		// borderWidth: 2,
		justifyContent: "space-between",

		width: "95%",
		borderRadius: 20,
		alignSelf: "center",
		borderColor: "#7bbfff",
		flexDirection: "column",
	},

	addOnRoller: { borderWidth: 1, height: 100 },
	// ADDON AND DOWN
	topContainer: {
		// flex: 2,
		// bottom: 20,
		// borderWidth: 2,
		top: 20,
		flexDirection: "column",
		alignContent: "center",
		backgroundColor: "white",
		borderRadius: 25,

		// paddingRight: 5,
		// paddingLeft: 5,
	},
	Btitle: {
		flexDirection: "row",
		justifyContent: "space-between",
	},

	D: {
		flexDirection: "column",
		flex: 2,
		position: "absolute",

		top: "74%",
	},
	footer: {
		justifyContent: "space-between",
		// zIndex: -10000,
		// height: 50,
		// bottom: 25,
		borderRadius: 25,
		flexDirection: "row",
	},

	Evariants: {
		flexDirection: "row",
		// zIndex: -100,
		height: 60,
		// bottom: 10,
		borderRadius: 20,
		backgroundColor: "white",
		bottom: 10,
	},
	addOnText: {
		alignSelf: "flex-start",
		fontSize: 18,
		fontFamily: "helectiva",
		// marginLeft: 10,
		bottom: 10,
	},
	arrow: {
		color: "black",
		backgroundColor: "#f5f5f5",
		fontSize: 20,
	},

	container: {
		// flex: 1,
		// borderWidth: 2,
		bottom: 10,
		flexDirection: "column",
		backgroundColor: "#7bbfff",
	},
	colors: {
		position: "absolute",
		width: "50%",
		height: 21,
		left: 28,
		top: 300,
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 25,
	},

	home: {
		top: 385,
		width: 200,
		height: 38,
		left: 80,
		backgroundColor: "#7bbfff",
		borderRadius: 24,
		color: "white",
	},

	image: {
		// position: "absolute",
		// width: 413,
		// flex: 2,
		// height: "20%",
		resizeMode: "cover",
	},

	name: {
		fontFamily: "Avenir",
		fontStyle: "normal",
		fontWeight: "800",
		color: "#000000",
		flexDirection: "row",
		fontSize: 25,
		alignSelf: "flex-start",
		right: 10,
		width: "130%",
	},
	price: {
		// position: "absolute",
		flexDirection: "row",
		fontFamily: "Avenir",
		fontSize: 18,
	},

	variantsText: {
		fontFamily: "Avenir",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 25,
		position: "absolute",
		height: 21,
		left: 10,
	},
});
