import React, { Component } from "react";
import expenselistStyle from "./ExpenseListCss"
import {
    View, Text, SafeAreaView, Button, ListView,
    Image, TouchableOpacity,
    StatusBar, TextInput,
    KeyboardAvoidingView, ScrollView, AsyncStorage
} from "react-native";

import Toast, { DURATION } from "react-native-easy-toast";
import { switchCase, switchStatement } from "@babel/types";
var ImagePicker = require('react-native-image-picker');

class ExpenseListComponent extends Component {
    category_ds = new ListView.DataSource({ rowHasChanged: (prevRowData, nextRowData) => prevRowData !== nextRowData });
    expense_ds = new ListView.DataSource({ rowHasChanged: (prevRowData, nextRowData) => prevRowData !== nextRowData });
    max_monthly_limit = "0.00"
    total_monthly_expense = 0.00
    categories = []

    // Customise navigation options as per screen's requirements
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            headerRight: (
                <Button
                    onPress={() => { this.prototype.onSettingClick(navigation) }}
                    title="Setting"
                    color="#fff"
                />
            ),
        };
    };

    // Setting Button click event
    onSettingClick(navigation, prototype) {
        console.log("Setting Clikced")
        navigation.navigate("Setting", {
            callback: this.callback.bind(this)
        })
    }

    // Callback handler from child component
    callback() {
        this.loadDataFromAsyncStorage()
    }

    constructor(props) {
        super(props);
        this.state = {
            amount: "0.00",
            description: null,
            filePath: null,
            selectedCategory: null,
        };
        this.loadDataFromAsyncStorage()
    }

    // A method to load data from UserDefaults with the help of "AsyncStorage"
    async loadDataFromAsyncStorage() {
        try {
            var tmplist = null
            //await AsyncStorage.removeItem("default_categories")
            const strjson = await AsyncStorage.getItem("default_categories")
            tmplist = JSON.parse(strjson)
            if (tmplist == undefined || tmplist == null || tmplist.length == 0) {
                this.categories = this.fetchCategories()
                await AsyncStorage.setItem("default_categories", JSON.stringify(this.categories))
            } else {
                this.categories = tmplist
            }
            const category = this.categories[0]
            this.max_monthly_limit = category.cat_month_limit
            this.calculateTotalMonthlyExpense(category)
            if (this.state == null) {
                //this.render()
            } else {
                this.setState({
                    selectedCategory: category,
                    categoriesDataSource: this.category_ds.cloneWithRows(this.categories),
                    expenseDataSource: this.expense_ds.cloneWithRows(category.cat_expenses),
                })
            }
        } catch (error) {
            console.log(error.message)
            this.refs.toast.show(error.message, DURATION.LONG_TIME)
        }
    }

    // A method to calculate total monthly expenses from the list of expenses
    calculateTotalMonthlyExpense(item) {
        // Compare and update the category's cat_expenses list
        this.total_monthly_expense = 0.00
        this.categories.forEach((value, index) => {
            if (parseInt(value.cat_id) == parseInt(item.cat_id)) {
                value.cat_expenses.forEach((value1, index) => {
                    this.total_monthly_expense += parseFloat(value1.amount)
                })
                console.log(value.cat_name)
            }
        })
    }

    /*
    // To get Expense Categories
    fetchCategories() {
        return [
            { "cat_id": "1", "cat_name": "Petrol", "cat_icn": require("../../resource/images/icon_petrol.png"), "cat_month_limit": 5000, "cat_expenses": [] },
            { "cat_id": "2", "cat_name": "Books", "cat_icn": require("../../resource/images/icon_book.png"), "cat_month_limit": 3500, "cat_expenses": [] },
            { "cat_id": "3", "cat_name": "Clothes", "cat_icn": require("../../resource/images/icon_clothes.png"), "cat_month_limit": 6000, "cat_expenses": [] },
            { "cat_id": "4", "cat_name": "Footwear", "cat_icn": require("../../resource/images/icon_footwear.png"), "cat_month_limit": 200, "cat_expenses": [] },
            { "cat_id": "5", "cat_name": "Home Interior", "cat_icn": require("../../resource/images/icon_home_interior.png"), "cat_month_limit": 800, "cat_expenses": [] },
            { "cat_id": "6", "cat_name": "Home Repair", "cat_icn": require("../../resource/images/icon_home_repair.png"), "cat_month_limit": 1500, "cat_expenses": [] },
            { "cat_id": "7", "cat_name": "Mobile", "cat_icn": require("../../resource/images/icon_mobile.png"), "cat_month_limit": 500, "cat_expenses": [] },
            { "cat_id": "8", "cat_name": "Personal", "cat_icn": require("../../resource/images/icon_personal.png"), "cat_month_limit": 4500, "cat_expenses": [] },
            { "cat_id": "9", "cat_name": "Pet", "cat_icn": require("../../resource/images/icon_pet.png"), "cat_month_limit": 1000, "cat_expenses": [] },
            { "cat_id": "10", "cat_name": "Wifi", "cat_icn": require("../../resource/images/icon_wifi.png"), "cat_month_limit": 600, "cat_expenses": [] }
        ]
    }*/

    // To get Expense Categories
    fetchCategories() {
        return [
            { "cat_id": "1", "cat_name": "Petrol", "cat_month_limit": 5000, "cat_expenses": [] },
            { "cat_id": "2", "cat_name": "Books", "cat_month_limit": 3500, "cat_expenses": [] },
            { "cat_id": "3", "cat_name": "Clothes", "cat_month_limit": 6000, "cat_expenses": [] },
            { "cat_id": "4", "cat_name": "Footwear", "cat_month_limit": 200, "cat_expenses": [] },
            { "cat_id": "5", "cat_name": "Home Interior", "cat_month_limit": 800, "cat_expenses": [] },
            { "cat_id": "6", "cat_name": "Home Repair", "cat_month_limit": 1500, "cat_expenses": [] },
            { "cat_id": "7", "cat_name": "Mobile", "cat_month_limit": 500, "cat_expenses": [] },
            { "cat_id": "8", "cat_name": "Personal", "cat_month_limit": 4500, "cat_expenses": [] },
            { "cat_id": "9", "cat_name": "Pet", "cat_month_limit": 1000, "cat_expenses": [] },
            { "cat_id": "10", "cat_name": "Wifi", "cat_month_limit": 600, "cat_expenses": [] }
        ]
    }

    //MARK:-=====================================
    //MARK: Category list row rendering
    //MARK:-=====================================

    // A property to retrieve a category list's row per record
    renderCategoryRow = (item, sectionID, rowID) => {
        console.log(sectionID, rowID)
        var rowTheme = expenselistStyle.categoryImage
        if (this.state.selectedCategory != null && item.cat_id == this.state.selectedCategory.cat_id) {
            rowTheme = expenselistStyle.categorySelectedImage
        }
        return (
            <View nativeID={rowID} style={expenselistStyle.categoryRow}>
                <TouchableOpacity onPress={() => {
                    this.onCategoryItemClick(item, sectionID, rowID)
                }}>
                    <Image source={this.imagepath(item.cat_id)} resizeMode="cover" style={rowTheme} />
                </TouchableOpacity>
            </View>
        )
    }

    // A property to retrive an imagepath based on category id from the list of categories
    imagepath = (cat_id) => {
        switch (parseInt(cat_id)) {
            case 1:
                return require("../../resource/images/icon_petrol.png");
            case 2:
                return require("../../resource/images/icon_book.png");
            case 3:
                return require("../../resource/images/icon_clothes.png")
            case 4:
                return require("../../resource/images/icon_footwear.png")
            case 5:
                return require("../../resource/images/icon_home_interior.png")
            case 6:
                return require("../../resource/images/icon_home_repair.png")
            case 7:
                return require("../../resource/images/icon_mobile.png")
            case 8:
                return require("../../resource/images/icon_personal.png")
            case 9:
                return require("../../resource/images/icon_pet.png")
            case 10:
                return require("../../resource/images/icon_wifi.png")
            default:
                return require("../../resource/images/icon_home_interior.png")
        }
    }

    // A property to retrieve a category list
    getCategoryView = () => {
        return (
            <ListView
                style={expenselistStyle.categoryListView}
                testID="categorylist"
                horizontal={true}
                dataSource={this.state.categoriesDataSource}
                renderRow={this.renderCategoryRow}
            />
        )
    }

    //MARK:-=====================================
    //MARK: Expense list row rendering
    //MARK:-=====================================

    returnImage = (data) => {
        const string = "data:image/png;base64," + data
        return (
            <Image source={{ uri: string }} resizeMode="cover" style={{ height: 70, width: 70, marginRight: 10 }} />
        )
    }

    renderExpenseListRow = (expense, sectionID, rowID) => {
        var imageview = null
        if (expense.filepath != null) {
            const { data } = expense.filepath;
            imageview = this.returnImage(data)
        }
        return (
            <View nativeID={rowID} style={expenselistStyle.expenseRow}>
                {imageview}
                <TouchableOpacity onPress={() => {
                    this.onExpenseItemClick(expense, sectionID, rowID)
                }}>
                    <Text style={[expenselistStyle.expenseRowTitleText, { marginTop: 5 }]}>Amount :{" "}
                        <Text style={expenselistStyle.expenseRowDescText}>$ {expense.amount}</Text>
                    </Text>
                    <Text style={[expenselistStyle.expenseRowTitleText, { marginTop: 5, marginBottom: 5 }]}>Description :{" "}
                        <Text style={expenselistStyle.expenseRowDescText}>
                            {(expense.description == null || expense.description.trim().length == 0) ? "n/a" : expense.description}
                        </Text>
                    </Text>
                    <Text style={[expenselistStyle.expenseRowTitleText, { marginBottom: 5 }]}>Date :{" "}
                        <Text style={expenselistStyle.expenseRowDescText}>{expense.datetime}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    getExpenseListView = () => {
        return (
            <ListView
                style={expenselistStyle.expenseListView}
                testID="expenselist"
                dataSource={this.state.expenseDataSource}
                renderRow={this.renderExpenseListRow}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
                    return (
                        <View style={{ height: 1, backgroundColor: "white" }} />
                    )
                }}
            />
        )
    }

    //MARK:-=====================================
    //MARK: Click events
    //MARK:-=====================================

    // On click of Expense Category 
    onCategoryItemClick(item, sectionID, rowID) {
        console.log(item.cat_name, sectionID, rowID)
        this.calculateTotalMonthlyExpense(item)
        this.max_monthly_limit = item.cat_month_limit
        this.setState({
            selectedCategory: item,
            expenseDataSource: this.expense_ds.cloneWithRows(item.cat_expenses),
        })
    }

    // formattedDateTime = () => {
    //     const datetime = new Date()
    //     const date = datetime.getDate(); //Current Date
    //     const month = datetime.getMonth() + 1; //Current Month
    //     const year = datetime.getFullYear(); //Current Year
    //     const hours = datetime.getHours(); //Current Hours
    //     const min = datetime.getMinutes(); //Current Minutes
    //     const sec = datetime.getSeconds(); //Current Seconds
    //     const formattedDatetime = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec
    //     return formattedDatetime
    // }

    // On click of Expense list row 
    onExpenseItemClick(expense, sectionID, rowID) {
        console.log(expense, sectionID, rowID)
    }

    // Send button click event
    onSendClick = () => {
        const amount = this._amountInput.props.value
        const total = parseFloat(this.total_monthly_expense) + parseFloat(amount)
        const description = this._descInput.props.value
        if (amount == null || amount.trim() == "" || amount.trim().length == 0 || parseInt(amount.trim()) <= 0.00) {
            this.refs.toast.show("Please enter a valid amount", 2000);
        } else if (total > this.max_monthly_limit) {
            this.refs.toast.show("Entered amount exceeds the total allowed monthly expense cost.", 2000);
        } else {
            const { selectedCategory, filePath } = this.state;
            const datetime = new Date()
            const localdatetime = datetime.toLocaleString()
            const expense_item = {
                "cat_id": selectedCategory.cat_id,
                "cat_name": selectedCategory.cat_name,
                "amount": amount,
                "description": description,
                "datetime": localdatetime,
                "filepath": filePath
            }
            this.total_monthly_expense = 0.00
            // Compare and update the category's cat_expenses list
            this.categories.forEach((value, index) => {
                if (parseInt(value.cat_id) == parseInt(selectedCategory.cat_id)) {
                    value.cat_expenses.push(expense_item)
                    value.cat_expenses.forEach((value1, index) => {
                        this.total_monthly_expense += parseFloat(value1.amount)
                    })
                    console.log(value.cat_name)
                }
            })
            // Reload category & expense list after this change
            this.setState({
                selectedCategory: selectedCategory,
                categoriesDataSource: this.category_ds.cloneWithRows(this.categories),
                expenseDataSource: this.expense_ds.cloneWithRows(selectedCategory.cat_expenses),
                filePath: null
            })

            try {
                AsyncStorage.setItem("default_categories", JSON.stringify(this.categories))
            } catch (error) {
                console.log(error.message)
            }
            // Clear the textfields after successful send
            this._amountInput.clear()
            this._descInput.clear()
        }
    }

    // Camera icon click event
    onAttachImageClick = () => {
        this.launchLibrary()
    }

    // To get a view with "No record title"
    getNoRecordText = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={expenselistStyle.noRecordView}> No record found </Text>
            </View>
        )
    }

    componentWillMount() {
        //this.loadDataFromAsyncStorage()
    }

    render() {
        const { selectedCategory } = this.state;
        const expenseView = (selectedCategory == null || selectedCategory.cat_expenses == null || selectedCategory.cat_expenses.length == 0) ? this.getNoRecordText() : this.getExpenseListView();
        const categoryView = (selectedCategory == null) ? this.getNoRecordText() : this.getCategoryView()
        const icon_send_path = require("../../resource/images/icon_send.png")
        const icon_camera_path = require("../../resource/images/icon_camera.png")
        return (
            <SafeAreaView style={expenselistStyle.safeAreaView}>
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={100} behavior={"height"}>
                    {/* Scrollview */}
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ overflow: "visible" }}
                        keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled"
                    >
                        {/* Header View */}
                        <View style={expenselistStyle.headerView}>
                            {/* A view to listout the Expense Categories on top of the screen */}
                            {categoryView}
                        </View>
                        {/* Middle View */}
                        <View style={expenselistStyle.middleView}>
                            {/* No record found or Expense list view */}
                            {expenseView}
                        </View>
                        {/* Bottom View */}
                        <View style={expenselistStyle.bottomView}>
                            {/* View contains Total & Max expenses per month */}
                            <View style={expenselistStyle.monthlyExpenseDisplayView}>
                                {/* Max limit allowed to spend per month */}
                                <Text style={expenselistStyle.monthlyExpenseTitleText}>
                                    Total : $
                                    <Text style={expenselistStyle.monthlyExpensePriceText}
                                        ref={component => this._lblTotalMonthExpense = component}
                                    >
                                        {this.total_monthly_expense}
                                    </Text>
                                </Text>
                                {/* Monthly spent expenses */}
                                <Text style={expenselistStyle.monthlyExpenseTitleText}>
                                    Monthly Expense Limit : $
                                    <Text style={expenselistStyle.monthlyExpensePriceText} >
                                        {this.max_monthly_limit}
                                    </Text>
                                </Text>
                            </View>
                            <View style={expenselistStyle.monthlyExpenseInputView}>
                                {/* A camera button to get images from camera or library */}
                                <TouchableOpacity style={expenselistStyle.button} onPress={this.onAttachImageClick}>
                                    <Image source={icon_camera_path}
                                        resizeMode="cover" style={expenselistStyle.attachmentImage}
                                    />
                                </TouchableOpacity>
                                {/* A View containing TextInput for Amount and Description */}
                                <View style={{ flex: 1, flexDirection: "column", margin: 10 }}>
                                    {/* A TextInput for Expense Amount */}
                                    <TextInput style={expenselistStyle.textInput}
                                        placeholder="Please enter amount"
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        defaultValue={this.state.amount}
                                        onChangeText={(text) => { this.setState({ amount: text }) }}
                                        value={this.state.amount}
                                        onPress={() => { this._descInput.focus() }}
                                        ref={component => this._amountInput = component}
                                        returnKeyType="next"
                                    />
                                    {/* A TextInput for Expense Description */}
                                    <TextInput style={[expenselistStyle.textInput, { marginTop: 5 }]}
                                        placeholder="Please enter description"
                                        multiline={true}
                                        maxLength={255}
                                        numberOfLines={0}
                                        defaultValue={this.state.description}
                                        value={this.state.description}
                                        onChangeText={(text) => { this.setState({ description: text }) }}
                                        ref={component => this._descInput = component}
                                        returnKeyType="send"
                                        onPress={this.onSendClick}
                                    />
                                </View>
                                {/* A button for Send */}
                                <TouchableOpacity style={expenselistStyle.button} onPress={this.onSendClick}>
                                    <Image source={icon_send_path}
                                        resizeMode="cover" style={expenselistStyle.attachmentImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    {/* A toast view to represent an error if any */}
                    <Toast
                        ref="toast"
                        style={{ backgroundColor: 'red' }}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{ color: 'white' }
                        }
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    /**
    * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
    */
    componentDidMount() {
    }

    //MARK:-=====================================
    //MARK: Camera Events
    //MARK:-=====================================

    chooseFile = () => {
        var options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.default.showImagePicker(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                alert('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert('ImagePicker Error: ' + response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                let source = response;
                this.setState({
                    filePath: source,
                });
            }
        });
    };
    // Open Camera
    launchCamera = () => {
        var options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.default.launchCamera(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                alert('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert('ImagePicker Error: ' + response.error);
            } else {
                let source = response;
                this.setState({
                    filePath: source,
                });
            }
        });
    };

    // Open Photo library
    launchLibrary = () => {
        var options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.default.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                alert('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert('ImagePicker Error: ' + response.error);
            } else {
                let source = response;
                this.setState({
                    filePath: source,
                });
            }
        });
    };

}

export default ExpenseListComponent;
