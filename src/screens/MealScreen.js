import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Context as MealContext } from "../context/MealProvider";
import { Context as AuthContext } from "../context/AuthProvider";

const MealScreen = ({ navigation }) => {
  const {
    state,
    indianMeal,
    fetchBreakFast,
    fetchLunchRecipe,
    recommedRecipe,
    fetchDinnerRecipe
  } = useContext(MealContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    indianMeal(state.meal);
    fetchBreakFast(state.breakFast);
    fetchLunchRecipe(state.lunch);
    recommedRecipe(20, authContext.state.userid);
    fetchDinnerRecipe(state.dinner);
  }, []);

  useEffect(() => {}, [state.recommedRecipe]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>Indian Recipes</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.meal}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {
            indianMeal(state.meal);
          }}
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
          ListEmptyComponent={
            <ActivityIndicator size="large" color="#0F52BA" style={styles.activityStyle} />
          }
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
          ListEmptyComponent={<Text style={{textAlign:'center', marginLeft:10}}>Not found any suitable recipes</Text>}
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>BreakFast</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.breakFast}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {
            fetchBreakFast(state.breakFast);
          }}
          onEndReachedThreshold={0.8}
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
          ListEmptyComponent={
            <ActivityIndicator size="large" color="#0F52BA" style={styles.activityStyle} />
          }
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>Lunch</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.lunch}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {
            fetchLunchRecipe(state.lunch);
          }}
          onEndReachedThreshold={0.8}
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
          ListEmptyComponent={
            <ActivityIndicator size="large" color="#0F52BA" style={styles.activityStyle} />
          }
        />
      </View>
      <View style={styles.recipeview}>
        <Text style={styles.typeOfRecipe}>Dinner</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={state.dinner}
          keyExtractor={(item) => item.recipe_id.toString()}
          onEndReached={() => {
            fetchDinnerRecipe(state.dinner);
          }}
          onEndReachedThreshold={0.8}
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
          ListEmptyComponent={
            <ActivityIndicator size="large" color="#0F52BA" style={styles.activityStyle} />
          }
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
    color: "#7bbfb5",
  },
  recipeview: {
    flexDirection: "column",
  },
  activityStyle:{
    marginLeft:10
  }
});

export default MealScreen;
