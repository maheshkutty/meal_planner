import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ToastAndroid,
  Modal,
} from "react-native";
import { Context as AuthProvider } from "../context/AuthProvider";
import { AirbnbRating, Rating } from "react-native-elements";
import { Button } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import ShowModal from "../component/ShowModal";
import { FontAwesome } from "@expo/vector-icons";

const fetchIngredients = (ingredients) => {
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

const MealDetailsScreen = ({ navigation, route }) => {
  const { recipe } = route.params;
  const [rating, setRating] = useState(3);
  const { state } = useContext(AuthProvider);
  const [showAllergyWarn, setShowAllergyWarn] = useState(false);
  const [chkScrollEvt, setChkScrollEvt] = useState(false);

  useEffect(() => {
    console.log("isAdmin", state.isAdmin);
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

  useEffect(() => {
    let ingredients = recipe.ingredients;
    ingredients = ingredients.replace(/\^/g, "\n");
    let ingredientsArr = [ingredients.replace(/\^/g, ",")];
    state.foodAllergyArr.forEach((item) => {
      for (let j = 0; j < ingredientsArr.length; j++) {
        if (ingredientsArr[j].match(item) != null) {
          setShowAllergyWarn(true);
          break;
        }
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
        firebase.firestore().collection("user_rate").doc(state.userid.toString()).get().then((doc) => {
          if(doc.exists)
          {
            //const data = doc.data();
            data = {
              "recipe_name":recipe.recipe_name,
              "recipe_id":recipe.recipe_id,
              "rating":rating.toString()
            }
            firebase.firestore().collection("user_rate").doc(state.userid.toString()).update({
              [recipe.recipe_id]:data
            });
          }
          else{
            const data = {
              "recipe_name":recipe.recipe_name,
              "recipe_id":recipe.recipe_id,
              "rating":rating.toString()
            }
            firebase.firestore().collection("user_rate").doc(state.userid.toString()).set({
              [recipe.recipe_id]:data
            });
          }
        });
        ToastAndroid.show("Review Recorded", ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  return (
    <ScrollView
      onScroll={(event) => {
        if (chkScrollEvt == false && event.nativeEvent.contentOffset.y > 200) {
          navigation.setOptions({
            headerShown: true,
          });
          setChkScrollEvt(true);
        }else if (chkScrollEvt == true && event.nativeEvent.contentOffset.y < 200) {
          navigation.setOptions({ headerShown: false });
          setChkScrollEvt(false);
        }
      }}
    >
      <Image source={{ uri: recipe.image_url }} style={styles.imageStyle} />
      <View style={styles.mainView}>
        <Text style={styles.textStyle}>{recipe.recipe_name}</Text>
        {showAllergyWarn ? (
          <View style={styles.warnMsgContainer}>
            <FontAwesome
              name="info-circle"
              size={24}
              color="#ff0f0f"
              style={{ marginHorizontal: 5 }}
            />
            <Text style={styles.warnMsg}>
              This food conatins {state.foodAllergyArr[0]} not suitable for you
            </Text>
          </View>
        ) : null}
        <Text style={styles.ingriHeader}>Ingredients</Text>
        <Text style={styles.ingriList}>
          {fetchIngredients(recipe.ingredients)}
        </Text>
        <Text style={styles.ingriHeader}>Directions:</Text>
        <Text style={styles.instruStyle}>
          {fetchCookingDirection(recipe.cooking_directions)}
        </Text>
        {!state.isAdmin ? (
          <>
            <Text style={styles.ratingHeader}>Leave us rating</Text>
            <AirbnbRating
              defaultRating={rating}
              onFinishRating={(rating) => {
                setRating(rating);
              }}
            />
            <Button
              title="Save"
              onPress={saveRating}
              buttonStyle={styles.buttonStyle}
            />
          </>
        ) : (
          <ShowModal recipe={recipe} />
        )}
      </View>
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
    color: "#0F52BA",
  },
  imageStyle: {
    marginTop: 35,
    height: 210,
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
    fontSize: 18,
    marginHorizontal: 10,
    marginBottom: 20,
    lineHeight: 30,
  },
  instruStyle: {
    marginHorizontal: 10,
    lineHeight: 30,
    fontSize: 18,
  },
  mainView: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderWidth: 1,
  },
  buttonStyle: {
    color: "#0F52BA",
    backgroundColor: "#0F52BA",
    marginVertical: 20,
    marginHorizontal: 5,
  },
  warnMsgContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  warnMsg: {
    color: "#ff0f0f",
  },
  ratingHeader: {
    textAlign: "center",
    fontSize: 20,
    margin: 5,
    fontWeight: "bold",
    color: "#0F52BA",
  },
});

export default MealDetailsScreen;
