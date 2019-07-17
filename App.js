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
  AsyncStorage,
  NetInfo,
  Text
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
    this.state = {
      isLoading: true,
      isConnected: true,
    };
    this.setResetUserDefault()
  }

  componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    setTimeout(() => {
      this.setState({ isLoading: false });
      this.checkInternetConnectivity();
    }, 5000);
  }

  checkInternetConnectivity() {
    // Get the network state once on each fresh launch:
    NetInfo.getConnectionInfo().then(result => {
      console.log("Connection type", result.type);
      console.log("Is connected?", result.isConnected);
      const connected = (result.type == "none") ? false : true
      this.setState({
        isConnected: connected
      })
    });

    //Subscribe to network state updates:
    // Subscribe
    NetInfo.addEventListener("connectionChange", result => {
      console.log("Connection type", result.type);
      console.log("Is connected?", result.isConnected);
      const connected = (result.type == "none") ? false : true
      this.setState({
        isConnected: connected
      })
    })
  }

  // To reset the categories and their records
  async setResetUserDefault() {
    try {
      const datetime = new Date()
      const currentmonth = datetime.getMonth().toString()
      var oldmonth = await AsyncStorage.getItem("month")
      if (oldmonth == undefined || oldmonth == null || oldmonth.length == 0) {
        await AsyncStorage.setItem("month", currentmonth)
      } else {
        if (parseInt(currentmonth) != parseInt(oldmonth)) {
          await AsyncStorage.removeItem("default_categories")
          await AsyncStorage.setItem("month", currentmonth)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  render() {
    if (this.state.isLoading) {
      return <SplashScreen />
    }

    if (this.state.isConnected == true) {
      return <AppContainer />
    } else {
      // To get a view with "No internet title"
      return (
        <View style={{
          flex: 1,
          justifyContent: "center",
          padding: 10,
          backgroundColor: "pink",
          alignItems: "center"
        }}>
          <Text style={{
            fontWeight: "bold",
            color: "black",
            textAlign: "center"
          }}> No internet connectivity. Check your device settings. </Text>
        </View>
      )
    }
  }
}
