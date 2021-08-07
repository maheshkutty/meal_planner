import React, { useEffect, useState, useContext } from "react";
import { Text, Button, Image } from "react-native-elements";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { Context as AuthContext } from "../../context/AuthProvider";

const WeeklyPlan = ({ navigation }) => {
  const [planStructure, setPlanStructure] = useState([]);
  const { state } = useContext(AuthContext);

  const checkPlan = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("/requestplan")
        .doc(state.userid)
        .get();
      const flag = 0;
      if(!snapshot.exists)
      {
          let userData = await firebase.firestore().collection("user").doc(state.userid).get();
          userData = userData.data();
          await firebase
          .firestore()
          .collection("/requestplan")
          .doc(state.userid)
          .set({
            status: "pending",
            name:userData.name,
            userid:state.userid
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("daily_plan")
      .get()
      .then((querySnapshot) => {
        const planData = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          planData.push(doc.data());
        });
        setPlanStructure(planData);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>All Plans</Text>
      <View>
        <FlatList
          data={planStructure}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ReadWeeklyPlan", item);
                }}
              >
                <View style={styles.planContainer}>
                  <Image
                    source={require("../../../assets/plan.jpg")}
                    style={{
                      width: 350,
                      height: 150,
                    }}
                  />
                  <Text style={styles.textStyle}>{item.name}</Text>
                  <Text style={styles.textDecStyle}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {state.isAdmin ? (
        <Button
          title="Add Plan"
          onPress={() => {
            navigation.navigate("CreateWeekly");
          }}
          buttonStyle={styles.buttonStyle}
        />
      ) : (
        <Button
          title="Request for meal plan"
          onPress={() => {
            checkPlan();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  planContainer: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#6200EE",
    padding: 10,
    elevation: 5,
  },
  textStyle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
  },
  mainText: {
    textAlign: "center",
    fontSize: 30,
    color: "#0F52BA",
    fontWeight: "bold",
  },
  buttonStyle: {
    backgroundColor: "#0F52BA",
  },
  textDecStyle: {
    color: "white",
    fontSize: 15,
  },
});

export default WeeklyPlan;
