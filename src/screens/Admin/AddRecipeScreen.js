import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, TextInput, ScrollView } from "react-native";
import { Input, Button, Tooltip } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import * as yup from "yup";
import { useFormik } from "formik";
import recipeApi from "../../config/recipeApi";
import { Context } from "../../context/AuthProvider";
import ToastMessage from "../../component/ToastMessage";
import { FontAwesome5 } from "@expo/vector-icons";

const createIncrement = () => {
  var seq = "R" + new Date().getTime();
  return seq;
};

let recipeSchema = yup.object().shape({
  recipeName: yup.mixed().required("Recipe name is required"),
  ingredients: yup.mixed().required("Recipe ingredients is required"),
  direction: yup.mixed().required("Recipe direction is required"),
  imageUrl: yup.mixed().required("Recipe imageUrl is required"),
});

const AddRecipeScreen = ({ navigation, route }) => {
  const { state } = useContext(Context);

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    resetForm,
  } = useFormik({
    validationSchema: recipeSchema,
    initialValues: {
      recipeName: "",
      recipeDesc: "",
      ingredients: "",
      direction: "",
      imageUrl: "",
    },
    onSubmit: async () => {
      try {
        const data = {
          recipe_id: createIncrement(),
          recipe_name: values.recipeName,
          image_url: values.imageUrl,
          cooking_directions: values.direction,
          ingredients: values.ingredients,
          tag: {
            breakfast: 0,
            dinner: 0,
            lunch: 0,
            veg: 0,
            region: "",
          },
        };
        data.ingredients = data.ingredients.replace(/,/g, "^");
        data.cooking_directions = data.cooking_directions.replace(/,/g, "/n");
        let chkflag = 0;
        const chkQuerySnapShot = await firebase
          .firestore()
          .collection("recipes")
          .where("recipe_name", "==", data.recipe_name)
          .get();
        chkQuerySnapShot.forEach((item) => {
          if (item.exists) chkflag = 1;
        });
        console.log(chkflag);
        if (chkflag === 0) {
          const nRes = await recipeApi.post("/addrecipe", data, {
            headers: {
              authorization: state.accessToken,
            },
          });
          await firebase
            .firestore()
            .collection("recipes")
            .doc(data.recipe_id)
            .set(data);
          console.log(nRes.data);
          console.log("Data successfully inserted ", data.recipe_id);
          resetForm({});
          ToastMessage("Recipe Successfully Added!!!");
        } else {
          ToastMessage("Recipe Already Exist");
        }
      } catch (err) {
        console.log(err.message);
      }
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.textStyle}>Add Recipes</Text>
        <Tooltip
          height={80}
          backgroundColor="black"
          width={200}
          popover={
            <Text style={{ color: "white", fontWeight: "bold" }}>
              1. Ingredients should be comma seperated {"\n"}
              2. To add new line in direction add comma
            </Text>
          }
        >
          <FontAwesome5 name="info-circle" size={30} color="#0F52BA" />
        </Tooltip>
      </View>
      <Input
        placeholder="Name"
        value={values.recipeName}
        onChangeText={handleChange("recipeName")}
        onBlur={handleBlur("recipeName")}
        numberOfLines={2}
        multiline={true}
        errorMessage={errors.recipeName}
        touched={touched.recipeName}
      />
      <Input
        placeholder="Description"
        value={values.recipeDesc}
        numberOfLines={5}
        multiline={true}
        onChangeText={handleChange("recipeDesc")}
        errorMessage={errors.recipeDesc}
        onBlur={handleBlur("recipeDesc")}
        touched={touched.recipeDesc}
      />
      <Input
        placeholder="Ingredients"
        numberOfLines={4}
        value={values.ingredients}
        onChangeText={handleChange("ingredients")}
        errorMessage={errors.ingredients}
        onBlur={handleBlur("ingredients")}
        touched={touched.ingredients}
      />
      <Input
        placeholder="Direction"
        numberOfLines={10}
        // inputStyle={styles.inputStyle}
        value={values.direction}
        onChangeText={handleChange("direction")}
        errorMessage={errors.direction}
        onBlur={handleBlur("direction")}
        touched={touched.direction}
      />
      <Input
        placeholder="Image Url"
        value={values.imageUrl}
        onChangeText={handleChange("imageUrl")}
        numberOfLines={2}
        errorMessage={errors.imageUrl}
        onBlur={handleBlur("imageUrl")}
        touched={touched.imageUrl}
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
        buttonStyle={styles.buttonStyle}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    flexDirection: "column",
    backgroundColor: "white",
  },
  inputStyle: {
    borderBottomWidth: 1,
    margin: 5,
    fontSize: 18,
  },
  buttonStyle: {
    marginVertical: 10,
    margin: 2,
    backgroundColor: "#0F52BA",
  },
  textStyle: {
    fontSize: 25,
    color: "#0F52BA",
    fontWeight: "bold",
  },
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddRecipeScreen;
