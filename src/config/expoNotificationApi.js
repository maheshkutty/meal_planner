import axios from 'axios';

export default axios.create({
    baseURL:"https://exp.host/--/api/v2/push",
    headers:{
        "Content-Type": "application/json"
    }
})