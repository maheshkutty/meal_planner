import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PlanRequestScreen = ({ navigation }) => {
  const [requestPlan, setRequestPlan] = useState([]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      async function fetchData() {
        try {
          const response = await firebase
            .firestore()
            .collection("/requestplan")
            .where("status", "==", "pending")
            .get();
          let planArr = [];
          response.forEach((item) => {
            console.log("exists plan", item.exists);
            if (item.exists) {
              const data = item.data();
              planArr.push({
                name: data.name,
                userid: data.userid,
                status: data.status,
              });
            }
          });
          setRequestPlan(planArr);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Plan Request Screen</Text>
      <FlatList
        data={requestPlan}
        keyExtractor={(item) => item.userid}
        renderItem={({ item }) => {
          return (
            <View style={styles.listContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ShowUser", item.userid);
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CreateWeekly", {
                    generic: false,
                    userid: item.userid,
                  });
                }}
              >
                <MaterialIcons name="add" size={24} color="black" />
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
    flex: 1,
    marginTop: 30,
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PlanRequestScreen;
