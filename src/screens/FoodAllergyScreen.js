import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FoodCheckBox from "../component/FoodCheckBox";

const FoodAllergyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Specify Any Food Allergy</Text>
      <View style={styles.foodCheckBoxContain}>
        <FoodCheckBox name="Egg" />
        <FoodCheckBox name="Peanut" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor:'#f6f6f6'
  },
  checkBoxContainer: {
    flexDirection: "row",
  },
  textStyle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },
  foodCheckBoxContain:{
    marginLeft:20,
    marginRight:20
  }
});

export default FoodAllergyScreen;
