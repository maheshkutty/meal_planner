import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";

let userSchema = yup.object().shape({
  name: yup.string("Name should be character").required("Name is required"),
  weight: yup
    .number("Weight should be number")
    .required("Weight is required")
    .positive("Weight should be positive number")
    .integer("Weight should be positive number"),
  heFeet: yup
    .number("Feet should be number")
    .required("Feet is required")
    .max(10, "Feet must be less than 10")
    .positive("Feet should be positive number")
    .integer("Feet should be positive number"),
  heInches: yup
    .number("Inches should be number")
    .required("Inches is required")
    .positive("Inches should be positive number")
    .integer("Inches should be positive number"),
});

const checkDOB = () => {};

const UserDetailScreen = ({ navigation }) => {
  DropDownPicker.setListMode("SCROLLVIEW");
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [items, setItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      validationSchema: userSchema,
      initialValues: {
        name: "",
        weight: "",
        heFeet: "",
        heInches: "",
      },
      onSubmit: () => {
        navigation.navigate("FoodAllergy", {
          name: values.name,
          weight: values.weight,
          heFeet: values.heFeet,
          heInches: values.heInches,
          date: getDateFormat(),
          gender,
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
    <ScrollView style backgroundColor="#fff">
      <Text style={styles.contain}>Sign Up Now</Text>
      <Text style={styles.containing}>
        Please fill the details and create account
      </Text>

      <Input
        label="Name"
        placeholder="Name"
        onChangeText={handleChange("name")}
        onBlur={handleBlur("name")}
        errorMessage={errors.name}
        touched={touched.name}
        value={values.name}
        labelStyle={styles.labelStyle}
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
        labelStyle={styles.labelStyle}
      />
        <Text style={{
          fontSize:15,
          marginHorizontal:10,
          fontWeight:'bold',
          color:"#0F52BA",
          marginBottom:-10
        }}>Gender</Text>
        <DropDownPicker
          labelProps="Gender"
          open={open}
          value={gender}
          items={items}
          setOpen={setOpen}
          setValue={setGender}
          setItems={setItems}
          maxHeight={100}
          style={{
            backgroundColor:"white",
            opacity:0.5,  
            borderWidth:0,
            borderBottomWidth:1,
            marginBottom:10
          }}
          containerStyle={{
            marginVertical:8,
          }}
        />
      <TouchableOpacity onPress={showDatepicker}>
        <Input
          label="DOB"
          placeholder="DOB"
          disabled={true}
          value={getDateFormat()}
          onBlur={checkDOB}
          labelStyle={styles.labelStyle}
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
          labelStyle={styles.labelStyle}
        />
        <Input
          label="Inches"
          placeholder="Inches"
          onChangeText={handleChange("heInches")}
          onBlur={handleBlur("heInches")}
          errorMessage={errors.heInches}
          touched={touched.heInches}
          value={values.heInches}
          rightIcon={<Text style={styles.labelStyle}>IN</Text>}
          labelStyle={styles.labelStyle}
        />
      </View>
      <View style={styles.nextIcon}>
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.6}>
          <MaterialIcons name="navigate-next" size={50} color="#0F52BA" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contain: {
    marginTop: 60,
    paddingBottom: 5,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
    color:"#0F52BA"
  },
  containing: {
    paddingBottom: 30,
    fontSize: 15,
    color: "grey",
    alignSelf: "center",
  },
  heightWeightStyle: {
    flexDirection: "column",
  },
  nextIcon: {
    alignItems: "flex-end",
    paddingTop: 5,
  },
  dateStyle: {
    borderBottomWidth: 1,
    margin: 2,
    marginBottom: 5,
    fontSize: 15,
  },
  labelStyle:{
    color:"#0F52BA"
  }
});

export default UserDetailScreen;
