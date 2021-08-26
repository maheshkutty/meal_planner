import axios from 'axios';

export default axios.create({
    baseURL:"https://api.nal.usda.gov/fdc/v1/foods",
    headers:{
        "Content-Type": "application/json"
    },
    params:{
        "api_key":"4745ryZOUpkjufOEPrASN4kU95sMMLgmOkK36ba4"
    }
})