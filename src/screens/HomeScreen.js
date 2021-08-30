import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Image } from "react-native-elements";
import { Context as MealContext } from "../context/MealProvider";
import { Context as AuthContext } from "../context/AuthProvider";
import firebase from "firebase";
import "firebase/firestore";
import UserHeader from "../component/UserHeader";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const HomeScreen = ({ navigation, route }) => {
  const { state, recommedRecipe } = useContext(MealContext);
  const { state: authState } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  let componentMounted = true;

  useEffect(() => {
    //console.log("Home ", authState);
    if (authState.userid != "") {
      async function fetchData() {
        try {
          if (authState.userid != "") {
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
          }
        } catch (error) {
          console.log(error);
        }
        recommedRecipe(20, authState.userid);
      }
      if (componentMounted) fetchData();
    }
    return () => {
      componentMounted = false;
    };
  }, [authState.accessToken]);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (componentMounted) {
      registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token);
        if (authState.userid.toString() != "") {
          firebase
            .firestore()
            .collection("user")
            .doc(authState.userid.toString())
            .set(
              {
                expotoken: token,
              },
              { merge: true }
            )
            .then(() => {
              console.log("Successfully merged");
            })
            .catch((err) => {
              console.log("Error while setting push notification", err.message);
            });
        }
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    }
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      componentMounted = false;
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  }

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
