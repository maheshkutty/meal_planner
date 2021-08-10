import React, { useEffect, useState, useContext } from "react";
import { Text, Button, Image } from "react-native-elements";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { Context as AuthContext } from "../../context/AuthProvider";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const CommonPlan = ({ planStructure, navigation }) => {
  return (
    <View>
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

const CustomPlan = ({ customPlan, checkPlan, navigation }) => {
  return (
    <View>
      <Button
        title="Request for meal plan"
        onPress={() => {
          checkPlan();
        }}
        buttonStyle={styles.buttonStyle}
      />
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
                  <Image
                    source={require("../../../assets/plan5.jpg")}
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

const PlanViewScreen = ({ navigation }) => {
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
      } else {
        const planHistory = await firebase
          .firestore()
          .collection("planhistory")
          .doc(state.userid)
          .get();
        ToastAndroid.showWithGravityAndOffset(
          "Request For meal plan already send",
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          30
        );
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
    { key: "CommonPlan", title: "Common Plan" },
    { key: "CustomPlan", title: "Custom Plan" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "CommonPlan":
        return (
          <CommonPlan planStructure={planStructure} navigation={navigation} />
        );
      case "CustomPlan":
        return (
          <CustomPlan
            customPlan={customPlan}
            checkPlan={checkPlan}
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
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.labelStyle}
        renderLabel={({ route }) => (
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {route.title}
          </Text>
        )}
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
    marginTop: 10,
  },
  textDecStyle: {
    color: "white",
    fontSize: 15,
  },
  tabbar: {
    backgroundColor: "#0F52BA",
    color: "#7bbfb5",
  },
  labelStyle: {
    fontSize: 18,
    color: "#0F52BA",
    fontWeight: "bold",
  },
  tab: {
    color: "#0F52BA",
  },
  indicator: {
    backgroundColor: "white",
  },
  imageStyle: {
    width:400,
    height:150,
    resizeMode:'cover'
  },
});

export default PlanViewScreen;
