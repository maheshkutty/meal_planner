import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Context as MealContext } from "../context/MealProvider";
import { Context as AuthContext } from "../context/AuthProvider";

const MealScreen = ({ navigation }) => {
  const { state, indianMeal, fetchBreakFast, fetchLunchRecipe, recommedRecipe } =
  useContext(MealContext);
  const [noList, setnoList] = useState(0);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    indianMeal({ start: 0, end: 5 });
    fetchBreakFast({ start: 0, end: 5 });
    fetchLunchRecipe();
    recommedRecipe(20, authContext.state.userid);
  }, []);

  useEffect(() => {

  },[state.recommedRecipe])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>Indian Recipes</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.meal}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {}}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MealDetails", {
                    recipe: item,
                  })
                }
              >
                <View style={styles.recipeCard}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.texStyle}>{item.recipe_name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>Recommended Recipes</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.recommedRecipe}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {}}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MealDetails", {
                    recipe: item,
                  })
                }
              >
                <View style={styles.recipeCard}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.texStyle}>{item.recipe_name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>BreakFast</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.breakFast}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {}}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MealDetails", {
                    recipe: item,
                  })
                }
              >
                <View style={styles.recipeCard}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.texStyle}>{item.recipe_name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>Lunch</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.lunch}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {}}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MealDetails", {
                    recipe: item,
                  })
                }
              >
                <View style={styles.recipeCard}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.texStyle}>{item.recipe_name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 40,
    backgroundColor: "#f6f6f6",
  },
  recipeCard: {
    height: 200,
    width: 200,
    padding: 2,
    margin: 2,
    elevation: 1,
    borderRadius: 2,
  },
  texStyle: {
    fontWeight: "bold",
  },
  imageStyle: {
    height: 150,
    width: 195,
    padding: 2,
  },
  typeOfRecipe: {
    marginVertical: 10,
    fontSize: 22,
    fontWeight: "400",
    marginHorizontal: 10,
    color:"#7bbfb5"
  },
  recipeview: {
    flexDirection: "column",
  },
});

export default MealScreen;
