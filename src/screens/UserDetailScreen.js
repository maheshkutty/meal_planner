import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as yup from "yup";
import { Formik, useFormik } from "formik";

let userSchema = yup.object().shape({
  name: yup.string("Name should be integer").required("Name is required"),
  weight: yup
    .number("Weight should be number")
    .required("Weight is required")
    .positive("Weight should be positive number")
    .integer("Weight should be positive number"),
  heFeet: yup
    .number("Feet should be number")
    .required("Feet is required")
    .positive("Feet should be positive number")
    .integer("Feet should be positive number"),
  heInches: yup
    .number("Inches should be number")
    .required("Inches is required")
    .positive("Inches should be positive number")
    .integer("Inches should be positive number"),
});

const checkDOB = () => {
    
}

const SignUpScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      validationSchema: userSchema,
      initialValues: {
        name: "",
        weight: "",
        heFeet: "",
        heInches: ""
      },
      onSubmit: () => {
        navigation.navigate("Signup", {
          name: values.name,
          weight: values.weight,
          heFeet: values.heFeet,
          heInches: values.heInches,
          date: getDateFormat(),
        });
      },
    });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const getDateFormat = () => {
    let result = `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;
    return result;
  };

  return (
    <ScrollView style={styles.conatiner}>
      <Text>Create New account</Text>
      <Input
        label="Name"
        placeholder="Name"
        onChangeText={handleChange("name")}
        onBlur={handleBlur("name")}
        errorMessage={errors.name}
        touched={touched.name}
        value={values.name}
      />
      <Input
        label="Weight"
        placeholder="Weight"
        onChangeText={handleChange("weight")}
        onBlur={handleBlur("weight")}
        errorMessage={errors.weight}
        touched={touched.weight}
        value={values.weight}
        rightIcon={<Text>KG</Text>}
      />
      <TouchableOpacity onPress={showDatepicker}>
        <Input
          label="DOB"
          placeholder="DOB"
          disabled={true}
          value={getDateFormat()}
          onBlur={checkDOB}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <View style={styles.heightWeightStyle}>
        <Input
          label="Height"
          placeholder="Height"
          onChangeText={handleChange("heFeet")}
          onBlur={handleBlur("heFeet")}
          errorMessage={errors.heFeet}
          touched={touched.heFeet}
          value={values.heFeet}
          rightIcon={<Text>Ft</Text>}
        />
        <Input
          label="Inches"
          placeholder="Inches"
          onChangeText={handleChange("heInches")}
          onBlur={handleBlur("heInches")}
          errorMessage={errors.heInches}
          touched={touched.heInches}
          value={values.heInches}
          rightIcon={<Text>IN</Text>}
        />
      </View>
      <View style={styles.nextIcon}>
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.6}
        >
          <MaterialIcons name="navigate-next" size={50} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    marginTop: 50,
  },
  heightWeightStyle: {
    flexDirection: "column",
  },
  nextIcon: {
    alignItems: "flex-end",
  },
  dateStyle: {
    borderBottomWidth: 1,
    margin: 2,
    marginBottom: 5,
    fontSize: 15,
  },
});

export default SignUpScreen;
