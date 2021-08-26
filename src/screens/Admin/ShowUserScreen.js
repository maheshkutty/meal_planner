import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import { Context as AuthContext } from "../../context/AuthProvider";
import dayjs from "dayjs";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

var customParseFormat = require("dayjs/plugin/customParseFormat");

const UserProfile = ({ userData }) => {
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

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          marginHorizontal: 25,
        }}
      ></View>
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
    </ScrollView>
  );
};

const ExistingPlan = ({ customPlan, navigation }) => {
  return (
    <View>
      <View>
        <FlatList
          data={customPlan}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ReadWeeklyPlan", item);
                }}
              >
                <View style={styles.planContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={require("../../../assets/plan.jpg")}
                      style={styles.imageStyle}
                    />
                  </View>

                  <Text style={styles.textStylePlan}>{item.name}</Text>
                  <Text style={styles.textDecStylePlan}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const ShowUserScreen = ({ navigation, route }) => {
  const { state } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [customPlan, setCustomPlan] = useState([]);
  const userid = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      async function fetchData() {
        try {
          if (userid != "") {
            const doc = await firebase
              .firestore()
              .collection("user")
              .doc(userid.toString())
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
  }, [state.isSignedUp]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("userplan")
      .doc(userid.toString())
      .get()
      .then((doc) => {
        const data = doc.data();
        const customPlan = [];
        if (doc.exists) {
          customPlan[0] = data.plan;
        }
        setCustomPlan(customPlan);
      });
  }, []);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    { key: "UserProfile", title: "Profile" },
    { key: "ExistingPlan", title: "Existing Plan" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "UserProfile":
        return <UserProfile userData={userData} />;
      case "ExistingPlan":
        return <ExistingPlan navigation={navigation} customPlan={customPlan} />;
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
  planContainer: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#6200EE",
    padding: 10,
    elevation: 5,
  },
  textStylePlan: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
  },
  textDecStylePlan: {
    color: "white",
    fontSize: 15,
  },
  tab: {
    // width: 100,
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
  tabbar: {
    backgroundColor: "#0F52BA",
  },
  imageStyle: {
    height: 150,
    resizeMode: "cover",
  },
});

export default ShowUserScreen;
