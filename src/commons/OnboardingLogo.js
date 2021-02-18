import React from 'react'
import { images } from '../constants/images'
import { View, Text, Image } from 'react-native'

const OnboardingLogo = () => (
	<View center>
		<View>
			<Image source={images.logo} />
		</View>
		<View>
			<Text>
				Say
				<Text>Mile</Text>
			</Text>
		</View>
		<Text>Clothing Shop</Text>
	</View>
)

export default OnboardingLogo
