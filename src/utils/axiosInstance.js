import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessTokens = localStorage.getItem("token");
        if (accessTokens) {
            config.headers.Authorization = `Bearer ${accessTokens}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 401){
                //Redirect to login page
                window.location.href = "/";
            } else if(error.response.status === 500){
                console.log("Server error, please try again later.");
            }
        } else if (error.code === 'ECONNABORTED') {
            console.log("Request timed out, please try again.");
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;