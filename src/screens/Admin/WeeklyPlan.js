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
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const commonPlan = () => {};

const customPlan = () => {};

const WeeklyPlan = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    { key: "name", title: "Name" },
    { key: "breakfast", title: "BreakFast" },
    { key: "lunch", title: "Lunch" },
    { key: "dinner", title: "Dinner" },
    { key: "save", title: "Save" },
  ]);

  const [planStructure, setPlanStructure] = useState([]);
  const { state } = useContext(AuthContext);
  const [customPlan, setCustomPlan] = useState([]);

  const createIncrement = () => {
    var seq = "P" + new Date().getTime();
    return seq;
  };

  const checkPlan = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("/requestplan")
        .doc(state.userid)
        .get();
      const flag = 0;
      if (!snapshot.exists) {
        const seq = createIncrement();
        let userData = await firebase
          .firestore()
          .collection("user")
          .doc(state.userid)
          .get();
        userData = userData.data();
        await firebase
          .firestore()
          .collection("requestplan")
          .doc(state.userid)
          .set({
            status: "pending",
            name: userData.name,
            userid: state.userid,
            planid: seq,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
          });
        await firebase
          .firestore()
          .collection("planhistory")
          .doc(state.userid.toString())
          .collection("planid")
          .doc(seq)
          .set({
            status: "pending",
            name: userData.name,
            userid: state.userid,
            planid: seq,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
          });
        // const chkPlanHistory = await firebase
        //   .firestore()
        //   .collection("planhistory")
        //   .doc(state.userid.toString())
        //   .get();
        // if (chkPlanHistory.exists) {
        //   await firebase
        //     .firestore()
        //     .collection("planhistory")
        //     .doc(state.userid.toString())
        //     .update({
        //       details: {
        //         status: "pending",
        //         name: userData.name,
        //         userid: state.userid,
        //         date: firebase.firestore.Timestamp.fromDate(new Date()),
        //         planid: seq
        //       },
        //     });
        // } else {
        //   const data = {
        //     details: {
        //       status: "pending",
        //       name: userData.name,
        //       userid: state.userid,
        //       date: firebase.firestore.Timestamp.fromDate(new Date()),
        //       planid: seq
        //     },
        //   };
        //   await firebase
        //     .firestore()
        //     .collection("planhistory")
        //     .doc(state.userid.toString())
        //     .set(data);
        // }
      } else {
        const planHistory = await firebase
          .firestore()
          .collection("planhistory")
          .doc(state.userid)
          .get();
        console.log(planHistory.data());
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

  useEffect(() => {
    firebase
      .firestore()
      .collection("userplan")
      .doc(state.userid.toString())
      .get()
      .then((doc) => {
        const data = doc.data();
        if (doc.exists) {
          console.log(data);
          customPlan.push(data.plan.details);
        }
        console.log(customPlan);
        setCustomPlan(customPlan);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>All Plans</Text>
      <View>
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
                    style={styles.imageStyle}
                  />
                  <Text style={styles.textStyle}>{item.name}</Text>
                  <Text style={styles.textDecStyle}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
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
    marginHorizontal:10,
    borderRadius:10,
    marginVertical:10
  },
  textDecStyle: {
    color: "white",
    fontSize: 15,
  },
  imageStyle: {
    width: 400,
    height: 150,
    resizeMode: "cover",
  },
});

export default WeeklyPlan;
