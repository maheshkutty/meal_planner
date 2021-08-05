import React from "react";
import { Text, Button, View, StyleSheet } from "react-native";
import firebase from "firebase";
import "firebase/firestore";

const AdminHomeScreen = ({ navigation }) => {
  const logOutUser = async () => {
    await firebase.auth().signOut();
    //signOut();
    navigation.navigate("Landing");
  };
  return (
    <View style={styles.conatiner}>
      <Text style={styles.textStyle}>Welcome Admin</Text>
      <Button
        title="Sign Out"
        onPress={logOutUser}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner:{
    flex:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
  buttonStyle: {
    color: "#0F52BA",
    width: 100,
    backgroundColor: "#0F52BA",
    marginVertical: 20,
  },
  textStyle: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 40,
  },
});

export default AdminHomeScreen;
