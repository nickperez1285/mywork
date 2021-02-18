import React, { Component, useState, useEffect } from "react"
import {
	Image,
	Text,
	TextInput,
	StatusBar,
	StyleSheet,
	View,
	ScrollView,
	FlatList,
} from "react-native"
import { Card, ListItem, Button,  } from "react-native-elements";

import { Ionicons } from "@expo/vector-icons"
import motorbike from "../../assets/img/motorbike.png"
import StoreCard from "../components/StoreCard"
import AlgoliaSearch from "../components/AlgoliaSearch"
import { connect, useSelector, useDispatch } from "react-redux"
import { getStores, getLocation, getInventory } from "../actions/index"

// Primary data object  is located here as state.data
const HomeScreen = (props) => {
	const [state, setState] = useState({
		search: "",
		dataSet: false,
		data: [],
	})
	const [zip, setZip] = useState("")

	const changeZip = (e) => {
		let data = e.target.value
		setZip(data)
	}


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
	} = useSelector((state) => state.algoliaReducer.storeData)

	const dispatch = useDispatch()

	const algo = useSelector((state) => state.algoliaReducer.storeData)
	const user = useSelector((state) => state.userReducer)

	// useEffect(() => {
	// 	if(user){


	// 	}else{ alert("ERROR- USER ")}
		
	// }, [])
	const handlePress = (i) => {
		// will set global store /inventory ID
		dispatch(getInventory(i.Store_id))
		props.navigation.navigate("Store Screen")
	};

	const renderItem = ({item})=> {

		return(

			<Card >
				<Text style={styles.name}>{item.Brand}</Text>
			<Text style={styles.description}>{item.Store_name}</Text>
			<Text style={styles.description}>Phone: {item.store_phone_number}</Text>
			<Text style={styles.description}>Zip Code: {item.Store_zip_code} </Text>
			<Button
				onPress={() => {handlePress(item)}}
				title="View Store"
			/>
								
								
								

		</Card>

		)

	}

	return (
		<View style={styles.container}>
			<View style={styles.topbox}>
				<View style={styles.pin}>
					<Ionicons name="md-pin" size={24} color="black" />
				</View>
				<View style={styles.pinText}>
					<Button
						title={`${props.store.locationReducer.zip}`}
						style={{
							backgroundColor: "#64BACB",
							// backgroundColor: "white",
						
						}}
						color="black"
						onPress={() => {
							console.log(props.store.locationReducer)
							// props.navigation.navigate("ZipSearch")
						}}
					/>
				</View>
			</View>

			<View style={styles.searchbox}>
				<AlgoliaSearch />
			</View>
			<View style={styles.bannertop}>
				<View style={styles.whitebox}>
					<Image style={styles.motorbike} source={motorbike}></Image>
					<Text style={styles.taptext}>Tap. Order. Smile.</Text>
					<Text style={styles.brandtext}>Bringing you the brands you love, fast and easy.</Text>
				</View>
			</View>
			<Text
				style={{
					position: "absolute",
					width: 81,
					height: 33,
					left: 28,
					top: 315,
					fontFamily: "Avenir",
					fontStyle: "normal",
					fontWeight: "normal",
					fontSize: 24,
					lineHeight: 33,
				}}>
				Nearby
			</Text>


		<View style= {styles.container3}>
			<FlatList
				data={algo}
				renderItem={renderItem}
				keyExtractor={(item) => item.objectID}
				horizontal={false}
				
			/>
			</View>
		
		</View>
	)
}

const mapStateToProps = (store) => {
	return {
		store,
	}
}

export default connect(mapStateToProps, {})(HomeScreen)

const styles = StyleSheet.create({
	container3:{
		top:150
	},
		container2: {
			fontFamily: "Avenir",
			fontStyle: "normal",
			flex: 1,
			backgroundColor: "#fff",
			alignItems: "center",
			// top :200
		},
		itemCards: {
			flex: 1,
			flexDirection: "row",
			// justifyContent: "center",
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
	bannertop: {
		position: "absolute",
		backgroundColor: "#64BACB",
		borderRadius: 20,
		width: 440,
		height: 176,
		left: 13,
		top: 130,
		fontFamily: "Avenir",
		fontStyle: "normal",
		position: "absolute",
		fontWeight: "800",
		fontSize: 24,
		lineHeight: 33,
	},
	brandtext: {
		position: "absolute",
		width: 181,
		height: 32,
		left: 170,
		top: 87,
		fontWeight: "normal",
		fontSize: 12,
		lineHeight: 16,
		color: "white",
	},

	container: {
		flex: 1,
		justifyContent: "center",
	},
	checkboxContainer: {
		flexDirection: "row",
		marginBottom: 20,
	},
	checkbox: {
		alignSelf: "center",
	},
	hometext: {
		fontFamily: "Avenir",
		fontStyle: "normal",
		position: "absolute",
		width: 68,
		height: 33,
		left: 28,
		top: 37,
		fontWeight: "800",
		fontSize: 24,
		lineHeight: 33,
	},

	label: {
		margin: 8,
	},
	motorbike: {
		position: "absolute",
		width: 142,
		height: 136,
		left: 34,
		// top: 24,
	},

	pin: {
		position: "absolute",
		width: 22.5,
		height: 27,
		left: 359,
		top: 35,
	},
	pinText: {
		position: "absolute",
		height: 100,
		left: 290,
		top: 30,
		fontWeight: "bold",


	},
	searchbox: {
		position: "absolute",
		width: 361,
		height: 36,
		left: 28,
		top: 86,
		backgroundColor: "#F8F8F8",
		borderRadius: 18,
	},
	storecards: {
		width: 363,
		height: 97,
		top: 340,
	},
	taptext: {
		position: "absolute",
		width: 201,
		height: 33,
		left: 170,
		top: 50,
		color: "white",
	},
	topbox: {
		display: "flex",
		flexDirection: "row",
		position: "absolute",
		backgroundColor: "lightblue",
		width: 414,
		height: 83,
		left: 0,
		top: 0,
	},
	whitebox: {
		position: "absolute",
		width: 114,
		height: 176,
		left: 0,
		backgroundColor: "#FFFFFF",
	},
	ziptext: {
		flex: 3,
		flexDirection: "row-reverse",
		alignItems: "flex-end",
		left: 3000,
	},
})
