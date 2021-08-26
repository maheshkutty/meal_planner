import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

const FoodCheckBox = ({ name, data, setData }) => {
  return (
    <TouchableOpacity onPress={setData}>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          size={15}
          iconRight
          iconType="material"
          checkedColor="#0F52BA"
          checkedIcon={
            <MaterialIcons name="check-circle-outline" size={25} color="#0F52BA" />
          }
          uncheckedIcon={
            <MaterialIcons
              name="radio-button-unchecked"
              size={25}
              color="#0F52BA"
            />
          }
          uncheckedColor="#0F52BA"
          checked={data}
          onPress={setData}
        />
        <Text style={styles.textStyle}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 8,
  },
  textStyle: {
    paddingVertical: 15,
    fontSize: 15,
  },
});

export default FoodCheckBox;
