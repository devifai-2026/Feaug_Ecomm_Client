// Component/Pages/Login/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuUserRound, LuLock, LuMail, LuEye, LuEyeOff } from "react-icons/lu";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would validate credentials with backend
      if (formData.email && formData.password) {
        toast.success("Login successful!");

        // Store user info in localStorage
        const userData = {
          email: formData.email,
          isLoggedIn: true,
          rememberMe: rememberMe,
        };
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to home page
        navigate("/");
      } else {
        toast.error("Please fill in all fields");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Tablet: max-w-lg, Mobile: max-w-md, Desktop: max-w-md */}
      <div className="max-w-md md:max-w-xl mx-auto">
        <div className="text-center mb-8">
         
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 md:px-12">
          <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm md:text-base font-medium text-gray-700"
              >
                Email Address
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
                  className="appearance-none block w-full pl-10 md:pl-12 px-3 py-2 md:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#C19A6B] focus:border-[#C19A6B] text-sm md:text-base"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm md:text-base font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 md:mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuLock className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 md:pl-12 pr-10 md:pr-12 px-3 py-2 md:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#C19A6B] focus:border-[#C19A6B] text-sm md:text-base"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 md:h-5 md:w-5 text-[#C19A6B] focus:ring-[#C19A6B] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm md:text-base text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm md:text-base">
                <Link
                  to="/forgotPassword"
                  className="font-medium text-[#C19A6B] hover:text-amber-700"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

      

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-sm md:text-base text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[#C19A6B] hover:text-amber-700 transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-600">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-[#C19A6B] hover:text-amber-700">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#C19A6B] hover:text-amber-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;