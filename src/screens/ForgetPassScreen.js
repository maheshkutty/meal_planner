import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  Text,
} from "react-native";
import { Input, Button } from "react-native-elements";
import firebase from "firebase";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import ToastMessage from "../component/ToastMessage";

const LoginSchema = yup.object().shape({
  email: yup.string().required("Email is required").email(),
});

const ForgetPassScreen = ({ navigation }) => {
  const { handleChange, handleSubmit, values, errors, touched, handleBlur } =
    useFormik({
      validationSchema: LoginSchema,
      initialValues: {
        email: "",
      },
      onSubmit: () => {
        firebase
          .auth()
          .sendPasswordResetEmail(values.email)
          .then(() => {
            ToastMessage("Password reset email sent!");
            navigation.navigate("SignIn");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            errors.email = errorMessage;
            ToastMessage(errorMessage);
          });
      },
    });

  return (
    <View style={styles.container}>
      <Text style={styles.firstText}>Forget Password</Text>
      <Input
        placeholder="Email"
        label="Email"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        errorMessage={errors.email}
        touched={touched.email}
        leftIcon={<MaterialIcons name="email" size={24} color="black" />}
      />
      <Button title="Submit" onPress={handleSubmit} buttonStyle={styles.buttonStyle} />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignIn");
        }}
      >
        <Text style={styles.lastElement}>Go to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent:'center'
  },
  buttonStyle: {
    color: "#0F52BA",
    backgroundColor: "#0F52BA",
    marginVertical: 20,
    marginHorizontal:5
  },
  firstText: {
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  lastElement: {
    textAlign: "center",
    margin: 10,
    paddingTop: 10,
    color: "grey",
    fontSize: 13,
  },
});

export default ForgetPassScreen;
