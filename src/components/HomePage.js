import React from "react";
import { StyleSheet } from "react-native";
import { images } from "../constants/images";
import { cacheImages } from "../utils/cacheImages";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoreScreen from "../screens/StoreScreen";
import ProductScreen from "../screens/ProductScreen";
import { Ionicons } from "@expo/vector-icons";
import { getStores, getUser } from "../actions/index";
import { connect } from "react-redux";
import { withNavigationFocus } from "react-navigation";

const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
	input: {
		height: 80,
		width: 100,
		borderColor: "gray",
		borderWidth: 1,
	},
	h1: {
		fontSize: 20,
		fontFamily: "Avenir",
		fontStyle: "normal",
		fontWeight: "normal",
		height: 80,
		width: 283,
		left: 57,
		top: 40,
		color: "#8E8E8E",
	},
});
class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			user: "",
		};
	}

	// componentDidMount() {
	// 	// this.cacheAssets();
	// 	this.props.navigation.addListener("beforeRemove", (e) => {// CAUSES NAVIGATOR TO FAIL
	// 		// console.log("here");
	// 		e.preventDefault();
	// 		return;
	// 	});
	// }

	// cacheAssets = async () => {
	// 	const imagesAssets = cacheImages(Object.values(images));
	// 	await Promise.all([...imagesAssets]);
	// 	this.setState({
	// 		isReady: true,
	// 	});
	// };

	render() {
		const Tab = createBottomTabNavigator();
		return (
			<>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							if (route.name === "Home") {
								return <Ionicons name={focused ? "md-home" : "md-home"} size={size} color={color} />;
							} else if (route.name === "Cart") {
								return <Ionicons name={focused ? "ios-cart" : "ios-cart"} size={size} color={color} />;
							} else if (route.name === "Settings") {
								return <Ionicons name={focused ? "md-person" : "md-person"} size={size} color={color} />;
							}
						},
					})}
					tabBarOptions={{
						activeTintColor: "#7bbfff",
						inactiveTintColor: "white",
						style: { backgroundColor: "#ce9c80" },
					}}>
					{/* <Tab.Screen name="Home" component={HomeScreen} /> */}
					<Tab.Screen name="Home" component={StoreScreen} />
					<Tab.Screen name="Cart" component={CartScreen} />
					<Tab.Screen name="Settings" component={ProfileScreen} user={this.props.store.userReducer} />
					{/* <Tab.Screen name="Store Screen" component={StoreScreen} /> */}
				</Tab.Navigator>
			</>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		store,
	};
};
export default connect(mapStateToProps, null)(HomePage);
