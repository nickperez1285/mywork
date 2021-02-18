import React, { useState, useEffect } from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { getStores, getLocation, getInventory, getItem } from "../actions/index";
import { connect, useDispatch, useSelector } from "react-redux";
// ******** ALL CONTENTS X FERRED TO HOMESCREEN
const StoreCard = (props) => {
	const {
		Brand,
		Store_id,
		Store_name,
		Store_street_address,
		Store_zip_code,
		_geoloc,
		objectID,
		store_city,
		store_country,
		store_phone_number,
		store_state,
	} = props.store;
	const [storeID, setID] = useState("");

	const dispatch = useDispatch();
	const stat = useSelector((state) => state.inventoryReducer.inventory.length);
	// const user = useSelector((state) => state.userReducer);

	const handlePress = (e) => {
		// will set global store /inventory ID
		dispatch(getInventory(props.storeID));
		// console.log(user, " user info after clicking on store");

		props.navigate.navigate("Store Screen");
	};

	return (
		// <FlatList data=/>
		<Card styles={styles.container}>
			<Text style={styles.name}>{Brand}</Text>
			<Text style={styles.description}>{Store_name}</Text>
			<Text style={styles.description}>Phone: {store_phone_number}</Text>
			<Text style={styles.description}>Zip Code: {Store_zip_code} </Text>
			<Button
				onPress={() => {
					handlePress();
				}}
				title="View Store"
			/>
		</Card>
	);
};
const mapStateToProps=store =>{
	return{
		store 
	}

	
}

export default connect(mapStateToProps, {})(StoreCard);

const styles = StyleSheet.create({
	container2: {
		fontFamily: "Avenir",
		fontStyle: "normal",
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
	},
	itemCards: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap",
		top: 30,
	},
	name: {
		fontWeight: "800",
		fontSize: 18,
		lineHeight: 25,
	},
	description: {
		fontSize: 14,
		lineHeight: 19,
	},
});
