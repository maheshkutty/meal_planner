import axios from 'axios';

export default axios.create({
    baseURL:"http://192.168.43.47:3002",
    headers:{
        "Content-Type": "application/json"
    }
})