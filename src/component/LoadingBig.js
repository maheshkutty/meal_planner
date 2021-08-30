import React from "react";
import { View, Stylesheet, ActivityIndicator } from "react-native";

const LoadingBig = () => {
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#cacaca" }}
    >
      <ActivityIndicator size={80} color="blue" />
    </View>
  );
};

export default LoadingBig;
