/*Hey J Crew. Here is a sample of one of the more complex components that Ive built. Here
We have a checkout page that checks to see if theres a user logged in , then establishes the type of order 
that is being made, then checks to see if there is a user address on file ,
then determines shipping cost if one is found or asks the user to input and address to deliver to. Once the 
delivery details and order type is established , the order gets prepared by the Stripe API  so that it can 
  be paid for. After  the user confirms they want to proceed their credit card info and address is 
 validated if not asked to be input, then the order itself gets processed by Postmates and recorded in our internal 
DB so that its ID can be used to update its status using a web app (that I also built and which allows 
	QR codes to be made and scanned ).
	 Finally the user is navigated to the track order page while the cart is emptied and reset in the background 
*/

import { CommonActions } from "@react-navigation/native";
import React, { Component, useState, useEffect, useReducer } from "react";
import {
	View,
	StyleSheet,
	Alert,
	FlatList,
	TouchableOpacity,
	SafeAreaView,
	TextInput,
	ActivityIndicator,
} from "react-native";
import { Button, Card, Text, CardItem, Label, Right, Left, CheckBox, Body } from "native-base";

import {
	getUser,
	addUserToCart,
	getQuote,
	createOrderID,
	chargeStripe,
	createDelivery,
	getUserCards,
	setSelectedAddress,
	emailDorm,
	selectCard,
	clearCart,
	setDefaultAddress,
	updateUser,
} from "../actions/index";
import { connect, useDispatch, useSelector } from "react-redux";
import AllAddressDrop from "../components/AllAddressDrop";
import Loader from "../components/Loader";
import { reducer } from "redux-form";

// DORM DELIVERY ADDRESS DEFAULTS TO PICKUP ADDRESS
// CREATE DELIVERY PHONE NUMBER USING STATIC , WILL NOT ACCEPT VARRIED FORMATS.
//*  STORE  PICKUP ADDRESS  MUST BE ACTUAL CLIENTS ADDRESS FORMATTED EXACTLY AS SHOWN BELOW.  CANNOT DEVIATE FROM FORMAT 154
//IF DORM - GET QUOTE NEEDED FOR DELIVERY ID TO MAKE CHARGE STRIPE AND CREATE ORDER WORK  - USE PICKUP ADDRESS AS DEFUALT
//IF REG- ASSIGN DEFAULT ADDRESS , ALLOW  USER TO CHANGE OR ADD
var pickup_address = {
	Store_street_address: "2500 North Mayfair Road",
	store_city: "Wauwatosa",
	store_state: "WI",
}; // NEED TO CONFIRM ADDRESS  FORMAT MUST REMAIN CONSISTENT
var pickup_phone = "415-5555555";

const CheckoutScreen = (props) => {
	const user = useSelector((u) => u.userReducer);
	const cart = useSelector((c) => c.cartReducer);
	const dispatch = useDispatch();
	const [state, setState] = useState({
		initialized: false,
		cart_id: "",
		order_id: "",
		final_price: 0.0,
		regDelivery: true,
		delivery_fee: 0.0,
		initPrice: 0.0,
		tax: 0.0,
		delivery_id: "",
		selectedAddress: "",
		selectedCard: "ADD OR SELECT PAYMENT",
		cards: [],
	});

	const { delivery_fee } = useSelector((u) => u.orderReducer);
	const order = useSelector((u) => u.orderReducer);
	const { delivery_id } = useSelector((u) => u.orderReducer);
	const [dormDelivery, setDormDelivery] = useState(false);
	const [initialized, setIntialized] = useState(false);
	const { user_ID } = useSelector((u) => u.userReducer);
	const { total_price } = useSelector((c) => c.cartReducer);
	const { tax } = useSelector((c) => c.cartReducer);
	const { user_stripe_id } = useSelector((u) => u.userReducer);
	const { store_address } = useSelector((c) => c.cartReducer);
	const { selectedAddress } = useSelector((u) => u.userReducer);
	const { selectedCard } = useSelector((u) => u.userReducer);
	const { customer_addresses } = useSelector((u) => u.userReducer);
	const [regDelivery, setRegDelivery] = useState(false);
	const [startFinishAndPay, setStartFinishAndPay] = useState(false);
	const [choice, setChoice] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [initPrice, setInitPrice] = useState(0.0);

	//Check if user is signed in and if address is set
	const checkID = () => {
		dispatch(getUser());
		if (!user.user_stripe_id) {
			console.log("no user stripe id found when checing id ");
			props.navigation.push("Checkout Form", {
				data: { localId: user.user_ID, phoneNumber: user.phoneNumber },
			});
		}
		if (!selectedAddress || selectedAddress.addressLine1 == "") {
			dispatch(setDefaultAddress());
		}

		setIntialized(true);
	};

	useEffect(() => {
		if (!initialized) {
			checkID();
		}
	}, []);

	// ADD ID for USER TO CART
	useEffect(() => {
		if (cart.cart_id !== "" && user_ID !== "") {
			if (!cart.user_id) {
				console.log("adding", user_ID, "to", cart.cart_id, " cart id ");
				dispatch(addUserToCart(user_ID, cart.cart_id));
			}
		}
	}, [cart, user]);

	useEffect(() => {
		if (!selectedAddress) {
			setDefaultAddress();
		} else if (selectedAddress && selectedAddress.addressLine1 == undefined) {
			setDefaultAddress();
		}
	}, [selectedAddress]);

	// Fetches payment cards
	useEffect(() => {
		if (state.cards.length < 1) {
			dispatch(getUserCards(user.user_stripe_id));
			setState({ ...state, cards: user.cards });
		}
	}, []);

	useEffect(() => {
		if (choice == "reg") {
			getQuoteReg();
		} else if (choice == "dorm") {
			getQuoteDorm();
		}
	}, [choice]);

	// EVERY TIME USER COMES TO PAGE OR CHANGES ADDRESS GET QUOTE,
	const getQuoteReg = () => {
		setRegDelivery(true);

		setDormDelivery(false);

		if (selectedAddress !== undefined && selectedAddress.addressLine1 !== undefined) {
			return dispatch(getQuote(pickup_address, selectedAddress, user.user_stripe_id));
		} else {
			dispatch(setDefaultAddress()).then((res) => {
				if (res && res != "none") {
					dispatch(getQuote(pickup_address, res, user.user_stripe_id));
				} else {
					console.log("no address set");
				}
			});
			showAddressBar(!addressBar);
		}
	};

	const getQuoteDorm = () => {
		setRegDelivery(false);
		if (!regDelivery) {
			const dormAddress = {
				addressType: "dorm address",
				addressLine1: store_address.Store_street_address,
				addressLine2: user.dormRoomNumber ? user.dormRoomNumber : "dorm",
				city: store_address.store_city,
				state: store_address.store_state,
				zipCode: store_address.Store_zip_code,
			};
			dispatch(setSelectedAddress(dormAddress));
			dispatch(getQuote(pickup_address, dormAddress, user.user_stripe_id));
		}

		!user.dormRoomNumber ? showDormNumber(false) : showDormNumber(true);
		setDormDelivery(true);
	};

	//RUN WHEN REG DELIVERY IS FIRST SELECTED
	const dormParams = () => {
		if (user.dormRoomNumber && user.dormName) {
			return true;
		} else {
			return false;
		}
	};

	const chargeStripeCard = () => {
		if (user.selectedCard) {
			if (order.order_id !== undefined) {
				if (dormDelivery) {
					if (dormParams()) {
						setIsLoading(true);
						dispatch(chargeStripe(user_stripe_id, cart.cart, user.selectedCard.id, final_price, 0))
							.then((res) => {
								console.log(res, "res from charge stripe");
								if (typeof res.receipt !== undefined) {
									dispatch(emailDorm(order.order_id)).then((data) => {
										deliver();
									}); // empties cart
								} else {
									setIsLoading(false);
									alert("payment failed ");
								}
							})
							.catch((err) => console.log(err, "dorm delivery error"));
					} else {
						alert("please enter dorm number and dorm name ");
					}
				} else if (regDelivery) {
					if (typeof selectedAddress.addressLine1 !== undefined) {
						setIsLoading(true);
						dispatch(chargeStripe(user_stripe_id, cart.cart, user.selectedCard.id, final_price, delivery_fee))
							.then((res) => {
								if (res.data.status == "succeeded") {
									deliver();
								} else {
									setIsLoading(false);
									alert("payment failed");
								}
							})

							.catch((err) => console.log(err));
					}
				}
			} else {
				alert("please try again ");
				console.log("order id not ready ");
			}
		} else {
			alert("Please select payment method");
		}
	};
	// API requires a phone number to fall back to

	const deliver = () => {
		const ph = user.phoneNumber == undefined ? "1555-5555555" : user.phoneNumber;

		dispatch(
			createDelivery({
				pickup_name: "SEXY CAKES",
				pickup_address: pickup_address,
				pickup_phone_number: "1" + `${pickup_phone}`, //WONT WORK WITH OTHER FORMATS ie (555)555 5555"
				dropoff_name: user.first_name,
				dropoff_address: selectedAddress,
				dropoff_phone_number: ph,
				quote_id: order.delivery_id,
				manifest: "manifest",
				manifest_items: cart.cart,
				user_stripe_id: user.user_stripe_id,
				order_type: regDelivery ? "Off-Campus" : "Dorm",
			})
		)
			.then((res) => {
				console.log(res, "delivery res");

				if (res != undefined) {
					finishAlert();
				} else {
					alert("delivery failed");
					console.log("delivery failed");
				}
			})
			.catch((err) => console.log(err, "delivery  error"));
	};

	const createOrder = (deliveryFee, deliveryID, customer_address) => {
		if (delivery_id != undefined || "") {
			store_address
				? dispatch(
						createOrderID({
							delivery_id: deliveryID, //set in  postmates' quote_id from createQuote
							store_id: 1, // SECY CAKES ONLY cart[0].store_id,//store id of first item in cart
							user_stripe_id: user.user_stripe_id,
							first_name: user.first_name,
							last_name: user.last_name,
							phone: user.phoneNumber,
							customer_address: customer_address, // if no selected address, defaults to the last one provided [this.]
							total_price: final_price,
							delivery_fee: deliveryFee, //determined by checkdelivery function
							store_address: store_address, //need to decide if all items will comefrom same store address
							order_status: "pending", //get order status from getDeliveryStatusForDifferentService ignore the naming for now
							items: cart.cart,
						})
				  ).then((res) => alertAndPay())
				: console.log("missing store address ");
		} else {
			alert("please verify delivery address");
		}
	};

	const alertAndPay = () => {
		{
			Alert.alert("", "Would you like to make this purchase?", [
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						chargeStripeCard();
					},
				},
			]);
		}
	};

	// NNEED TO CHECK IF QUOTE ID EXISTS AND IF ITS OEXPIRED< NEED TO MAKE SUER THEIRS A PCIKUP AND DROP OFF ADDRESS
	const confirm = () => {
		console.log("confirming");
		if (regDelivery || dormDelivery) {
			if (regDelivery) {
				if (selectedAddress && delivery_fee) {
					if (selectedAddress && user.selectedCard) {
						createOrder(delivery_fee, delivery_id, selectedAddress);
						setStartFinishAndPay(true);
					} else {
						alert("please select address and payment ");
					}
				} else {
					alert("address is not deliverable");
				}
			}
			if (dormDelivery) {
				if (selectedCard && (user.dormRoomNumber != "" || undefined) && user.dormName) {
					//CHECK IF DELVIERY ID STILL REQUIRED  FOR  CEARTE ORDER TO WORK
					createOrder(0, "dormDelivery", pickup_address);
					setStartFinishAndPay(true);
				} else {
					alert("Please Confirm Payment & Dorm Room ");
				}
			}
		} else {
			alert("please make a selection");
		}
	};

	// RENDERS PAYMENT METHODS
	const showCards = (card) => {
		dispatch(selectCard(card));
		setCardMenu(false);
	};
	const renderCards = ({ item, separators }) => {
		let selected = !user.selectedCard ? null : user.selectedCard.id;
		return (
			<Card style={{ flex: 1, padding: 10, margin: 5, backgroundColor: "#7bbfff" }}>
				<TouchableOpacity
					onPress={() => showCards(item)}
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						height: "100%",
						backgroundColor: "#7bbfff",
					}}>
					<Right style={{ backgroundColor: "#7bbfff" }}>
						<Body style={{ backgroundColor: "#7bbfff" }}>
							<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}>{item.brand + " ... " + item.last4}</Text>
							<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}>
								{"EXP: " + item.exp_month + "/" + item.exp_year}
							</Text>
							<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}>
								{user.first_name + " " + user.last_name}
							</Text>
						</Body>
					</Right>

					<Left style={{ justifyContent: "flex-end" }}>
						<Body style={{ justifyContent: "center", alignSelf: "flex-end" }}>
							<Text style={{ color: "#2c7bbf" }}>
								<CheckBox color="#2c7bbf" checked={selected == item.id} onPress={() => showCards(item)} />
							</Text>
						</Body>
					</Left>
				</TouchableOpacity>
			</Card>
		);
	};
	const selectAndQuote = (it) => {
		dispatch(setSelectedAddress(it), dispatch(getQuote(pickup_address, it, user.user_stripe_id)));
	};
	const renderAddresses = ({ item, separators }) => {
		return (
			<Card style={{ flex: 1, padding: 10, margin: 5 }}>
				{/* <TouchableOpacity onPress={() => dispatch(selectCard(item))}> */}
				{/* <CardItem style={{ justifyContent: "space-between" }}> */}
				<TouchableOpacity
					onPress={() => selectAndQuote(item)}
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						height: "100%",
					}}>
					<View style={{ width: "90%" }}>
						<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}>
							{user.first_name + " " + user.last_name}
						</Text>
						<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}>{item.addressLine1}</Text>
						<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}> {item.addressLine2}</Text>
						<Text style={{ flexDirection: "row", alignSelf: "flex-start" }}>
							{item.city + " " + item.state + " " + item.zipCode}
						</Text>
					</View>

					<Left style={{ justifyContent: "flex-end" }}>
						<Body style={{ justifyContent: "center", alignSelf: "flex-end" }}>
							<Text style={{ color: "#2c7bbf" }}>
								<CheckBox
									color="#2c7bbf"
									checked={user.selectedAddress.addressLine1 == item.addressLine1}
									onPress={() => selectAndQuote(item)}
								/>
							</Text>
						</Body>
					</Left>
				</TouchableOpacity>
				{/* </CardItem> */}
				{/* </TouchableOpacity> */}
			</Card>
		);
	};

	const [cardMenu, setCardMenu] = useState(false);

	const openMenu = () => {
		return (
			<TouchableOpacity
				onPress={() => handleCardMenu()}
				style={{ color: "#2c7bbf", alignContent: "center", alignItems: "center" }}>
				<Text
					style={{
						color: "#2c7bbf",
						alignItems: "center",
						alignContent: "center",
						alignSelf: "center",
					}}
					title="SELECT PAYMENT">
					SELECT PAYMENT
				</Text>
			</TouchableOpacity>
		);
	};
	const handleCardMenu = (e) => {
		!user.cards ? dispatch(getUserCards()) : null;
		setCardMenu(true);
	};

	const selection = !cardMenu ? openMenu() : null;
	const [addressBar, showAddressBar] = useState(false);
	const [dormInput, setDormInput] = useState("");
	const [dormInput2, setDormInput2] = useState("");
	const [dormNumber, showDormNumber] = useState(false);
	const dormInputBox = () => {
		return (
			<View style={{ flex: 4, alignSelf: "center", color: "#2c7bbf", width: "120%" }}>
				{!dormNumber && (
					<TextInput
						name="dormInput"
						style={styles.dormInput1}
						onChangeText={(e) => setDormInput(e)}
						placeholder="  Dorm Name"
					/>
				)}
				{!dormNumber && (
					<TextInput
						name="dormInput2"
						style={styles.dormInput2}
						onChangeText={(e) => setDormInput2(e)}
						placeholder="  Dorm #"
					/>
				)}
			</View>
		);
	};

	const saveDorm = () => {
		console.log("pressed");
		if (dormInput2 || dormInput) {
			dispatch(updateUser({ dormRoomNumber: dormInput2, addressLine2: dormInput2, dormName: dormInput }));
			console.log("user dorm room number set in state to ", user.dormRoomNumber);
			showDormNumber(!dormNumber);
		} else {
			alert("Address Invalid");
		}
	};
	const finishAlert = () => {
		setIsLoading(false);
		Alert.alert("", "Order Completed.", [
			{
				text: "Ok",
				onPress: () => {
					props.navigation.dispatch(
						CommonActions.reset({
							index: 1,
							routes: [
								{ name: "Home" },
								{
									name: "Order Tracking",
									params: [
										{ pickup: { lat: cart.store_address._geoloc.lat, lng: cart.store_address._geoloc.lng } },
										{ dropoff: { lat: cart.store_address._geoloc.lat, lng: cart.store_address._geoloc.lng } },
										{ item: { quote_id: order.delivery_id } },
										{ user_stripe_id: { user_stripe_id: user.user_stripe_id } },
									],
								},
							],
						})
					);
				},
			},
		]);
		dispatch(clearCart());
	};

	const dorm = () => {
		return (
			<View style={styles.mainCardDorm}>
				<CardItem style={styles.header}>
					{dormDelivery && (
						<Left style={{ right: 5, backgroundColor: "#7bbfff" }}>
							{/* <Label style={styles.titles}>On-Campus</Label> */}
						</Left>
					)}
					<Right>
						{dormDelivery && (
							<Button
								style={styles.editButtons}
								onPress={() => {
									showDormNumber(!dormNumber);
									// showAddressBar(!addressBar);
								}}>
								<Text
									style={{
										color: "#2c7bbf",
										height: "100%",
										alignItems: "flex-end",
										left: 20,
										// borderWidth: 2,
									}}>
									EDIT
								</Text>
							</Button>
						)}
					</Right>
				</CardItem>
				{dormDelivery && !dormNumber && (
					<CardItem style={styles.dormInputContainer}>
						<Body>
							{dormInputBox()}
							<Button style={styles.dormInputButton} onPress={() => saveDorm()}>
								{!dormNumber && <Text style={styles.dormInputButtonText}>Save</Text>}
							</Button>
						</Body>
					</CardItem>
				)}
				<CardItem style={{ flex: 1.5, justifyContent: "center", flexDirection: "row", backgroundColor: "#7bbfff" }}>
					<Body>
						<Text style={styles.dormText}>
							{dormDelivery && user.dormRoomNumber && dormNumber && (
								<Text>
									<Text style={{ fontWeight: "bold" }}>Dorm Name</Text>
									{"\n" + user.dormName + "\n"}
									<Text style={{ fontWeight: "bold" }}>Dorm #</Text>
									{"\n" + user.dormRoomNumber + "\n"}
								</Text>
							)}
						</Text>
					</Body>
				</CardItem>
			</View>
		);
	};

	const reg = () => {
		return (
			<View style={styles.mainCardCampus}>
				<CardItem style={styles.header}>
					{regDelivery && <Left>{/* <Label style={styles.titles}>OFF-CAMPUS</Label> */}</Left>}
					<Right>
						{regDelivery && (
							<Button
								style={{
									backgroundColor: "#7bbfff",
									justifyContent: "center",
								}}
								onPress={() => {
									showAddressBar(!addressBar);
								}}>
								<Text
									style={{
										backgroundColor: "#7bbfff",
										zIndex: 10000,
										color: "#2c7bbf",
										// font
									}}>
									EDIT
								</Text>
							</Button>
						)}
					</Right>
				</CardItem>
				<CardItem style={{ zIndex: 100, flex: 4, flexDirection: "row", width: "90%", backgroundColor: "#7bbfff" }}>
					<View style={styles.addressBar}>
						{regDelivery && addressBar && (
							<View style={styles.addressBarBody}>
								<Button
									style={{
										alignSelf: "flex-end",
										height: 30,
										width: "15%",
										backgroundColor: "#2c7bbf",
										borderRadius: 25,

										// borderWidth: 2,
										alignContent: "flex-start",
										// bottom: "8%",
									}}
									onPress={() => {
										showAddressBar(!addressBar);
									}}>
									<Text style={{ color: "black", alignSelf: "flex-end", backgroundColor: "#2c7bbf" }}>X</Text>
								</Button>

								{/* // <AllAddressDrop storeAddress={pickup_address} /> */}

								<FlatList
									data={customer_addresses}
									renderItem={renderAddresses}
									keyExtractor={(item) => item.id}
									horizontal={false}
									numRows={3}
									numColumns={1}
									persistentScrollbar={true}
									style={{ width: "100%" }}
								/>
								{/* )} */}
								{/* {regDelivery && addressBar && ( */}
								<Button
									onPress={() => {
										props.navigation.navigate("Addresses Screen");
									}}
									style={{
										backgroundColor: "white",
										alignSelf: "center",
										// left: "50%",
										zIndex: -20,
										alignSelf: "center",
										justifyContent: "center",
										borderWidth: 2,
										borderRadius: 25,
										top: 5,
										borderColor: "#2c7bbf",
									}}>
									<Text style={{ height: 20, color: "#2c7bbf" }}>Add New Address</Text>
								</Button>
							</View>
						)}

						<TouchableOpacity
							style={{
								width: "90%",
								// backgroundColor: "#7bbfff",
								// borderWidth: 2,
								alignContent: "center",
								alignItems: "center",
								alignSelf: "center",
								height: "100%",
								bottom: "40%",
							}}
							onPress={() => {
								typeof selectedAddress !== undefined ? showAddressBar(false) : showAddressBar(true);
							}}>
							{regDelivery && !addressBar && (
								<View
									style={{
										alignSelf: "center",
										// width: "8%",
										color: "black",
										height: "200%",
										// alignSelf:'flex-end'
										// borderWidth: 2,
									}}>
									{typeof selectedAddress !== undefined && selectedAddress.addressLine1 !== "" ? (
										<Text
											style={{
												alignSelf: "center",
												// width: "8%",
												color: "black",
											}}>
											{user.first_name +
												" " +
												user.last_name +
												"\n" +
												user.selectedAddress.addressLine1 +
												"\n" +
												user.selectedAddress.city +
												" " +
												user.selectedAddress.state +
												" " +
												user.selectedAddress.zipCode}
										</Text>
									) : (
										<Text>click edit to add/select new address</Text>
									)}
								</View>
							)}
						</TouchableOpacity>
					</View>
				</CardItem>
			</View>
		);
	};
	//////////////////////////////////////////////////////////////

	return isLoading ? (
		<ActivityIndicator style={{ backgroundColor: "#7bbfff", display: "flex", flex: 1 }} />
	) : (
		<SafeAreaView style={styles.container}>
			{/* <Button
				onPress={() => {
					fetch("http://us-central1-saymile-a29fa.cloudfunctions.net/api/getAllincompleteDelivery", {
						method: "GET",
						mode: "cors",
					}).then((res) => console.log(res, "fetching"));
				}}>
				<Text>TEST</Text>
			</Button> */}
			{/* <Loader loading={startFinishAndPay} ></Loader> */}
			<View style={{ display: "flex", flexDirection: "row", bottom: 2, zIndex: 1000 }}>
				<Button
					onPress={() => {
						setChoice("dorm");
					}}
					style={{ borderBottomLeftRadius: 25, backgroundColor: regDelivery ? "grey" : "#2c7bbf" }}>
					<Text>On Campus</Text>
				</Button>
				<Button
					onPress={() => {
						setChoice("reg");
					}}
					style={{ borderTopRightRadius: 25, zIndex: 100, backgroundColor: dormDelivery ? "grey" : "#2c7bbf" }}>
					<Text>Off Campus</Text>
				</Button>
			</View>
			{!regDelivery && !dormDelivery && <Text style={{ margin: 10 }}> Select Type of Order</Text>}
			<Text style={{ color: "grey", alignSelf: "center" }}> _____________________________________</Text>

			{regDelivery ? reg() : dorm()}
			<Text style={{ color: "grey", alignSelf: "center" }}> _____________________________________</Text>

			<View style={styles.mainCardPay}>
				{/* <CardItem style={styles.headers}> */}
				<CardItem style={{ flex: 0.4, justifyContent: "space-between", width: "100%", backgroundColor: "#7bbfff" }}>
					<Left>
						<Label style={styles.titles}>PAYMENT METHOD </Label>
					</Left>
					<Right>
						<Button
							style={{ backgroundColor: "#7bbfff" }}
							onPress={() => {
								setCardMenu(!cardMenu);
							}}>
							<Text style={{ color: "#2c7bbf", zIndex: -1 }}> EDIT</Text>
						</Button>
					</Right>
				</CardItem>

				{user.selectedCard ? (
					<CardItem
						style={{
							flex: 5,
							flexDirection: "row",
							alignSelf: "flex-start",
							height: "100%",
							backgroundColor: "#7bbfff",
							justifyContent: "space-between",
							//borderWidth: 2,
							width: "100%",
							// bottom: "5%",
						}}>
						{/* <Left style={{ borderWidth: 1, height: "100%" }}> */}
						{!cardMenu && (
							<Left style={{ backgroundColor: "#7bbfff" }}>
								<Text>
									{user.first_name +
										" " +
										user.last_name +
										"\n" +
										user.selectedCard.brand +
										" ... " +
										user.selectedCard.last4 +
										"\n" +
										"EXP: " +
										user.selectedCard.exp_month +
										"/" +
										user.selectedCard.exp_year +
										"\n"}
								</Text>
							</Left>
						)}
						{!cardMenu && (
							<Right>
								<Body style={styles.selectedCard}>
									<Text>
										<CheckBox
											color="#2c7bbf"
											// color="black"
											checked={true}
											onPress={() => console.log(user.selectedCard)}
										/>
									</Text>
								</Body>
							</Right>
						)}

						{/* </CardItem> */}
					</CardItem>
				) : (
					selection
				)}
			</View>
			{cardMenu && (
				<View style={styles.cardList}>
					<Body style={{ flex: 2, width: "100%" }}>
						<Button
							onPress={() => {
								showCards();
							}}
							style={{
								alignSelf: "flex-end",
								height: "15%",
								width: "15%",
								backgroundColor: "white",
								right: 10,
								borderRadius: 25,
							}}>
							<Text style={{ color: "#2c7bbf", alignSelf: "flex-end", left: 10 }}>X</Text>
						</Button>
						<FlatList
							data={user.cards}
							renderItem={renderCards}
							keyExtractor={(item) => item.id}
							horizontal={false}
							numRows={3}
							numColumns={1}
							persistentScrollbar={true}
							style={{ height: 40, width: "100%" }}
						/>
					</Body>

					<View style={{ flex: 0.4, alignSelf: "center", top: 1 }}>
						<Button
							style={{
								// height: 10,
								justifyContent: "flex-end",
								alignSelf: "center",
								backgroundColor: "white",
								alignContent: "center",
								alignItems: "center",
								borderWidth: 2,
								flex: 0.8,
								borderRadius: 25,
								borderColor: "#2c7bbf",
								// height: "20%",
							}}
							onPress={() => {
								props.navigation.navigate("Card Screen");
								// console.log(user);
								dispatch(getUserCards());
							}}>
							<Text style={{ alignSelf: "center", color: "#2c7bbf" }}>Add New Payment Method</Text>
						</Button>
					</View>
				</View>
			)}
			<CardItem style={styles.mainOrderSummary}>
				<Left style={{ right: 20, flexDirection: "column" }}>
					<Text
						style={{
							right: 10,
							fontWeight: "bold",
							width: "100%",
							alignSelf: "flex-start",
							fontSize: 17,
							color: "#2c7bbf",
						}}>
						ORDER SUMMARY
					</Text>
					<Label note style={styles.summaryText}>
						SUBTOTAL
					</Label>
					<Text note style={styles.summaryText2}>
						Tax:
					</Text>
					<Text note style={styles.summaryText2}>
						Delivery Fee:
					</Text>
					<Label note style={styles.summaryText}>
						Total:
					</Label>
				</Left>
				<Right style={{ top: "5%" }}>
					<Text style={styles.price}>${(initPrice + total_price).toFixed(2)}</Text>
					<Text style={styles.price}>${tax ? tax.toFixed(2) : "0.00"}</Text>
					<Text style={styles.price}>
						${regDelivery && delivery_fee ? (initPrice + delivery_fee).toFixed(2) : "0.00"}
					</Text>
					{(dormDelivery || regDelivery) &&
						(regDelivery ? (
							<Text style={{ fontWeight: "bold" }} bold>
								${total_price && delivery_fee ? (delivery_fee + total_price + tax).toFixed(2) : "0.00"}
							</Text>
						) : (
							<Text style={{ fontWeight: "bold" }} bold>
								${total_price ? (tax + total_price).toFixed(2) : "0.00"}
							</Text>
						))}
				</Right>
			</CardItem>
			<View
				style={{
					width: "50%",
					alignItems: "center",

					backgroundColor: "#ce9c80",
					width: "100%",
					padding: 5,
				}}>
				<Button
					onPress={() => {
						confirm();
					}}
					style={{
						display: "flex",

						backgroundColor: "white",
						borderRadius: 25,
						justifyContent: "center",
						alignSelf: "center",
					}}>
					<Text style={{ color: "#2c7bbf", fontWeight: "bold" }}>Buy Now </Text>
				</Button>
			</View>
		</SafeAreaView>
	);
};

const mapStateToProps = (global) => {
	return {
		global,
	};
};
export default connect(mapStateToProps, {})(CheckoutScreen);

const styles = StyleSheet.create({
	add: { width: 450, left: 90 },
	addAddress: {
		flexDirection: "row",
		right: 40,
	},
	addressBarBody: {
		position: "absolute",
		alignItems: "center",
		alignContent: "center",
		alignSelf: "center",
		justifyContent: "flex-end",
		zIndex: 100,
		width: "130%",
		height: "100%",
		bottom: "65%",
		// borderWidth: 2,
		flexShrink: 1,
		padding: 10,
		// backgroundColor: "#7bbfff",
		zIndex: 100,
		// paddingTop: 30,
		// height: "50%",
		// width: "80%",
		backgroundColor: "#2c7bbf",
		borderWidth: 4,
		borderRadius: 25,
		// borderColor: "#2c7bbf",
	},
	addressBar: {
		position: "absolute",
		alignItems: "center",
		alignContent: "center",
		alignSelf: "center",
		justifyContent: "center",
		zIndex: 100000,
		width: "80%",
		left: "20%",
		top: "60%",
		// borderWidth: 2,
		// flex: 2,
		height: "90%",

		//
	},
	bodyText: { width: "80%", bottom: "5%", marginLeft: 40 },

	cardList: {
		height: "40%",
		width: "80%",
		backgroundColor: "white",
		borderWidth: 4,
		borderRadius: 25,
		borderColor: "#2c7bbf",
		position: "absolute",
		top: "30%",
		////borderWidth: 2,

		flexShrink: 0.6,
		// bottom: 20,
		// bottom: 70,
	},
	checkboxes: { width: 20, justifyContent: "center" },
	creditText: { flexDirection: "row", alignSelf: "flex-start" },

	container: {
		height: "100%",
		flex: 1,
		backgroundColor: "#7bbfff",

		alignItems: "center",
		flexDirection: "column",
		// padding: 20,
		// margin: 10,
		// borderRadius: 25,
		// margin: 10,
		borderColor: "#2c7bbf",

		// borderWidth: 10,
		// justifyContent: "center",
	},
	dormCheckbox: {
		height: "100%",
		color: "#2c7bbf",
		width: "10%",
		alignSelf: "center",
		justifyContent: "center",
		zIndex: 100,
		right: 8,
		// borderWidth: 2,
		// height: "100%",
		// color: "#2c7bbf",
		// width: "8%",
		// alignSelf: "flex-start",
		// justifyContent: "center",
		// // position: "absolute",
		// right: 10,
		// backgroundColor: "#7bbfff",

		// width:20
		flex: 1,
	},
	dormInputContainer: {
		position: "absolute",
		height: "50%",
		// borderWidth: 4,
		borderRadius: 25,
		backgroundColor: "#7bbfff",
		// borderColor: "#2c7bbf",
		// padding: 10,
		// left: 100,

		justifyContent: "flex-end",
		alignSelf: "center",
		alignContent: "center",
		alignItems: "center",
		width: "50%",
		zIndex: 100,
		flex: 5,
		flexDirection: "column",
	},
	dormInput1: {
		height: "50%",
		alignSelf: "center",

		justifyContent: "flex-end",
		flexDirection: "row",
		backgroundColor: "rgba(180, 180, 180, 0.4)",

		borderRadius: 25,
		width: "100%",
		padding: 10,
		// borderWidth: 2,
		flexGrow: 1,
	},
	dormInput2: {
		height: "50%",
		flexDirection: "row",
		width: "100%",
		padding: 10,
		flexGrow: 1,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "flex-end",
		backgroundColor: "rgba(180, 180, 180, 0.4)",
		borderRadius: 25,
		// width: 150,
		margin: 5,
	},
	dormInputButton: {
		alignSelf: "center",
		alignItems: "center",
		alignContent: "center",
		zIndex: 1000,
		borderRadius: 25,
		top: 10,
		backgroundColor: "white",
		flex: 1,
		// width: "80%",
		height: "80%",
		// borderWidth: 2,
	},
	dormInputButtonText: {
		// borderWidth: 2,
		// flex: 1,

		// left: "155%",
		// width: "100%",
		alignSelf: "center",
		// fontSize: 15,
		alignContent: "center",
		// borderWidth: 2,
		height: "80%",
		color: "#2c7bbf",
	},
	dormText: {
		alignSelf: "center",
		justifyContent: "center",
		height: "100%",
		fontSize: 15,

		alignContent: "center",
		// borderWidth: 2,
	},
	editButtons: {
		backgroundColor: "#7bbfff",
		zIndex: -1,

		width: "50%",
		alignSelf: "flex-end",
		color: "#2c7bbf",
	},

	header: {
		flex: 0.3,
		justifyContent: "space-between",
		// bottom: "1%",
		backgroundColor: "#7bbfff",

		width: "100%",
		// borderWidth: 2,
		backgroundColor: "#7bbfff",
	},
	inputBody: {
		alignSelf: "flex-start",
		alignItems: "center",
		alignContent: "center",
		backgroundColor: "white",
		flex: 1.5,
		height: "80%",
		width: "100%",
		// borderWidth: 2,
		// marginBottom: 5,
	},

	mainOrderSummary: {
		flex: 1,
		width: "90%",
		backgroundColor: "#7bbfff",

		// borderWidth: 1,
		// zIndex: -100,
	},
	mainCardPay: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#7bbfff",

		// //borderWidth: 1,
		// style={{
	},
	mainCardCampus: {
		flex: 2,
		flexDirection: "column",
		width: "100%",
		backgroundColor: "#7bbfff",

		// //borderWidth: 2,
	},
	mainCardDorm: {
		flex: 2,
		flexDirection: "column",
		width: "95%",
		backgroundColor: "#7bbfff",

		justifyContent: "center",
		alignContent: "center",
		// top: "50%",

		// top: 40,
		// bottom: "15%",
		// height: 100,
		// borderWidth: 1,
		// top: "5%",
	},

	price: {
		color: "#2c7bbf",
		fontWeight: "bold",
		// padding: 10,
	},
	radio: {
		justifyContent: "space-between",
		width: 200,
	},

	regDelivCheck: {
		height: "100%",
		color: "#2c7bbf",
		width: "10%",
		alignSelf: "center",
		justifyContent: "center",
		zIndex: 100,
		left: 2,
		// flex: 1,
		// borderWidth: 1,,
	},
	selectedCard: {
		//borderWidth: 1,
		backgroundColor: "#7bbfff",

		height: "100%",
		justifyContent: "center",
		alignSelf: "flex-end",
		width: "50%",
	},
	summaryText: { alignSelf: "flex-start", color: "#2c7bbf", fontWeight: "bold" },
	summaryText2: { right: 10, alignSelf: "flex-start", fontWeight: "bold" },
	titles: { zIndex: 100, height: "100%", fontSize: 18, fontWeight: "bold", color: "#2c7bbf" },

	//
});
