import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SearchBar, CheckBox, Button } from "react-native-elements";
import firebase from "firebase";
import recipeApi from "../../config/recipeApi";
import "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { Context as AuthContext } from "../../context/AuthProvider";

const SearchAdminRecipe = ({ navigation, route }) => {
  const [searchAdmin, setSearchAdminBar] = useState("");
  const [recipeLimit, setRecipeLimit] = useState(20);
  const [recipeData, setRecipeData] = useState([]);
  const { flag } = route.params;
  const { state } = useContext(AuthContext);

  useEffect(() => {
    navigation.addListener("blur", () => {
      setRecipeData([]);
      setSearchAdminBar("");
    })
    return () => {
      setRecipeData([]);
      setSearchAdminBar("");
    }
  },[])

  const searchRecipeData = async () => {
    try{
      if (searchAdmin != "" && state.accessToken != "") {
        const response = await recipeApi.post(
          "/recipe",
          {
            search: searchAdmin,
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
    }
    catch(err){
      console.log("searchRecipe error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Type here...."
        onChangeText={setSearchAdminBar}
        value={searchAdmin}
        lightTheme={true}
        containerStyle={{
          backgroundColor: "#0F52BA",
        }}
        inputContainerStyle={{
          backgroundColor: "#ececed",
        }}
        searchIcon={<MaterialIcons name="search" size={28} color="#0F52BA" />}
        onBlur={() => {
          searchRecipeData();
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
