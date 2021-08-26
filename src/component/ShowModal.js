import React, { useState } from "react";
import { Switch } from "react-native";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Alert,
  Pressable,
  FlatList,
} from "react-native";
import ShowTag from "./ShowTag";
import firebase from "firebase";
import "firebase/firestore";
import recipeApi from "../config/recipeApi";
import { Context as AuthContext } from "../context/AuthProvider";

const ShowModal = ({ recipe }) => {
  //const tagState = Object.entries(recipe.tag);
  const [modalVisible, setModalVisible] = useState(false);
  const [tag, setTag] = useState(recipe.tag);
  const { state } = useState(AuthContext);

  const createTagSwitch = () => {
    const tagData = [];
    for (let i in tag) {
      if (i != "region") {
        tagData.push(
          <View key={i}>
            <Switch
              value={tag[i] == 0 ? false : true}
              onValueChange={() => {
                const updateTag = tag;
                updateTag[i] = updateTag[i] == 0 ? 1 : 0;
                setTag({ ...updateTag });
              }}
            />
            <Text>{i}</Text>
          </View>
        );
      }
    }
    return tagData;
  };

  const populateTag = () => {
    const tagArr = [];
    for (let i in tag) {
      if (i !== "region") {
        if (tag[i] === 1) tagArr.push(i);
      }
    }
    return tagArr;
  };

  const submitTag = (newTagArr) => {
    newTagArr.forEach((item) => {
      setTag({ ...tag, [item]: 1 });
    });
    firebase
      .firestore()
      .collection("recipes")
      .doc(recipe.recipe_id.toString())
      .update({
        tag: tag,
      })
      .catch((error) => {
        console.log(error.message);
      });
    recipeApi
      .post("/recipe_tag", {
        recipe_id: recipe.recipe_id.toString(),
        tag: tag,
      }, {
        headers: {
          'Authorization': state.accessToken,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removeTag = (tagToRemove) => {
    const tagArr = tag;
    delete tagArr[tagToRemove];
    setTag({ ...tagArr });
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
        <View style={styles.modalView}>
          <Text style={styles.mainModelText}>PRESS SPACE TO ADD TAG</Text>
          <ShowTag
            tags={populateTag()}
            submitTag={submitTag}
            removeTag={removeTag}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>CANCEL</Text>
          </Pressable>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>ADD TAG</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#0F52BA",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  switchConatinerStyle: {
    flexDirection: "row",
  },
  mainModelText: {
    marginHorizontal: 8,
    fontSize: 17,
    fontWeight: "bold",
    color: "#7bbfb5",
  },
});

export default ShowModal;
