import { apiCall } from '../helpers/apicall/apiCall';

// Helper to store user data in localStorage
const storeUserData = (data) => {
  if (data.user && data.tokens) {
    const userData = {
      ...data.user,
      token: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new Event('userLoginStatusChanged'));
  }
};

// Helper to clear user data from localStorage
const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  window.dispatchEvent(new Event('userLoginStatusChanged'));
};

const authApi = {
  // User Registration
  register: ({ userData, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/auth/register',
      payload: userData,
      setLoading,
      onSuccess: (data) => {
        if (data.success) {
          storeUserData(data.data);
        }
        onSuccess?.(data);
      },
      onError,
    }),

  // User Login
  login: ({ email, password, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/auth/login',
      payload: { email, password },
      setLoading,
      onSuccess: (data) => {
        if (data.success) {
          storeUserData(data.data);
        }
        onSuccess?.(data);
      },
      onError,
    }),

  // User Logout
  logout: ({ setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/auth/logout',
      setLoading,
      onSuccess: (data) => {
        clearUserData();
        onSuccess?.(data);
      },
      onError: (err) => {
        // Clear data even on error
        clearUserData();
        onError?.(err);
      },
    }),

  // Get Current User Profile
  getCurrentUser: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/auth/me',
      setLoading,
      onSuccess,
      onError,
    }),

  // Update User Profile
  updateProfile: ({ profileData, setLoading, onSuccess, onError }) =>
    apiCall.patch({
      route: '/auth/update-me',
      payload: profileData,
      setLoading,
      onSuccess,
      onError,
    }),

  // Update Password
  updatePassword: ({ currentPassword, newPassword, setLoading, onSuccess, onError }) =>
    apiCall.patch({
      route: '/auth/update-password',
      payload: { currentPassword, newPassword },
      setLoading,
      onSuccess,
      onError,
    }),

  // Forgot Password
  forgotPassword: ({ email, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/auth/forgot-password',
      payload: { email },
      setLoading,
      onSuccess,
      onError,
    }),

  // Reset Password
  resetPassword: ({ token, password, setLoading, onSuccess, onError }) =>
    apiCall.patch({
      route: `/auth/reset-password/${token}`,
      payload: { password },
      setLoading,
      onSuccess,
      onError,
    }),

  // Verify Email
  verifyEmail: ({ token, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/auth/verify-email/${token}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Resend Verification Email
  resendVerification: ({ email, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/auth/resend-verification',
      payload: { email },
      setLoading,
      onSuccess,
      onError,
    }),

  // Utility: Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  // Utility: Get current user from localStorage
  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Utility: Get access token
  getToken: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.token;
      }
    } catch {
      return null;
    }
    return null;
  },
};

export default authApi;
