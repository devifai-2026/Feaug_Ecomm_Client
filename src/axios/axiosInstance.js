// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
//   baseURL: "https://cpanel.fun4pets.co.in/api/v1", // Your backend base URL
  baseURL: "http://localhost:5000/api/v1", // Your backend base URL
  withCredentials: true, // For cookies if you're using them
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the config here (e.g., add auth token)
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
