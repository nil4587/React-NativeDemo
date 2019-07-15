import { StyleSheet, Dimensions } from "react-native";
const dim = Dimensions.get('screen');
const width = dim.width
const height = dim.height

export default (expenselistStyle = StyleSheet.create({
  textStyles: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold"
  },
  expenseRow: {
    margin: 10,
    padding: 0,
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
  // categorySelectedRow: {
  //   margin: 10,
  //   padding: 0,
  //   backgroundColor: "pink",
  //   borderRadius: 10.0
  // },
  categoryListView: {
    margin: 10
  },
  expenseListView: {
    flex: 1
  },
  safeAreaView: {
    flex: 1
  },
  headerView: {
    backgroundColor: "#CFF1",
    height: (dim.height * 0.15),
  },
  middleView: {
    backgroundColor: "#CCDDEE",
    height: (dim.height * 0.50),
  },
  bottomView: {
    backgroundColor: "#ABCDEF",
    height: (dim.height * 0.25),
    marginBottom: 0
  },
  noRecordView: {
    fontWeight: "bold",
    color: "black",
    textAlign: "center"
  },
  monthlyExpenseDisplayView: {
    backgroundColor: "blue",
    width: "100%",
    justifyContent: "space-evenly"
  },
  monthlyExpenseInputView: {
    flexDirection: "row",
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
  },
  monthlyExpenseTitleText: {
    padding: 5,
    backgroundColor: "green"
  },
  monthlyExpensePriceText: {
    margin: 5,
  },
  attachmentImage: {
    height: '100%',
    aspectRatio: 1
  },
  sendButton: {
    height: "100%",
    aspectRatio: 1,
  },
  textInput: {
    flex: 1,
    backgroundColor: "gray",
    borderRadius: 5.0,
    padding: 5
  },
  button: {
    height: "50%",
    aspectRatio: 1,
    alignSelf: "center"
  }
}));
