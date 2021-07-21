import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as firebase from "firebase";
import { Context as AuthContext } from "../context/AuthProvider";

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={{ height: 350, width: 350 }}
      />

      <Text style={styles.text}>Welcome!!</Text>
      <Text style={styles.textSign}>Sign in with account</Text>
      <View>
        <Button
          style={styles.button}
          color="#E91E63"
          title="Getting Started"
          onPress={() => navigation.navigate("UserDetail")}
        >
          <LinearGradient style={styles.signIn}>
            <MaterialIcons name="navigate-next" color="#fff" size={20} />
          </LinearGradient>
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.navigatebutton}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingBottom: 500,
  },
  signIn: {},
  textSign: {
    color: "grey",
    paddingTop: 5,
    fontSize: 15,
    paddingBottom: 50,
  },
  text: {
    paddingTop: 30,
    fontSize: 40,
    fontWeight: "bold",
  },

  navigatebutton: {
    paddingTop: 20,
    color: "grey",
  },
});

export default LandingScreen;
