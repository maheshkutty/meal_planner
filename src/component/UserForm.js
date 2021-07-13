import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as yup from "yup";
import { Formik, useFormik } from "formik";

const LoginSchema = yup.object().shape({
  email: yup.string().required("Email is required").email(),
  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must be 8 character long"),
});

const UserForm = ({ onPost, bname }) => {

  const { handleChange, handleSubmit, values, errors, touched, handleBlur } =
    useFormik({
      validationSchema: LoginSchema,
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: () => {
        onPost({ email: values.email, password: values.password });
      },
    });

  return (
    <View style={styles.container}>
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
      <Input
        placeholder="Password"
        label="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChange("password")}
        onBlur={handleBlur("password")}
        errorMessage={errors.password}
        touched={touched.password}
        leftIcon={
          <MaterialCommunityIcons name="account-key" size={24} color="black" />
        }
      />
      <Button title={bname} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});

export default UserForm;
