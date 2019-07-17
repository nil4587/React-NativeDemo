import React, { Component } from "react";
import { View, SafeAreaView, Image, ImageBackground, StatusBar } from "react-native";
import splashStyle from "./SplashCss";

class SplashComponent extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "green" }}>
        <StatusBar barStyle="light-content" />
        <ImageBackground style={{ flex: 1, margin: 0 }} source={require("../../resource/images/splash.png")} resizeMode="contain" />
      </SafeAreaView>
    );
  }
}

export default SplashComponent;
