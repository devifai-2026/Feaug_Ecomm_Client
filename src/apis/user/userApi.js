import axiosInstance from "../../axios/axiosInstance";
import { handleApiError } from "../../error/apiError";
import { getGuestId } from "../../helpers/guest/guestId";

// Helper to store user data in localStorage (aligned with helpers pattern)
const storeUserData = (responseData) => {
  // Backend response after normalization: { status, success, token, data: { user } }
  if (responseData.token && responseData.data?.user) {
    const userData = {
      ...responseData.data.user,
      token: responseData.token,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', responseData.token);
    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new Event('userLoginStatusChanged'));
  } else if (responseData.user && responseData.tokens) {
    // Alternative format with tokens object
    const userData = {
      ...responseData.user,
      token: responseData.tokens.accessToken,
      refreshToken: responseData.tokens.refreshToken,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', responseData.tokens.accessToken);
    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new Event('userLoginStatusChanged'));
  } else if (responseData.token && responseData.user) {
    // Simple format with user and token at same level
    const userData = { ...responseData.user, token: responseData.token };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', responseData.token);
    localStorage.setItem('isLoggedIn', 'true');
    // Clear guestId as it is now merged
    localStorage.removeItem('guestId');
    window.dispatchEvent(new Event('userLoginStatusChanged'));
  }
};

// Helper to clear user data from localStorage
const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  window.dispatchEvent(new Event('userLoginStatusChanged'));
};

// Helper to get current user from localStorage
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Helper to update stored token
const updateStoredToken = (newToken, newRefreshToken) => {
  const user = getStoredUser();
  if (user) {
    user.token = newToken;
    if (newRefreshToken) {
      user.refreshToken = newRefreshToken;
    }
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Helper to update stored user data without overwriting token
const updateStoredUser = (updatedUser) => {
  const currentUser = getStoredUser();
  if (currentUser) {
    const freshUser = { ...currentUser, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(freshUser));
    window.dispatchEvent(new Event('userLoginStatusChanged'));
  }
};

const userApi = {
  // User Registration
  register: async (userData) => {
    try {
      const guestId = getGuestId();
      const payload = { ...userData, guestId };
      const response = await axiosInstance.post("/auth/register", payload);
      if (response.data.status === 'success') {
        storeUserData(response.data);
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to register user");
    }
  },

  // User Login
  login: async (credentials) => {
    try {
      const guestId = getGuestId();
      const payload = { ...credentials, guestId };
      const response = await axiosInstance.post("/auth/login", payload);

      // Store user data using standardized format
      // Pass entire response.data which contains { status, success, token, data: { user } }
      if (response.data.status === 'success') {
        storeUserData(response.data);
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

      // Clear user data using standardized format
      clearUserData();

      return response.data;
    } catch (error) {
      // Clear data even on error
      clearUserData();
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
      const response = await axiosInstance.post(
        "/auth/update-me",
        profileData,
      );
      
      if (response.data.status === 'success' && response.data.data?.user) {
        updateStoredUser(response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update profile");
    }
  },

  // Update Password
  updatePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.post("/auth/update-password", {
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
      const user = getStoredUser();
      const response = await axiosInstance.post("/auth/refresh-token", {
        refreshToken: user?.refreshToken,
      });

      // Store new token if present in response
      if (response.data.success && response.data.data?.tokens) {
        updateStoredToken(
          response.data.data.tokens.accessToken,
          response.data.data.tokens.refreshToken
        );
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
      const response = await axiosInstance.post(
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
      const response = await axiosInstance.post(
        `/users/addresses/${addressId}/set-default`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to set default address");
    }
  },

  // Get User Addresses with optional pagination
  getAddresses: async (page = 1, limit = 4) => {
    try {
      const response = await axiosInstance.get(`/users/addresses?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch addresses");
    }
  },

  // Utility function to set auth token manually
  setAuthToken: (token, refreshToken) => {
    if (token) {
      updateStoredToken(token, refreshToken);
    } else {
      clearUserData();
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  // Get stored user data
  getStoredUser,
};

export default userApi;
