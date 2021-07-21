import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ToastAndroid
} from "react-native";
import { Context as AuthProvider } from "../context/AuthProvider";
import { AirbnbRating, Rating } from "react-native-elements";
import { Button } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";

const fetchiIngredients = (ingredients) => {
  ingredients = ingredients.replace(/\^/g, "\n");
  return ingredients;
};

const fetchCookingDirection = (direction) => {
  direction = direction.replace("{'directions':", "");
  direction = direction.replace("'}", "");
  direction = direction.replace("u'", "");
  direction = direction.replace(/\\n/g, " \n");
  return direction;
};

const MealDetailsScreen = ({ route }) => {
  const { recipe } = route.params;
  const [rating, setRating] = useState(3);
  const { state } = useContext(AuthProvider);

  useEffect(() => {
    const recipe_id = recipe.recipe_id.toString();
    firebase
      .firestore()
      .collection("recipe_rate")
      .doc(recipe_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          data.userRate.filter((value) => {
            if (state.userid == value.userid) {
              setRating(value.rating);
            }
          });
        }
      });
  }, []);

  const saveRating = () => {
    const recipe_id = recipe.recipe_id.toString();
    const recipeDocRef = firebase
      .firestore()
      .collection("recipe_rate")
      .doc(recipe_id);
    recipeDocRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          for (let i = 0; i < data.userRate.length; i++) {
            if (data.userRate[i].userid == state.userid) {
              recipeDocRef.update({
                userRate: firebase.firestore.FieldValue.arrayRemove(
                  data.userRate[i]
                ),
              });
            }
          }
          recipeDocRef.update({
            userRate: firebase.firestore.FieldValue.arrayUnion({
              userid: state.userid,
              rating: rating.toString(),
            }),
          });
        } else {
          recipeDocRef
            .set({
              recipe_id,
              userRate: [
                {
                  userid: state.userid.toString(),
                  rating: rating.toString(),
                },
              ],
            })
            .catch((error) => {
              console.log(error);
            });
        }
        ToastAndroid.show('Review Recorded', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  return (
    <ScrollView>
      <Image source={{ uri: recipe.image_url }} style={styles.imageStyle} />
      <Text style={styles.textStyle}>{recipe.recipe_name}</Text>
      <Text style={styles.ingriHeader}>Ingredients</Text>
      <Text style={styles.ingriList}>
        {fetchiIngredients(recipe.ingredients)}
      </Text>
      <Text style={styles.ingriHeader}>Directions:</Text>
      <Text style={styles.instruStyle}>
        {fetchCookingDirection(recipe.cooking_directions)}
      </Text>
      <Text>Leave us rating</Text>
      <AirbnbRating
        defaultRating={rating}
        onFinishRating={(rating) => {
          setRating(rating);
        }}
      />
      <Button title="Save" onPress={saveRating} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    fontSize: 30,
    margin: 10,
    fontWeight: "bold",
  },
  imageStyle: {
    marginTop: 35,
    height: 200,
    width: "100%",
    padding: 2,
  },
  ingriHeader: {
    marginHorizontal: 10,
    marginBottom: 20,
    fontSize: 17,
    fontWeight: "bold",
  },
  ingriList: {
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    lineHeight: 30,
  },
  instruStyle: {
    marginHorizontal: 10,
    lineHeight: 25,
  },
});

export default MealDetailsScreen;
