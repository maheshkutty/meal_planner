import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, Modal } from "react-native";
import { Switch, Button } from "react-native-elements";
import firebase from "firebase";
import { Context } from "../context/AuthProvider";
import ToastMessage from "./ToastMessage";

const AddRecipeHistory = ({recipeId, recipeName}) => {
  const { state } = useContext(Context);
  const [breakfast, setBreakFast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const AddUserConsumptions = () => {
    const ref = firebase
      .firestore()
      .collection("user")
      .doc(state.userid.toString())
      .collection("nutrition");
    const currentDate = new Date(Date.now());
    let todayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    todayDate = Math.floor(todayDate.getTime() / 1000);
    ref
      .doc(todayDate.toString())
      .get()
      .then((doc) => {
        let data = {
          breakfast: {},
          lunch: {},
          dinner: {},
          timestamp:todayDate.toString()
        };
        if (doc.exists) {
          data = doc.data();
          data.timestamp = todayDate.toString();
          delete data.breakfast[recipeId];
          delete data.lunch[recipeId];
          delete data.dinner[recipeId];
        }
        if (breakfast) {
          data.breakfast[recipeId] = {
            name: recipeName,
          };
        }
        if (lunch) {
          data.lunch[recipeId] = {
            name: recipeName,
          };
        }
        if (dinner) {
          data.dinner[recipeId] = {
            name: recipeName,
          };
        }
        console.log(data);
        ref
          .doc(todayDate.toString())
          .set(data)
          .then(() => {
            console.log("Data successfully inserted");
            ToastMessage("Added to your diary");
            setModalVisible(false);
          }).catch((err) => {
            console.log("Set Nutrition history", err.message)
          });
      }).catch((err) => {
        console.log("Get Nutrition history", err.message)
      });;
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerSwitch}>
              <Text style={styles.textStyle}>Break Fast</Text>
              <Switch
                value={breakfast}
                color="blue"
                onValueChange={setBreakFast}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={breakfast ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
            <View style={styles.containerSwitch}>
              <Text style={styles.textStyle}>Lunch</Text>
              <Switch
                value={lunch}
                color="blue"
                onValueChange={setLunch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={lunch ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
            <View style={styles.containerSwitch}>
              <Text style={styles.textStyle}>Dinner</Text>
              <Switch
                value={dinner}
                color="blue"
                onValueChange={setDinner}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={dinner ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
            <View style={styles.buttonConatiner}>
              <Button
                title="Save"
                raised={true}
                type="outline"
                onPress={() => {
                  AddUserConsumptions();
                }}
              />
              <Button
                title="Close"
                onPress={() => setModalVisible(!modalVisible)}
                buttonStyle={{
                  marginVertical: 5,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Button title="Add To Diary" buttonStyle={styles.buttonStyle} onPress={() => setModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  containerSwitch: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  textStyle: {
    margin: 10,
    padding: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonConatiner: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  buttonStyle: {
    color: "#0F52BA",
    backgroundColor: "#0F52BA",
    marginVertical: 20,
    marginHorizontal: 10,
  },
});

export default AddRecipeHistory;
