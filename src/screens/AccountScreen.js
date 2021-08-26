import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import { Context as AuthContext } from "../context/AuthProvider";
import dayjs from "dayjs";
import UserHeader from "../component/UserHeader";
var customParseFormat = require("dayjs/plugin/customParseFormat");
const AccountScreen = ({ navigation }) => {
  const { state, signOut } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      async function fetchData() {
        try {
          if (state.userid != "") {
            const doc = await firebase
              .firestore()
              .collection("user")
              .doc(state.userid.toString())
              .get();
            if (doc.exists) {
              const {
                email,
                heFeet,
                heInches,
                name,
                weight,
                date,
                gender,
                foodAllergyArr,
              } = doc.data();
              setUserData({
                email,
                heFeet,
                heInches,
                name,
                weight,
                dob: date,
                gender,
                foodAllergyArr,
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    });
    return unsubscribe;
  }, [state.accessToken]);

  const calDailyCalorie = () => {
    let BMR = 0;
    if (userData.heFeet != undefined) {
      const heightCm = userData.heFeet * 30.48 + userData.heInches * 2.54;
      if (userData.gender == "male")
        BMR =
          13.397 * userData.weight +
          4.799 * heightCm -
          5.677 * calAge() +
          88.362;
      else
        BMR =
          9.247 * userData.weight +
          3.098 * heightCm -
          4.33 * calAge() +
          447.593;
    }
    return BMR.toFixed(2);
  };

  const calAge = () => {
    dayjs.extend(customParseFormat);
    let now = dayjs();
    let ageDate = dayjs(userData.dob, "D/M/YYYY");
    let age = dayjs().diff(ageDate, "year");
    return age;
  };

  const logOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        signOut();
      });
    navigation.navigate("Landing");
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          marginHorizontal: 25,
        }}
      >
        <UserHeader userName={userData.name} gender={userData.gender} />
      </View>
      <Text style={styles.mainText}>Personal Details</Text>
      <View style={styles.formatInput}>
        <Text style={styles.textStyle}>Name</Text>
        <Text style={styles.textStyleData}>{userData.name}</Text>
      </View>
      <View style={styles.formatInput}>
        <Text style={styles.textStyle}>Email</Text>
        <Text style={styles.textStyleData}>{userData.email}</Text>
      </View>
      <View style={styles.formatInput}>
        <Text style={styles.textStyle}>Weight</Text>
        <Text style={styles.textStyleData}>{userData.weight}</Text>
      </View>
      <View style={styles.formatInput}>
        <Text style={styles.textStyle}>Height Feet</Text>
        <Text style={styles.textStyleData}>{userData.heFeet}</Text>
      </View>
      <View style={styles.formatInput}>
        <Text style={styles.textStyle}>Height Inches</Text>
        <Text style={styles.textStyleData}>{userData.heInches}</Text>
      </View>
      <Text style={styles.subHeaderText}>Goals</Text>
      <View style={styles.formatInput}>
        <Text style={styles.textStyle}>Daily Calorie</Text>
        <Text style={styles.textStyleData}>{calDailyCalorie()}</Text>
      </View>
      <Text style={styles.subHeaderText}>Food Allergies</Text>
      <View>
        {userData.foodAllergyArr ? (
          <Text style={styles.foodAllergyText}>
            {userData.foodAllergyArr.join(",")}
          </Text>
        ) : null}
      </View>
      <Button
        title="Sign Out"
        onPress={logOutUser}
        buttonStyle={styles.buttonStyle}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    flex: 1,
    // alignItems: "center",
    // alignItems:'flex-start',
    backgroundColor: "#f6f6f6",
  },
  buttonStyle: {
    color: "white",
    width: 100,
    backgroundColor: "#FF0000",
    marginVertical: 20,
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 20,
  },
  iconStyle: {
    textAlign: "center",
    marginHorizontal: 20,
  },
  mainText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 20,
    backgroundColor: "#0F52BA",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    paddingVertical: 10,
    marginVertical: 10,
  },
  formatInput: {
    flexDirection: "row",
    marginVertical: 5,
    alignSelf: "stretch",
    marginHorizontal: 15,
    justifyContent: "space-between",
    borderRadius: 20,
    backgroundColor: "white",
    padding: 10,
  },
  textStyle: {
    fontSize: 18,
    color: "#0F52BA",
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
    backgroundColor: "#0F52BA",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 20,
  },
  foodAllergyText: {
    fontSize: 25,
    textTransform: "capitalize",
    marginHorizontal: 20,
    color: "#0F52BA",
    fontWeight: "bold",
  },
  textStyleData: {
    color: "black",
    fontSize: 20,
  },
});

export default AccountScreen;
