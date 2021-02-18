import React from "react"
import { Field, reduxForm } from "redux-form"
import {
	View,
	Text,
	TextInput,
	StatusBar,
	StyleSheet,
	Alert,
	TouchableOpacity,
	ScrollView,
	Button,
} from "react-native"
import { connect, useSelector, useDispatch } from "react-redux"
import { getUser, updateUser, setUserInfo, addUserAddress, addUserInfo } from "../actions/index.js"
import CheckoutScreen from "../screens/CheckoutScreen.js"

const AddressForm2 = (props) => {
	

	return (
		<View style={styles.primary}>
			

				<View>
	

					<Text style={styles.row}>Address line 1</Text>

					<Field style={styles.field} name="addressLine1" component={CheckoutScreen} />
				</View>

				<View>
					<Text style={styles.row}>Address line 2</Text>
					<Field style={styles.field} name="addressLine2" component={CheckoutScreen} />
				</View>

				<View>
					<Text style={styles.row}>City</Text>
					<Field style={styles.field} name="city" component={CheckoutScreen} />
				</View>

				<View>
					<Text style={styles.row}>State</Text>
					<Field style={styles.field} name="state" component={CheckoutScreen} />
				</View>

				<View>
					<Text style={styles.row}>Zipcode</Text>
					<Field style={styles.field} name="zipCode" component={CheckoutScreen} />
				</View>
		
			
				  <TouchableOpacity onPress={props.handleSubmit}>
        <Text>Submit!</Text>
      </TouchableOpacity>


		
			
		</View>
	)
}
const mapStateToProps = (state, props) => ({
	initialValues: state.userReducer, // retrieve name from redux store
})

export default connect(mapStateToProps)(
	reduxForm({
		form: "address2", // a unique identifier for this form
		enableReinitialize: false,
	})(AddressForm2)
)
const styles = StyleSheet.create({
	field: {
		backgroundColor: "white",
		borderColor: "black",
		borderWidth:1,
		width: "150%",
		borderRadius:25,
		// alignSelf: "center",
		// alignItems: "center",
		// marginTop:20

	},
	primary: {
		display:'flex',	
		top:20,
		// alignItems: "center",
		flexDirection: "column",
		// flexWrap: "wrap",
		// alignItems: "center",
		// alignSelf: "center",
		// width: "90%",
		// padding:20,
		bottom:40,
		
	},


	row: {
		marginRight:5,
		
	},

	getCode: {
	
		borderColor: "#64bacb",
		borderWidth: 1,
		borderRadius: 25,
		backgroundColor: "#64bacb",
		color: "white",
		alignSelf: "center",
		alignItems: "center",

	},
	
})
