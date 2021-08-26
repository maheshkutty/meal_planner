import React, { useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import UserDetailScreen from "./src/screens/UserDetailScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LandingScreen from "./src/screens/LandingScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import MealScreen from "./src/screens/MealScreen";
import MealDetailsScreen from "./src/screens/MealDetailsScreen";
import AccountScreen from "./src/screens/AccountScreen";
import FoodAllergyScreen from "./src/screens/FoodAllergyScreen";
import SearchScreen from "./src/screens/SearchScreen";
import * as firebase from "firebase";
import AdminHomeScreen from "./src/screens/Admin/AdminHomeScreen";
import TaggingScreen from "./src/screens/Admin/TaggingScreen";
import CreateWeeklyPlan from "./src/screens/Admin/CreateWeeklyPlan";
import WeeklyPlan from "./src/screens/Admin/WeeklyPlan";
import SearchAdminRecipe from "./src/screens/Admin/SearchAdminRecipe";
import NutrionalScreen from "./src/screens/NutrionalScreen";
import ReadWeeklyPlan from "./src/screens/Admin/ReadWeeklyPlan";
import PlanRequestScreen from "./src/screens/Admin/PlanRequestScreen";
import ShowUserScreen from "./src/screens/Admin/ShowUserScreen";
import PlanViewScreen from "./src/screens/Admin/PlanViewScreen";
import AddRecipeScreen from "./src/screens/Admin/AddRecipeScreen";
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from "./src/context/AuthProvider";

import { Provider as MealProvider } from "./src/context/MealProvider";

const firebaseConfig = {
  apiKey: "AIzaSyDoZu1NbGW0PhU7UFVdgkTISuR9CLqlFDI",
  authDomain: "meal-planner-71e71.firebaseapp.com",
  projectId: "meal-planner-71e71",
  storageBucket: "meal-planner-71e71.appspot.com",
  messagingSenderId: "958386612193",
  appId: "1:958386612193:web:5919012351d160f57054a0",
  measurementId: "G-HBERRK6WR6",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  //console.log(firebase);
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Home() {
  return (
    <MealProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Meal") {
              iconName = "no-meals";
            } else if (route.name == "Account") {
              iconName = "account-circle";
            } else if (route.name == "Search") {
              iconName = "search";
            }
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#0F52BA",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Meal" component={MealScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Nutrional"
          component={NutrionalScreen}
          options={{
            title: "Nutrition",
            tabBarIcon: ({ focused, color, size }) => {
              return (
                <MaterialCommunityIcons
                  name="nutrition"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        {/* <Tab.Screen
          name="WeeklyUser"
          component={WeeklyPlan}
          options={{
            title: "Daily Plan",
            tabBarIcon: ({ focused, color, size }) => {
              return <FontAwesome name="calendar" size={size} color={color} />;
            },
          }}
        /> */}
        <Tab.Screen
          name="PlanView"
          component={PlanViewScreen}
          options={{
            title: "Daily Plan",
            tabBarIcon: ({ focused, color, size }) => {
              return <FontAwesome name="calendar" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </MealProvider>
  );
}

function AdminHome() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "AdminHome") {
            iconName = "home";
          } else if (route.name === "Tagging") {
            iconName = "tag";
          } else if (route.name == "Weekly") {
            iconName = "calendar";
          }
          else if(route.name == "AddRecipe"){
            iconName = "edit";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#0F52BA",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Tagging"
        component={TaggingScreen}
        options={{
          title: "Tag Recipe",
        }}
      />
      <Tab.Screen
        name="Weekly"
        component={WeeklyPlan}
        options={{
          title: "Daily Plan",
        }}
      />
      <Tab.Screen
        name="PlanRequest"
        component={PlanRequestScreen}
        options={{
          title: "Plan Request",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen name="AddRecipe" component={AddRecipeScreen} options={{
        title:"Add Recipe"
      }} />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Account"
        onPress={() => props.navigation.navigate("Account")}
      />
      <DrawerItem
        label="Meal"
        onPress={() => props.navigation.navigate("Meal")}
      />
      <DrawerItem
        label="Search"
        onPress={() => props.navigation.navigate("Search")}
      />
      <DrawerItem
        label="Nutrional"
        onPress={() => props.navigation.navigate("Account")}
      />
      <DrawerItem
        label="Daily Plan"
        onPress={() => props.navigation.navigate("PlanView")}
      />
    </DrawerContentScrollView>
  );
}

function DrawerHome() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        title: "Meal Planner",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: "Home",
        }}
        component={Home}
      />
    </Drawer.Navigator>
  );
}

function App() {
  //const { state } = useContext(AuthContext);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ResolveAuth"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="DrawerHome" component={DrawerHome} />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
          <Stack.Screen
            name="MealDetails"
            component={MealDetailsScreen}
            options={{
              headerShown: false,
              title: "Recipe Details",
              headerStyle: {
                backgroundColor: "white",
              },
              headerTransparent: false,
            }}
          />
          <Stack.Screen name="FoodAllergy" component={FoodAllergyScreen} />
          <Stack.Screen name="AdminHome" component={AdminHome} />
          <Stack.Screen
            name="CreateWeekly"
            component={CreateWeeklyPlan}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#0F52BA",
                elevation: 0,
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTintColor: "#fff",
              title: "Create Daily Plan",
            }}
          />
          <Stack.Screen
            name="SearchAdminRecipe"
            component={SearchAdminRecipe}
          />
          <Stack.Screen
            name="ReadWeeklyPlan"
            component={ReadWeeklyPlan}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#0F52BA",
                elevation: 0,
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTintColor: "#fff",
              title: "Daily Plan",
            }}
          />
          <Stack.Screen
            name="ShowUser"
            options={{
              headerShown: true,
              title: "User Details",
              headerStyle: {
                backgroundColor: "#0F52BA",
                elevation: 0,
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTransparent: false,
              headerTintColor: "#fff",
            }}
            component={ShowUserScreen}
          />
          <Stack.Screen name="AddRecipe" options={{
              headerShown: true,
              title: "Add recipe",
              headerTransparent: false,
            }} component={AddRecipeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
