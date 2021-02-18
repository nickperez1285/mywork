import React, { Component, useState, useEffect } from "react";
import { Button, View, TextInput, StatusBar, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
const AuthStack = createStackNavigator();
import Signup from "./SignupScreen";
import Login from "./LoginScreen";
import {
	getUser,
	getUserCards,
	clearUser,
	getUserStripeID,
	getUserID,
	setUserID,
	getAllOrders,
	clearOrders,
	logOut,
} from "../actions/index";
import { connect, useSelector, useDispatch } from "react-redux";
import AddressesScreen from "./AddressesScreen";
import CardsScreen from "./CardsScreen";
import { Container, Header, Content, Icon, List, ListItem, Text, Right, Left } from "native-base";
import * as ImagePicker from "expo-image-picker";
import Axios from "axios";
import { purgeStoredState } from "redux-persist";
import { getUserToken, saveUserToken, removeUserToken } from "../actions/auth";

class ProfileScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses: [],
			orders: [],
			init: false,
			loggedIn: false,
			profileUri: "",
		};
		this.importAddresses = this.importAddresses.bind(this);
		this.importOrders = this.importOrders.bind(this);
		this.pickImage = this.pickImage.bind(this);
		this.image = null;

		this.signOut = this.signOut.bind(this);
		this.checkID = this.checkID.bind(this);
		this.loginHandler = this.loginHandler.bind(this);
		console.log(this.props.user);
		if (this.props.user.user_ID) {
			console.log(this.props.user.user_ID, "id");
			Axios.get(
				"https://us-central1-saymile-a29fa.cloudfunctions.net/api/downloadDataViaURL/" + this.props.user.user_ID
			).then((res) => {
				this.setState({ profileUri: res.data });
			});
		}
	}

	checkID(path) {
		this.props.global.authReducer.token
			? this.props.navigation.navigate(path)
			: this.props.navigation.navigate("SignIn", { routeName: path });
	}

	signOut() {
		Alert.alert("", "Would you like to sign out?", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{
				text: "OK",
				onPress: async () => {
					await this.props.logOut();
					await this.forceUpdate();
				},
			},
		]);
		this.props.navigation.push("Home");
	}
	importAddresses() {
		if (this.props.user.user_ID) {
			if (this.props.global.userReducer.customer_addresses.length < 1) {
				this.props.getUser();
			}
		}

		this.checkID("Addresses Screen");
	}

	importOrders() {
		if (this.props.global.userReducer.user_stripe_id) {
			this.props.getAllOrders(this.props.global.userReducer.user_stripe_id);
			this.setState({ ...this.state, orders: this.props.global.orderReducer.orderedItems });
		}
	}

	pickImage() {
		if (Platform.OS !== "web") {
			ImagePicker.requestCameraRollPermissionsAsync().then((res) => {
				const { status } = res;
				if (status !== "granted") {
					alert("Sorry, we need camera roll permissions to make this work!");
				}

				ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [4, 3],
					quality: 0.2,
				}).then((res) => {
					console.log(res);
					let formdata = new FormData();
					var uri = Platform.OS === "android" ? res.uri : res.uri.replace("file://", "");
					this.setState({ profileUri: res.uri });
					this.updateUser({ profile_image: res.uri });
					var filename = res.uri.split("/");
					filename = this.user.user_ID + ".jpg";
					//   console.log({
					// 	uri: uri,
					// 	type: res.type,
					// 	name: filename
					// })
					formdata.append("file", {
						uri: uri,
						type: res.type,
						name: filename,
					});
					formdata.append("field", "CehooHRXxMhdwTCDHWqllEnWfcl2");
					Axios.post("https://us-central1-saymile-a29fa.cloudfunctions.net/api/addProfileImage", formdata, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}).then((res) => {
						//   console.log(res)
					});
				});
			});
		}
	}

	loginHandler() {
		if (this.props.global.authReducer.token !== "") {
			this.signOut();
		} else {
			this.props.navigation.navigate("SignIn");
		}
		this.forceUpdate();

		// this.props.logOut();
	}

	componentDidMount() {
		// this.props.clearUser();
		// this.props.clearOrders();
		// this.props.setUserID("i8h9zQDg0zYMwSU0IRHfBqQp9qj2");
		if (!this.props.user.user_ID || !this.state.init) {
			this.props.getUser();
			this.setState({ init: true, loggedIn: this.props.user.loggedIn });
		}
		// this.props.saveUserToken({
		// 	expiresIn: "3600",
		// 	idToken:
		// 		"eyJhbGciOiJSUzI1NiIsImtpZCI6ImI5ODI2ZDA5Mzc3N2NlMDA1ZTQzYTMyN2ZmMjAyNjUyMTQ1ZTk2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2F5bWlsZS1hMjlmYSIsImF1ZCI6InNheW1pbGUtYTI5ZmEiLCJhdXRoX3RpbWUiOjE2MDc1MTM5NjksInVzZXJfaWQiOiJLN0QwbnlQd1JJWTlPeWU2UDlzTTVlYVNvbUgyIiwic3ViIjoiSzdEMG55UHdSSVk5T3llNlA5c001ZWFTb21IMiIsImlhdCI6MTYwNzUxMzk2OSwiZXhwIjoxNjA3NTE3NTY5LCJwaG9uZV9udW1iZXIiOiIrMTY1MDM5ODY4MzAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisxNjUwMzk4NjgzMCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.NZj2N50zAt9gB6jcJlcUpJdtu6HVujv0zARoKVEvtgsmB54vcpE-5W7PO4QUOjNHrlZZoVQu325indPMcS517vwPcKOMmBrGmxqfnsMAROpQzvVVfxx4wGEsIT2THs4QEhvU3cHxH-3MfN0dsJSNzUmL3XYt8PbwFsKO-rYTIQhgMD2W05Q0hm-TfUwIvMgI1VlNI23-z8OoEgD9e9AfnSpRPhNGrIJ0ZnBRYA1Holzi0NWwHJM1LVZEnQ3FONQsGnzqpqAE4E5qQ3lH4WvGKv_x33I7ZIIJpqiJwq5aKPzn-TuteECuOyY5lNV_kikejWuZArqjPI-deC78wfsnRA",
		// 	isNewUser: false,
		// 	localId: "K7D0nyPwRIY9Oye6P9sM5eaSomH2",
		// 	phoneNumber: "+16503986830",
		// 	refreshToken:
		// 		"AG8BCnedmed444pXbSxatE1wWxmxjlFsVSU7gqlbja-i8_ByEvTrOSEo2KloWm_xcwhM3GClvSZp-yf0uWSB0PmIdlTamZs7Z5A6BF9s_xr6xnzc97xGO6napC0SulYeoUpx_DTyk6t7j5dJBAlAlicguuzpkLaUjXiFzJRgmukHr4j3AhD-r4e8FAKt3Ft95rq0q5KG37tv",
		// });
	}

	componentDidUpdate() {}

	// if (this.props.user.loggedIn != this.state.loggedIn) {
	// 	console.log("not logged in");
	// 	this.setState({ loggedIn: this.props.user.loggedIn });
	// }

	// shouldComponentUpdate(nextProps, nwxtState) {
	//  if (this.props.global.authReducer!= this.props.global.userReducer) {
	// 	// 	console.log(this.props.user.user_ID);
	// 	// 	return true;
	// 	// }
	// }

	componentWillUnmount() {
		// this.forceUpdate();

		console.log("unmounting");
	}

	render() {
		var bgColor = "#DCE3F4";

		return (
			<View style={{ backgroundColor: "#7bbfff", flex: 1 }}>
				{/* <Button title="test" onPress={console.log(this.state.profileUri)}/> */}

				<View style={styles.header}>
					<TouchableOpacity onPress={() => this.pickImage()} style={{ height: 95, marginLeft: "2%" }}>
						{this.state.profileUri === "" || typeof this.state.profileUri === undefined ? (
							<Image
								style={{ height: "95%", width: 90, borderRadius: 100, resizeMode: "contain" }}
								source={require("../../assets/img/person.png")}
							/>
						) : (
							<Image
								style={{ height: "95%", width: 90, borderRadius: 100, resizeMode: "stretch" }}
								source={{ uri: this.state.profileUri }}
							/>
						)}
					</TouchableOpacity>
					<View style={styles.name}>
						{this.props.user ? (
							<Text style={styles.sectionText}>
								{this.props.user.first_name + " " + this.props.user.last_name + "\n"}
							</Text>
						) : (
							console.log("no user found")
						)}

						{/* {this.props.user && this.props.global.orderReducer.orderedItems ? (
							<Text style={{ top: 10, fontSize: 18, color: "black" }}>
								{"\n" + this.props.global.orderReducer.orderedItems.length + "  x  "}
								<Icon
									ios="ios-menu"
									android="md-menu"
									style={{ top: 20, fontSize: 30, color: "black" }}
								/>
							</Text>
						) : (
							<Text>{"\n 0"}</Text>
						)} */}
					</View>
				</View>
				<View style={{ top: 50 }}>
					<List>
						<ListItem style={styles.sections} onPress={() => this.loginHandler()}>
							<Left>
								<Text style={styles.sectionText}>{this.props.global.authReducer.token !== "" && "SIGN OUT"}</Text>

								<Text style={styles.sectionText}>
									{this.props.global.authReducer.token === "" && "SIGN UP/SIGN IN"}
								</Text>
							</Left>
							<Right>
								<Icon active name="arrow-forward" />
							</Right>
						</ListItem>
						<ListItem
							style={styles.sections}
							onPress={() => {
								this.importAddresses();
							}}>
							<Left>
								<Text style={styles.sectionText}> Addresses </Text>
							</Left>
							<Right>
								<Icon active name="arrow-forward" />
							</Right>
						</ListItem>

						<ListItem style={styles.sections} onPress={() => this.checkID("Card Screen")}>
							<Left>
								<Text style={styles.sectionText}> Payment Methods</Text>
							</Left>
							<Right>
								<Icon active name="arrow-forward" />
							</Right>
						</ListItem>
						{/* <SettingsList.Item
								title="  PAYMENT METHODS "
								titleInfoStyle={styles.titleInfoStyle}
								onPress={() => this.props.navigation.navigate("Card Screen")}
							/> */}

						<ListItem style={styles.sections} onPress={() => this.checkID("Order Tracking")}>
							<Left>
								<Text style={styles.sectionText}> Order Tracking</Text>
							</Left>
							<Right>
								<Icon active name="arrow-forward" />
							</Right>
						</ListItem>

						{/* <ListItem onPress={() => this.checkID("Order History")}>
							<Left>
								<Text> ORDERS</Text>
							</Left>
							<Right>
								<Icon active name="arrow-forward" />
							</Right>
						</ListItem> */}

						{/* <ListItem onPress={() => this.props.navigation.navigate("Card Screen")}>
							<Left>
								<Text> REWARDS</Text>
							</Left>
							<Right>
								<Icon active name="arrow-forward" />
							</Right>
						</ListItem> */}
					</List>
				</View>
			</View>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	const global = state;
	const user = state.userReducer;
	return { global, user };
};

export default connect(mapStateToProps, {
	getUser,
	getUserCards,
	clearUser,
	getUserID,
	getUserStripeID,
	setUserID,
	getAllOrders,
	clearOrders,
	logOut,
	getUserToken,
	saveUserToken,
	removeUserToken,
})(ProfileScreen);

const styles = StyleSheet.create({
	sections: { borderBottomWidth: 1 },
	sectionText: { color: "#2c7bbf", fontWeight: "bold" },
	name: {
		justifyContent: "center",
		margin: 20,
		justifyContent: "space-between",
		color: "#2c7bbf",
		fontWeight: "bold",
	},
	container: {
		position: "absolute",
		width: 234,
		height: 40,
		top: 182,
		left: 102,
		lineHeight: 28.13,
		fontSize: 24,
	},
	header: {
		flexDirection: "row",
		top: 30,
	},
	title: {
		position: "absolute",
		width: 234,
		height: 40,
		top: 448,
		fontSize: 24,
		lineHeight: 28,
	},
	rectangle: {
		width: 272,
		height: 52,
		top: 293,
		left: 64,
		position: "absolute",
	},
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
