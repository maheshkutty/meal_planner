import axios from 'axios';
import Constants from "expo-constants";

export default axios.create({
    baseURL:Constants.manifest.extra.USDAKEY,
    headers:{
        "Content-Type": "application/json"
    },
    params:{
        "api_key":Constants.manifest.extra.USDAKEY
    }
})