import React, { useContext, useState } from "react";
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
import ToastMessage from "./ToastMessage";

const ShowModal = ({ recipe }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tag, setTag] = useState(recipe.tag);
  const { state } = useContext(AuthContext);

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
    console.log(tag);
    for (let i in tag) {
      if (i !== "region") {
        if (tag[i] === 1) tagArr.push(i);
      }
    }
    return tagArr;
  };

  const submitTag = (newTagArr) => {
    let newTagState = tag;
    newTagArr.forEach((item) => {
      newTagState[item] = 1;
    });
    setTag(newTagState);
    firebase
      .firestore()
      .collection("recipes")
      .doc(recipe.recipe_id.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          firebase
            .firestore()
            .collection("recipes")
            .doc(recipe.recipe_id.toString())
            .update({
              tag: tag,
            })
            .catch((error) => {
              console.log("firebase tag", error.message);
            });
        } else {
          let newRecipeData = recipe;
          newRecipeData.tag = tag;
          firebase
            .firestore()
            .collection("recipes")
            .doc(newRecipeData.recipe_id.toString())
            .set(newRecipeData)
            .then(() => {
              console.log("Document successfully wite");
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    recipeApi
      .post(
        "/recipe_tag",
        {
          recipe_id: recipe.recipe_id.toString(),
          tag: tag,
        },
        {
          headers: {
            Authorization: state.accessToken,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("rest api tag", error);
      });
    setModalVisible(!modalVisible);
    ToastMessage("Tag added successfully");
  };

  const removeTag = (tagToRemove) => {
    const tagArr = tag;
    if (["lunch", "dinner", "breakfast"].indexOf(tagToRemove) >= 0)
      tagArr[tagToRemove] = 0;
    else delete tagArr[tagToRemove];
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
