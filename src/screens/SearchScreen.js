import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SearchBar, Image } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import recipeApi from "../config/recipeApi";
import "firebase/firestore";
import { Context as AuthContext } from "../context/AuthProvider";

const SearchScreen = ({ navigation }) => {
  const [search, setSearchBar] = useState("");
  const [recipeLimit, setRecipeLimit] = useState(20);
  const [recipeData, setRecipeData] = useState([]);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      setRecipeData([]);
    }
  },[])

  const searchRecipe = async () => {
    try {
      console.log("search", state.accessToken, search);
      let data = {
        search,
        foodAllergy: state.foodAllergyArr,
        limit: recipeLimit,
      }
      console.log(data);
      if (search != "") {
        const response = await recipeApi.post(
          "/recipe",
          {
            search,
            foodAllergy: state.foodAllergyArr,
            limit: recipeLimit,
          },
          {
            headers: {
              Authorization: state.accessToken,
            },
          }
        );
        setRecipeData(response.data);
      }
    } catch (err) {
      console.log("searchRecipe user ", err.message);
    }

    // firebase
    //   .firestore()
    //   .collection("recipes")
    //   .where("recipe_name", ">=", search)
    //   .limit(recipeLimit)
    //   .get()
    //   .then((snapshot) => {
    //     const mealData = [];
    //     snapshot.forEach((doc) => {
    //       mealData.push(doc.data());
    //     });
    //     setRecipeData(mealData);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Type here...."
        onChangeText={setSearchBar}
        value={search}
        lightTheme={true}
        containerStyle={{
          backgroundColor: "#0F52BA",
        }}
        inputContainerStyle={{
          backgroundColor: "#ececed",
        }}
        searchIcon={<MaterialIcons name="search" size={28} color="#0F52BA" />}
        onBlur={() => {
          searchRecipe();
        }}
      />
      {recipeData.length == 0 ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 200 }}>
          <Text style={styles.mainTextStyle}>Search Any Recipe</Text>
        </View>
      ) : null}
      <FlatList
        data={recipeData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return (
            <View style={styles.recipeContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MealDetails", {
                    recipe: item,
                  });
                }}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>{item.recipe_name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    flex: 1,
  },
  imageStyle: {
    height: 200,
    width: "100%",
    padding: 2,
    borderRadius: 5,
  },
  recipeContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    borderRadius: 10,
  },
  textStyle: {
    color: "#0F52BA",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
  },
  mainTextStyle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#7bbfb5",
  },
});

export default SearchScreen;
