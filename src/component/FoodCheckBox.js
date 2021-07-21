import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

const FoodCheckBox = ({ name, data, setData }) => {
  return (
    <View style={styles.checkBoxContainer}>
      <CheckBox
        iconRight
        iconType="material"
        checkedColor="red"
        checkedIcon={
          <MaterialIcons name="check-circle-outline" size={30} color="red" />
        }
        uncheckedIcon={
          <MaterialIcons name="radio-button-unchecked" size={30} color="red" />
        }
        uncheckedColor="red"
      />
      <Text style={styles.textStyle}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent:'flex-start',
    backgroundColor:'white',
    borderRadius:20,
    marginTop:10
  },
  textStyle:{
      paddingVertical:20,
      fontSize:15
  }
});

export default FoodCheckBox;
