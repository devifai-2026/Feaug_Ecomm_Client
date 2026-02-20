// Component/Pages/Register/Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuUserRound,
  LuLock,
  LuMail,
  LuPhone,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../../../apis/user/userApi";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    otp: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validation functions (keep existing)
  const validateFirstName = (firstName) => {
    if (!firstName.trim()) return "First name is required";
    if (firstName.trim().length < 2)
      return "First name must be at least 2 characters";
    if (!/^[A-Za-z\s]+$/.test(firstName.trim()))
      return "First name can only contain letters";
    return "";
  };

  const validateLastName = (lastName) => {
    if (!lastName.trim()) return "Last name is required";
    if (lastName.trim().length < 2)
      return "Last name must be at least 2 characters";
    if (!/^[A-Za-z\s]+$/.test(lastName.trim()))
      return "Last name can only contain letters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return ""; // Phone is optional
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 10)
      return "Phone number must be exactly 10 digits";
    if (!/^\d{10}$/.test(digitsOnly))
      return "Please enter a valid 10-digit mobile number";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password))
      return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const validateOtp = (otp) => {
    if (!otp) return "OTP is required";
    if (otp.length < 6) return "OTP must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format phone number as user types
    if (name === "phone") {
      // Remove all non-digit characters and limit to 10 digits
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validate on change
    let error = "";
    if (name === "firstName") {
      error = validateFirstName(formattedValue);
    } else if (name === "lastName") {
      error = validateLastName(formattedValue);
    } else if (name === "email") {
      error = validateEmail(formattedValue);
    } else if (name === "phone") {
      error = validatePhone(formattedValue);
    } else if (name === "password") {
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
      error = validateConfirmPassword(formattedValue, formData.password);
    } else if (name === "otp") {
      error = validateOtp(formattedValue);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Check overall form validity
  useEffect(() => {
    const firstNameValid =
      !errors.firstName && formData.firstName.trim().length >= 2;
    const lastNameValid =
      !errors.lastName && formData.lastName.trim().length >= 2;
    const emailValid = !errors.email && formData.email.trim().length > 0;
    const phoneValid = !errors.phone; // Phone can be empty
    const passwordValid = !errors.password && formData.password.length >= 8;
    const confirmPasswordValid =
      !errors.confirmPassword && formData.confirmPassword.length > 0;

    const isValid =
      firstNameValid &&
      lastNameValid &&
      emailValid &&
      phoneValid &&
      passwordValid &&
      confirmPasswordValid &&
      agreeTerms;

    setIsFormValid(isValid);
  }, [errors, formData, agreeTerms]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    const allTouched = {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      otp: false,
    };
    setTouched((prev) => ({ ...prev, ...allTouched }));

    // Validate all fields
    const validationErrors = {
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      ),
      otp: (prev) => prev,
    };

    setErrors((prev) => ({ ...prev, ...validationErrors, otp: prev.otp }));

    // Check if there are any errors in step 1
    const hasErrors = Object.entries(validationErrors).some(
      ([key, error]) => key !== "otp" && error !== "",
    );

    if (hasErrors) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await userApi.sendRegisterOtp(formData.email);
      if (
        response.status === "success" ||
        response.message?.includes("OTP sent")
      ) {
        setStep(2);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();

    const otpError = validateOtp(formData.otp);
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      setTouched((prev) => ({ ...prev, otp: true }));
      toast.error(otpError);
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await userApi.verifyOtp(formData.otp);

      if (
        verifyResponse.status === "success" ||
        verifyResponse.message === "OTP verified successfully"
      ) {
        // Now register
        const cleanPhone = formData.phone.replace(/\D/g, "");
        const registrationData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: cleanPhone || undefined,
        };

        const regResponse = await userApi.register(registrationData);

        if (regResponse.status === "success" || regResponse.token) {
          // If registration is successful, automatically log the user in
          try {
            const loginCredentials = {
              email: registrationData.email,
              password: registrationData.password,
            };
            const loginResponse = await userApi.login(loginCredentials);

            if (loginResponse.status === "success" || loginResponse.token) {
              toast.success("Account created and logged in successfully!");
              setTimeout(() => {
                navigate("/");
              }, 1500);
            } else {
              // Login failed despite successful registration
              toast.success("Registration successful! Please login.");
              setTimeout(() => {
                navigate("/login");
              }, 3000);
            }
          } catch (loginError) {
            console.error("Auto-login Error:", loginError);
            toast.success("Registration successful! Please login.");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          }
        } else {
          toast.error(regResponse.message || "Registration failed");
        }
      } else {
        toast.error(verifyResponse.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message || "Validation failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check if field has error
  const getInputClassName = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid =
      touched[fieldName] &&
      !errors[fieldName] &&
      formData[fieldName].length > 0;

    return `appearance-none block w-full pl-10 md:pl-12 px-3 py-2 md:py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm md:text-base transition-colors ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : isValid
          ? "border-green-300 focus:border-green-500 focus:ring-green-500"
          : "border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]"
    }`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md md:max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Join our community of jewelry lovers
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 md:px-12">
          {step === 1 ? (
            <form className="space-y-2 md:space-y-3" onSubmit={handleSubmit}>
              {/* First Name Field - keep existing */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  First Name *
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuUserRound className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("firstName")}
                    placeholder="John"
                  />
                  {touched.firstName &&
                    !errors.firstName &&
                    formData.firstName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                </div>
                {touched.firstName && errors.firstName ? (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.firstName}
                  </p>
                ) : (
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    At least 2 characters, letters only
                  </p>
                )}
              </div>

              {/* Last Name Field - keep existing */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Last Name *
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuUserRound className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("lastName")}
                    placeholder="Doe"
                  />
                  {touched.lastName &&
                    !errors.lastName &&
                    formData.lastName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                </div>
                {touched.lastName && errors.lastName ? (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.lastName}
                  </p>
                ) : (
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    At least 2 characters, letters only
                  </p>
                )}
              </div>

              {/* Email Field - keep existing */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuMail className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
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
                    className={getInputClassName("email")}
                    placeholder="you@example.com"
                  />
                  {touched.email && !errors.email && formData.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {touched.email && errors.email ? (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.email}
                  </p>
                ) : (
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    We'll never share your email with anyone else
                  </p>
                )}
              </div>

              {/* Phone Field - keep existing */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Phone Number (Optional)
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuPhone className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("phone")}
                    placeholder="9876543210"
                    maxLength="10"
                  />
                  {touched.phone && !errors.phone && formData.phone && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {touched.phone && errors.phone ? (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.phone}
                  </p>
                ) : (
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    Format: 10 digit mobile number (e.g., 9876543210)
                  </p>
                )}
              </div>

              {/* Password Field - keep existing */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Password *
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuLock className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("password")}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center focus:outline-none"
                  >
                    {showPassword ? (
                      <LuEyeOff className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <LuEye className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password ? (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.password}
                  </p>
                ) : (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs md:text-sm font-medium text-gray-700">
                      Password Requirements:
                    </p>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li
                        className={`flex items-center ${formData.password.length >= 8 ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">•</span> At least 8 characters
                      </li>
                      <li
                        className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">•</span> One uppercase letter
                      </li>
                      <li
                        className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">•</span> One lowercase letter
                      </li>
                      <li
                        className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">•</span> One number
                      </li>
                      <li
                        className={`flex items-center ${/(?=.*[@$!%*?&])/.test(formData.password) ? "text-green-600" : ""}`}
                      >
                        <span className="mr-1">•</span> One special character
                        (@$!%*?&)
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field - keep existing */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Confirm Password *
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuLock className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
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
                    className={getInputClassName("confirmPassword")}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <LuEyeOff className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <LuEye className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword ? (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                ) : formData.confirmPassword && !errors.confirmPassword ? (
                  <p className="mt-1 text-xs md:text-sm text-green-600">
                    ✓ Passwords match
                  </p>
                ) : (
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    Re-enter your password
                  </p>
                )}
              </div>

              {/* Terms Agreement - keep existing */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 md:h-5 md:w-5 text-[#C19A6B] focus:ring-[#C19A6B] border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 block text-sm md:text-base text-gray-900"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms-condition"
                    className="text-[#C19A6B] hover:text-amber-700"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacyPolicy"
                    className="text-[#C19A6B] hover:text-amber-700"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {!agreeTerms && Object.values(touched).some((t) => t) && (
                <p className="text-xs md:text-sm text-red-600 -mt-4">
                  You must agree to the terms and conditions
                </p>
              )}

              {/* Submit Button - keep existing */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full flex justify-center py-2 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleVerifyOtpAndRegister}>
              <div className="text-center mb-6 text-gray-700">
                <p>
                  We've sent an OTP to your email:{" "}
                  <strong>{formData.email}</strong>
                </p>
                <p className="text-sm mt-1">
                  Please enter it below to complete registration.
                </p>
              </div>
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  OTP
                </label>
                <div className="mt-1 md:mt-2 relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="appearance-none block w-full px-3 py-2 md:py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 border-[#C19A6B] text-center tracking-widest text-lg"
                    placeholder="111111"
                  />
                </div>
                {touched.otp && errors.otp && (
                  <p className="mt-1 text-xs md:text-sm text-red-600">
                    {errors.otp}
                  </p>
                )}
              </div>
              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || formData.otp.length < 6}
                  className="w-full flex justify-center py-2 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? "Verifying & Creating..."
                    : "Verify OTP and Register"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-2 md:py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-sm md:text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#C19A6B] hover:text-amber-700 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
