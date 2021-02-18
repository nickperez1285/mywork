import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator } from "react-navigation";
import React, { Component } from "react";
import { NavigationService } from "../api/NavigationService";
import TabBar from "../components/TabBar";

const AuthNavigator = createStackNavigator(
	{
		Login: {
			getScreen: () => require("./LoginScreen").default,
		},
	},
	{
		navigationOptions: {
			header: null,
		},
	}
);

const TabNavigator = createBottomTabNavigator(
	{
		Home: {
			getScreen: () => require("./StoreScreen").default,
		},
		Cart: {
			getScreen: () => require("./CartScreen").default,
		},
		Profile: {
			getScreen: () => require("./ProfileScreen").default,
		},
	},
	{
		tabBarComponent: (props) => <TabBar {...props} />,
	}
);

const MainNavigator = createStackNavigator(
	{
		Tab: TabNavigator,
	},
	{
		navigationOptions: {
			headerStyle: {
				backgroundColor: green,
			},
		},
	}
);

const AppNavigator = createSwitchNavigator(
	{
		Splash: {
			getScreen: () => require("./SplashScreen").default,
		},
		Auth: AuthNavigator,
		Main: MainNavigator,
	},
	// change initial routename back to Splash
	{
		intialRouteName: "Main",
	}
);

class Navigation extends Component {
	state = {};
	render() {
		return <AppNavigator ref={(r) => NavigationService.setTopLevelNavigator(r)} />;
	}
}

export default Navigation;
