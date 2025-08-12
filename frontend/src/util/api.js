import axios from 'axios';

const api = axios.create({
    // baseURL:"https://zero-waste-2xxf.onrender.com"
    baseURL:"http://localhost:3002"
})
export default api