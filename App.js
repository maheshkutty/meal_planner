import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from '@expo/vector-icons'; 
import UserDetailScreen from "./src/screens/UserDetailScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LandingScreen from "./src/screens/LandingScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import MealScreen from "./src/screens/MealScreen";
import MealDetailsScreen from "./src/screens/MealDetailsScreen";
import AccountScreen from "./src/screens/AccountScreen";
import FoodAllergyScreen from "./src/screens/FoodAllergyScreen";
import * as firebase from "firebase";
import { Provider as AuthProvider } from "./src/context/AuthProvider";

import { Provider as MealProvider } from "./src/context/MealProvider";

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
    <MealProvider>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Meal') {
              iconName = 'no-meals';
            }
            else if(route.name == 'Account'){
              iconName = 'account-circle';
            }
            return <MaterialIcons name={iconName} size={size} color={color} />
          },
        })}
        tabBarOptions={{
          activeTintColor: '#0F52BA',
          inactiveTintColor: 'gray',
        }} >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Meal" component={MealScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </MealProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ResolveAuth"
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
          <Stack.Screen
            name="MealDetails"
            component={MealDetailsScreen}
            options={{
              headerShown: true,
              title: "",
              headerTransparent: true,
              headerStyle: {
                backgroundColor: "white",
              },
            }}
          />
          <Stack.Screen name="FoodAllergy" component={FoodAllergyScreen} />
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
