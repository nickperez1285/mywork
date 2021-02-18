import React, { Component, useEffect, useState } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import {
	Container,
	Header,
	Content,
	Card,
	CardItem,
	Text,
	Body,
	Right,
	Left,
	Image,
	Thumbnail,
	Item,
	Title,
	Label,
	Button,
	Footer,
} from "native-base";
import { useSelector, useDispatch, connect } from "react-redux";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { getOrderID, getUserStripeID, getOrderInfo, setOrderID, setCart, clearCart, setCard } from "../actions/index";
import { or } from "react-native-reanimated";
import { CommonActions } from "@react-navigation/native";

const OrderScreen = (props) => {
	const dispatch = useDispatch();
	const [state, setState] = useState({ init: false, info: [] });
	const [orderInfo, setOrderInfo] = useState({ price: 0.0 });
	const [custInfo, setCustInfo] = useState({
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		zipCode: "",
		addressType: "",
	});
	const [dorm, setDorm] = useState({ dormRooomNumber: "" });
	const [storeInfo, setStoreInfo] = useState("");
	const [mainInfo, setMainInfo] = useState({ total_price: 0, delivery_fee: 0 });
	const [res, setRes] = useState("");
	const [dataArr, setData] = useState([]);
	const orders = useSelector((o) => o.orderReducer);
	const user = useSelector((o) => o.userReducer);
	const cart = useSelector((c) => c.cartReducer);
	const { order_id } = useSelector((o) => o.orderReducer);
	const { orderedItems } = useSelector((o) => o.orderReducer);
	const { items } = useSelector((o) => o.orderReducer.orderedItems);
	const [itemsPrice, setItemsPrice] = useState(0);
	let info = () => Promise.resolve(items);
	const reOrder = (or) => {
		or.items.map((it) => {
			console.log(it.price, " it asdasd");
			it.item_title !== "DISCOUNT"
				? dispatch(
						setCart({
							item_color: "none",
							item_size: 1,
							item_price: it.price,
							item_quantity: it.quantity,
							item_title: it.title,
							add_ons: it.add_ons,
							variants: it.variants,
							images: it.images || "none",
							description: it.description || "none",
						})
				  )
				: null;
		});
		// console.log(Object.keys(cart.cart[0]), " item going to cart");
		// console.log(info(), "info ");
		// dispatch(clearCart());

		props.navigation.dispatch(
			CommonActions.reset({
				index: 1,
				routes: [
					{ name: "Home" },
					{
						name: "Cart Screen",
					},
				],
			})
		);
	};

	let actual_total_price = mainInfo.delivery_fee + mainInfo.total_price;
	let subtotal = mainInfo.total_price / 1.15;
	let tax = mainInfo.total_price - mainInfo.total_price / 1.15;
	useEffect(() => {
		if (orderedItems != undefined) {
			orderedItems.map((a) => {
				if (a.order_id == order_id) {
					// a.items[0].map((i) => {
					setOrderInfo(a.items[0]);
					setCustInfo(a.customer_address);
					setStoreInfo(a.store_address);
					setMainInfo(a);
					setData(a.items);
				}
			});
		}
	}, []);

	// useEffect(() =>
	// {
	// 	if (!mainInfo.price)
	// 	{

	// 	}

	// },[])

	const renderItem = ({ item }) => {
		// console.log(orderInfo, "orderinfo ");

		// console.log(item);
		return (
			<View key={item.objectdId} style={styles.topMid}>
				<Text bold style={{ width: "100%" }}>
					{item.title}
				</Text>
				<Text style={{ fontSize: 14 }}>$ {item.price.toFixed(2)}</Text>
				<Text note>Quantity: {item.quantity}</Text>
				{item.add_ons ? item.add_ons.map((ao) => <Text note>{ao.name !== "none" ? ao.name : ""}</Text>) : null}
			</View>
		);
	};

	return (
		<Container style={{ flex: 1 }}>
			{/* <View style={{ flex: 1, margin: 12 }}> */}
			<Card style={styles.cards}>
				<CardItem style={{ alignContent: "flex-end", flex: 1 }}>
					{/* <Left> */}
					<Thumbnail
						source={{
							uri: "https://saymile-images.s3-us-west-1.amazonaws.com/sexycakes+/Sexy+Cakes.png",
						}}
						style={{ height: 100, width: 100 }}
					/>
					{/* </Left> */}

					{/* <CardItem style={{ justifyContent: 'flex-end', alignContent:"flex-end", borderWidth:2, flex:1, width:'100%'}}> */}
					<FlatList
						data={mainInfo.items}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
						horizontal={false}
						numColumns={2}
						style={{ width: "100%" }}
					/>
					{/* </CardItem> */}
					{/* <Right></Right> */}
				</CardItem>
			</Card>
			<Card style={styles.cards}>
				<CardItem style={{ width: "100%", justifyContent: "space-evenly" }}>
					<Left style={{ alignSelf: "flex-start", flexDirection: "column", justifyContent: "space-evenly" }}>
						<Title bold style={{ right: 5, alignSelf: "flex-start" }}>
							ORDER SUMMARY
						</Title>
						<Label note style={{ fontSize: 15, alignSelf: "flex-start" }}>
							SUBTOTAL
						</Label>
						<Text note style={{ alignSelf: "flex-start" }}>
							Tax:
						</Text>
						<Text note style={{ alignSelf: "flex-start" }}>
							Delivery Fee:
						</Text>
						<Label note style={{ alignSelf: "flex-start" }}>
							Total:
						</Label>
					</Left>
					<Right style={{ top: 10 }}>
						<Text>${(0.0 + subtotal).toFixed(2)}</Text>
						<Text note>${(0.0 + tax).toFixed(2)}</Text>
						<Text note>${(0.0 + mainInfo.delivery_fee).toFixed(2)}</Text>
						<Text bold>${(0.0 + actual_total_price).toFixed(2)}</Text>
					</Right>
				</CardItem>
			</Card>
			<Card style={styles.cards}>
				<Label style={{ fontSize: 19, left: 22 }}>Delivery Info</Label>

				<CardItem style={{ flexDirection: "column", flex: 1, justifyContent: "center" }}>
					{custInfo.city !== undefined ? (
						<Left style={{ flexDirection: "column", justifyContent: "center" }}>
							<Text>{custInfo.addressLine1}</Text>

							<Text>{custInfo.city + "  " + custInfo.state + " " + custInfo.zipCode}</Text>
						</Left>
					) : (
						<Text>Dorm Delivery</Text>
					)}
				</CardItem>
			</Card>
			{/* </View> */}
			{/* <View style={{alignContent: "center", alignSelf: "center", marginBottom: "20%" }}> */}
			<Card style={{ borderRadius: 25 }}>
				<Button
					style={{
						width: "100%",
						backgroundColor: "#7bbfff",
						alignSelf: "center",
						justifyContent: "center",
						borderRadius: 25,
					}}
					onPress={() => {
						reOrder(mainInfo);
					}}>
					<Text style={{ alignSelf: "center" }}>BUY THIS AGAIN</Text>
				</Button>
			</Card>
			{/* </View> */}
		</Container>
	);
};
const mapStateToProps = (global) => {
	return {
		global,
	};
};

export default connect(mapStateToProps, {})(OrderScreen);
const styles = StyleSheet.create({
	cards: { flex: 2, fontSize: 10 },
	container: {
		backgroundColor: "white",
		flex: 1,
		height: "100%",
		borderWidth: 2,
	},
	content: {
		height: "100%",
		borderWidth: 2,
	},
	ordButton: {
		borderWidth: 2,

		// position: "absolute",
		// width: "50%",
		// height: "28%",
		bottom: 20,
		justifyContent: "flex-end",
		alignSelf: "center",
		backgroundColor: "#64bacb",
		borderRadius: 25,

		top: "180%",
	},
	topMid: {
		flexWrap: "wrap",
		alignContent: "flex-start",
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-start",
		width: "100%",
	},
});
