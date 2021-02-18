import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import React, { Component, useState, useEffect } from "react";
import {
	View,
	TextInput,
	StatusBar,
	StyleSheet,
	Alert,
	TouchableOpacity,
	Switch,
	FlatList,
	SafeAreaView,
	Keyboard,
} from "react-native";
import {
	Button,
	Container,
	Header,
	Content,
	Card,
	CardItem,
	Text,
	Icon,
	Right,
	Left,
	Body,
	CheckBox,
} from "native-base";
import { addUserCard, setCard, listCards, getUserCards, selectCard } from "../actions/index";
import { connect } from "react-redux";
import { userReducer } from "../reducers/user";
import { FormSection } from "redux-form";
import { cartReducer } from "../reducers/cart";

var stripe = require("stripe-client")("sk_test_O9n7fxDTT3G38Lz48prDzoCi00uarHUVti");

class CardScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			useLiteCreditCardInput: true,
			user_stripe_id: "",
			info: [],
			cards: [],
			carr: [],
			card: {
				number: "",
				exp_month: "",
				exp_year: "",
				cvc: "",
			},
			userName: "",
		};
		this.handleSave = this.handleSave.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.select = this.select.bind(this);
	}
	componentDidMount() {
		this.props.getUserCards(this.props.global.userReducer.user_stripe_id);

		this.setState({
			...this.state,
			cards: this.props.global.userReducer.cards,
			user_stripe_id: this.props.global.userReducer.user_stripe_id,
		});
	}

	shouldComponentUpdate() {
		if (this.state.cards.length !== this.props.global.userReducer.cards.length) {
			return true;
		}
		if (this.props.global.userReducer.cards.length < 1) {
			return true;
		}
	}

	componentDidUpdate() {}

	handleSubmit(e) {
		// event.preventDefault();
		this.setState({ ...this.state, card: e.values });
		// console.log(e);
	}
	handleSave() {
		// this.props.selectCard(e)
		// console.log(this.props.global.userReducer.cards.length);
		// console.log(this.state.cards.length);
		// this.props.getUserCards(this.props.global.userReducer.user_stripe_id).then((res) => {
		// 	console.log(res.data.length, this.state.cards.length, "getusercards");
		// });
		Keyboard.dismiss();
		this.state.card.number != ""
			? stripe
					.createToken({
						card: {
							number: this.state.card.number,
							exp_month: this.state.card.expiry.split("/")[0],
							exp_year: this.state.card.expiry.split("/")[1],
							cvc: this.state.card.cvc,
						},
					})

					.then((res) => {
						this.props.addUserCard(this.props.global.userReducer.user_stripe_id, res.id).then((res) => {
							this.props.getUserCards(this.props.global.userReducer.user_stripe_id);
							this.forceUpdate();
						});
					})
			: alert("PLEASE FILL OUT ALL REQUIRED FIELDS ABOVE");
	}

	select(e) {
		// console.log(e.id);
		this.props.selectCard(e);
		this.forceUpdate();
	}

	_onChange = (formData) => this.handleSubmit(formData);

	_onFocus = (field) => console.log(field);
	_onFocus = (field) => console.log(field);
	componentWillUnmount() {
		console.log("unmount");
	}
	render() {
		const selected = !this.props.global.userReducer.selectedCard ? null : this.props.global.userReducer.selectedCard.id;

		const renderItem = ({ item }) => {
			let name = this.props.global.userReducer;
			console.log(item);
			return (
				<Card key={item.id} style={{ backgroundColor: "rgba(180, 180, 180, 0.4)" }}>
					<TouchableOpacity onPress={() => this.select(item)}>
						<CardItem style={{ padding: 20, backgroundColor: "rgba(180, 180, 180, 0.6)" }}>
							<Left>
								<Body style={{ justifyContent: "space-evenly", height: 80 }}>
									<Text style={s.b1}>{item.brand + " ... " + item.last4}</Text>
									<Text style={s.b1}>{"EXP: " + item.exp_month + "/" + item.exp_year}</Text>
									<Text style={s.b1}>{name.first_name + " " + name.last_name}</Text>
								</Body>
							</Left>
							<Right>
								{this.props.global.userReducer.selectedCard.id == item.id && (
									<CheckBox style={{ justifyContent: "center" }} color="#7bbfff" checked={true} />
								)}

								{this.props.global.userReducer.selectedCard.id !== item.id && <Icon active name="arrow-forward" />}
							</Right>

							{/* </TouchableOpacity> */}
						</CardItem>
					</TouchableOpacity>
				</Card>
			);
		};
		return (
			<SafeAreaView style={s.container}>
				{/* <TouchableWithoutFeedback> */}
				<View style={{ flex: 1.3 }}>
					<CreditCardInput
						cardImageFront={{}}
						autoFocus={true}
						requiresName={true}
						requiresCVC
						requiresPostalCode
						cardScale={(0.542, 0.521)}
						labelStyle={s.label}
						inputStyle={s.input}
						validColor={"black"}
						invalidColor={"red"}
						placeholderColor={"white"}
						onFocus={this._onFocus}
						onChange={this._onChange}
					/>
				</View>
				{/* </TouchableWithoutFeedback> */}
				<View
					style={{
						// borderWidth: 2,
						flex: 0.3,
						// position: "absolute",
						// top: "1%",
						borderRadius: 25,
						alignSelf: "center",
					}}>
					<Button
						style={{
							borderRadius: 25,
							alignSelf: "center",
							height: 40,
							backgroundColor: "white",
						}}
						onPress={() => this.handleSave()}>
						<Text style={{ color: "#2c7bbf" }}>ADD NEW</Text>
					</Button>
				</View>

				<View style={{ flex: 2.5, margin: 10, paddingBottom: 20 }}>
					<FlatList
						data={this.props.global.userReducer.cards}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
						horizontal={false}
						numRows={1}
					/>
				</View>
			</SafeAreaView>
		);
	}
}
const mapStateToProps = (global) => {
	return { global };
};

export default connect(mapStateToProps, { addUserCard, setCard, getUserCards, selectCard })(CardScreen);
const s = StyleSheet.create({
	a: {
		flexDirection: "row",
		left: 100,
	},
	b1: {
		flexDirection: "row",
		alignSelf: "flex-start",
		color: "#2c7bbf",
		fontWeight: "bold",
	},
	b2: {
		flexDirection: "row",
		alignSelf: "flex-end",
	},
	b3: {
		flexDirection: "row",
		left: 80,
	},
	switch: {
		alignSelf: "center",
		marginTop: 20,
		marginBottom: 20,
	},
	container: {
		backgroundColor: "#7bbfff",
		flex: 1,
		// height: "90%",
		padding: 10,
	},
	label: {
		color: "#2c7bbf",

		fontSize: 15,
		// flex: 1,
		alignContent: "center",
		// borderWidth: 2,
	},
	input: {
		fontSize: 16,
		color: "black",
		top: "10%",
		// flex: 1,/
		// borderWidth: 2,
	},
});
