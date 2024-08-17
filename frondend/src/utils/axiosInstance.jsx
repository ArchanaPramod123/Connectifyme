import axios from "axios";
// import { BASE_URL } from "./constants";

const accessToken = localStorage.getItem('access')

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    // baseURL: `${BASE_URL}/api`,
    headers:{
        Accept:'application/json',
        Authorization:`Bearer ${accessToken}`
    }
})

export default axiosInstance