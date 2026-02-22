// Component/Pages/Login/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuMail,
  LuLock,
  LuKeyRound,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import { toast } from "react-toastify";
import userApi from "../../../apis/user/userApi";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification, 3: Reset password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // Validate OTP (for password reset)
  const validateOtp = (otp) => {
    if (!otp) return "OTP is required";
    if (otp.length !== 6) return "OTP must be exactly 6 digits";
    return "";
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    // Check for at least one uppercase letter
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    // Check for at least one lowercase letter
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    // Check for at least one number
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    // Check for at least one special character
    if (!/(?=.*[@$!%*?&])/.test(password))
      return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword, newPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== newPassword) return "Passwords do not match";
    return "";
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "otp") {
      formattedValue = value.replace(/\\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validate on change
    let error = "";
    if (name === "email") {
      error = validateEmail(formattedValue);
    } else if (name === "otp") {
      error = validateOtp(formattedValue);
    } else if (name === "newPassword") {
      error = validatePassword(formattedValue);
      // Also re-validate confirm password if it exists
      if (formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(
            formData.confirmPassword,
            formattedValue,
          ),
        }));
      }
    } else if (name === "confirmPassword") {
      error = validateConfirmPassword(formattedValue, formData.newPassword);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Check if form can be submitted
  useEffect(() => {
    let isValid = false;

    if (step === 1) {
      isValid = !errors.email && formData.email.length > 0;
    } else if (step === 2) {
      isValid = !errors.otp && formData.otp.length === 6;
    } else if (step === 3) {
      const passwordValid =
        !errors.newPassword && formData.newPassword.length > 0;
      const confirmValid =
        !errors.confirmPassword && formData.confirmPassword.length > 0;
      isValid = passwordValid && confirmValid;
    }

    setCanSubmit(isValid);
  }, [step, errors, formData]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validate before submitting
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      setTouched((prev) => ({ ...prev, email: true }));
      toast.error(emailError);
      return;
    }

    setIsLoading(true);

    try {
      // Call forgot password API
      const response = await userApi.forgotPassword(formData.email);

      if (response.status === "success") {
        setStep(2);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to send reset email. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Validate before submitting
    const otpError = validateOtp(formData.otp);
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      setTouched((prev) => ({ ...prev, otp: true }));
      toast.error(otpError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await userApi.verifyOtp(formData.otp);

      if (
        response.status === "success" ||
        response.message === "OTP verified successfully"
      ) {
        setStep(3);
        toast.success("OTP verified! Now set your new password.");
      } else {
        const errorMsg = response.message || "Invalid OTP";
        toast.error(errorMsg);
        setErrors((prev) => ({ ...prev, otp: errorMsg }));
        setTouched((prev) => ({ ...prev, otp: true }));
      }
    } catch (error) {
      const errorMsg = error.message || "OTP verification failed";
      toast.error(errorMsg);
      setErrors((prev) => ({ ...prev, otp: errorMsg }));
      setTouched((prev) => ({ ...prev, otp: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown} seconds before resending`);
      return;
    }

    setIsLoading(true);

    try {
      // Call forgot password API again
      const response = await userApi.forgotPassword(formData.email);

      if (response.status === "success") {
        setCountdown(60); // Reset countdown
        toast.success("Reset email resent!");

        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(response.message || "Failed to resend email");
      }
    } catch (error) {
      toast.error(error.message || "Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate all fields
    const passwordError = validatePassword(formData.newPassword);
    const confirmError = validateConfirmPassword(
      formData.confirmPassword,
      formData.newPassword,
    );

    const hasErrors = passwordError || confirmError;

    if (hasErrors) {
      setErrors({
        newPassword: passwordError,
        confirmPassword: confirmError,
      });
      setTouched({
        newPassword: true,
        confirmPassword: true,
      });

      if (passwordError) toast.error(passwordError);
      else if (confirmError) toast.error(confirmError);
      return;
    }

    setIsLoading(true);

    try {
      // Call reset password API
      const response = await userApi.resetPassword({
        token: formData.otp,
        password: formData.newPassword,
      });

      if (response.status === "success") {
        toast.success(
          "Password reset successfully! You can now login with your new password.",
        );

        // Clear form data
        setFormData({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Password reset failed");
      }
    } catch (error) {
      toast.error(error.message || "Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md md:max-w-xl mx-auto">
        {/* Back to Login Button */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-sm md:text-base text-[#C19A6B] hover:text-amber-700 transition-colors duration-300"
          >
            <LuArrowLeft className="mr-2" />
            Back to Login
          </Link>
        </div>

        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Follow the steps to recover your account
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center">

            {/* Step 1 - label on BOTTOM */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${step >= 1 ? "bg-[#C19A6B] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                1
              </div>
              <span className={`text-xs md:text-sm mt-1 ${step >= 1 ? "text-[#C19A6B] font-medium" : "text-gray-600"}`}>
                Enter Email
              </span>
            </div>

            {/* Connector 1→2 */}
            <div
              className={`h-1 w-12 md:w-20 mb-4 ${step >= 2 ? "bg-[#C19A6B]" : "bg-gray-200"}`}
            ></div>

            {/* Step 2 - label on BOTTOM */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${step >= 2 ? "bg-[#C19A6B] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                2
              </div>
              <span className={`text-xs md:text-sm mt-1 ${step >= 2 ? "text-[#C19A6B] font-medium" : "text-gray-600"}`}>
                Enter OTP
              </span>
            </div>

            {/* Connector 2→3 */}
            <div
              className={`h-1 w-12 md:w-20 mb-4 ${step >= 3 ? "bg-[#C19A6B]" : "bg-gray-200"}`}
            ></div>

            {/* Step 3 - label on BOTTOM */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${step >= 3 ? "bg-[#C19A6B] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                3
              </div>
              <span className={`text-xs md:text-sm mt-1 ${step >= 3 ? "text-[#C19A6B] font-medium" : "text-gray-600"}`}>
                New Password
              </span>
            </div>

          </div>
        </div>

        <div className="bg-white py-6 md:py-8 px-4 md:px-8 shadow rounded-lg md:rounded-xl">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                >
                  Enter your registered email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 px-3 py-3 md:py-3.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm md:text-base ${
                      touched.email && errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  We'll send a password reset link to this email
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !canSubmit}
                  className="w-full flex justify-center py-3 md:py-3.5 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                >
                  Enter the reset OTP from your email
                </label>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  Check your email at{" "}
                  <span className="font-semibold">{formData.email}</span> for
                  the reset OTP
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuKeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 px-3 py-3 md:py-3.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm md:text-base ${
                      touched.otp && errors.otp
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]"
                    }`}
                    placeholder="Enter reset OTP"
                  />
                </div>
                {touched.otp && errors.otp && (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.otp}
                  </p>
                )}
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-xs md:text-sm text-gray-500">
                    Didn't receive the OTP?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm md:text-base font-medium text-[#C19A6B] hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || !canSubmit}
                  className="w-full flex justify-center py-3 md:py-3.5 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-3 md:py-3.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                >
                  Use different email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 pr-10 px-3 py-3 md:py-3.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm md:text-base ${
                      touched.newPassword && errors.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]"
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  >
                    {showPassword ? (
                      <LuEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <LuEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>

                {touched.newPassword && errors.newPassword && (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.newPassword}
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    Password Requirements:
                  </p>
                  <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                    <li
                      className={`flex items-center ${formData.newPassword.length >= 8 ? "text-green-600" : ""}`}
                    >
                      <span className="mr-1">•</span> At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${/(?=.*[A-Z])/.test(formData.newPassword) ? "text-green-600" : ""}`}
                    >
                      <span className="mr-1">•</span> One uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${/(?=.*[a-z])/.test(formData.newPassword) ? "text-green-600" : ""}`}
                    >
                      <span className="mr-1">•</span> One lowercase letter
                    </li>
                    <li
                      className={`flex items-center ${/(?=.*\d)/.test(formData.newPassword) ? "text-green-600" : ""}`}
                    >
                      <span className="mr-1">•</span> One number
                    </li>
                    <li
                      className={`flex items-center ${/(?=.*[@$!%*?&])/.test(formData.newPassword) ? "text-green-600" : ""}`}
                    >
                      <span className="mr-1">•</span> One special character
                      (@$!%*?&)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 pr-10 px-3 py-3 md:py-3.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm md:text-base ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]"
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <LuEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <LuEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword && !errors.confirmPassword && (
                  <p className="mt-1 text-xs md:text-sm text-green-600">
                    ✓ Passwords match
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || !canSubmit}
                  className="w-full flex justify-center py-3 md:py-3.5 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex justify-center py-3 md:py-3.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                >
                  Back to OTP Entry
                </button>
              </div>
            </form>
          )}

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-600 text-center">
              If you're still having trouble, please{" "}
              <Link
                to="/contact"
                className="font-medium text-[#C19A6B] hover:text-amber-700"
              >
                contact our support team
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-md md:rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 md:h-6 md:w-6 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm md:text-base font-medium text-amber-800">
                Security Notice
              </h3>
              <div className="mt-2 text-xs md:text-sm text-amber-700">
                <p>
                  For your security, the reset OTP will expire in 10 minutes.
                  Never share this OTP with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
