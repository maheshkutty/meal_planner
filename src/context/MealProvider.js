import createDataContext from "./createDataContext";
import firebase from "firebase";
import "firebase/firestore";
import { LogBox } from "react-native";
import pythonApi from "../config/pythonApi";
import recipeApi from "../config/recipeApi";
import { Context as AuthContext } from "../context/AuthProvider";
import { useContext, useState } from "react";

LogBox.ignoreLogs(["Setting a timer"]);

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
    case "fetch_breakfast":
      return { ...state, breakFast: actions.payload, errorMessage: "" };
    case "fetch_lunch":
      return { ...state, lunch: actions.payload, errorMessage: "" };
    case "fetch_recommed":
      return { ...state, recommedRecipe: actions.payload, errorMessage: "" };
    case "fetch_dinner":
      return { ...state, dinner: actions.payload, errorMessage: "" };
    default:
      return state;
  }
};

const indianMeal = (dispatch) => {
  const ref = firebase
    .firestore()
    .collection("indian_recipe")
    .orderBy("recipe_name");
  return (indianMeal) => {
    if (indianMeal.length == 0) {
      ref
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = [];
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "search_indian_meal", payload: mealData });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ref
        .startAfter(indianMeal[indianMeal.length - 1].recipe_name)
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = indianMeal;
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "search_indian_meal", payload: mealData });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // firebase
    //   .firestore()
    //   .collection("indian_recipe")
    //   .get()
    //   .then((snapshot) => {
    //     console.log(snapshot.size);
    //     const mealData = [];
    //     snapshot.forEach((doc) => {
    //       mealData.push(doc.data());
    //     });
    //     dispatch({ type: "search_indian_meal", payload: mealData });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
};

const indianRecipeSize = () => {
  return () => {
    firebase
      .firestore()
      .collection("recipe_rate")
      .set()
      .then((snapshot) => {});
  };
};

const fetchUserRate = (dispatch) => {
  return (recipeid) => {
    firebase
      .firestore()
      .collection("recipe_rate")
      .doc(recipeid)
      .get()
      .then((doc) => {
        console.log(doc.data());
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

const fetchBreakFast = (dispatch) => {
  return (breakFast) => {
    const ref = firebase
      .firestore()
      .collection("recipes")
      .orderBy("recipe_name")
      .where("tag.breakfast", "==", 1);
    if (breakFast.length == 0) {
      ref
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = [];
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "fetch_breakfast", payload: mealData });
        });
    } else {
      ref
        .startAfter(breakFast[breakFast.length - 1].recipe_name)
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = breakFast;
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "fetch_breakfast", payload: mealData });
        });
    }
    // firebase
    //   .firestore()
    //   .collection("recipes")
    //   .where("tag.breakfast", "==", 1)
    //   .get()
    //   .then((snapshot) => {
    //     const mealData = [];
    //     snapshot.forEach((doc) => {
    //       mealData.push(doc.data());
    //     });
    //     dispatch({ type: "fetch_breakfast", payload: mealData });
    //   });
  };
};

const fetchLunchRecipe = (dispatch) => {
  return (lunch) => {
    const ref = firebase
      .firestore()
      .collection("recipes")
      .orderBy("recipe_name")
      .where("tag.lunch", "==", 1);
    if (lunch.length == 0) {
      ref
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = [];
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "fetch_lunch", payload: mealData });
        });
    } else {
      ref
        .startAfter(lunch[lunch.length - 1].recipe_name)
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = lunch;
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "fetch_lunch", payload: mealData });
        });
    }
  };
};

const fetchDinnerRecipe = (dispatch) => {
  return (dinner) => {
    const ref = firebase
      .firestore()
      .collection("recipes")
      .orderBy("recipe_name")
      .where("tag.dinner", "==", 1);
    if (dinner.length == 0) {
      ref
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = [];
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "fetch_dinner", payload: mealData });
        });
    } else {
      ref
        .startAfter(dinner[dinner.length - 1].recipe_name)
        .limit(5)
        .get()
        .then((snapshot) => {
          const mealData = dinner;
          snapshot.forEach((doc) => {
            mealData.push(doc.data());
          });
          dispatch({ type: "fetch_dinner", payload: mealData });
        });
    }
  };
};

const recommedRecipe = (dispatch) => {
  const { state } = useContext(AuthContext);
  return (size, userid) => {
    firebase
      .firestore()
      .collection("user_rate")
      .doc(userid.toString())
      .get()
      .then((doc) => {
        let recipe_like = [];
        if (doc.exists) {
          const data = doc.data();
          for (let i of Object.keys(data)) {
            recipe_like.push({
              recipe_name: data[i].recipe_name,
              ratings: data[i].rating,
            });
          }
        }
        pythonApi
          .post("/meal_predicte", {
            recipe_like,
            size,
          })
          .then((response) => {
            response = response.data;
            recipeApi
              .post(
                "/search_list",
                {
                  recipeArr: response.final_recipe,
                },
                {
                  headers: { authorization: state.accessToken },
                }
              )
              .then((response) => {
                dispatch({
                  type: "fetch_recommed",
                  payload: response.data.data,
                });
              })
              .catch((error) => {
                console.log("mongodb api", error);
                dispatch({
                  type: "fetch_recommed",
                  payload: response.data.data,
                });
              });
            // firebase
            //   .firestore()
            //   .collection("recipes")
            //   .where("recipe_name", "in", response.final_recipe)
            //   .get()
            //   .then((querysnapshot) => {
            //     const final_recipe = [];
            //     querysnapshot.forEach((doc) => {
            //       if (doc.exists) final_recipe.push(doc.data());
            //     });
            //     //console.log("hello", final_recipe);
            //     dispatch({
            //       type: "fetch_recommed",
            //       payload: final_recipe,
            //     });
            //   })
            //   .catch((error) => {
            //     console.log("name_final", error);
            //   });
          })
          .catch((error) => {
            console.log("python api", error);
            dispatch({
              type: "fetch_recommed",
              payload: [],
            });
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "fetch_recommed",
          payload: [],
        });
      });
  };
};

const pythonAPIFunc = (authorization, recipeArr) => {
  recipeApi
    .post(
      "/search_list",
      {
        recipeArr,
      },
      {
        headers: { authorization },
      }
    )
    .then((response) => {
      dispatch({
        type: "fetch_recommed",
        payload: response.data.data,
      });
    })
    .catch((error) => {
      console.log("mongodb api", error);
      dispatch({
        type: "fetch_recommed",
        payload: response.data.data,
      });
    });
};

export const { Context, Provider } = createDataContext(
  MealReducer,
  {
    indianMeal,
    fetchUserRate,
    fetchBreakFast,
    fetchLunchRecipe,
    recommedRecipe,
    fetchDinnerRecipe,
  },
  {
    meal: [],
    errorMessage: "",
    indianMealSize: 0,
    breakFast: [],
    dinner: [],
    lunch: [],
    recommedRecipe: [],
    dinner:[]
  }
);

