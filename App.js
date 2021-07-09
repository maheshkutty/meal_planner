import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import UserDetailScreen from './src/screens/UserDetailScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import * as firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyDoZu1NbGW0PhU7UFVdgkTISuR9CLqlFDI",
  authDomain: "meal-planner-71e71.firebaseapp.com",
  projectId: "meal-planner-71e71",
  storageBucket: "meal-planner-71e71.appspot.com",
  messagingSenderId: "958386612193",
  appId: "1:958386612193:web:5919012351d160f57054a0",
  measurementId: "G-HBERRK6WR6"
}


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
  console.log(firebase);
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserDetail" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="UserDetail" component={UserDetailScreen}  />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;