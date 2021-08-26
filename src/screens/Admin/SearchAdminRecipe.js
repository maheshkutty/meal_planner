import React, { useState, useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SearchBar, CheckBox, Button } from "react-native-elements";
import firebase from "firebase";
import recipeApi from "../../config/recipeApi";
import "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { Context as AuthContext } from "../../context/AuthProvider";

const SearchAdminRecipe = ({ navigation, route }) => {
  const [search, setSearchBar] = useState("");
  const [recipeLimit, setRecipeLimit] = useState(20);
  const [recipeData, setRecipeData] = useState([]);
  const { flag } = route.params;
  const { state } = useContext(AuthContext);

  const searchRecipe = async () => {
    if (search != "") {
      const response = await recipeApi.post(
        "/recipe",
        {
          search,
          foodAllergy: [],
          limit: recipeLimit,
        },
        {
          headers: {
            Authorization: state.accessToken,
          },
        }
      );
      response.data = response.data.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      setRecipeData(response.data);
    }
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
      <FlatList
        data={recipeData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item, index }) => {
          return (
            <CheckBox
              title={item.recipe_name}
              checked={recipeData[index].checked}
              onPress={() => {
                const tempRecipeData = recipeData;
                tempRecipeData[index].checked = !tempRecipeData[index].checked;
                setRecipeData([...tempRecipeData]);
              }}
            />
          );
        }}
      />
      <Button
        title="Save"
        onPress={() => {
          const data = recipeData.filter((item) => {
            if (item.checked) return true;
            else return false;
          });
          console.log(flag);
          navigation.navigate("CreateWeekly", {
            [flag]: data,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
  },
});

export default SearchAdminRecipe;
