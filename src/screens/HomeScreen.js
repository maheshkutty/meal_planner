import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Context } from "../context/AuthProvider";
import { getItemAsync } from "expo-secure-store";

const HomeScreen = () => {
  const { state, signin, showErr } = useContext(Context);
  console.log(state);
  useEffect(() => {
    const backSync = async () => {
      try {
        userid = await getItemAsync("userid");
        console.log('userid:', userid)
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
    };
    backSync();
  }, []);
  return (
    <TouchableOpacity>
      <Image source={require("../../assets/icon.png")} style={{height: 200, width:200}} />
      <Text>Welcome to home screen</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
