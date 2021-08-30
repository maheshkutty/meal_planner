import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Context as AuthContext } from "../context/AuthProvider";
import firebase from "firebase";
import "firebase/firestore";
import { FlatList } from "react-native";

//when app starts load this function is called based on that user redirected to page
const ResolveAuthScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleNavigate = async (doc, user) => {
    if (doc.exists) {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const data = doc.data();
      await restore_token({
        email: user.email,
        userid: user.uid,
        foodAllergyArr: data.foodAllergyArr,
        isAdmin: data.admin,
        accessToken: idToken,
      });
      setIsLoading(true);
      if (data.admin) {
        navigation.navigate("AdminHome");
      } else {
        navigation.navigate("DrawerHome");
      }
    } else navigation.navigate("DrawerHome");
  };

  const { state, restore_token } = useContext(AuthContext);
  const [token, setToken] = useState("");

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
            handleNavigate(doc, user);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  if (!isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor:"#cacaca" }}>
        <ActivityIndicator size={80} color="blue" />
      </View>
    );
  }else{
    return null;
  }
};

export default ResolveAuthScreen;
