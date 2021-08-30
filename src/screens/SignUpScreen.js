import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Pressable, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import UserForm from "../component/UserForm";
import firebase from "firebase";
import "firebase/firestore";
import { Context } from "../context/AuthProvider";
import LoadingBig from "../component/LoadingBig";

const SignUpScreen = ({ navigation, route }) => {
  const { name, weight, heFeet, heInches, date, foodAllergyArr, gender } =
    route.params;
  const { state, signup, showErr, clearErrorMessage } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      clearErrorMessage();
    });
    return unsubscribe;
  }, [navigation]);

  const registerUser = ({ email, password }) => {
    setIsLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        firebase
          .firestore()
          .collection("user")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            weight,
            heFeet,
            heInches,
            date,
            email,
            password,
            gender,
            foodAllergyArr,
          })
          .then(() => {
              signup({
                email,
                userid: firebase.auth().currentUser.uid,
                foodAllergyArr: foodAllergyArr,
            })
          })
          .catch((err) => {
            console.log("Hello2", err);
            showErr(err.message);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log("Hello", err.message);
        console.log(typeof err);
        showErr(err.message);
        console.log(state.errorMessage);
        setIsLoading(false);
      });
  };

  if(isLoading)
  {
    return <LoadingBig />
  }  

  return (
    <>
      <Text style={styles.first}>Create New account</Text>
      <UserForm
        onPost={registerUser}
        bname="Sign Up"
        errorMessage={state.errorMessage}
      />
      <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}>
        <Text style={styles.lastElement}>Create a new Account? Sign up</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  first: {
    paddingTop: 200,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 30,
  },
  lastElement: {
    textAlign: "center",
    margin: 10,
    color: "grey",
  },
});

export default SignUpScreen;
