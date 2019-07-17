import React, { Component } from "react";
import {
    View, Text, SafeAreaView,
    Button, ListView, Image,
    TouchableOpacity, AsyncStorage,
    KeyboardAvoidingView, ScrollView,
    TextInput
} from "react-native";
import expenseSettingStyle from "./ExpenseSettingCss";
import Toast, { DURATION } from "react-native-easy-toast";

class ExpenseSettingComponent extends Component {
    category_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    categories = []
    max_monthly_limit = "0.00"
    total_monthly_expense = 0.00

    constructor(props) {
        super(props);
        this.state = {
            amount: "0.00",
            selectedCategory: null
        };
        this.loadDataFromAsyncStorage()
    }

    async loadDataFromAsyncStorage() {
        try {
            //await AsyncStorage.removeItem("default_categories")
            const strjson = await AsyncStorage.getItem("default_categories")
            this.categories = JSON.parse(strjson)
            const category = this.categories[0]
            this.max_monthly_limit = category.cat_month_limit
            this.setState({
                selectedCategory: category,
                categoriesDataSource: this.category_ds.cloneWithRows(this.categories),
            })
            this.total_monthly_expense = 0.00
            // Compare and update the category's cat_expenses list
            this.categories.forEach((value, index) => {
                if (parseInt(value.cat_id) == parseInt(category.cat_id)) {
                    value.cat_expenses.forEach((value1, index) => {
                        this.total_monthly_expense += parseFloat(value1.amount)
                    })
                    console.log(value.cat_name)
                }
            })
        } catch (error) {
            this.setState({
                selectedCategory: null,
            })
            console.log(error.message)
            this.refs.toast.show(error.message, DURATION.LONG_TIME)
        }
    }

    // On click of Expense Category 
    onCategoryItemClick(item, sectionID, rowID) {
        console.log(item.cat_name, sectionID, rowID)
        this.max_monthly_limit = item.cat_month_limit
        this.total_monthly_expense = 0.00
        this.setState({
            selectedCategory: item,
        })
        // Compare and update the category's cat_expenses list
        this.categories.forEach((value, index) => {
            if (parseInt(value.cat_id) == parseInt(item.cat_id)) {
                value.cat_expenses.forEach((value1, index) => {
                    this.total_monthly_expense += parseFloat(value1.amount)
                })
                console.log(value.cat_name)
            }
        })
    }

    renderCategoryRow = (item, sectionID, rowID) => {
        console.log(sectionID, rowID)
        var rowTheme = expenseSettingStyle.categoryImage
        if (this.state.selectedCategory != null && item.cat_id == this.state.selectedCategory.cat_id) {
            rowTheme = expenseSettingStyle.categorySelectedImage
        }
        return (
            <View nativeID={rowID} style={expenseSettingStyle.categoryRow}>
                <TouchableOpacity onPress={() => {
                    this.onCategoryItemClick(item, sectionID, rowID)
                }}>
                    <Image source={this.imagepath(item.cat_id)} resizeMode="cover" style={rowTheme} />
                </TouchableOpacity>
            </View>
        )
    }

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

    getCategoryView = () => {
        return (
            <ListView
                style={expenseSettingStyle.categoryListView}
                testID="categorylist"
                horizontal={true}
                dataSource={this.state.categoriesDataSource}
                renderRow={this.renderCategoryRow}
            />
        )
    }

    // To get a view with "No record title"
    getNoRecordText = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={expenseSettingStyle.noRecordView}> No record found </Text>
            </View>
        )
    }

    // Save button click event
    onSaveClick = () => {
        const amount = this._amountInput.props.value.trim()
        if (amount == null || amount.length == 0 || parseFloat(amount) <= 0.00) {
            this.refs.toast.show("Please enter a valid amount", 3000);
        } else if (parseFloat(amount) < this.total_monthly_expense) {
            this.refs.toast.show("Amount should not less than the total expense of the selected month.", 3000);
        } else {
            const { selectedCategory } = this.state;
            selectedCategory.cat_month_limit = amount
            this.max_monthly_limit = amount
            // Compare and update the category's cat_expenses list
            this.categories.forEach((value, index) => {
                if (parseInt(value.cat_id) == parseInt(selectedCategory.cat_id)) {
                    value.cat_month_limit = amount
                    console.log(value.cat_name)
                }
            })
            // Reload category & expense list after this change
            this.setState({
                selectedCategory: selectedCategory,
                categoriesDataSource: this.category_ds.cloneWithRows(this.categories),
            })

            // Update the categories list after adding an item 
            try {
                AsyncStorage.setItem("default_categories", JSON.stringify(this.categories))
                // Clear the textfields after successful send
                this._amountInput.clear()
                // Callback handler: To move back to parent
                const { callback } = this.props.navigation.state.params;
                callback()
                // Pop to previous view
                this.props.navigation.goBack()
            } catch (error) {
                console.log(error.message)
            }
        }
    }


    render() {
        const categoryView = (this.categories.length <= 0) ? this.getNoRecordText() : this.getCategoryView()
        return (
            <SafeAreaView style={expenseSettingStyle.safeAreaView}>
                <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={100} behavior={"height"}>
                    {/* Header View */}
                    <View style={expenseSettingStyle.headerView} >
                        {categoryView}
                    </View>

                    {/* Middle View */}
                    <View style={expenseSettingStyle.middleView}>
                        {/* Monthly spent expenses */}
                        <Text style={expenseSettingStyle.monthlyExpenseTitleText}>
                            Monthly Expense Limit : $
                                    <Text style={expenseSettingStyle.monthlyExpensePriceText} >
                                {this.max_monthly_limit}
                            </Text>
                        </Text>

                        {/* A TextInput for Month limit */}
                        <TextInput style={expenseSettingStyle.textInput}
                            placeholder="Please enter amount"
                            maxLength={4}
                            keyboardType="number-pad"
                            defaultValue={this.state.amount}
                            onChangeText={(text) => { this.setState({ amount: text }) }}
                            value={this.state.amount}
                            onPress={() => { }}
                            ref={component => this._amountInput = component}
                            returnKeyType="done"
                        />
                    </View>

                    {/* Bottom View */}
                    <View style={expenseSettingStyle.bottomView}>
                        {/* A button for Save & Close */}
                        <TouchableOpacity style={expenseSettingStyle.button} onPress={this.onSaveClick}>
                            <Text style={{ fontWeight: "bold", color: "white" }}> Save </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                {/* A toast view to represent an error if any */}
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'red' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
                />
            </SafeAreaView>
        );
    }
}

export default ExpenseSettingComponent;