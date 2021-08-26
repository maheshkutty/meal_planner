import axios from 'axios';

export default axios.create({
    baseURL:"http://maheshkutty.pythonanywhere.com",
    headers:{
        "Content-Type": "application/json"
    }
})