import React, { useEffect, useState } from "react";
import { Field, reduxForm } from "redux-form";
import { View, TextInput, StatusBar, StyleSheet, Button, FlatList, Keyboard, TouchableOpacity } from "react-native";

import { connect, useSelector, useDispatch } from "react-redux";
import { setSelectedAddress, addUserAddress, getUserID, getUser } from "../actions/index.js";
import {
	Item,
	Text,
	Label,
	CheckBox,
	Body,
	Right,
	CardItem,
	Separator,
	Card,
	Content,
	Container,
	Left,
} from "native-base";
import { sub } from "react-native-reanimated";
import { InfoWindow } from "google-maps-react";
import { initState } from "../reducers/location.js";
import { store } from "../../persist.js";
import { colors } from "react-native-elements";
const submit = (info) => {
	const id = store.getState().userReducer.user_ID;
	// const user = store.getState().userReducer;
	console.log(info);
	if (info.length != 6) {
		store.dispatch(
			addUserAddress({
				addressLine1: info.addressLine1,
				id: id,
				addressLine2: info.addressLine2,
				city: info.city,
				state: info.state,
				zipCode: info.zipCode,
			})
		);
		// ).then (res=> res !== undefined? reset(): null)

		// props.navigation.navigate("HOME SCREEN");
	} else {
		alert("FILL OUT ALL FIELDS");
	}
};

const renderInput = ({ input: { onChange, ...restInput } }) => {
	return <TextInput style={styles.field} onChangeText={onChange} {...restInput} />;
};

const AddressForm = (props) => {
	const dispatch = useDispatch();

	const allAddresses = useSelector((s) => s.userReducer.customer_addresses);
	const [state, setState] = useState({ ready: false });
	const user = useSelector((u) => u.userReducer);
	const id = useSelector((s) => s.userReducer.user_ID);

	const initState = () => {
		// IF COMPONENT STATE IS EMPTY, GET USER INFO
		dispatch(getUser());
		setState({ addresses: user.customer_addresses, ready: true });
	};
	useEffect(() => {
		!state.ready ? initState() : null;
	}, [user.customer_addresses, user.user_ID]);

	const select = (i) => {
		dispatch(setSelectedAddress(i));
		console.log(i, user.addressLine1);
	};

	const { handleSubmit } = props;

	const renderItem = ({ item }) => {
		// console.log('Item 	props', item)
		return (
			<View style={{ flex: 1, alignContent: "flex-end", backgroundColor: "#7bbfff", margin: "1%" }}>
				{/* <TouchableOpacity onPress={dispatch(setSelectedAddress(item))}> */}
				<Card
					style={{
						justifyContent: "center",
						height: "90%",
						borderRadius: 25,
						alignContent: "center",
						backgroundColor: "rgba(180, 180, 180, 0.4)",
					}}>
					<Left
						style={{
							// width: "80%",
							fontWeight: "bold",
							paddingTop: 10,
							margin: 10,
							// borderWidth: 2,
							justifyContent: "flex-end",
							alignContent: "center",
							// flex: 1,
							alignSelf: "flex-start",
						}}>
						<Text style={styles.row2}> Address1: {item.addressLine1}</Text>
						<Text style={styles.row2}> APT/Dorm #: {item.addressLine2 || ""}</Text>
						<Text style={styles.row2}> City : {item.city}</Text>
						<Text style={styles.row2}> State : {item.state}</Text>
						<Text style={styles.row2}> ZipCode : {item.zipCode}</Text>
					</Left>

					<Right
						style={{
							flex: 1,
							width: "50%",
							fontWeight: "bold",
							margrinRight: 10,
							justifyContent: "center",
							color: "#7bbfff",

							bottom: "50%",
							right: "5%",
							alignSelf: "flex-end",
						}}>
						<Text>
							<CheckBox checked={item == user.selectedAddress} onPress={() => select(item)} color="#7bbfff" />
						</Text>
					</Right>
				</Card>
			</View>
		);
	};

	return (
		<Container style={styles.primary}>
			<View
				style={{
					flex: 6,
					borderRadius: 25,
					borderWidth: 3,
					margin: 10,
					padding: 5,
					borderColor: "#2c7bbf",
					color: "#2c7bbf",

					paddingBottom: "6%",
				}}>
				<View style={styles.item}>
					<Label stackedLabel style={styles.label}>
						Street Address
					</Label>
					<Field style={styles.field} name="addressLine1" component={renderInput} />
				</View>

				<View style={styles.item}>
					<Label stackedLabel style={styles.label}>
						APT/Dorm #:
					</Label>
					<Field style={styles.field} name="addressLine2" component={renderInput} />
				</View>
				<View style={styles.item}>
					<Label stackedLabel style={styles.label}>
						City
					</Label>
					<Field style={styles.field} name="city" component={renderInput} />
				</View>

				<View style={styles.item}>
					<Label stackedLabel style={styles.label}>
						State
					</Label>
					<Field style={styles.field} name="state" component={renderInput} />
				</View>

				<View style={styles.item}>
					<Label note stackedLabel style={styles.label}>
						ZipCode
					</Label>
					<Field style={styles.field} name="zipCode" component={renderInput} />
				</View>
				<TouchableOpacity
					style={{
						borderWidth: 2,
						borderRadius: 20,
						backgroundColor: "white",
						// flexShrink: 2,
						top: 2,
						height: "12%",
						width: "25%",
						alignContent: "center",
						alignSelf: "center",
						justifyContent: "center",
						borderColor: "#2c7bbf",
						// margin: 5,
					}}
					onPress={handleSubmit(submit)}>
					<Text style={{ alignSelf: "center", color: "#2c7bbf", justifyContent: "center", fontSize: 16 }}> SAVE</Text>
				</TouchableOpacity>
			</View>

			{/* <AllAddressDrop /> */}

			<View
				style={{
					flex: 7,
					justifyContent: "flex-end",
					borderWidth: 3,
					borderColor: "#2c7bbf",
					borderRadius: 25,
					margin: 10,
					padding: 5,
				}}>
				<FlatList
					data={allAddresses}
					renderItem={renderItem}
					keyExtractor={(item) => {
						item;
					}}
					horizontal={false}
					// style={{ borderWidth: 2, flex: 3, }}
				/>
			</View>
		</Container>
	);
};
const mapStateToProps = (global, props) => ({
	// initialValues: global.userReducer.allAddresses, // retrieve name from redux store
});

export default connect(mapStateToProps)(
	reduxForm({
		form: "address", // a unique identifier for this form
		enableReinitialize: false,
	})(AddressForm)
);

const styles = StyleSheet.create({
	item: {
		alignSelf: "center",
		width: "90%",
		borderBottomWidth: 2,
		borderBottomColor: "#d5d5d5",
		height: "19%",
		flexDirection: "column",
	},
	label: {
		fontSize: 12,
		color: "#2c7bbf",
		fontWeight: "bold",
		// marginBottom: "6%",
		height: "30%",
		// borderWidth: 2,s
	},
	field: {
		backgroundColor: "#7bbfff",
		width: "95%",
		// height: 30,
		// borderWidth: 2,
		height: "50%",

		alignSelf: "center",
		// alignItems: "center",
		// marginTop:20
		fontSize: 16,
	},

	primary: {
		display: "flex",
		flex: 1,
		width: "100%",
		height: "90%",
		backgroundColor: "#7bbfff",
		// borderWidth: 2,
		// borderRadius: 25,

		// justifyContent:'center',
		// alignItems: "center",
		flexDirection: "column",
	},
	list: {
		width: "100%",
		height: 100,
		backgroundColor: "rgba(180, 180, 180, 0.4)",
		// borderWidth: 2,
		margin: 10,
		padding: 5,
	},

	row: {
		flexDirection: "row",
		color: "#2c7bbf",
		borderColor: "#2c7bbf",
		borderWidth: 1,
		width: "90%",
		fontSize: 18,
		backgroundColor: "#7bbfff",
	},
	row2: {
		width: "100%",
		fontSize: 12,
		color: "#2c7bbf",
		fontWeight: "bold",
		padding: 2,
	},
});
