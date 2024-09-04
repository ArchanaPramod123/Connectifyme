// import axios from "axios";

// const accessToken = localStorage.getItem('access')

// const axiosInstance = axios.create({
//     // baseURL: process.env.BASE_URL,
//     const baseURL = import.meta.env.VITE_BASE_URL,

//     headers:{
//         Accept:'application/json',
//         Authorization:`Bearer ${accessToken}`
//     }
// })

// export default axiosInstance


import axios from "axios";

const accessToken = localStorage.getItem('access');

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL ,
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
    }
});

export default axiosInstance;
