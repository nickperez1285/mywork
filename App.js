import "react-native-gesture-handler";

import React, { createContext, useState, useEffect } from "react";
import { images } from "./src/constants/images";

// import { cacheImages } from './src/utils/cacheImages'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ZipSearch from "./src/components/ZipSearch";
import HomePage from "./src/components/HomePage";
import ProductPage from "./src/screens/ProductScreen";
import OrderHistory from "./src/components/OrderHistory";
import { Provider, connect, useDispatch, useSelector } from "react-redux";

import StoreScreen from "./src/screens/StoreScreen";
import ProductScreen from "./src/screens/ProductScreen";
import SignUp from "./src/components/SignUp";
// import OrderHistory from "./src/components/OrderHistory"
import VerifyCode from "./src/components/VerifyCode";
import CheckoutForm from "./src/components/Checkout";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import AddressesScreen from "./src/screens/AddressesScreen";
import CardScreen from "./src/screens/CardsScreen";
import OrderScreen from "./src/screens/OrderScreen";
import CartScreen from "./src/screens/CartScreen";
import TrackAllOrders from "./src/components/TrackAllOrders";
import ViewOrderMap from "./src/components/viewOrderMap";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditScreen from "./src/screens/EditScreen";
import YourAccount from "./src/components/YourAccount";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./persist.js";
import { getUserToken, removeUserToken } from "./src/actions/auth";
import Splash from "./src/screens/SplashScreen";
import { Loader } from "./src/components/Loader";
import { ActivityIndicator } from "react-native";
const Stack = createStackNavigator();
let version = " ";
// let token = store.getState().authReducer.token;
// console.log(token, "app,js");
function RootStack() {
	return (
		<Stack.Navigator initialRouteName="Splash">
			{/* <Stack.Screen name="ZipSearch" component={ZipSearch} /> */}
			<Stack.Screen
				name="Splash"
				component={Splash}
				options={{
					title: " ",
					headerStyle: {
						backgroundColor: "#7bbfff",
					},
					headerShown: false,

					gestureEnabled: false,
				}}
			/>
			<Stack.Screen
				name="Home"
				component={HomePage}
				options={{
					title: "SexyCakes" + `${version}`,
					headerStyle: {
						// backgroundColor: "#f9f9f9",
						backgroundColor: "rgba(180, 180, 180, 1)",
					},
					// headerTintColor: "rgba(180, 180, 180, 0.6)",
					headerTitleStyle: {
						color: "#2c7bbf",

						fontWeight: "bold",
					},
					headerLeft: () => {
						return null;
					},
					gestureEnabled: false,
				}}
			/>

			{/* <Stack.Screen
				name="Your Account"
				component={YourAccount}
				options={{
					title: "Your Account",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "white",
					headerTitleStyle: {
						color: "black",
						fontWeight: "bold",
					},
					gestureEnabled: true,
				}}
			/> */}
			{/* <Stack.Screen
				name="Store Screen"
				component={StoreScreen}
				options={{
					title: "My home",
					headerStyle: {
						backgroundColor: "#f4511e",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/> */}
			<Stack.Screen
				name="Product Page"
				component={ProductScreen}
				options={{
					title: "",
					headerStyle: {
						backgroundColor: "rgba(180, 180, 180, 1)",
						// height: "6%",
					},
					headerTintColor: "#2c7bbf",
					headerTitleStyle: {
						color: "#2c7bbf",

						fontWeight: "bold",
						// color: "black",
						height: "100%",
					},
				}}
			/>
			<Stack.Screen
				name="VerifyCode"
				component={VerifyCode}
				options={{
					title: "",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="SignIn"
				component={SignUp}
				options={{
					title: "SignUp",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Checkout Form"
				component={CheckoutForm}
				options={{
					title: "Checkout",
					headerStyle: {
						backgroundColor: "rgba(180, 180, 180, 1)",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Cart Screen"
				options={{
					title: "Cart",
					headerStyle: {
						backgroundColor: "rgba(180, 180, 180, 1)",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					headerShown: true,
				}}
				component={CartScreen}
			/>
			<Stack.Screen
				name="Edit Screen"
				options={{
					title: "Edit",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					// headerShown: false,
				}}
				component={EditScreen}
			/>
			<Stack.Screen
				name="Checkout Screen"
				component={CheckoutScreen}
				options={{
					title: " ",
					headerStyle: {
						backgroundColor: "rgba(180, 180, 180, 1)",
						// height: 40,\\
					},
					headerTintColor: "#2c7bbf",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					// headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Addresses Screen"
				component={AddressesScreen}
				options={{
					title: "",
					headerStyle: {
						backgroundColor: "rgba(180, 180, 180, 1)",
					},
					headerTintColor: "#2c7bbf",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Card Screen"
				component={CardScreen}
				options={{
					title: "Payment Methods",
					headerStyle: {
						backgroundColor: "#e4e1e1",
					},
					headerTintColor: "#2c7bbf",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Settings Screen"
				component={ProfileScreen}
				options={{
					title: "Your Settings",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Order Tracking"
				component={TrackAllOrders}
				options={{
					title: "Order Tracking",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Order Screen"
				component={OrderScreen}
				options={{
					title: "Your Order",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Order History"
				component={OrderHistory}
				options={{
					title: "",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="ViewOrderMap"
				component={ViewOrderMap}
				options={{
					title: "Your Orders Map",
					headerStyle: {
						backgroundColor: "white",
					},
					headerTintColor: "black",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
		</Stack.Navigator>
	);
}

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate
				loading={() => {
					<ActivityIndicator />;
				}}
				persistor={persistor}>
				<NavigationContainer>
					<RootStack />
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
};

export default App;
