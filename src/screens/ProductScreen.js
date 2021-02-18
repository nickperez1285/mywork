import React, { Component, useState, useEffect } from "react";
import { Image, StyleSheet, View, Alert } from "react-native";
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
	editCart,
	getUser,
	clearCart,
	setCartAddress,
	setSelectedAddress,
	setCartItem,
} from "../actions/index.js";
// import DropDownPicker from "react-native-dropdown-picker";
import { images } from "../constants/images.js";
import { SafeAreaView } from "react-navigation";
import { add, or, sub } from "react-native-reanimated";
import { current } from "@reduxjs/toolkit";

const ProductScreen = (props) => {
	const [state, setState] = useState({
		prodID: "",
		prodInfo: {
			key: "val",
		},
		add_ons: [{ name: "none" }, { price: 0 }],
		variants: [],
		selected_add_ons: [],
		selected_variants: [],
		storeID: "",
		productInfo: { key: "" },
		categories: [],
	});
	const [ready, setReady] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();
	const itm = useSelector((i) => i.itemReducer);
	const productID = useSelector((globalState) => globalState.itemReducer.itemID);
	const stores = useSelector((s) => s.algoliaReducer.storeData);
	const item = itm;

	useEffect(() => {
		if (!ready) {
			init();
		}
	}, [productID, ready, itm]);

	const init = () => {
		var addons = itm.add_ons.map((ao) => {
			let arr = [];
			if (ao.name.includes("Topping") || ao.name.includes("Sauce")) {
				let toppings = {
					id: ao.name,
					name: ao.name,
					price: ao.price,
					category: "Toppings",
					RNchecked: false,
				};
				arr.push(toppings);
			} else if (ao.name.includes("Shake")) {
				let shk = {
					id: ao.name,
					name: ao.name,
					price: ao.price,
					category: "Shakes",
					RNchecked: false,
				};
				arr.push(shk);
			} else if (ao.name.includes("Bacon") || ao.name.includes("Fries") || ao.name.includes("Browns")) {
				let sides = {
					id: ao.name,
					name: ao.name,
					price: ao.price,
					category: "Sides",
					RNchecked: false,
				};
				arr.push(sides);
			} else {
				arr.push({
					id: ao.name,
					name: ao.name,
					price: ao.price,
					category: "Other",
					RNchecked: false,
				});
			}
			return arr.reduce((a, val) => {
				return [...a, val];
			}, []);
		});
		let groups = addons.flat();
		const aoGroups = groups.reduce((addonsSoFar, { category, name, price }) => {
			if (!addonsSoFar[category]) addonsSoFar[category] = [];
			addonsSoFar[category].push({ name: name, price: price });
			return addonsSoFar;
		}, {});
		// console.log(aoGroups, "groups");

		setState({
			...state,
			prodID: productID, //check product id
			productInfo: [itm],
			add_ons: addons.flat(),

			variants: itm.variants
				? itm.variants.map((v, idx) =>
						Object.assign(
							v,
							{ id: idx, checked: false },
							{ variants: v.variants.map((i, ix) => ({ ...i, RNchecked: false, id: idx + "." + ix })) }
						)
				  )
				: [],

			images: itm.images,
			store_address: {
				store_street_address: stores[0].Store_street_address,
				store_city: stores[0].store_city,
				store_phone_number: stores[0].store_phone_number,
				store_state: stores[0].store_state,
				store_id: stores[0].Store_id,
			},
			categories: groups.reduce((addonsSoFar, { category, name, price }) => {
				if (!addonsSoFar[category]) addonsSoFar[category] = [];
				addonsSoFar[category].push({ name: name, price: price });
				return addonsSoFar;
			}, {}),
		});

		setReady(true);
	};

	const addOnPrice = (arr) => {
		let aoPrice = 0;
		if (arr) {
			arr.map((item) => {
				let { price } = item;
				aoPrice += price;
			});
		}
		return aoPrice;
	};

	const addItem = (it) => {
		var finalPrice =
			itm.variants.length > 0
				? state.selected_add_ons.reduce((acc, item) => acc + parseFloat(item.price), parseFloat(it.base_price)) +
				  state.selected_variants.reduce((acc, itm) => acc + parseFloat(itm.price), 0)
				: state.selected_add_ons.reduce((acc, item) => acc + parseFloat(item.price), parseFloat(it.base_price)); //add if vaiants have price
		const add_ons = state.selected_add_ons.length > 0 ? state.selected_add_ons : [{ name: "none", price: "0.00" }];
		const variants =
			itm.variants.length > 0 ? state.selected_variants : [{ name: "none", variants: [{ name: "none", price: 0 }] }]; // variants mandatory if exists

		let orderItem = {
			localId: Date.now(),
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
			base_price: it.base_price,
		};
		// console.log(variants, "vars");

		Alert.alert(
			" ",
			"Item Added To Cart",
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
		console.log(orderItem);

		dispatch(setCartAddress(stores[0])); //SEXY CAKES IS THE ONLY STORE
		dispatch(setCart(orderItem));
		props.navigation.navigate("Home");
	};

	const cart = useSelector((s) => s.cartReducer);
	const toggleAddOn = (item) => {
		let select = [...state.selected_add_ons];
		let arr = [...state.add_ons];
		let idx = arr.indexOf(item);
		if (arr[idx].RNchecked == true) {
			arr[idx].RNchecked = false;
			select.includes(arr[idx]) ? select.splice(select.indexOf(arr[idx]), 1) : null;
		} else {
			arr[idx].RNchecked = true;
			select.includes(arr[idx]) == false ? select.push(arr[idx]) : null;
		}
		setState({ ...state, add_ons: arr, selected_add_ons: select });
	};

	const increase = () => {
		let i = quantity + 1;

		setQuantity(i);
	};

	const decrease = () => {
		let i = quantity - 1;
		i > 0 ? setQuantity(i) : 0;
	};

	const toggleVariants = (item, idx, subItem, idx2) => {
		let select = [state.selected_variants];
		let arr = [...state.variants];
		let subVariant = state.variants[idx].variants[idx2];
		state.variants[idx].variants.map((s) => {
			s.RNchecked = false;
		});
		if (subVariant.RNchecked == true) {
			state.variants[idx].variants.map((s) => {
				s.RNchecked = false;
			});
			subVariant.RNchecked = false;
			select.includes(subVariant) ? select.splice(select.indexOf(subVariant), 1) : null;
		} else {
			subVariant.RNchecked = true;
			select.includes(subVariant) == false ? select.push(subVariant) : null;
		}
		let final = [];
		let res = state.variants.map((i) =>
			i.variants.map((v) => (v.RNchecked == true ? final.push({ name: i.name, variants: [v], price: v.price }) : null))
		);
		// let obj = { name: item.name, variants: res.flat(), price: subItem.price };

		setState({ ...state, variants: arr, selected_variants: final });
		console.log(state.selected_variants);
	};

	useEffect(() => {
		return console.log("unmount ");
	}, []);
	return (
		<SafeAreaView
			style={{ flexGrow: 1, flexDirection: "column", backgroundColor: "#7bbfff" }}
			alwaysBounceVertical={false}>
			<View
				style={{
					flexGrow: 1.5,
					zIndex: 100,
					// borderWidth: 4,
				}}>
				<Content style={styles.content} alwaysBounceVertical={false}>
					<Thumbnail
						square
						style={styles.mainImg}
						source={{
							uri: item.images,
						}}
					/>
					<CardItem style={styles.topText}>
						<View style={styles.topTextBody}>
							<View style={styles.topTextName}>
								<Text style={styles.topTextNameText} bold>
									{item.name}
								</Text>
							</View>

							<View>
								<Text
									style={{
										fontSize: 18,
										// alignSelf: "flex-end",
										// alignContent: "flex-end",
										bottom: 5,
										// borderWidth: 2,
										padding: 5,
										width: "100%",
										height: "100%",
										color: "#944d04",
										fontWeight: "bold",
									}}>
									${item.base_price}
								</Text>
							</View>
						</View>
						<Body style={{ top: 10, flexGrow: 10, alignContent: "center", height: "100%" }}>
							<Text style={styles.topTextDescription}>{item.description}</Text>
						</Body>
					</CardItem>

					{state.variants.length > 0 && (
						<List style={styles.variants}>
							{itm.variants
								? itm.variants.map((vnt, idx) => (
										<List style={styles.variantsContainer} key={vnt.id}>
											<ListItem style={{ alignContent: "center", justifyContent: "space-between", width: "90%" }}>
												<Text
													style={{
														fontSize: 15,
														fontWeight: "bold",
														color: "#2c7bbf",
													}}
													note>
													{vnt.name}
												</Text>
												<View style={styles.required}>
													<Text
														style={{
															color: "white",
														}}>
														Required
													</Text>
												</View>
											</ListItem>
											<List>
												{vnt.variants.map((subVnt, subVntIdx) => (
													<ListItem
														onPress={(e) => {
															// toggleVariants(vnt.variants, vnt.name, subVnt, subVntIdx);
															toggleVariants(vnt, idx, subVnt, subVntIdx);
															// vnt.variants
															// console.log(it, "vnt");
														}}
														key={subVntIdx}
														style={{
															justifyContent: "space-between",
															color: "#2c7bbf",
															// borderWidth: 2,
															width: "90%",
														}}>
														<Text style={{ fontWeight: "bold", fontSize: 16, color: "#2c7bbf" }}>
															{" "}
															{`${subVnt.name}`}
														</Text>

														<View style={styles.variantsSub}>
															<Text
																style={{
																	fontSize: 16,
																	color: "#2c7bbf",
																}}>
																{subVnt.price > 0 ? `${"$" + subVnt.price + " "}` : ""}
															</Text>
															<CheckBox
																onPress={() => {
																	toggleVariants(vnt, idx, subVnt, subVntIdx);
																}}
																checked={state.variants[idx].variants[subVntIdx].RNchecked}
																// style={{ color: "#7bfff" }}
																color="#2c7bbf"
															/>
														</View>
													</ListItem>
												))}
											</List>
										</List>
								  ))
								: null}
						</List>
					)}

					{/* <View
						style={{
							// bottom: "3%"
							top: ".1%",

							flexDirection: "column",
							flex: 13,
							borderRadius: 20,
							bottom: "1%",
							height: "100%",

							// margin: 20,
						}}> */}
					{state.add_ons.length > 0 && state.add_ons.filter((itm) => itm.category == "Toppings").length > 0 && (
						<List style={styles.addOnList}>
							<ListItem style={{ alignContent: "center", justifyContent: "space-between", width: "90%" }}>
								<Text
									style={{
										fontSize: 14,
										fontWeight: "bold",
										color: "#2c7bbf",
									}}
									note>
									Toppings
								</Text>
							</ListItem>

							{state.add_ons.map(
								(addon) =>
									addon.category == "Toppings" && (
										<ListItem
											onPress={() => {
												toggleAddOn(addon);
											}}
											style={{ alignContent: "center", justifyContent: "space-between", width: "90%" }}>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "bold",

													color: "#2c7bbf",
												}}>
												{addon.name}
											</Text>

											<View
												style={{
													flexDirection: "row",
													alignContent: "center",
													color: "#2c7bbf",

													justifyContent: "flex-end",
												}}>
												<Text
													style={{
														fontSize: 16,
														color: "#2c7bbf",

														fontWeight: "bold",
													}}>
													{"$" + addon.price + " "}
												</Text>
												<CheckBox
													onPress={() => {
														toggleAddOn(addon);
													}}
													checked={addon.RNchecked}
													color="#2c7bbf"
												/>
											</View>
										</ListItem>
									)
							)}
						</List>
					)}
					{state.add_ons.length > 0 && state.add_ons.filter((itm) => itm.category == "Shakes").length > 0 && (
						<List style={styles.addOnList}>
							<ListItem
								style={{
									// backgroundColor: "rgba(180, 180, 180, 0.6)",
									alignContent: "center",
									justifyContent: "space-between",
									width: "90%",
								}}>
								<Text
									style={{
										fontSize: 14,
										fontWeight: "bold",
										color: "#2c7bbf",
									}}
									note>
									Shakes
								</Text>
							</ListItem>

							{state.add_ons.map(
								(addon) =>
									addon.category == "Shakes" && (
										<ListItem
											onPress={() => {
												toggleAddOn(addon);
											}}
											style={{ alignContent: "center", justifyContent: "space-between", width: "90%" }}>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "bold",

													color: "#2c7bbf",
												}}>
												{addon.name}
											</Text>
											<View
												style={{
													flexDirection: "row",
													alignContent: "center",
													justifyContent: "flex-end",
												}}>
												<Text
													style={{
														fontSize: 16,
														fontWeight: "bold",

														color: "#2c7bbf",
													}}>
													{"$" + addon.price + " "}
												</Text>
												<CheckBox
													onPress={() => {
														toggleAddOn(addon);
													}}
													checked={addon.RNchecked}
													color="#2c7bbf"
												/>
											</View>
										</ListItem>
									)
							)}
						</List>
					)}
					{state.add_ons.length > 0 && state.add_ons.filter((itm) => itm.category == "Sides").length > 0 && (
						<List style={styles.addOnList}>
							<ListItem
								style={{
									alignContent: "center",
									justifyContent: "space-between",
									width: "90%",
								}}>
								<Text
									style={{
										fontSize: 14,

										color: "#2c7bbf",
										fontWeight: "bold",
									}}
									note>
									Sides
								</Text>
							</ListItem>

							{state.add_ons.map(
								(addon) =>
									addon.category == "Sides" && (
										<ListItem
											onPress={() => {
												toggleAddOn(addon);
											}}
											style={{ alignContent: "center", justifyContent: "space-between", width: "90%" }}>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "bold",

													color: "#2c7bbf",
												}}>
												{addon.name}
											</Text>

											<View
												style={{
													flexDirection: "row",
													alignContent: "center",
													justifyContent: "flex-end",
													color: "#2c7bbf",
												}}>
												<Text
													style={{
														fontSize: 16,
														fontWeight: "bold",

														color: "#2c7bbf",
													}}>
													{"$" + addon.price + " "}
												</Text>
												<CheckBox
													onPress={() => {
														toggleAddOn(addon);
													}}
													checked={addon.RNchecked}
													color="#2c7bbf"
												/>
											</View>
										</ListItem>
									)
							)}
						</List>
					)}

					{state.add_ons.length > 0 && (
						<List style={styles.addOnList}>
							<ListItem
								style={{
									alignContent: "center",
									justifyContent: "space-between",
									width: "90%",
								}}>
								<Text
									style={{
										fontSize: 14,
										fontWeight: "bold",
										color: "#2c7bbf",
									}}
									note>
									Other
								</Text>
							</ListItem>

							{state.add_ons.map(
								(addon) =>
									addon.category != "Shakes" &&
									addon.category != "Sides" &&
									addon.category != "Toppings" && (
										<ListItem
											onPress={() => {
												toggleAddOn(addon);
											}}
											style={{
												alignContent: "center",
												justifyContent: "space-between",
												width: "90%",
											}}>
											<Text
												style={{
													fontSize: 15,
													color: "#2c7bbf",
													fontWeight: "bold",
													color: "#2c7bbf",
												}}>
												{addon.name}
											</Text>

											<View
												style={{
													flexDirection: "row",
													alignContent: "center",
													justifyContent: "flex-end",
												}}>
												<Text
													style={{
														fontSize: 16,
														color: "#2c7bbf",
														fontWeight: "bold",
													}}>
													{"$" + addon.price + " "}
												</Text>
												<CheckBox
													onPress={() => {
														toggleAddOn(addon);
													}}
													checked={addon.RNchecked}
													color="#2c7bbf"
												/>
											</View>
										</ListItem>
									)
							)}
						</List>
					)}
					{/* </View> */}
				</Content>
			</View>
			{/* <View> */}
			<CardItem
				style={{
					flex: 0.12,

					width: "100%",
					justifyContent: "space-between",
					alignContent: "center",
					// borderWidth: 2,
					backgroundColor: "#ce9c80",
					// bottom: ".1%",
					// top: ".1%",
				}}>
				<View
					style={{
						borderColor: "#f5f5f5",
						backgroundColor: "#f5f5f5",
						borderRadius: 25,
						// borderWidth: 5,
						height: "100%",
						justifyContent: "space-between",
						alignSelf: "flex-start",
						alignContent: "center",
						alignItems: "center",
						// bottom: "60%",
						width: "40%",
						flexDirection: "row",
					}}>
					<Button
						style={{ height: "100%", borderRadius: 25, backgroundColor: "#f5f5f5" }}
						onPress={() => {
							decrease();
						}}>
						<Text style={{ color: "#2c7bbf" }}> - </Text>
					</Button>
					<Text style={{ fontWeight: "bold", color: "#2c7bbf", alignContent: "center" }}> {quantity} </Text>

					<Button
						style={{ height: "100%", backgroundColor: "#f5f5f5", borderRadius: 25 }}
						onPress={() => {
							increase();
						}}>
						<Text style={{ color: "#2c7bbf" }}> + </Text>
					</Button>
				</View>
				<View
					style={{
						backgroundColor: "#7bbfff",
						zIndex: -10,
						justifyContent: "flex-start	",
						borderRadius: 25,
						// flex: 1,
						width: "40%",
						borderColor: "#7bbfff",
						alignContent: "center",
						alignItems: "center",
						alignSelf: "flex-end",
						// borderWidth: 2,
						// top: "10%",
					}}>
					<Button
						style={{
							backgroundColor: "white",
							zIndex: -10,
							justifyContent: "center",
							borderRadius: 25,
							flex: 2,
							width: "100%",
							alignContent: "flex-start",
							alignSelf: "center",
							// borderWidth: 2,
							// top: "10%",
						}}
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
						}}>
						<Text style={{ color: "#2c7bbf", fontWeight: "bold" }}>Add To Cart</Text>
					</Button>
				</View>

				{/* </Item> */}
			</CardItem>
			{/* </View> */}
		</SafeAreaView>
	);
};

const mapStateToProps = (globalState) => {
	return { globalState };
};
export default connect(mapStateToProps, {})(ProductScreen);
const styles = StyleSheet.create({
	// allAddOns: { top: 10 },
	A: {
		// height:200
		// height: "20%",
		borderRadius: 20,
	},
	addOnList: {
		justifyContent: "space-between",
		// borderWidth: 2,
		alignContent: "center",
		backgroundColor: "rgba(180, 180, 180, 0.6)",
		alignSelf: "center",
		// borderColor: "#7bbfff",
		marginRight: "5%",
		marginLeft: "5%",
		top: ".1%",
		marginBottom: "2%",
		// backgroundColor: "#fafafa",
		borderRadius: 25,
		width: "100%",
		alignContent: "center",
		flexShrink: 1,
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
		alignContent: "flex-end",
		borderRadius: 25,
		padding: 3,
		alignSelf: "flex-end",
		justifyContent: "center",
		backgroundColor: "#ce9c80",

		width: "25%",
	},
	topText: {
		borderRadius: 25,
		flexDirection: "column",
		flex: 2,
		paddingTop: 10,
		paddingTop: "1%",
		// height: "25%",
		// borderColor: "#7bbfff",
		// color: "#944d04",
		bottom: "2%",
		backgroundColor: "#7bbfff",
		justifyContent: "space-between",

		// borderWidth: 2,
	},
	topTextBody: {
		// borderWidth: 2,

		flex: 1,
		flexDirection: "row",
		width: "100%",
		height: "100%",
		justifyContent: "space-between",
		// alignContent: "flex-start",
		borderRadius: 25,
		color: "#944d04",
		backgroundColor: "#7bbfff",
		// justifyContent: "space-between",
	},
	topTextDescription: {
		alignSelf: "center",
		fontSize: 14,
		// height: "200%",
		flexWrap: "wrap",
		margin: 2,
		color: "#dc7e1c",
		fontWeight: "bold",
		backgroundColor: "#7bbfff",
	},
	topTextName: {
		height: "100%",
		// width: "80%",
		alignContent: "flex-start",
		alignSelf: "flex-start",
		alignItems: "flex-start",
		// marginRight: 10
		// borderWidth: 2,
		zIndex: 100,
		flexGrow: 10,
		flexWrap: "wrap",
	},
	topTextNameText: {
		color: "#944d04",
		fontWeight: "bold",
		fontSize: 24,
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
		// backgroundColor: "#b0b5bf",
		backgroundColor: "rgba(180, 180, 180, 0.6)",

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
		color: "#2c7bbf",

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
