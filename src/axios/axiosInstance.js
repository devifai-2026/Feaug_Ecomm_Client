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
    
    // Add Guest ID from localStorage
    const guestId = localStorage.getItem('guestId');
    if (guestId) {
      config.headers['x-guest-id'] = guestId;
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
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      // Clear user data and redirect to login only if it's NOT a login request
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.dispatchEvent(new Event("userLoginStatusChanged"));

      // Only redirect if not already on login page to avoid infinite loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
