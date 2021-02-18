import React, { useState, useRef, useEffect } from "react";
import { StackActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-community/async-storage";
// import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { Text, StatusBar, StyleSheet, View, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	FirebaseRecaptchaVerifierModal,
	FirebaseRecaptchaVerifier,
	FirebaseRecaptcha,
} from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserID, updateUser, clearUser, setUserStripeID } from "../actions/index";
import { saveUserToken } from "../actions/auth";

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

const VerifyCode: () => React$Node = ({ navigation, route }) => {
	const dispatch = useDispatch();
	const recaptchaVerifier = useRef(null);
	const [phoneNumber, setPhoneNumber] = useState();
	const [buttonText, setButtonText] = useState("Verify Code");

	const [userCode, setUserCode] = useState();
	const [enableMobileInput, setEnableMobileInput] = useState(true);
	const [firebaseData, setFirebaseData] = useState();

	// const popAction = StackActions.pop(2);
	const popAction = StackActions.pop(2);
	var screenLoad = false;
	return (
		<View>
			<View>
				<Text style={styles.verifyCode}>Verify Code</Text>
				<TextInput
					onChangeText={(val) => setUserCode(val)}
					autoCompleteType="tel"
					keyboardType="phone-pad"
					textContentType="telephoneNumber"
					style={styles.verifyInput}></TextInput>
			</View>
			<TouchableOpacity
				onPress={() => {
					try {
						fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/verifyCode", {
							method: "POST",
							body: JSON.stringify({
								verificationCode: userCode,
								sessionInfo: route.params.sessionInfo,
							}),
						}).then((data) =>
							data.json().then((res) => {
								if (!res.error) {
									console.log(res, " verify code res");
									setFirebaseData(res);
									dispatch(saveUserToken(res, res.isNewUser))

									if (res.isNewUser) {
										navigation.navigate("Checkout Form", {
											data: res,
										});
									} else {
										navigation.dispatch(popAction)
								} }
								else {
									console.log("Login failed!");
									alert("login failed")
								}
							
							}))
					} catch (err) {
						console.log("error" + err);
					}
				}}
				style={styles.getCode}>
				<Text style={styles.getCodeText}>{buttonText}</Text>
			</TouchableOpacity>
		</View>
		// </View>
	);
};

const styles = StyleSheet.create({
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
		backgroundColor: "#f8f8f8",
		width: "80%",
		marginTop: "5%",
		marginLeft: "10%",
		padding: 8,
		borderRadius: 5,
	},
	verifyCode: {
		fontWeight: "bold",
		fontSize: 16,
		marginTop: "10%",
		marginLeft: "10%",
	},
});

export default VerifyCode;
