import createDataContext from "./createDataContext";
import * as SecureStore from "expo-secure-store";

const AuthReducer = (state, actions) => {
  switch (actions.type) {
    case "add_user":
      return {
        ...state,
        email: actions.payload.email,
        userid: actions.payload.userid,
        errorMessage: "",
        foodAllergyArr: actions.payload.foodAllergyArr
      };
    case "signin":
      return {
        ...state,
        email: actions.payload.email,
        userid: actions.payload.userid,
        errorMessage: "",
        isAdmin: actions.payload.isAdmin,
        foodAllergyArr: actions.payload.foodAllergyArr
      };
    case "restore_token":
      return {
        ...state,
        email: actions.payload.email,
        userid: actions.payload.userid,
        errorMessage: "",
        foodAllergyArr: actions.payload.foodAllergyArr,
        isAdmin: actions.payload.isAdmin
      };
    case "errmsg":
      return {
        ...state,
        email: "",
        userid: "",
        errorMessage: actions.payload.errorMessage,
        isAdmin:false,
        foodAllergyArr:[]
      };
    case "signout":
      return {
        isSignedUp: null,
        errorMessage: "",
        email: "",
        userid: "",
        isAdmin:false,
        foodAllergyArr:[],
      };
    case "clear_error_message":
      return {
        ...state,
        errorMessage: "",
      };
    default:
      return state;
  }
};

const signup = (dispatch) => {
  return async ({ email, userid }) => {
    dispatch({ type: "add_user", payload: { email, userid } });
    try {
      await SecureStore.setItemAsync("userid", userid);
    } catch (err) {
      console.log(err);
    }
  };
};

const signin = (dispatch) => {
  return async ({ email, userid, isAdmin, foodAllergyArr }) => {
    dispatch({ type: "signin", payload: { email, userid, isAdmin, foodAllergyArr } });
    try {
      await SecureStore.setItemAsync("userid", userid);
    } catch (err) {
      console.log(err);
    }
  };
};

const showErr = (dispatch) => {
  return (errorMessage) => {
    dispatch({ type: "errmsg", payload: { errorMessage } });
  };
};

const restore_token = (dispatch) => {
  
  return ({ email, userid, foodAllergyArr, isAdmin }) => {
    dispatch({ type: "restore_token", payload: { email, userid, foodAllergyArr, isAdmin } });
  };
};

const signOut = (dispatch) => {
  return () => {
    dispatch({ type: "signout", payload: "" });
  };
};

const clearErrorMessage = (dispatch) => {
  return () => {
    dispatch({ type: "clear_error_message", payload: "" });
  };
};

export const { Context, Provider } = createDataContext(
  AuthReducer,
  {
    signup,
    signin,
    showErr,
    restore_token,
    signOut,
    clearErrorMessage
  },
  { isSignedUp: null, errorMessage: "", email: "", userid: "", isAdmin: false, foodAllergyArr:[] }
);
