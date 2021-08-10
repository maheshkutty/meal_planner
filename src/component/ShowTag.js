import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable
} from "react-native";
import { Input, Button } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

const ShowTag = ({ tags, submitTag, removeTag }) => {
  const [newTag, setNewtag] = useState("");
  const [stateTag, setStateTag] = useState(tags);
  const displayTags = () => {
    return stateTag.map((item) => {
      return (
        <View style={styles.tagElement} key={item}>
          <Text style={styles.textStyle}>{item}</Text>
          <TouchableOpacity
            onPress={() => {
              let tempTags = stateTag.filter((tag) => tag !== item);
              setStateTag(tempTags);
              removeTag(item);
            }}
          >
            <MaterialIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
        </View>
      );
    });
  };
  return (
    <View style={styles.conatiner}>
      {displayTags()}
      <Input
        placeholder="ADD TAG"
        value={newTag}
        autoCorrect={false}
        onChangeText={setNewtag}
        onKeyPress={(e) => {
          if (e.nativeEvent.key == " " && newTag != " ") {
            console.log("Space key pressed")
            let tempTag = newTag.toLowerCase();
            tempTag = tempTag.trimEnd();
            if (stateTag.indexOf(tempTag) < 0) {
              setStateTag([...stateTag, tempTag]);
            }
            setNewtag("");
          }
          if (newTag == " ") setNewtag("");
        }}
      />
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => {
          submitTag(stateTag);
        }}
      >
        <Text style={styles.buttonTextStyle}>SAVE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: "row",
    alignSelf: "flex-start",
    flexWrap: "wrap",
  },
  tagElement: {
    flexDirection: "row",
    backgroundColor: "#0F52BA",
    borderRadius: 10,
    padding: 5,
    alignContent: "flex-start",
    alignItems: "center",
    marginLeft: 5,
    marginVertical: 5,
  },
  textStyle: {
    color: "white",
    marginRight: 10,
    fontSize:15,
    fontWeight:'bold',
    letterSpacing:1.5
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#0F52BA",
    minWidth:300,
    marginBottom:5
  }
});

export default ShowTag;
