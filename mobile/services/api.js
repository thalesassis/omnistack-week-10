import axios from 'axios';

const api = axios.create({
    baseURL: 'https://omnistack-week-10-nodejs.herokuapp.com' 
}); 

export default api; 