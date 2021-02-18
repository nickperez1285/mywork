import { registerRootComponent } from "expo";
import React from "react";
import App from "./App";
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
console.disableYellowBox = true;
// LogBox.ignoreAllLogs();
console.error = (error) => error.apply;

registerRootComponent(App);
