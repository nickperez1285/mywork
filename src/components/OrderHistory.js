import React, { Component, useState, useEffect } from "react";
import { Button, FlatList, Image, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Card, Left, Item, CardItem, Icon } from "native-base";
import { useSelector, useDispatch, connect } from "react-redux";
import { reducer } from "redux-form";
import { getUser, getAllOrders, getUserStripeID, getUserID, setCart, setOrderID } from "../actions/index.js";
import { userReducer } from "../reducers/user.js";
import { orderReducer } from "../reducers/order.js";

const OrderHistory = (props) => {
	const dispatch = useDispatch();

	const user = useSelector((u) => u.userReducer);
	const [state, setState] = useState({ orders: [], idCheck: false });
	const [last10, setLast10] = useState([]);
	const [ordersArr, setOrdersArr] = useState([]);
	const checkID = () => {
		dispatch(getUserStripeID()), dispatch(getUserID()), setState({ ...state, idCheck: true });
	};
	const cart = useSelector((c) => c.cartReducer);
	const [initialized, setInitialized] = useState(false);
	const orders = useSelector((s) => s.orderReducer);
	const { orderedItems } = useSelector((s) => s.orderReducer);
	const images = useEffect(() => {
		if (!state.idCheck) {
			checkID();
		}
		if (!initialized && user.user_stripe_id) {
			dispatch(getAllOrders(user.user_stripe_id)).then((res) => {
				setOrdersArr(orderedItems);
				setInitialized(true);
			});
		}
	}, []);

	const [selectedItem, selectItem] = useState([]);
	const toggleSelected = (i) => {
		dispatch(setOrderID(i.order_id));
		props.navigation.navigate("Order Screen");
	};
	let arr = [];

	let renderItem = (item) => {
		// let image = item.images? ,
		return (
			// <View style={styles.card}>
			<Card style={styles.A}>
				<TouchableOpacity onPress={() => toggleSelected(item.item)}>
					<View style={styles.b1}>
						<Text style={{ alignSelf: "center", fontSize: "11%", fontWeight: "bold" }}>
							{item.item.store_address.Brand}
						</Text>
					</View>
					<View style={{ height: 120, width: "25%" }}>
						{item.images ? (
							<Image
								style={styles.img}
								source={{
									uri: item.images,
								}}
							/>
						) : (
							<Image
								style={styles.img}
								source={{
									uri: "https://saymile-images.s3-us-west-1.amazonaws.com/sexycakes+/Sexy+Cakes.png",
								}}
							/>
						)}
					</View>
				</TouchableOpacity>

				<View style={styles.B}>
					<TouchableOpacity onPress={() => toggleSelected(item.item)}>
						<View style={styles.b2}>
							{item.item.items
								? item.item.items.map((it) => {
										return (
											<View key={item.objectID}>
												<Text style={{ fontSize: "12%", fontWeight: "bold" }}> {it.title}</Text>
												<Text note style={{ left: 5, fontSize: "13%", color: "black" }}>
													{"$" + (0.0 + it.price).toFixed(2)}
												</Text>
												<Text note style={{ left: 5, fontSize: "10%", color: "grey" }}>
													{"Quantity:" + it.quantity}
												</Text>
											</View>
										);
								  })
								: null}
						</View>
					</TouchableOpacity>

					{/* <View style={styles.b3}>
						<Icon active name="arrow-forward" />
					</View> */}
				</View>
			</Card>
		);
	};
	return (
		<View style={styles.container}>
			{/* <Button
				title="test"
				onPress={() => {
					console.log(all_orders);
				}}
			/> */}
			<View style={styles.orders}>
				{orders.orderedItems ? (
					<FlatList
						style={{ position: "absolute" }}
						data={orders.orderedItems}
						renderItem={renderItem}
						keyExtractor={(item) => {
							item.order_id;
						}}
						style={styles.container}
					/>
				) : null}
			</View>
		</View>
	);
};

export default connect(null, {})(OrderHistory);
const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1,
		height: "100%",
	},
	orders: {
		position: "absolute",
		height: "100%",
		// backgroundColor: "white",
	},
	A: {
		justifyContent: "flex-start",
		// borderWidth: 1,
		borderColor: "#c8c7cc",
		// position: "absolute",
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "98%",
		backgroundColor: "white",

		height: 150,
		marginTop: "5%",
		marginLeft: "1%",
		marginRight: "2%",

		// position: "absolute",
	},
	B: {
		flex: 3,
		height: "100%",
		flexDirection: "column",
		justifyContent: "space-evenly",
		alignContent: "flex-start",
	},
	b1: {
		fontWeight: "bold",
		backgroundColor: "white",
		justifyContent: "center",
		// alignSelf: "center",
		// left: 5,
		height: "10%",
		zIndex: 1,
	},
	b2: {
		backgroundColor: "white",
		justifyContent: "flex-start",
		alignSelf: "flex-start",
		flexWrap: "wrap",
	},
	b3: {
		justifyContent: "center",
		alignSelf: "flex-end",
		alignContent: "center",
		bottom: "50%",
		color: "#C1D5E8",

		// width: "20%",
	},
	img: {
		height: 120,
		width: 120,
	},
	ordButton: {
		justifyContent: "flex-end",
		alignSelf: "center",
		top: "90%",
		backgroundColor: "#64bacb",
		borderRadius: 20,
	},
});
