import axios from 'axios';

export default axios.create({
    baseURL:"http://damp-harbor-63298.herokuapp.com",
    headers:{
        "Content-Type": "application/json"
    }
})