import React, { Component } from "react";
import { View, SafeAreaView, Image, ImageBackground } from "react-native";
import splashStyle from "./SplashCss";

class SplashComponent extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "green" }}>
        <ImageBackground style={{ flex: 1, margin: 0 }} source={require("../../resource/images/splash.png")} resizeMode="contain" />
      </SafeAreaView>
    );
  }
}

export default SplashComponent;
