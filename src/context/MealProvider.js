import createDataContext from "./createDataContext";
import firebase from "firebase";
import "firebase/firestore";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const MealReducer = (state, actions) => {
  switch (actions.type) {
    case "search_indian_meal":
      return {
        ...state,
        meal: actions.payload,
        errorMessage: "",
      };
    case "search_meal":
      return {
        ...state,
        meal: actions.payload,
        errorMessage: "",
      };
    case "fetch_user_rate":
      return state;
    default:
      return state;
  }
};

const indianMeal = (dispatch) => {
  return async ({ start, end }) => {
    firebase
      .firestore()
      .collection("indian_recipe")
      .get()
      .then((snapshot) => {
        console.log(snapshot.size);
        const mealData = [];
        snapshot.forEach((doc) => {
          mealData.push(doc.data());
        })
        dispatch({type:"search_indian_meal", payload:mealData})
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const indianRecipeSize = () => {
  return () => {
    firebase.firestore().collection("recipe_rate").set().then(snapshot => {
      
    })
  }
}

const fetchUserRate = (dispatch) => {
  return (recipeid) => {
    firebase.firestore().collection('recipe_rate').doc(recipeid).get().then((doc) => {
      console.log(doc.data()) 
    }).catch((error) => {
      console.log(error);
    })
  }
}

export const { Context, Provider } = createDataContext(
  MealReducer,
  {
    indianMeal,
    fetchUserRate
  },
  { meal: [], errorMessage: "", indianMealSize:0 }
);
