import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

const OtherAllergyTag = ({ stateTag, setStateTag }) => {
  const [newTag, setNewtag] = useState("");
  const displayTags = () => {
    return stateTag.map((item) => {
      return (
        <View style={styles.tagElement} key={item}>
          <Text style={styles.textStyle}>{item}</Text>
          <TouchableOpacity
            onPress={() => {
              let tempTags = stateTag.filter((tag) => tag !== item);
              setStateTag(tempTags);
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
        onChangeText={(item) => {
            const regex = /^[a-zA-Z0-9_ ]*$/g;
            if(!regex.test(item))
                setNewtag("");
            else
                setNewtag(item);
        }}
        onKeyPress={(e) => {
          console.log("Called key press");
          if (e.nativeEvent.key == " " && newTag != " ") {
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
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    padding: 10,
    elevation: 2,
    flexGrow: 1,
  },
  buttonClose: {
    backgroundColor: "#0F52BA",
    marginBottom: 5,
  },
});

export default OtherAllergyTag;
