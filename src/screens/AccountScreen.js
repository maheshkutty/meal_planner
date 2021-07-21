import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import { Context as AuthContext } from '../context/AuthProvider'

const AccountScreen = ({ navigation }) => {
  const { state, signOut } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    firebase.firestore().collection("user").doc(state.userid.toString()).get().then((doc) => {
      if(doc.exists)
      {
        const { email, heFeet, heInches, name, weight } = doc.data();
        setUserData({
          email,
          heFeet,
          heInches,
          name,
          weight
        });
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [])
  
  const logOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("User logged out sucessfully");
        navigation.navigate("Landing");
      })
      .catch((error) => {
        console.log(error);
      });
  };



  return (
    <View style={styles.container}>
      <Ionicons
        name="person-circle"
        size={100}
        color="black"
        style={styles.iconStyle}
      />
      <Text style={styles.mainText}>Personal Details</Text>
      <View style={styles.formatInput}>
          <Text style={styles.textStyle}>Name</Text>
          <Text style={styles.textStyle}>{userData.name}</Text>
      </View>
      <View style={styles.formatInput}>
          <Text style={styles.textStyle}>Email</Text>
          <Text style={styles.textStyle}>{userData.email}</Text>
      </View>
      <View style={styles.formatInput}>
          <Text style={styles.textStyle}>Weight</Text>
          <Text style={styles.textStyle}>{userData.weight}</Text>
      </View><View style={styles.formatInput}>
          <Text style={styles.textStyle}>Height Feet</Text>
          <Text style={styles.textStyle}>{userData.heFeet}</Text>
      </View>
      <View style={styles.formatInput}>
          <Text style={styles.textStyle}>Height Inches</Text>
          <Text style={styles.textStyle}>{userData.heInches}</Text>
      </View>
      <Text>Goals</Text>
      <Button
        title="Sign Out"
        onPress={logOutUser}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    alignItems: "center",
  },
  buttonStyle: {
    color: "#0F52BA",
    width: 100,
    backgroundColor: "#0F52BA",
    marginVertical: 20,
  },
  iconStyle: {
    textAlign: "center",
  },
  mainText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  formatInput:{
    flexDirection:'row',
    marginVertical:10,
    alignSelf:'stretch',
    marginHorizontal:20,
    justifyContent:'space-between'
  },
  textStyle:{
    fontSize:18
  }
});

export default AccountScreen;
