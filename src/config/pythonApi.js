import axios from "axios";
import Constants from "expo-constants";

export default axios.create({
  baseURL: Constants.manifest.extra.PYTHONURL,
  headers: {
    "Content-Type": "application/json",
  },
});
