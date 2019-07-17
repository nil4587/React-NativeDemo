import { StyleSheet } from "react-native";

export default (expenseSettingStyle = StyleSheet.create({
    textStyles: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold"
    },
    categoryImage: {
        height: '100%',
        aspectRatio: 1
    },
    categorySelectedImage: {
        height: '100%',
        aspectRatio: 1,
        borderRadius: 10.0,
        borderWidth: 1.5,
        borderColor: "pink"
    },
    categoryRow: {
        margin: 10,
        padding: 0,
    },
    categoryListView: {
        margin: 10,
    },
    safeAreaView: {
        flex: 1
    },
    headerView: {
        backgroundColor: "#CFF1",
        justifyContent: "center",
        height: '18%',
    },
    middleView: {
        padding: 10,
        backgroundColor: "#CCDDEE",
        height: '25%',
    },
    bottomView: {
        backgroundColor: "#CCDDEE",
        height: '57%',
        padding: 10
    },
    noRecordView: {
        fontWeight: "bold",
        color: "black",
        textAlign: "center"
    },
    monthlyExpenseTitleText: {
        padding: 10,
    },
    monthlyExpensePriceText: {
        margin: 5,
    },
    textInput: {
        backgroundColor: "gray",
        borderRadius: 5.0,
        padding: 10,
        height: "25%",
        marginTop: 10,
        width: "50%"
    },
    button: {
        alignSelf: "center",
        width: "30%",
        backgroundColor: "green",
        height: "12%",
        justifyContent: "center",
        alignItems: "center"
    }
}));
