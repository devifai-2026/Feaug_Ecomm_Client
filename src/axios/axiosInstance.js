// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api/v1", // Backend API URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get token from user object in localStorage
const getToken = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.token;
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
  return null;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
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
      // Clear user data and redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      window.dispatchEvent(new Event('userLoginStatusChanged'));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
