import axiosInstance from "../../axios/axiosInstance";
import { handleApiError } from "../../error/apiError";

const userApi = {
  // User Registration
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to register user");
    }
  },

  // User Login
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);

      // Store token if present in response
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to login");
    }
  },

  // User Logout
  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");

      // Remove token from localStorage
      localStorage.removeItem("accessToken");
      delete axiosInstance.defaults.headers.common["Authorization"];

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to logout");
    }
  },

  // Get Current User Profile
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch user profile");
    }
  },

  // Update User Profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.patch(
        "/auth/update-me",
        profileData,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update profile");
    }
  },

  // Update Password
  updatePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.patch("/auth/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update password");
    }
  },

  // Forgot Password - Send reset token
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to send password reset email");
    }
  },

  // Reset Password with token
  resetPassword: async (resetData) => {
    try {
      const response = await axiosInstance.patch(
        `/auth/reset-password/${resetData.token}`,
        {
          password: resetData.password,
        },
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to reset password");
    }
  },

  // Verify Email
  verifyEmail: async (token) => {
    try {
      const response = await axiosInstance.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to verify email");
    }
  },

  // Resend Verification Email
  resendVerification: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/resend-verification", {
        email,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to resend verification email");
    }
  },

  // Refresh Token
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh-token");

      // Store new token if present in response
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to refresh token");
    }
  },

  // Add Address
  addAddress: async (addressData) => {
    try {
      const response = await axiosInstance.post(
        "/users/addresses",
        addressData,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to add address");
    }
  },

  // Update Address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await axiosInstance.patch(
        `/users/addresses/${addressId}`,
        addressData,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update address");
    }
  },

  // Delete Address
  deleteAddress: async (addressId) => {
    try {
      const response = await axiosInstance.delete(
        `/users/addresses/${addressId}`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to delete address");
    }
  },

  // Set Default Address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await axiosInstance.patch(
        `/users/addresses/${addressId}/set-default`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to set default address");
    }
  },

  // Get User Addresses
  getAddresses: async () => {
    try {
      const response = await axiosInstance.get("/users/addresses");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch addresses");
    }
  },

  // Utility function to set auth token manually
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    } else {
      localStorage.removeItem("accessToken");
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default userApi;
