import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserDetailScreen from "./src/screens/UserDetailScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LandingScreen from "./src/screens/LandingScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import * as firebase from "firebase";
import {
  Provider as AuthProvider,
  Context,
} from "./src/context/AuthProvider";

const firebaseConfig = {
  apiKey: "AIzaSyDoZu1NbGW0PhU7UFVdgkTISuR9CLqlFDI",
  authDomain: "meal-planner-71e71.firebaseapp.com",
  projectId: "meal-planner-71e71",
  storageBucket: "meal-planner-71e71.appspot.com",
  messagingSenderId: "958386612193",
  appId: "1:958386612193:web:5919012351d160f57054a0",
  measurementId: "G-HBERRK6WR6",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  //console.log(firebase);
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
