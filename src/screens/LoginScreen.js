import React, { Component } from 'react'
import { Alert, Animated, View, Text, TouchableOpacity } from 'react-native'
import OnboardingLogo from '../commons/OnboardingLogo'

const ViewAnimated = Animated.createAnimatedComponent(View)

class LoginScreen extends Component {
	state = {}
	componentDidMount() {}

	render() {
		return (
			<View f={1} center bg='white'>
				LogIn
			</View>
		)
	}
}

export default LoginScreen
