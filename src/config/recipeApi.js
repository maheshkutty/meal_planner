import axios from "axios";
import Constants from "expo-constants";;


export default axios.create({
  baseURL: Constants.manifest.extra.NODEURL,
  headers: {
    "Content-Type": "application/json",
  },
});
