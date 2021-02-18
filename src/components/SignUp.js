import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
// import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { Text, StatusBar, StyleSheet, View, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	FirebaseRecaptchaVerifierModal,
	FirebaseRecaptchaVerifier,
	FirebaseRecaptcha,
} from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import axios from "axios";

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

const SignUp: () => React$Node = ({ navigation }) => {
	const recaptchaVerifier = useRef(null);
	const [phoneNumber, setPhoneNumber] = useState();
	const [token, setToken] = useState();
	const [sessionInfo, setSessionInfo] = useState(null);
	const [askVerify, setAskVerify] = useState(false);
	const [buttonText, setButtonText] = useState("Get Code");
	const [enableMobileInput, setEnableMobileInput] = useState(true);
	const [userCode, setUserCode] = useState();
	var screenLoad = false;
	useEffect(() => {
		if (askVerify) {
			// setButtonText("Verify Code")
			setEnableMobileInput(false);
			navigation.navigate("VerifyCode", {
				sessionInfo: sessionInfo,
			});
		}
	});

	return (
		<View>
			<FirebaseRecaptchaVerifierModal
				ref={recaptchaVerifier}
				firebaseConfig={firebase.app().options}
			/>
			<Text style={styles.heading}>Sign Up or Sign In</Text>
			<View>
				<Text style={styles.mobile}>Mobile Number</Text>
				<TextInput
					editable={enableMobileInput}
					onChangeText={(val) => setPhoneNumber(val)}
					autoCompleteType="tel"
					keyboardType="phone-pad"
					textContentType="telephoneNumber"
					style={styles.mobileInput}></TextInput>
				<TouchableOpacity
					onPress={() => {
						try {
							recaptchaVerifier.current.verify().then((val) => {
								fetch(
									"https://us-central1-saymile-a29fa.cloudfunctions.net/api/requestVerificationCode",
									{
										method: "POST",
										body: JSON.stringify({
											phone_number: "+1" + phoneNumber,
											recaptcha: val,
										}),
									}
								).then((data) =>
									data.json().then((res) => {
										Alert.alert(
											"Code Sent",
											"A Verification code has been sent to " + phoneNumber,
											[
												{
													text: "Ok",
													onPress: () => {
														setAskVerify(true);
													},
												},
											],
											{ cancelable: false }
										);
										setSessionInfo(res.sessionInfo);
									})
								);
							});
						} catch (err) {
							console.log("error" + err);
						}
					}}
					style={styles.getCode}>
					<Text style={styles.getCodeText}>{buttonText}</Text>
				</TouchableOpacity>
			</View>
		</View>
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

export default SignUp;
