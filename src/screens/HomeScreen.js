import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { Context } from "../context/AuthProvider";
import { getItemAsync } from "expo-secure-store";

const HomeScreen = ({ navigation }) => {
  const { state, signin, showErr } = useContext(Context);
  console.log(state);
  useEffect(() => {
    const backSync = async () => {
      try {
        userid = await getItemAsync("userid");
        console.log("userid:", userid);
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
    };
    backSync();
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.textStyle}>Welcome User</Text>
        <Button title="Food Allergy" onPress={() => {
          navigation.navigate("FoodAllergy");
        }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 40,
  },
});

export default HomeScreen;
