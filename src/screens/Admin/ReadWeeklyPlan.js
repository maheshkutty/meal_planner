import React, { useState, useEffect, useContext } from "react";
import { Text, Button, Input } from "react-native-elements";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import firebase from "firebase";
import "firebase/firestore";
import recipeApi from "../../config/recipeApi";
import { Context as AuthContext } from "../../context/AuthProvider";

const searchRecipeById = async (recipe_id, accessToken) => {
  try {
    const response = await recipeApi.post(
      "search_recipe",
      {
        recipe_id,
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};

const BreakFastRoute = ({ navigation, breakFastData, accessToken }) => {
  return (
    <View style={styles.tabElementContainer}>
      <Text style={styles.textStyle}>List of recipes</Text>
      <FlatList
        data={breakFastData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return (
            <View style={{ elevation: 5 }}>
              <TouchableOpacity
                onPress={async () => {
                  const data = await searchRecipeById(item.recipe_id, accessToken);
                  navigation.navigate("MealDetails", {
                    recipe: data,
                  });
                }}
              >
                <Text style={styles.recipeNameStyle}>{item.recipe_name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const LunchRoute = ({ navigation, lunchData, accessToken }) => {
  return (
    <View style={styles.tabElementContainer}>
      <Text style={styles.textStyle}>List of recipes</Text>
      <FlatList
        data={lunchData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return (
            <View>
              <TouchableOpacity
                onPress={async () => {
                  const data = await searchRecipeById(item.recipe_id, accessToken);
                  navigation.navigate("MealDetails", {
                    recipe: data,
                  });
                }}
              >
                <Text style={styles.recipeNameStyle}>{item.recipe_name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const DinnerRoute = ({ navigation, dinnerData, accessToken }) => {
  return (
    <View style={styles.tabElementContainer}>
      <Text style={styles.textStyle}>List Of recipes</Text>
      <FlatList
        data={dinnerData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return (
            <View>
              <TouchableOpacity
                onPress={async () => {
                  const data = await searchRecipeById(item.recipe_id,accessToken);
                  navigation.navigate("MealDetails", {
                    recipe: data,
                  });
                }}
              >
                <Text style={styles.recipeNameStyle}>{item.recipe_name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const NameRoute = ({ planDesc, planName }) => <View style={{ flex: 1 }}></View>;

const ReadWeeklyPlan = ({ navigation, route }) => {
  const layout = useWindowDimensions();
  const { state } = useContext(AuthContext);

  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    { key: "breakfast", title: "BreakFast" },
    { key: "lunch", title: "Lunch" },
    { key: "dinner", title: "Dinner" },
  ]);

  const planStructure = route.params;
  console.log(planStructure);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "breakfast":
        return (
          <BreakFastRoute
            navigation={navigation}
            breakFastData={planStructure.details.breakfast}
            accessToken={state.accessToken}
          />
        );
      case "lunch":
        return (
          <LunchRoute
            navigation={navigation}
            lunchData={planStructure.details.lunch}
            accessToken={state.accessToken}
          />
        );
      case "dinner":
        return (
          <DinnerRoute
            navigation={navigation}
            dinnerData={planStructure.details.dinner}
            accessToken={state.accessToken}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
      />
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={styles.container}
      tabStyle={{
        width: "auto",
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 30,
  },
  tabbar: {
    // backgroundColor: "#3f51b5",
    backgroundColor: "#0F52BA",
  },
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: "#ffeb3b",
  },
  label: {
    fontWeight: "400",
  },
  tabElementContainer: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  recipeNameStyle: {
    fontSize: 25,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    color: "#7bbfb5",
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
    color: "#0F52BA",
  },
});

export default ReadWeeklyPlan;
