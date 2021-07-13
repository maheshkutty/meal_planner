import React, { useContext, useEffect  } from "react";
import { Context as AuthContext } from "../context/AuthProvider";
import * as firebase from 'firebase';

const ResolveAuthScreen = ({ navigation }) => {
  const { state, restore_token } = useContext(AuthContext);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        console.log("No sign in");
        navigation.navigate("Landing");
      } else {
        restore_token({ email: user.email, userid: user.uid });
        navigation.navigate("Home");
      }
    });
  }, []);
  return null;
};

export default ResolveAuthScreen;
