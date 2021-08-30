import React, { useState, useEffect } from "react";
import { Text, Button, Input } from "react-native-elements";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  ToastAndroid,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import firebase from "firebase";
import "firebase/firestore";
import expoNotificationApi from "../../config/expoNotificationApi";

const successMessage = (msg) => {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
    25,
    30
  );
};

const sendPushNotification = (userid) => {
  firebase
    .firestore()
    .collection("user")
    .doc(userid.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().expotoken != undefined)
          expoNotificationApi.post("/send", {
            to: doc.data().expotoken.toString(),
            title: "Meal Planner Notification",
            body: "Hey you got new recipe plan, Please check the app",
          });
      }
    });
};

const BreakFastRoute = ({ navigation, breakFastData }) => {
  return (
    <View style={styles.tabElementContainer}>
      <Text style={styles.textStyle}>LIST OF RECIPES</Text>
      <FlatList
        data={breakFastData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return <Text style={styles.recipeNameStyle}>{item.recipe_name}</Text>;
        }}
      />
      <Button
        title="Add Recipe"
        onPress={() => {
          navigation.navigate("SearchAdminRecipe", { flag: "breakfast" });
        }}
        buttonStyle={[styles.buttonStyle, styles.addMargin]}
      />
    </View>
  );
};

const LunchRoute = ({ navigation, lunchData }) => {
  return (
    <View style={styles.tabElementContainer}>
      <Text style={styles.textStyle}>LIST OF RECIPES</Text>
      <FlatList
        data={lunchData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return <Text style={styles.recipeNameStyle}>{item.recipe_name}</Text>;
        }}
      />
      <Button
        title="Add Recipe"
        onPress={() => {
          navigation.navigate("SearchAdminRecipe", { flag: "lunch" });
        }}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
};

const DinnerRoute = ({ navigation, dinnerData }) => {
  return (
    <View style={styles.tabElementContainer}>
      <Text style={styles.textStyle}>LIST OF RECIPES</Text>
      <FlatList
        data={dinnerData}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => {
          return <Text style={styles.recipeNameStyle}>{item.recipe_name}</Text>;
        }}
        buttonStyle={styles.buttonStyle}
      />
      <Button
        title="Add Recipe"
        onPress={() => {
          navigation.navigate("SearchAdminRecipe", { flag: "dinner" });
        }}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
};

const NameRoute = ({ planDesc, setPlanDesc, planName, setPlanName }) => (
  <View style={{ flex: 1 }}>
    <Input
      placeholder="Diet Name"
      value={planName}
      onChangeText={setPlanName}
    />
    <Input
      placeholder="Description"
      multiline
      numberOfLines={4}
      value={planDesc}
      onChangeText={setPlanDesc}
    />
  </View>
);

const SaveRoute = ({
  planName,
  planDesc,
  breakFastData,
  dinnerData,
  lunchData,
  userid,
  navigation,
}) => {
  //console.log(breakFastData);
  const storeDailyPlan = async () => {
    if (planName == "") {
      console.log("can not store plan as name is blank");
    } else if (
      breakFastData.length == 0 ||
      dinnerData.length == 0 ||
      lunchData == 0
    ) {
      console.log("breakfast, lunch and dinner can not be blank");
    } else {
      let planStructure = {
        name: planName,
        desc: planDesc,
        details: {
          breakfast: breakFastData.map((item) => {
            return {
              recipe_id: item.recipe_id,
              recipe_name: item.recipe_name,
            };
          }),
          lunch: lunchData.map((item) => {
            return {
              recipe_id: item.recipe_id,
              recipe_name: item.recipe_name,
            };
          }),
          dinner: dinnerData.map((item) => {
            return {
              recipe_id: item.recipe_id,
              recipe_name: item.recipe_name,
            };
          }),
        },
      };
      console.log(planStructure);
      if (userid != "") {
        let planId = await firebase
          .firestore()
          .collection("requestplan")
          .doc(userid.toString())
          .get();
        planId = planId.data().planid;
        await firebase.firestore().collection("userplan").doc(userid).set({
          userid: userid,
          planid: planId,
          plan: planStructure,
        });
        console.log("Plan successfully added");

        firebase
          .firestore()
          .collection("requestplan")
          .doc(userid.toString())
          .delete()
          .then(() => {
            console.log("data successfully deleted");
          })
          .catch((error) => {
            console.log(error);
          });
        firebase
          .firestore()
          .collection("planhistory")
          .doc(userid.toString())
          .collection("planid")
          .doc(planId.toString())
          .update({
            status: "done",
          })
          .then(() => {
            navigation.goBack();
            successMessage("Meal Plan Successfully Saved");
            sendPushNotification(userid);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        firebase
          .firestore()
          .collection("daily_plan")
          .where("name", "==", planName)
          .get()
          .then((querySnapshot) => {
            let chkFlag = false;
            querySnapshot.forEach((doc) => {
              if (doc.exists) {
                chkFlag = true;
                console.log("Plan with name already exist");
              }
            });
            if (!chkFlag) {
              firebase
                .firestore()
                .collection("daily_plan")
                .add(planStructure)
                .then((docref) => {
                  console.log(
                    "Plan structure successfully written ",
                    docref.id
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
              navigation.goBack();
              successMessage("Meal Plan Successfully Saved");
            }
          });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          marginVertical: 10,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 30,
          color: "#0F52BA",
        }}
      >
        Save the plan
      </Text>
      <Button
        title="Save"
        onPress={() => {
          storeDailyPlan();
          // navigation.goBack();
          // successMessage("Plan successfully saved");
        }}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
};

const CreateWeeklyPlan = ({ navigation, route }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    { key: "name", title: "Name" },
    { key: "breakfast", title: "BreakFast" },
    { key: "lunch", title: "Lunch" },
    { key: "dinner", title: "Dinner" },
    { key: "save", title: "Save" },
  ]);

  const [breakFastData, setBreakFastData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [userid, setUserId] = useState("");

  useEffect(() => {
    if (route.params?.generic == false) 
    {
      setUserId(route.params.userid);
    }
  }, []);

  useEffect(() => {
    if (route.params?.breakfast) {
      setBreakFastData(route.params?.breakfast);
    }
    if (route.params?.lunch) {
      setLunchData(route.params?.lunch);
    }
    if (route.params?.dinner) {
      setDinnerData(route.params?.dinner);
    }
  }, [route.params]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "breakfast":
        return (
          <BreakFastRoute
            navigation={navigation}
            breakFastData={breakFastData}
            setBreakFastData={setBreakFastData}
          />
        );
      case "lunch":
        return (
          <LunchRoute
            navigation={navigation}
            lunchData={lunchData}
            setBreakFastData={setLunchData}
          />
        );
      case "dinner":
        return (
          <DinnerRoute
            navigation={navigation}
            dinnerData={dinnerData}
            setBreakFastData={setDinnerData}
          />
        );
      case "name":
        return (
          <NameRoute
            navigation={navigation}
            planName={planName}
            setPlanName={setPlanName}
            planDesc={planDesc}
            setPlanDesc={setPlanDesc}
          />
        );
      case "save":
        return (
          <SaveRoute
            navigation={navigation}
            planName={planName}
            planDesc={planDesc}
            breakFastData={breakFastData}
            lunchData={lunchData}
            dinnerData={dinnerData}
            userid={userid}
            navigation={navigation}
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
    //marginTop: 30,
  },
  tabbar: {
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
    fontSize: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
  },
  textStyle: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
    color: "#0F52BA",
  },
  buttonStyle: {
    backgroundColor: "#0F52BA",
    //marginVertical:10,
    marginHorizontal: 10,
  },
  addMargin: {
    marginVertical: 10,
  },
});

export default CreateWeeklyPlan;