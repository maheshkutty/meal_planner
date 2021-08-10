import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Tooltip, Text } from "react-native-elements";

const PlanRequestScreen = ({ navigation }) => {
  const [requestPlan, setRequestPlan] = useState([]);
  async function fetchData() {
    try {
      const response = await firebase
        .firestore()
        .collection("/requestplan")
        .where("status", "==", "pending")
        .get();
      let planArr = [];
      response.forEach((item) => {
        //console.log("exists plan", item.exists);
        if (item.exists) {
          const data = item.data();
          //console.log(data);
          planArr.push({
            name: data.name,
            userid: data.userid,
            status: data.status,
            planid: data.planid,
          });
        }
      });
      setRequestPlan(planArr);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    navigation.addListener("focus", () => {
      fetchData();
    });
  }, [navigation]);

  const rejectRequest = async (userid, planid) => {
    try {
      await firebase
        .firestore()
        .collection("requestplan")
        .doc(userid.toString())
        .delete();
      await firebase
        .firestore()
        .collection("planhistory")
        .doc(userid.toString())
        .collection("planid")
        .doc(planid.toString())
        .update({
          status: "reject",
        });
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>LIST OF REQUEST</Text>
      {requestPlan.length == 0 ? (
        <Text style={styles.noRequestStyle}>No pending request to serve</Text>
      ) : (
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
                  <Text style={styles.subtext}>{item.name}</Text>
                </TouchableOpacity>
                <View style={styles.iconConatiner}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("CreateWeekly", {
                        generic: false,
                        userid: item.userid,
                      });
                    }}
                  >
                    <MaterialIcons
                      name="add"
                      size={40}
                      color="#0bda51"
                      style={{ marginRight: 20 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      rejectRequest(item.userid, item.planid);
                    }}
                  >
                    <MaterialIcons name="cancel" size={40} color="#ff0000" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#f6f6f6",
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    backgroundColor: "white",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  iconConatiner: {
    flexDirection: "row",
  },
  mainText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    color: "#7bbfb5",
    fontWeight: "bold",
  },
  subtext: {
    fontSize: 30,
    color: "#0F52BA",
    fontWeight: "bold",
  },
  noRequestStyle:{
    fontSize:20,
    textAlign:'center',
    alignContent:'center',
    marginVertical:50
  }
});

export default PlanRequestScreen;
