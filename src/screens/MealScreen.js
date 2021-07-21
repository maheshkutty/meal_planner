import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Context as MealContext } from "../context/MealProvider";

const MealScreen = ({ navigation }) => {
  const { state, indianMeal, fetchUserRate } = useContext(MealContext);
  const [noList, setnoList] = useState(0);

  useEffect(() => {
    indianMeal({ start: 0, end: 5 });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.typeOfRecipe}>Indian Recipes</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={state.meal}
        keyExtractor={(item) => item.recipe_id.toString()}
        onEndReached={()=> {}}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MealDetails", {
                  recipe: item
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  recipeCard: {
    height: 200,
    borderWidth: 1,
    width: 200,
    padding: 2,
    margin: 2,
    borderRadius: 5,
  },
  texStyle: {
    fontWeight: "bold",
  },
  imageStyle: {
    height: 150,
    width: 195,
    padding: 2,
  },
  typeOfRecipe:{
    marginVertical:20,
    fontSize:20,
    fontWeight:'bold',
    marginHorizontal:10
  }
});

export default MealScreen;
