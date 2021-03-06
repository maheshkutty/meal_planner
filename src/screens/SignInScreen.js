import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator
} from "react-native";
import UserForm from "../component/UserForm";
import { Context } from "../context/AuthProvider";
import firebase from "firebase";
import LoadingBig from "../component/LoadingBig";

const SignInScreen = ({ navigation }) => {
  const { state, signin, showErr, clearErrorMessage } = useContext(Context);
  const { admin, setAdmin } = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      clearErrorMessage();
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.navigate("UserDetail");
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );
  //   return () => backHandler.remove();
  // }, []);

  const onSignIn = ({ email, password }) => {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        checkAdmin(user.uid, email);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        showErr(errorMessage);
        setIsLoading(false);
      });
  };

  const checkAdmin = (userid,email) => {
    //function to check user is admin
    try {
      firebase
        .firestore()
        .collection("user")
        .doc(userid.toString())
        .get()
        .then((snapshot) => {
          console.log('Chk admin  ',snapshot.exists);
          if (snapshot.exists) {
            const data = snapshot.data();
            console.log(data)
            if (data.admin == true) {
              signin({ email, userid, isAdmin: true, foodAllergyArr: data.foodAllergyArr});
            } else {
              signin({ email, userid, isAdmin: false, foodAllergyArr: data.foodAllergyArr });
            }
          } else {
            signin({ email, userid, isAdmin: false });
          }
        });
        return true;
    } catch (error) {
      console.log(error);
    }
  };

  if(isLoading)
  {
    return <LoadingBig />
  }  

  return (
    <>
      <Text style={styles.firstText}>Welcome</Text>
      <Text style={styles.secondText}>Sign in to continue</Text>
      <UserForm
        onPost={onSignIn}
        bname="Sign In"
        errorMessage={state.errorMessage}
      />
      {/* {state.errorMessage ? <Text style color= "#FF0000" >   Something went wrong</Text> : null} */}
      <TouchableOpacity onPress={() => {
        navigation.navigate("ForgetPass")
      }}>
        <Text style={styles.forgetTextStyle}>Forget Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}>
        <Text style={styles.lastElement}>Create a new Account? Sign up</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  firstText: {
    marginTop: 150,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  secondText: {
    textAlign: "center",
    marginBottom: 35,
    color: "grey",
    fontSize: 17,
  },
  lastElement: {
    textAlign: "center",
    margin: 10,
    paddingTop: 10,
    color: "grey",
    fontSize: 13,
  },
  forgetTextStyle:{
    color:"blue",
    fontSize:15,
    fontWeight:'bold',
    textAlign:'right',
    marginHorizontal:10
  }
});

export default SignInScreen;
