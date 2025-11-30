import axios, { type InternalAxiosRequestConfig } from 'axios';

const axiosInstance=axios.create({
baseURL: 'http://localhost:9000',
})

axiosInstance.interceptors.request.use(
    (config:InternalAxiosRequestConfig)=>{
        const token=localStorage.getItem("token");
        if(token && config){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config;
    }
)

export default axiosInstance;