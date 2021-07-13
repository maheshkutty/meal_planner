import React, { useEffect, useContext } from "react";
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
      <Image source={require("../../assets/icon.png")} style={{height: 20, width:20}} />
      <Text>Welcome!!</Text>
      <Text>Sign in with account</Text>
      <View>
        <Button
          title="Registration"
          onPress={() => navigation.navigate("UserDetail")}
        >
          <LinearGradient colors={["#08d4c4", "#01ab9d"]} style={styles.signIn}>
            <Text style={styles.textSign}>Get Started</Text>
            <MaterialIcons name="navigate-next" color="#fff" size={20} />
          </LinearGradient>
        </Button>
        <Button title="Sign in" onPress={() => navigation.navigate("SignIn")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  signIn: {},
  textSign: {},
});

export default LandingScreen;
