import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Button, Input } from "react-native-elements";
import firebase from "firebase";
import { Context } from "../context/AuthProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LogBox } from "react-native";

const fetchNutrionalValue = (nutrional) => {
  try {
    if (nutrional == undefined || nutrional.length == 0) {
      console.log("nutrional", nutrional);
      return null;
    } else {
      nutrional = nutrional.replace(/u\'/g, '"');
      nutrional = nutrional.replace(/\'/g, '"');
      nutrional = nutrional.replace(/False/g, false);
      nutrional = nutrional.replace(/True/g, true);
      nutrional = JSON.parse(nutrional);
      nutrional = {
        protein: nutrional["protein"].displayValue,
        cal: nutrional["calories"].displayValue,
        carb: nutrional["carbohydrates"].displayValue,
        fat: nutrional["fat"].displayValue,
      };
      return nutrional;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

const ShowUserDiary = ({ navigation }) => {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    console.log(currentDate);
    console.log(currentDate.getDate());
    setBreakFast([]);
    setLunch([]);
    setDinner([]);
    let checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    checkDate = Math.floor(checkDate.getTime() / 1000);
    checkUserData(checkDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const getDateFormat = () => {
    let result = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    return result;
  };

  const { state } = useContext(Context);
  const [diaryData, setDiaryData] = useState({});
  const [breakfast, setBreakFast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [checkData, setCheckData] = useState(false);
  const [allNutritions, setAllNutritions] = useState({});

  const readRecipes = () => {
    let keyToRead = [];
    if (diaryData.breakfast != undefined) {
      let tempArr = Object.keys(diaryData.breakfast);
      //keyToRead.push(...tempArr);
      if (tempArr.length != 0)
        firebase
          .firestore()
          .collection("recipes")
          .where(firebase.firestore.FieldPath.documentId(), "in", tempArr)
          .get()
          .then((querySelector) => {
            let breakFastArr = [];
            console.log("querySelector", querySelector.size);
            querySelector.forEach((item) => {
              let data = item.data();
              let nutrional = fetchNutrionalValue(data["nutritions"]);
              breakFastArr.push({
                recipe_name: data["recipe_name"],
                recipe_id: data["recipe_id"],
                nutrional: nutrional,
              });
            });
            setBreakFast(breakFastArr);
          })
          .catch((err) => {
            console.log(err);
          });
    }
    if (diaryData.lunch != undefined) {
      let tempArr = Object.keys(diaryData.lunch);
      keyToRead.push(...tempArr);
      if (tempArr.length != 0)
        firebase
          .firestore()
          .collection("recipes")
          .where(firebase.firestore.FieldPath.documentId(), "in", tempArr)
          .get()
          .then((querySelector) => {
            let lunchArr = [];
            querySelector.forEach((item) => {
              let data = item.data();
              let nutrional = fetchNutrionalValue(data["nutritions"]);
              console.log(nutrional);
              lunchArr.push({
                recipe_name: data["recipe_name"],
                recipe_id: data["recipe_id"],
                nutrional: nutrional,
              });
            });
            console.log(lunchArr);
            setLunch(lunchArr);
          })
          .catch((err) => {
            console.log(err);
          });
    }
    if (diaryData.dinner != undefined) {
      let tempArr = Object.keys(diaryData.dinner);
      //keyToRead.push(...tempArr);
      if (tempArr.length != 0)
        firebase
          .firestore()
          .collection("recipes")
          .where(firebase.firestore.FieldPath.documentId(), "in", tempArr)
          .get()
          .then((querySelector) => {
            let dinnerArr = [];
            querySelector.forEach((item) => {
              let data = item.data();
              let nutrional = fetchNutrionalValue(data["nutritions"]);
              console.log(nutrional);
              dinnerArr.push({
                recipe_name: data["recipe_name"],
                recipe_id: data["recipe_id"],
                nutrional: nutrional,
              });
            });
            console.log(dinnerArr);
            setDinner(dinnerArr);
          })
          .catch((err) => {
            console.log(err);
          });
    }
    console.log(keyToRead);
  };

  const calAllNutritions = () => {
    let cal = 0,
      carbs = 0,
      protein = 0,
      fat = 0;
    if (breakfast.length != 0) {
      breakfast.forEach((item) => {
        if (item.nutrional != null) {
          cal = cal + parseInt(item.nutrional["cal"]);
          carbs = carbs + parseInt(item.nutrional["carb"]);
          fat = fat + parseInt(item.nutrional["fat"]);
          protein = protein + parseInt(item.nutrional["protein"]);
        }
      });
    }
    if (lunch.length != 0) {
      lunch.forEach((item) => {
        if (item.nutrional != null) {
          cal = cal + parseInt(item.nutrional["cal"]);
          carbs = carbs + parseInt(item.nutrional["carb"]);
          fat = fat + parseInt(item.nutrional["fat"]);
          protein = protein + parseInt(item.nutrional["protein"]);
        }
      });
    }
    if (dinner.length != 0) {
      dinner.forEach((item) => {
        if (item.nutrional != null) {
          cal = cal + parseInt(item.nutrional["cal"]);
          carbs = carbs + parseInt(item.nutrional["carb"]);
          fat = fat + parseInt(item.nutrional["fat"]);
          protein = protein + parseInt(item.nutrional["protein"]);
        }
      });
    }
    let tempdata = {
      cal,
      protein,
      carbs,
      fat,
    };
    console.log(tempdata);
    setAllNutritions(tempdata);
  };

  const checkUserData = (todayDate) => {
    console.log(state.userid.toString());
    firebase
      .firestore()
      .collection("user")
      .doc(state.userid.toString())
      .collection("nutrition")
      .doc(todayDate.toString())
      .get()
      .then((doc) => {
        console.log("Daily call");
        if (doc.exists) {
          setDiaryData(doc.data());
          setCheckData(true);
        } else {
          setCheckData(false);
        }
      });
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);


  useEffect(() => {
    readRecipes();
    calAllNutritions();
  }, [diaryData]);

  useEffect(() => {
    calAllNutritions();
  }, [breakfast, lunch, dinner]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (state.accessToken != "") {
        setBreakFast([]);
        setLunch([]);
        setAllNutritions({});
        setDinner([]);
        setDiaryData({});
        console.log("Checkdata effect called");
        setDate(new Date(Date.now()));
        const currentDate = new Date(Date.now());
        let todayDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        );
        todayDate = Math.floor(todayDate.getTime() / 1000);
        checkUserData(todayDate);
      }
    });
    return unsubscribe;
  }, [navigation, state.accessToken]);

  if (!checkData) {
    return (
      <View style={styles.recipeview}>
        <TouchableOpacity onPress={showDatepicker}>
          <Input
            placeholder="Choose Date"
            disabled={true}
            value={getDateFormat()}
            inputStyle={{
              textAlign: "center",
              elevation: 0,
              borderTopWidth: 1,
              marginVertical: 5,
            }}
            containerStyle={{
              borderWidth: 0,
            }}
          />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
          <Text style={{
            fontWeight:'bold',
            fontSize:20,
            marginTop:60
          }}>Data not availiable</Text>
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 25,
          marginVertical: 10,
        }}
      >
        Diary
      </Text>
      <View style={styles.recipeview}>
        <TouchableOpacity onPress={showDatepicker}>
          <Input
            placeholder="Choose Date"
            disabled={true}
            value={getDateFormat()}
            inputStyle={{
              textAlign: "center",
              elevation: 0,
              borderTopWidth: 1,
              marginVertical: 5,
            }}
            containerStyle={{
              borderWidth: 0,
            }}
          />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <Text
        style={{
          fontSize: 20,
          color: "black",
          fontWeight: "bold",
          marginHorizontal: 5,
        }}
      >
        All Nutritions
      </Text>
      <View
        style={[
          styles.listContainer,
          { flexDirection: "row", justifyContent: "space-around" },
        ]}
      >
        <View>
          <Text>Calories</Text>
          <Text>{allNutritions.cal}g</Text>
        </View>
        <View>
          <Text>Protein</Text>
          <Text>{allNutritions.protein}g</Text>
        </View>
        <View>
          <Text>Carbohydrates</Text>
          <Text>{allNutritions.carbs}g</Text>
        </View>
        <View>
          <Text>Fat</Text>
          <Text>{allNutritions.fat}g</Text>
        </View>
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.subHeaderText}>BreakFast</Text>
        <FlatList
          data={breakfast}
          keyExtractor={(item) => item.recipe_id}
          renderItem={({ item }) => {
            return (
              <View style={styles.listContainer}>
                <Text style={styles.recipeNameText}>{item.recipe_name}</Text>
                <View style={styles.nutrionalStyle}>
                  {item.nutrional != null ? (
                    <View style={styles.nutrionalStyle}>
                      <Text style={[styles.textStyle, styles.calStyle]}>
                        Calorie: {item.nutrional.cal}Kcal
                      </Text>
                      <Text style={[styles.textStyle, styles.proteinStyle]}>
                        Protein: {item.nutrional.protein}g
                      </Text>
                      <Text style={[styles.textStyle, styles.carboStyle]}>
                        Carbs: {item.nutrional.carb}g
                      </Text>
                      <Text style={[styles.textStyle, styles.fatStyle]}>
                        Fat: {item.nutrional.fat}g
                      </Text>
                    </View>
                  ) : (
                    <Text>No Information</Text>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Add BreakFast</Text>
          }
        />
      </View>
      <Text style={styles.subHeaderText}>Lunch</Text>
      <View>
        <FlatList
          data={lunch}
          keyExtractor={(item) => item.recipe_id}
          renderItem={({ item }) => {
            return (
              <View style={styles.listContainer}>
                <Text style={styles.recipeNameText}>{item.recipe_name}</Text>
                <View style={styles.nutrionalStyle}>
                  {item.nutrional != null ? (
                    <View style={styles.nutrionalStyle}>
                      <Text style={[styles.textStyle, styles.calStyle]}>
                        Calorie: {item.nutrional.cal}Kcal
                      </Text>
                      <Text style={[styles.textStyle, styles.proteinStyle]}>
                        Protein: {item.nutrional.protein}g
                      </Text>
                      <Text style={[styles.textStyle, styles.carboStyle]}>
                        Carbs: {item.nutrional.carb}g
                      </Text>
                      <Text style={[styles.textStyle, styles.fatStyle]}>
                        Fat: {item.nutrional.fat}g
                      </Text>
                    </View>
                  ) : (
                    <Text>No Information</Text>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Add Lunch</Text>
          }
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.subHeaderText}>Dinner</Text>
        <FlatList
          data={dinner}
          keyExtractor={(item) => item.recipe_id}
          renderItem={({ item }) => {
            return (
              <View style={styles.listContainer}>
                <Text style={styles.recipeNameText}>{item.recipe_name}</Text>
                <View style={styles.nutrionalStyle}>
                  {item.nutrional != null ? (
                    <View style={styles.nutrionalStyle}>
                      <Text style={[styles.textStyle, styles.calStyle]}>
                        Calorie: {item.nutrional.cal}Kcal
                      </Text>
                      <Text style={[styles.textStyle, styles.proteinStyle]}>
                        Protein: {item.nutrional.protein}g
                      </Text>
                      <Text style={[styles.textStyle, styles.carboStyle]}>
                        Carbs: {item.nutrional.carb}g
                      </Text>
                      <Text style={[styles.textStyle, styles.fatStyle]}>
                        Fat: {item.nutrional.fat}g
                      </Text>
                    </View>
                  ) : (
                    <Text>No Information</Text>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Add Dinner</Text>
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  nutrionalStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  listContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 10,
    shadowColor: "#EEEEEE",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: "#EEEEEE", //"#fce38a"
    borderRadius: 15,
  },
  textStyle: {
    marginRight: 5,
    marginVertical: 5,
  },
  subHeaderText: {
    fontSize: 20,
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  recipeNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#364f68",
  },
  recipeview: {
    flexDirection: "column",
  },
  carboStyle: {
    backgroundColor: "#39CCCC",
    borderRadius: 5,
    padding: 5,
    color: "white",
    fontWeight: "bold",
  },
  proteinStyle: {
    backgroundColor: "#F012BE",
    borderRadius: 5,
    padding: 5,
    color: "white",
    fontWeight: "bold",
  },
  fatStyle: {
    backgroundColor: "#FF4136",
    borderRadius: 5,
    padding: 5,
    color: "white",
    fontWeight: "bold",
  },
  calStyle: {
    backgroundColor: "#303841", //"#B10DC9",
    borderRadius: 5,
    padding: 5,
    color: "white",
    fontWeight: "bold",
  },
  emptyListText: {
    fontSize: 15,
    marginHorizontal: 5,
    marginVertical: 5,
  },
});

export default ShowUserDiary;
