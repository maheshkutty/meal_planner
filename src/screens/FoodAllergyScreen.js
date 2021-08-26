import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, Input } from "react-native-elements";
import FoodCheckBox from "../component/FoodCheckBox";
import { MaterialIcons } from "@expo/vector-icons";

const FoodAllergyScreen = ({ navigation, route }) => {
  const [egg, setEgg] = useState(false);
  const [peanut, setPeanut] = useState(false);
  const [treeNut, setTreeNut] = useState(false);
  const [shellFish, setShellFish] = useState(false);
  const [wheat, setWheat] = useState(false);
  const [others, setOthers] = useState(false);
  const [otherFoodAllergry, setotherFoodAllergry] = useState("");
  const { name, weight, heFeet, heInches, date, gender } = route.params;

  const handleSubmit = () => {
    const foodAllergyArr = [];
    if (egg) {
      foodAllergyArr.push("egg");
    } else if (peanut) {
      foodAllergyArr.push("peanut");
    } else if (treeNut) {
      foodAllergyArr.push("Treenut");
    } else if (wheat) {
      foodAllergyArr.push("wheat");
    } else if(others) {
      const textFoodAllergy = otherFoodAllergry;
      textFoodAllergy = otherFoodAllergry.toLowerCase().trim();
      foodAllergyArr.push(textFoodAllergy);
    }
    navigation.navigate("Signup", {
      name,
      weight,
      heFeet,
      heInches,
      date,
      gender,
      foodAllergyArr
    })
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Specify Any Food Allergy</Text>
        <View style={styles.foodCheckBoxContain}>
          <FoodCheckBox name="Egg" data={egg} setData={() => setEgg(!egg)} />
          <FoodCheckBox
            name="Peanut"
            data={peanut}
            setData={() => setPeanut(!peanut)}
          />
          <FoodCheckBox
            name="Tree Nut"
            data={treeNut}
            setData={() => setTreeNut(!treeNut)}
          />
          <FoodCheckBox
            name="Shell Fish"
            data={shellFish}
            setData={() => setShellFish(!shellFish)}
          />
          <FoodCheckBox
            name="Wheat"
            data={wheat}
            setData={() => setWheat(!wheat)}
          />
          <FoodCheckBox
            name="Others"
            data={others}
            setData={() => setOthers(!others)}
          />
          {others ? (
            <Input
              label="Other Food Allergy"
              containerStyle={styles.inputContainStyle}
              inputStyle={styles.inputStyle}
              value={otherFoodAllergry}
              onChangeText={setotherFoodAllergry}
            />
          ) : null}
        </View>
        <View style={styles.nextIcon}>
          <TouchableOpacity onPress={handleSubmit}>
            <MaterialIcons name="navigate-next" size={50} color="#0F52BA" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: "#f6f6f6",
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
  foodCheckBoxContain: {
    marginLeft: 20,
    marginRight: 20,
  },
  buttonStyle: {
    color: "#0F52BA",
    width: 100,
    backgroundColor: "#0F52BA",
    marginVertical: 20,
  },
  inputStyle: {
    // marginTop:2
  },
  inputContainStyle: {
    marginTop: 8,
  },
  nextIcon: {
    alignItems: "flex-end",
    paddingTop: 5
  },
});

export default FoodAllergyScreen;
