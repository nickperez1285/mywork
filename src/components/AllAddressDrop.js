import React, { useState, useRef, useEffect, Component } from "react";

import { Field, reduxForm } from "redux-form";
import {
	View,
	Text,
	TextInput,
	StatusBar,
	StyleSheet,
	Alert,
	TouchableOpacity,
	ScrollView,
	Button,
	SafeAreaView,
	BackHandler,
} from "react-native";
import { connect, useSelector, useDispatch } from "react-redux";
import {
	setSelectedAddress,
	// getcustomer_addresses,
	addUserAddress,
	getQuote,
	getAllOrders,
	getUser,
} from "../actions/index.js";
import DropDownPicker from "react-native-dropdown-picker";
import { store } from "../../persist.js";
import { add } from "react-native-reanimated";

// *** ADDS ADDRESS TO SELECTED ADDRESS IN REDUCER
const AllAddressDrop = (props) => {
	const dispatch = useDispatch();

	const userStripe = useSelector((u) => u.userReducer.user_stripe_id);
	const user = useSelector((u) => u.userReducer);
	const [allAddddreses, setAllAddresses] = [];
	const { customer_addresses } = useSelector((s) => s.userReducer);
	const fetchState = () => {
		dispatch(getUser()).then((
			res // GETs ALL OF USERS ADDERESSES
		) =>
			res.customer_addresses.length > 0
				? setAllAddresses(customer_addresses)
				: setAllAddresses({
						addressLine1: "Please Add   Address",
						addressLine2: "..",
						city: "..",
						state: "..",
						zipCode: "..",
						addressType: "none",
				  })
		);
	};

	const handleAddress = (dropaddress) => {
		const store_address = props.storeAddress;
		dispatch(setSelectedAddress(dropaddress));
		console.log(store_address, " store address in all address drop");

		dispatch(getQuote(store_address, dropaddress, userStripe));
	};

	useEffect(() => {
		if (allAddddreses < 1) {
			fetchState();
		}
	}, [user, customer_addresses]);

	return (
		<View>
			<DropDownPicker
				items={customer_addresses.map(({ state, addressLine1, addressLine2, city, zipCode, addressType }) => ({
					label: `${addressLine1},${city},${state},${zipCode}`,
					value: {
						addressType: addressType,
						addressLine1: addressLine1,
						addressLine2: addressLine2,
						city: city,
						state: state,
						zipCode: zipCode,
					},
				}))}
				placeholder={"SELECT ADDRESS"}
				selectedLabelStyle={{
					color: "white",
					width: "80%",
					flexWrap: "wrap",
					fontSize: 16,
					fontWeight: "bold",
					width: "95%",
				}}
				containerStyle={{
					backgroundColor: "#f5f5f5",
					// top: "20%",
					height: "80%",
					// width: "100%",
					backgroundColor: "#7bbfff",
					fontColor: "white",
					color: "white",
					// borderWidth: 2,
					borderRadius: 25,
					// borderColor: "#f5f5f5",
					alignSelf: "center",
					alignContent: "center",
					alignItems: "center",
				}}
				style={{
					borderColor: "white",
					width: "100%",
					height: "100%",
					backgroundColor: "f5f5f5",
					alignItems: "center",
					alignContent: "center",
					fontColor: "white",
				}}
				itemStyle={{
					fontColor: "white",

					flexWrap: "wrap",
					// width: "100%",
					alignSelf: "center",
					alignItems: "center",
					alignContent: "center",
					borderBottomColor: "#f5f5f5",
					borderBottomWidth: 1,
				}}
				dropDownStyle={{
					borderRadius: 25,
					alignSelf: "center",
					zIndex: 1000,
					// width: "80%",

					backgroundColor: "white",
					width: "95%",
					height: "150%",
				}}
				onChangeItem={(item) => {
					handleAddress(item.value);
				}}
			/>
		</View>
	);
};
const mapStateToProps = (global) => {
	return global;
};
export default connect(mapStateToProps, { getQuote })(AllAddressDrop);
