/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  AsyncStorage
} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import SplashScreen from "./screens/Splash/SplashComponent";
import ExpenseListScreen from "./screens/ExpenseList/ExpenseListComponent";
import SettingScreen from "./screens/ExpenseSetting/ExpenseSettingComponent";

const stackNavigator = createStackNavigator({
  ExpenseList: {
    screen: ExpenseListScreen,
    navigationOptions: {
      title: "Expense List",
    }
  },
  Setting: {
    screen: SettingScreen,
    title: "Setting",
    navigationOptions: {
      title: "Setting",
    }
  },
},
  {
    initialRouteName: "ExpenseList",
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        //fontFamily: "Montserrat-Bold",
        fontSize: 20
      }
    }
  }
)

const AppContainer = createAppContainer(stackNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 5000);
  }

  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <AppContainer />
    )
  }
}
