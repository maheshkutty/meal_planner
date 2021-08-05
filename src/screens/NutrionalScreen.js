import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SearchBar from "../component/SearchBar";
import usdaApi from "../config/usdaApi";

const NutritionalScreen = () => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const searchApi = async (term) => {
    try {
      let response = await usdaApi.post("/search", {
        pageSize: 25,
        query: term,
        dataType: ["Foundation", "Survey (FNDDS)"],
      });
      response = response.data;
      setResults(response.foods);
    } catch (err) {
      console.log(err);
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <View>
      <Text style={styles.screen}>Nutritional Screen</Text>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => searchApi(term)}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.fdcId.toString()}
        renderItem={({ item }) => {
          return <Text>{item.description}</Text>;
        }}
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Text>We have found {results.length} results</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    marginTop: 50,
  },
});

export default NutritionalScreen;
