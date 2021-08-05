import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native-elements";

const UserHeader = ({userName, gender}) => {

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <Text style={styles.textStyle}>Hello {userName},</Text>
      {gender == "female" ? (
        <Image
          source={require("../../assets/femaleuser.png")}
          style={styles.userImageStyle}
        />
      ) : (
        <Image
          source={require("../../assets/maleuser.png")}
          style={styles.userImageStyle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    textAlign: "left",
    marginTop: 20,
    color:"#7bbfb5",
    fontWeight:'bold'
  },
  userImageStyle: {
    width: 60,
    height: 60,
    marginTop:10,
    marginLeft:60
  },
  homeRecipeImageStyle:{
    width: 80,
    height: 80,
    marginRight:50
  }
});

export default UserHeader;
