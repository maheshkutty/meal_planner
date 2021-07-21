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
      };
    case "signin":
      return {
        ...state,
        email: actions.payload.email,
        userid: actions.payload.userid,
        errorMessage: "",
      };
    case "restore_token":
      return {
        ...state,
        email: actions.payload.email,
        userid: actions.payload.userid,
        errorMessage: "",
      };
    case "errmsg":
      return {
        ...state,
        email: "",
        userid: "",
        errorMessage: actions.payload.errorMessage,
      }; 
    case "signout":
      return {
        isSignedUp: null, errorMessage: "", email: "", userid: ""    
      }
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
  return async ({ email, userid }) => {
    dispatch({ type: "signin", payload: { email, userid } });
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
  return ({ email, userid }) => {
    dispatch({ type: "restore_token", payload: { email, userid } });
  };
};

const signOut = (dispatch) => {
  return () => {    
    dispatch({ type: "signout", payload: "" });
  };
};

export const { Context, Provider } = createDataContext(
  AuthReducer,
  {
    signup,
    signin,
    showErr,
    restore_token,
    signOut
  },
  { isSignedUp: null, errorMessage: "", email: "", userid: "" }
);
