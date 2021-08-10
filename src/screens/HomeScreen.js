import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Image } from "react-native-elements";
import { Context as MealContext } from "../context/MealProvider";
import { Context as AuthContext } from "../context/AuthProvider";
import { getItemAsync } from "expo-secure-store";
import firebase from "firebase";
import "firebase/firestore";
import UserHeader from "../component/UserHeader";

const HomeScreen = ({ navigation, route }) => {
  const { state, recommedRecipe } = useContext(MealContext);
  const [noList, setnoList] = useState(0);
  const authContext = useContext(AuthContext);

  const { state: authState } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");

  useEffect(() => {
    //console.log("Home ", authState);
    if (authState.userid != "") {
      async function fetchData() {
        try {
          const doc = await firebase
            .firestore()
            .collection("user")
            .doc(authState.userid.toString())
            .get();
          if (doc.exists) {
            const data = doc.data();
            setUserName(data.name);
            setUserGender(data.gender);
          }
        } catch (error) {
          console.log(error);
        }
        recommedRecipe(20, authState.userid);
      }
      fetchData();
    }
  }, [authState.accessToken]);

  // useEffect(() => {
  //   firebase
  //     .firestore()
  //     .collection("user")
  //     .doc(authState.userid.toString())
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         const data = doc.data();
  //         setUserName(data.name);
  //         setUserGender(data.gender);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   recommedRecipe(20, authState.userid);
  // }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <UserHeader userName={userName} gender={userGender} />

      <Text>What do you want to cook?</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Search");
        }}
      >
        <Text style={styles.searchStyle}>Click Here To Search</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#edf8f0",
          padding: 10,
          borderRadius: 20,
        }}
      >
        <Image
          source={require("../../assets/homerecipe.jpg")}
          style={styles.homeRecipeImageStyle}
        />
        <Text style={{ alignSelf: "center", flexWrap: "wrap", flex: 1 }}>
          We found {state.recommedRecipe.length} recipes, that you may like
        </Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  textStyle: {
    fontSize: 30,
    textAlign: "left",
    marginTop: 40,
    color: "#7bbfb5",
    fontWeight: "bold",
  },
  searchStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#0F52BA",
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    textAlign: "center",
    elevation: 5,
    marginVertical: 20,
  },
  recipeCard: {
    height: 350,
    width: 300,
    padding: 2,
    margin: 2,
    elevation: 1,
    borderRadius: 2,
  },
  texStyle: {
    fontWeight: "bold",
  },
  imageStyle: {
    height: 300,
    width: 300,
    padding: 2,
  },
  typeOfRecipe: {
    marginVertical: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "#7bbfb5",
  },
  recipeview: {
    flexDirection: "column",
  },
  userImageStyle: {
    width: 60,
    height: 60,
    marginTop: 30,
    marginLeft: 60,
  },
  homeRecipeImageStyle: {
    width: 80,
    height: 80,
    marginRight: 50,
  },
});

export default HomeScreen;
