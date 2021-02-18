import React, { Component } from "react";
import { View, Text, StatusBar, Image } from "react-native";
import OnboardingLogo from "../commons/OnboardingLogo";
import { NavigationService } from "../api/NavigationService";
import { store, persistor } from "../../persist.js";
import { connect, useSelector, useDispatch } from "react-redux";
import { getStores } from "../actions/index";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
// import SplashScreen from "react-native-splash-screen";

// function cacheImages(images) {
// 	return images.map((image) => {
// 		if (typeof image === "string") {
// 			return Image.prefetch(image);
// 		} else {
// 			return Asset.fromModule(image).downloadAsync();
// 		}
// 	});
// }

class Splash extends Component {
	constructor(props) {
		super(props);
		state = { isReady: false };
	}
	componentDidMount() {
		getStores(70118);
		setTimeout(() => {
			this.props.navigation.navigate("Home");
		}, 1000);
	}

	async _loadAssetsAsync() {
		const imageAssets = cacheImages([require("../../assets/splash2.png")]);

		// await Promise.all([...imageAssets]);
	}
	render() {
		// 	if (!this.state.isReady) {
		// 		return (
		// 			<AppLoading
		// 				startAsync={this._loadAssetsAsync}
		// 				onFinish={() => this.setState({ isReady: true })}
		// 				onError={console.warn}
		// 			/>
		// 		);
		// 	}

		return (
			<View f={1} center>
				<Image
					style={{ alignSelf: "center", height: "100%", width: "99%" }}
					source={require("../../assets/splash3.png")}
					cache="force-cache"
				/>
			</View>
		);
	}
}

export default connect(null, { getStores })(Splash);
