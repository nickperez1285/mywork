import React, { createContext, useState, useEffect, useContext } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, TextInput, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import {
	getStores,
	getLocation,
	setUser,
	setUserInfo,
	setUserID,
	clearUser,
	getUser,
	getUserID,
	getUserStripeID,
	setUserStripeID,
	addUserAddress,
	getAllAddresses,
	getAllOrders,
	getQuote,
	addUserInfo,
} from "../actions/index";
import AllAddressDrop from "../components/AllAddressDrop";
// REGISTERED USERS HAVE ID, SIGNED IN HAVE ID AND STRIPE ID
const ZipSearch = (props) => {
	const dispatch = useDispatch();

	const [state, setState] = useState({
		zip: "",
		data: "",
		located: false,
		isFetching: false,
	});

	const [zip, setZip] = useState({
		key: "",
	});

	const [located, setLocated] = useState(false);
	const [stored, setStored] = useState(false);

	const handleText = (val) => {
		setZip({
			// key: val,
			key: val,
		});
		setState({
			located: true,
		});
	};
	const user = useSelector((u) => u.userReducer);
	const userID = useSelector((u) => u.userReducer.user_ID);
	const setLocation = (e) => {
		// console.log(user)
		// console.log(user.allAddresses.length)
		// 	// INITIALIZE STORE DATA
		dispatch(getUser(user.user_ID));
		// console.log(JSON.stringify(user))
		// props.getLocation(zip.key)
		// props.getStores(zip.key)
		props.getStores(70118);
		props.getLocation(70118);

		state.located ? props.navigation.navigate("Home") : alert("Please enter valid zip ");
	};

	// 	const [loggedin, setLoggedin] = useState(false)

	// 	// temp info
	const login = () => {
		// dispatch(getAllAddresses("yN2VHdrFRTvkJeHwPvMZ"))
		// dispatch(clearUser())
		// console.log(props)
		// console.log(props.store.orderReducser.delivery_id)
		dispatch(getUserID());
		dispatch(getUserStripeID());
		// console.log(user.user_ID)
		// dispatch(getUser("yN2VHdrFRTvkJeHwPvMZ"))
		// dispatch(setUserID("CehooHRXxMhdwTCDHWqllEnWfcl2"))
		// dispatch(setUserStripeID("cus_IMn7iejJtvEZbR"))
		// dispatch(addUserAddress({addressLine1: "3040 Rivera Dr. ",
		// 		addressLine2: 'a' ,
		// 		city: 'burlingame' ,
		// 		first_name: 'nick',
		// 		last_name: 'peres' ,
		// 		state: 'ca' ,
		// 		addressType: "billing",
		// 		zipCode: "94010" ,
		// 		user_id: "yN2VHdrFRTvkJeHwPvMZ",
		// 		phone: "6502742567"}))
		// // // .
		// AsyncStorage.clear()
		// let st = {"store_address":{"store_street_address":"861 Masonic Ave","store_city":"SAn francisco ","store_phone_number":"(650) 930-0376‬","store_state":"cA"}}
		// dispatch(getQuote(st, user ,{user_stripe_id:"cus_IBypu0TU00YWwP"}))
		// let ca = {
		// 	"addressLine1": "3040 RIvera dr. ",
		// 	"addressLine2": "apt 202",
		// 	"addressType": "Home",
		// 	"city": "Burlingame",
		// 	"state": "ca",
		// 	"zipCode": "94010",
		//   }
		//   dispatch(getQuote(st, ca ,user.user_stripe_id) )
		// dispatch(getAllAddresses("yN2VHdrFRTvkJeHw
	};

	// 	const logout = () => {
	// 		// dispatch(clearUser())
	// 	}

	const toggleLogin = () => {
		// loggedin ?  logout():login()
		login();

		// setLoggedin(!loggedin)
	};

	useEffect(() => {
		props.getStores(70118);
		props.navigation.navigate("Home");
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.tempBTN}>
				<Text>{/* <Button
						title= {userID ? "I" : "O"}
						onPress={() => {
							toggleLogin()
						}}
					/> */}</Text>
			</View>
			{/* <Text style={styles.h2}>Enter 70118 to begin</Text> */}
			<TextInput
				name="zip"
				style={styles.input}
				onChangeText={handleText}
				// value={zip.key}
				value={zip.key}
				placeholder="enter zipcode"
			/>

			<Button title="ZIPCODE" onPress={setLocation} />

			<Image source={require("../../assets/img/location.png")} />
		</View>
	);
};

const styles = StyleSheet.create({
	tempBTN: {
		alignItems: "center",
		bottom: 120,
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		height: 40,
		width: 100,
		borderColor: "gray",
		borderWidth: 1,
	},
	h1: {
		fontSize: 20,
		fontFamily: "Avenir",
		fontStyle: "normal",
		fontWeight: "normal",
		height: 41,
		width: "100%",
		top: 19,
		color: "#8E8E8E",
		left: 70,
		marginBottom: 20,
	},
	// zipIcon: {
	//     flex: 3,
	//     flexDirection: "column",
	//     width: "20%",
	// }
});

const mapStateToProps = (store) => {
	return {
		store,
	};
};
export default connect(null, {
	getStores,
	getLocation,

	getUser,
})(ZipSearch);
