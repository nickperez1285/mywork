import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch";
import {
	List,
	Image,
	Text,
	TextInput,
	StatusBar,
	StyleSheet,
	View,
	Button,
	SafeAreaView,
	FlatList,
	ListItem,
	TouchableOpacity,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { getStores, getInventory } from "../actions/index";
// import { SearchBar, CheckBox } from "react-native-elements";
// import { InstantSearch } from "react-instantsearch-native";
import { Icon } from "react-native-elements";
import search from "../../assets/img/search.png";

const AlgoliaSearch = (props) => {
	const [state, setState] = useState({
		isModalOpen: false,
		searchState: true,
		search: "",
		coords: "",
		zip: "",
		data: [],
	});

	const dispatch = useDispatch();

	const storeState = useSelector((state) => state.algoliaReducer);

	const location = useSelector((state) => state.algoliaReducer.zip);

	const update = () => {
		setState({
			...state,
			search: `${state}`,
			searchState: true,
		});
		dispatch(getStores(state.zip, state.search));
	};

	useEffect(() => {
		if (state.searchState) {
			dispatch(getStores(location, state.search));
			setState({
				...state,
				zip: location,
				searchState: false,
			});
		}
	}, []);

	return (
		<SafeAreaView style={styles.searchbox}>
			<TouchableOpacity
				onPress={() => {
					update(state.search);
				}}
				style={styles.searchbox}>
				<View style={styles.img}>
					<Image source={require("../../assets/img/search.png")} />
				</View>

				<View style={styles.input}>
					<TextInput
						name="query"
						onChangeText={(search) =>
							setState({
								...state,
								search: search,
							})
						}
						max
						length={30}
						placeholder="enter search"
					/>
				</View>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const mapStateToProps = (store) => {
	return {
		store,
	};
};

export default connect(mapStateToProps, {
	getStores,
	getInventory,
})(AlgoliaSearch);

const styles = StyleSheet.create({
	img: {
		display: "flex",
		width: 10,
	},
	input: {
		display: "flex",
		left: 20,
		paddingTop: 10,
		width: 300,
	},

	searchbox: {
		flex: 1,
		flexDirection: "row",
		width: 300,
	},

	icon: {
		flexDirection: "row",
	},
	item: {
		paddingVertical: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		alignItems: "center",
	},
	itemCount: {
		backgroundColor: "#252b33",
		borderRadius: 25,
		paddingVertical: 5,
		paddingHorizontal: 7.5,
	},
	itemCountText: {
		color: "#FFFFFF",
		fontWeight: "800",
	},
	search: {
		flexDirection: "row",
	},
	searchbox: {
		flex: 1,
		flexDirection: "row",
	},
});
