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
  TouchableOpacity,
  Alert,
} from "react-native";
import { Context as AuthProvider } from "../context/AuthProvider";
import { AirbnbRating, Rating } from "react-native-elements";
import { Button } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import ShowModal from "../component/ShowModal";
import { FontAwesome } from "@expo/vector-icons";
import recipeApi from "../config/recipeApi";
import Svg, { Circle, Rect, Text as TextSVG } from "react-native-svg";
import AddRecipeHistory from "../component/AddRecipeHistory";

const fetchIngredients = (ingredients) => {
  ingredients = ingredients.replace(/\^/g, "\n");
  return ingredients;
};

const fetchCookingDirection = (direction) => {
  direction = direction.replace("{'directions':", "");
  direction = direction.replace("'}", "");
  direction = direction.replace('"}', "");
  direction = direction.replace("u'", "");
  direction = direction.replace(/\\n/g, " \n");
  return direction;
};

const fetchNurtionalValues = (nutrional) => {
  try {
    if (nutrional == undefined || nutrional.length == 0) {
      return (
        <Text style={{ marginHorizontal: 10, marginVertical: 20 }}>
          No data found
        </Text>
      );
    } else {
      nutrional = nutrional.replace(/u\'/g, '"');
      nutrional = nutrional.replace(/\'/g, '"');
      nutrional = nutrional.replace(/False/g, false);
      nutrional = nutrional.replace(/True/g, true);
      nutrional = JSON.parse(nutrional);
      //console.log(nutrional.calories.amount);
      return (
        <View style={styles.nutrionalContainer}>
          <View>
            <Svg width="76" height="76" version="1.1">
              <Circle
                cx="38"
                cy="38"
                r="35"
                stroke="#B10DC9"
                strokeWidth="5"
                fill="#ffffff"
              ></Circle>
              <TextSVG
                stroke="#85144b"
                fill="#85144b"
                fontSize="20"
                fontWeight="bold"
                x="38"
                y="35"
                textAnchor="middle"
              >
                {nutrional.calories.displayValue}
              </TextSVG>
              <TextSVG
                stroke="#111111"
                fill="#111111"
                fontSize="15"
                x="38"
                y="55"
                textAnchor="middle"
              >
                Cal
              </TextSVG>
            </Svg>
          </View>
          <View>
            <Text style={[styles.nutrionalTextStyle, styles.carboStyle]}>
              Carbs
            </Text>
            <Text>
              {nutrional.carbohydrates.displayValue}
              {nutrional.carbohydrates.unit}
            </Text>
          </View>
          <View>
            <Text style={[styles.nutrionalTextStyle, styles.proteinStyle]}>
              Protein
            </Text>
            <Text>
              {nutrional.protein.displayValue}
              {nutrional.protein.unit}
            </Text>
          </View>
          <View>
            <Text style={[styles.nutrionalTextStyle, styles.fatStyle]}>
              Fat
            </Text>
            <Text>
              {nutrional.fat.displayValue}
              {nutrional.fat.unit}
            </Text>
          </View>
        </View>
      );
    }
  } catch (err) {
    console.log("fetchNurtionalValues err", err.message);
    return (
      <Text style={{ marginHorizontal: 10, marginVertical: 20 }}>
        No data found
      </Text>
    );
  }
};

const MealDetailsScreen = ({ navigation, route }) => {
  const { recipe } = route.params;
  const [rating, setRating] = useState(3);
  const { state } = useContext(AuthProvider);
  const [showAllergyWarn, setShowAllergyWarn] = useState(false);
  const [chkScrollEvt, setChkScrollEvt] = useState(false);
  const [firstAllergy, setFirstAllergy] = useState("");

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
          setFirstAllergy(item);
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
        firebase
          .firestore()
          .collection("user_rate")
          .doc(state.userid.toString())
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = {
                recipe_name: recipe.recipe_name,
                recipe_id: recipe.recipe_id,
                rating: rating.toString(),
              };
              firebase
                .firestore()
                .collection("user_rate")
                .doc(state.userid.toString())
                .update({
                  [recipe.recipe_id]: data,
                });
            } else {
              const data = {
                recipe_name: recipe.recipe_name,
                recipe_id: recipe.recipe_id,
                rating: rating.toString(),
              };
              firebase
                .firestore()
                .collection("user_rate")
                .doc(state.userid.toString())
                .set({
                  [recipe.recipe_id]: data,
                });
            }
          });
        ToastAndroid.show("Review Recorded", ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const deleteRecipe = () => {
    Alert.alert("Confirm", "Do you want to delete recipe", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          console.log(recipe.recipe_id.toString());
          // firebase
          //   .firestore()
          //   .collection("recipes")
          //   .doc(recipe.recipe_id.toString())
          //   .delete()
          //   .then(() => {
          //     console.log("Recipes Delete successfully");
          //   })
          //   .catch((err) => {
          //     console.log("Delete Recipes Error", err.message);
          //   });
          // recipeApi
          //   .post(
          //     "/deleterecipe",
          //     {
          //       recipe_id: recipe.recipe_id.toString(),
          //     },
          //     {
          //       headers: { authorization: state.accessToken },
          //     }
          //   )
          //   .then((res) => {
          //     console.log("Recipe Deleted successfully");
          //     navigation.navigate("Tagging");
          //   })
          //   .catch((err) => {
          //     console.log("Delete Recipes REST Error", err.message);
          //   });
          navigation.navigate("Tagging", { rload: true });
        },
      },
    ]);
    // firebase.firestore().collection("recipes").doc(recipe.recipe_id).delete().then(() => {
    //   console.log("Recipes Delete successfully");
    // }).catch((err) => {
    //   console.log("Delete Recipes Error",err.message)
    // });
  };

  return (
    <ScrollView
      onScroll={(event) => {
        if (chkScrollEvt == false && event.nativeEvent.contentOffset.y > 200) {
          navigation.setOptions({
            headerShown: true,
          });
          setChkScrollEvt(true);
        } else if (
          chkScrollEvt == true &&
          event.nativeEvent.contentOffset.y < 200
        ) {
          navigation.setOptions({ headerShown: false });
          setChkScrollEvt(false);
        }
      }}
    >
      <Image source={{ uri: recipe.image_url }} style={styles.imageStyle} />
      <View style={styles.mainView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Text style={styles.textStyle}>{recipe.recipe_name}</Text>
          {state.isAdmin ? (
            <TouchableOpacity
              onPress={() => {
                deleteRecipe();
              }}
            >
              <FontAwesome
                name="trash"
                size={35}
                color="red"
                style={{
                  marginTop: 10,
                  marginRight: 20,
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {showAllergyWarn ? (
          <View style={styles.warnMsgContainer}>
            <FontAwesome
              name="info-circle"
              size={24}
              color="#ff0f0f"
              style={{ marginHorizontal: 5 }}
            />
            <Text style={styles.warnMsg}>
              This food contains {firstAllergy} not suitable for you
            </Text>
          </View>
        ) : null}
        <Text style={styles.nutrionalLable}>Nutrition Per Serving</Text>
        {fetchNurtionalValues(recipe.nutritions)}
        <AddRecipeHistory
          recipeId={recipe.recipe_id.toString()}
          recipeName={recipe.recipe_name.toString()}
        />
        <Text style={styles.ingriHeader}>Ingredients</Text>
        <Text style={styles.ingriList}>
          {fetchIngredients(recipe.ingredients)}
        </Text>
        <Text style={styles.ingriHeader}>Directions</Text>
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
  textStyle: {
    fontSize: 30,
    margin: 10,
    fontWeight: "bold",
    color: "#2C3531",
  },
  imageStyle: {
    marginTop: 35,
    height: 210,
    width: "100%",
    padding: 2,
  },
  ingriHeader: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "bold",
    color: "#2C3531",
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
    backgroundColor: "white",
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
    marginHorizontal: 5,
  },
  warnMsg: {
    color: "#ff0f0f",
    fontWeight: "bold",
    fontSize: 15,
  },
  ratingHeader: {
    textAlign: "center",
    fontSize: 20,
    margin: 5,
    fontWeight: "bold",
    color: "#0F52BA",
  },
  nutrionalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    marginHorizontal: 20,
    alignContent: "center",
    alignItems: "center",
  },
  nutrionalLable: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3531",
  },
  nutrionalTextStyle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  carboStyle: {
    color: "#39CCCC",
  },
  proteinStyle: {
    color: "#F012BE",
  },
  fatStyle: {
    color: "#FF4136",
  },
});

export default MealDetailsScreen;
