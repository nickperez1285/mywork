import React, { useEffect, useState, useCallback } from "react";
import {
	Text,
	StatusBar,
	StyleSheet,
	View,
	SafeAreaView,
	TextInput,
	Button,
	ScrollView,
	Dimensions,
	FlatList,
	Linking,
} from "react-native";
import OrderCard from "./orderCard";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { getUserID, getUserStripeID, getUser } from "../actions/index";
import { userReducer } from "../reducers/user";
import AsyncStorage from "@react-native-community/async-storage";
// 	const checkID = ()=> {dispatch(getUser(), setState({...state,idCheck:true})
// user_stripe_id available in route.params.user_stripe_id
var supportedUrl = "https://qrscanner-gamma.vercel.app/";
const TrackAllOrders: (props) => React$Node = ({ navigation, route }) => {
	const greyEllipse = require("../../assets/img/Ellipse47.png");
	const truck = require("../../assets/img/icons8-truck.png");
	const [allOrders, setAllOrders] = useState([1, 2, 3, 4, 5, 6, 9]);
	const [gotOrders, setGotOrders] = useState(false);
	const [flatList, setFlastList] = useState(false);
	const [currentStatus, setCurrentStatus] = useState("");
	const [numPreviousOrders, setNumPreviousOrders] = useState(0);

	const [userID, setUserID] = useState("");
	const { user_stripe_id } = useSelector((s) => s.userReducer);
	const { kitchen_delivery_id } = useSelector((s) => s.orderReducer);
	console.log(user_stripe_id);
	var [stripeID, setStripeID] = useState(user_stripe_id);

	// const user_stripe_id= "cus_IMn7iejJtvEZbR"
	// const userID = "CehooHRXxMhdwTCDHWqllEnWfcl2"

	const dispatch = useDispatch();
	// useEffect(() => {
	// 	if (!screenLoaded) {
	// 		AsyncStorage.getItem("USER", (err, res) => {
	// 			console.log(res, "user id");
	// 			const body = JSON.stringify({ user_id: res });
	// 			fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/getUser", {
	// 				method: "POST",
	// 				mode: "cors",
	// 				body: body,
	// 			})
	// 				.then((res) => {
	// 					// console.log("here")
	// 					res.json().then((dat) => {
	// 						// console.log(dat["user_data"]["user_stripe_id"])
	// 						setStripeID(dat["user_data"]["user_stripe_id"]);
	// 					});
	// 				})
	// 				.then(() => {
	// 					console.log(stripeID, "stripeid");

	// 					const dat = JSON.stringify({
	// 						user_stripe_id: stripeID,
	// 					});
	// 					console.log(dat, "data");
	// 					Axios.post("https://us-central1-saymile-a29fa.cloudfunctions.net/api/getDeliveryByStripe", {
	// 						body: dat,
	// 					}).then((res) => {
	// 						console.log("hereraerer");
	// 						console.log(res.data, "was hereraerer");
	// 						setScreenLoaded(true);

	// 						console.log(res.data["deliveries"], "all deliveries");
	// 						var dels = res.data["deliveries"];

	// 						dels = dels.filter((item) => {
	// 							if (item.created) {
	// 								return item;
	// 							}
	// 						});
	// 						dels = dels.sort((a, b) => {
	// 							var dateA = new Date(a.created);
	// 							var dateB = new Date(b.created);
	// 							return dateB - dateA;
	// 						});
	// 						// console.log(dels)
	// 						setAllOrders(dels);
	// 						setGotOrders(true);
	// 					});
	// 				});
	// 		});
	// 	}
	// });

	// console.log(userID)
	// const [screenLoaded, setScreenLoaded] = useState(false);
	// const checkID = () => {
	// 	dispatch(getUser()).then((res) => {
	// 		console.log(res);
	// 		setStripeID(res.user_stripe_id), console.log(res.user_stripe_id, "response");
	// 	});
	// 	return stripeID;
	// };

	// useEffect(() => {
	// 	if (!stripeID) {
	// 		checkID();
	// 		console.log(stripeID, "stripe id ");
	// 	}
	// }, []);

	const getStatus = () => {
		Axios.get(`https://us-central1-saymile-a29fa.cloudfunctions.net/api/getKitchenStatus/${kitchen_delivery_id}`)
			.then((res) => {
				if (res.status == 200) {
					setCurrentStatus(res.data.kitchen_status);
				}
			})
			.catch((err) => console.log(err, "failed to retrieve kitchen status"));
	};
	useEffect(() => {
		if (currentStatus == "" && kitchen_delivery_id) {
			setInterval(getStatus, 1000);
		}
	}, [kitchen_delivery_id]);

	const OpenURLButton = ({ url, children }) => {
		const handlePress = useCallback(async () => {
			// Checking if the link is supported for links with custom URL scheme.
			const supported = await Linking.canOpenURL(url);

			if (supported) {
				// Opening the link with some app, if the URL scheme is "http" the web link should be opened
				// by some browser in the mobile
				await Linking.openURL(url);
			} else {
				Alert.alert(`Don't know how to open this URL: ${url}`);
			}
		}, [url]);

		return <Button title={children} onPress={handlePress} />;
	};

	return (
		<SafeAreaView style={{ display: "flex", flex: 1, backgroundColor: "#7bbfff" }}>
			{/* <Button
				title="update"
				onPress={() => {
					getStatus();
					console.log(kitchen_delivery_id, "delivery id");
				}}
			/> */}
			<View style={{ marginTop: "10%", alignContent: "center", alignItems: "center", backgroundColor: "#7bbfff" }}>
				<Text>
					Order Status:
					<Text style={{ fontWeight: "bold" }}>{currentStatus ? currentStatus : "awaiting status"}</Text>
				</Text>
				<Text>
					Order ID:
					<Text style={{ fontWeight: "bold" }}>{kitchen_delivery_id}</Text>
				</Text>
				<OpenURLButton url={supportedUrl}>Link to Admin Panel /QR scanner</OpenURLButton>
			</View>

			{allOrders.length == 0 && <Text>No orders found!</Text>}

			{allOrders.length > 0 && gotOrders && (
				<FlatList
					// contentInset={0, 0, 0, 0,}
					contentContainerStyle={{ paddingBottom: 100 }}
					refreshing={flatList}
					onRefresh={() => {
						setFlastList(true);
						const dat = JSON.stringify({
							user_stripe_id: stripeID,
						});
						Axios.post("https://us-central1-saymile-a29fa.cloudfunctions.net/api/getDeliveryByStripe", {
							body: dat,
						}).then((res) => {
							// console.log(res.data)
							setScreenLoaded(true);
							// console.log(res.data["deliveries"][1])
							var dels = res.data["deliveries"];

							dels = dels.filter((item) => {
								console.log(item);
								if (item.created) {
									return item;
								}
							});
							dels = dels.sort((a, b) => {
								var dateA = new Date(a.created);
								var dateB = new Date(b.created);
								// console.log(dateA)
								return dateB - dateA;
							});
							// console.log(dels)
							setAllOrders(dels);
							setGotOrders(true);
							setFlastList(false);
						});
					}}
					data={allOrders}
					renderItem={({ item }) => {
						// console.log(item["pickup"], "itemadfadfa")
						// console.log(item)
						if ("pickup" in item) {
							return (
								// <Text>Input</Text>
								<OrderCard
									item={item}
									trackUrl={item["tracking_url"]}
									pickup={item["pickup"]["location"]}
									dropoff={item["dropoff"]["location"]}
									quote_id={item["quote_id"]}
									navigation={navigation}
									orderId={item.order_id}
									truck={truck}
									status={item["order_status"]}
									heading={item["manifest"]["description"]}
									key={item["quote_id"]}
								/>
							);
						}
					}}
					style={{
						height: Dimensions.get("window").height,
						marginBottom: 10,
					}}></FlatList>
			)}
		</SafeAreaView>
	);
};

export default TrackAllOrders;
