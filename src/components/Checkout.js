import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
// import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { createStackNavigator } from "@react-navigation/stack";

import {
	Text,
	StatusBar,
	StyleSheet,
	View,
	TextInput,
	Button,
	ScrollView,
	SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	FirebaseRecaptchaVerifierModal,
	FirebaseRecaptchaVerifier,
	FirebaseRecaptcha,
} from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import axios from "axios";
import { DateInput } from "react-native-date-input";
import dayjs from "dayjs";
import { Circle } from "google-maps-react";
import { useSelector, useDispatch, connect } from "react-redux";
import { StackActions } from "react-navigation";
import { Content, Container } from "native-base";
import {
	setSelectedAddress,
	setUserID,
	addUserCard,
	setUserStripeID,
	selectCard,
	updateUser,
} from "../actions";
//  ADDED SET USER ID IN LINE 306
var stripe = require("stripe-client")("sk_test_O9n7fxDTT3G38Lz48prDzoCi00uarHUVti");
var firebaseConfig = {
	apiKey: "AIzaSyDvxW0UR7ms8C_aDS6wVJFyFHS3_ZXb-vc",
	authDomain: "saymile-a29fa.firebaseapp.com",
	databaseURL: "https://saymile-a29fa.firebaseio.com",
	projectId: "saymile-a29fa",
	storageBucket: "saymile-a29fa.appspot.com",
	messagingSenderId: "762997218792",
	appId: "1:762997218792:web:6db6840d65a3f16cd5585d",
	measurementId: "G-N7FSFS03GB",
};

try {
	firebase.initializeApp(firebaseConfig);
} catch {
	console.log("Already initialized");
}

// Stripe.setOptionsAsync({
//     publishableKey: "sk_test_O9n7fxDTT3G38Lz48prDzoCi00uarHUVti"
// })

// const CheckoutForm: (props) => React$Node = ({ navigation, route }) => {
const CheckoutForm = ({ navigation, route }) => {
	const recaptchaVerifier = useRef(null);
	const [phoneNumber, setPhoneNumber] = useState(route.params.data.phoneNumber);
	const [userId, setID] = useState(route.params.data.localId);
	const [firstName, setFirstName] = useState();
	const [lastName, setLastName] = useState();
	const [addressLine1, setAddressLine1] = useState();
	const [addressLine2, setAddressLine2] = useState();
	const [city, setCity] = useState();
	const [state, setState] = useState();
	const [cardId, setCardId] = useState("");
	const [buttonText, setButtonText] = useState("Submit & Checkout");
	const [userCode, setUserCode] = useState();
	const [cardNum, setCardNum] = useState();
	const [cvv, setCvv] = useState();
	const [date, setDate] = useState();
	const [enableMobileInput, setEnableMobileInput] = useState(true);

	let addressObj = {
		addressType: "billing",
		addressLine1: addressLine1,
		addressLine2: addressLine2,
		city: city,
		state: state,
		zipCode: 70118,
	};
	var screenLoad = false;
	// console.log(route.params.data, "user id ");
	const popAction = StackActions.pop(2);

	const dispatch = useDispatch();
	useEffect(() => {
		if (!route.params.data.localId) {
			if (route.params.data.userId) {
				setID(route.params.data.userId);
			}
		}
	}, []);
	return (
		<SafeAreaView style={{ flex: 1, paddingTop: 100 }}>
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.row1}>
					<View style={styles.row1View}>
						<Text style={styles.verifyCode}>First Name</Text>
						<TextInput
							autoGrow={false}
							maxLength={26}
							onChangeText={(val) => setFirstName(val)}
							autoCompleteType="name"
							textContentType="text"
							style={styles.verifyInput}></TextInput>
					</View>

					<View style={styles.row1View}>
						<Text style={styles.verifyCode}>Last Name</Text>
						<TextInput
							onChangeText={(val) => setLastName(val)}
							autoCompleteType="name"
							textContentType="text"
							style={styles.verifyInput}></TextInput>
					</View>
				</View>

				<View style={styles.row2}>
					<View
						style={{
							// backgroundColor: "black",
							width: "100%",
						}}>
						<Text style={styles.verifyCode}>Phone Number</Text>

						<TextInput
							value={phoneNumber}
							onChangeText={(val) => setPhoneNumber(val)}
							autoCompleteType="tel"
							keyboardType="phone-pad"
							textContentType="telephoneNumber"
							style={styles.phoneNumberInput}></TextInput>
					</View>
				</View>

				<View style={styles.row3}>
					<View>
						<Text style={styles.verifyCode}>Address line 1</Text>

						<TextInput
							onChangeText={(val) => setAddressLine1(val)}
							autoCompleteType="street-address"
							textContentType="text"
							style={styles.verifyInput}></TextInput>
					</View>

					<View>
						<Text style={styles.verifyCode}>Address line 2</Text>

						<TextInput
							onChangeText={(val) => setAddressLine2(val)}
							autoCompleteType="street-address"
							textContentType="text"
							style={styles.verifyInput}></TextInput>
					</View>
				</View>

				<View style={styles.row3}>
					<View>
						<Text style={styles.verifyCode}>City</Text>

						<TextInput
							onChangeText={(val) => setCity(val)}
							autoCompleteType="street-address"
							textContentType="text"
							style={styles.verifyInput}></TextInput>
					</View>

					<View>
						<Text style={styles.verifyCode}>State</Text>

						<TextInput
							onChangeText={(val) => setState(val)}
							autoCompleteType="street-address"
							textContentType="text"
							style={styles.verifyInput}></TextInput>
					</View>
				</View>

				<View
					style={{
						marginTop: "8%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-evenly",
					}}>
					<View>
						<Text style={styles.verifyCode}>Card Number</Text>

						<TextInput
							maxLength={16}
							onChangeText={(val) => setCardNum(val)}
							autoCompleteType="cc-number"
							textContentType="text"
							style={{
								backgroundColor: "#f8f8f8", //
								width: 150,
								// marginTop: "5%",
								// marginLeft: "10%",
								padding: 8,
								borderRadius: 5,
								overflow: "scroll",
							}}></TextInput>
					</View>

					<View
						style={
							{
								// marginRight: "26%"
							}
						}>
						<Text style={styles.verifyCode}>CVV</Text>

						<TextInput
							maxLength={3}
							onChangeText={(val) => setCvv(val)}
							autoCompleteType="cc-csc"
							textContentType="text"
							style={{
								backgroundColor: "#f8f8f8", //
								width: 50,
								// marginTop: "5%",
								// marginLeft: "10%",
								padding: 8,
								borderRadius: 5,
								overflow: "scroll",
							}}></TextInput>
					</View>

					<View
						style={{
							marginRight: "-0.1%",
						}}>
						<Text style={styles.verifyCode}>Date</Text>

						<DateInput
							// inputProps={{
							//     style: {},
							//     ...props,
							//     // Supports all TextInput props
							// }}

							inputProps={{
								style: {
									backgroundColor: "#f8f8f8", //
									width: 70,
									// marginTop: "5%",
									// marginLeft: "10%",
									padding: 8,
									borderRadius: 5,
									overflow: "scroll",
								},
							}}
							dateFormat={"MM/YYYY"}
							defaultValue={
								new Date(
									dayjs()
										.subtract(5, "year")
										// .format("DD/MM/YYYY")
										.format("MM/YYYY")
								)
							}
							defaultDate={new Date(dayjs().subtract(5, "year"))}
							minimumDate={new Date(dayjs().subtract(10, "year"))}
							handleChange={(data) => {
								setDate(data);
							}}
						/>

						{/* <TextInput maxLength={3} onChangeText={(val) => setUserCode(val)} autoCompleteType=""
                        textContentType="text" style={{
                            backgroundColor: "#f8f8f8", //
                            width: 80,
                            // marginTop: "5%",
                            // marginLeft: "10%",
                            padding: 8,
                            borderRadius: 5,
                            overflow: "scroll"
                        }}></TextInput> */}
					</View>
				</View>

				<TouchableOpacity
					onPress={() => {
						try {
							stripe
								.createToken({
									card: {
										number: parseInt(cardNum),
										exp_month: parseInt(date.split("/")[0]),
										exp_year: parseInt(date.split("/")[1]),
										cvc: parseInt(cvv),
									},
								})
								.then((res) => {
									//   console.log(res)
									setCardId(res.id);
									fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/setStripeID", {
										method: "PUT",
										body: JSON.stringify({
											description: firstName,
											stripeToken: res.id,
											user_id: userId,
										}),
									}).then((dat) => {
										fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/addUserInfo", {
											method: "POST",
											body: JSON.stringify({
												user_id: userId,
												first_name: firstName,
												last_name: lastName,
												addressLine1: addressLine1,
												addressLine2: addressLine2,
												city: city,
												state: state,
												zipCode: "70118",
												addressType: "Type",
											}),
										}).then((res) => {
											console.log(JSON.stringify(res));
											res.json().then((data) => {
												console.log(data);
												if (data.success) {
													fetch(
														"https://us-central1-saymile-a29fa.cloudfunctions.net/api/getStripeID",
														{
															method: "POST",
															body: JSON.stringify({ user_id: userId }),
														}
													).then((res) => {
														res.json().then((dataID) => {
															console.log(dataID, " user stripe id return checkout ");
															dispatch(setSelectedAddress(addressObj));
															dispatch(updateUser({ user_stripe_id: dataID.user_stripe_id }));
															dispatch(addUserCard(dataID, cardId))// CARDS NOT GETTING SAVED ON FIRST
															alert("User successfully created!");
															navigation.pop(3);
														});
													});
												}
											});
										});
									});
								})
								.catch((err) => {
									console.log(err);
									alert("There was a problem adding your card!" + err);
								});
						} catch (err) {
							console.log("error" + err);
						}
					}}
					style={styles.getCode}>
					<Button title={buttonText} style={styles.getCodeText} />
				</TouchableOpacity>
				<Text>
					{
						("\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"\n",
						"x")
					}
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	row3: {
		marginTop: "8%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		// paddingLeft: "5%"
	},
	phoneNumberInput: {
		backgroundColor: "#f8f8f8", //
		width: "93%",
		// width: 330,
		// marginTop: "5%",
		// marginLeft: "10%",
		padding: 8,
		borderRadius: 5,
		overflow: "scroll",
	},
	row1: {
		marginTop: "20%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		// paddingRight: "15%"
	},
	row2: {
		marginTop: "8%",
		// width: "100%",
		display: "flex",
		// flex: 1,
		flexDirection: "row",
		// justifyContent: "space-between",
		paddingLeft: "5%",
	},
	row1View: {},
	heading: {
		fontWeight: "bold",
		fontSize: 18,
		marginTop: "15%",
		marginLeft: "10%",
	},
	mobile: {
		fontWeight: "bold",
		fontSize: 16,
		marginTop: "5%",
		marginBottom: "10%",
		marginLeft: "10%",
	},
	mobileInput: {
		backgroundColor: "#f8f8f8",
		width: "80%",
		marginLeft: "10%",
		padding: 8,
		borderRadius: 5,
	},
	getCode: {
		// marginLeft: "10%",
		marginTop: "10%",
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 20,
		paddingRight: 20,

		borderColor: "#64bacb",
		borderWidth: 1,
		borderRadius: 50,
		backgroundColor: "#64bacb",
		width: "70%",
		color: "white",
		alignSelf: "center",
		alignItems: "center",
	},
	getCodeText: {
		color: "white",
		fontWeight: "bold",
	},
	verifyInput: {
		backgroundColor: "#f8f8f8", //
		width: 150,
		// marginTop: "5%",
		// marginLeft: "10%",
		padding: 8,
		borderRadius: 5,
		overflow: "scroll",
	},
	verifyCode: {
		fontWeight: "bold",
		fontSize: 16,
		// marginTop: "10%",
		// marginLeft: "10%"
	},
});

export default CheckoutForm;
