import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Context as AuthContext } from "../context/AuthProvider";
import firebase from "firebase";
import "firebase/firestore";

//when app starts load this function is called based on that user redirected to page
const ResolveAuthScreen = ({ navigation }) => {
  const { state, restore_token } = useContext(AuthContext);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        navigation.navigate("Landing");
      } else {
        firebase
          .firestore()
          .collection("user")
          .doc(user.uid.toString())
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Reslove auth call");
              const data = doc.data();
              restore_token({
                email: user.email,
                userid: user.uid,
                foodAllergyArr: data.foodAllergyArr,
                isAdmin: data.admin,
              });
              setIsLoading(false);
              if (data.admin) {
                console.log("True admin");
                navigation.navigate("AdminHome");
              } else {
                console.log("normal user");
                navigation.navigate("DrawerHome");
              }
            } else navigation.navigate("DrawerHome");
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    });
    return unsubscribeAuth;
  }, []);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return null;
};

export default ResolveAuthScreen;
