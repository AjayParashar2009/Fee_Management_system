import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faSpinner,
  faEye,
  faEyeSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
console.log("API URL:", url); // For debugging

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setApiError("");
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleValidate = () => {
    const formError = {};

    if (!loginData.username.trim()) {
      formError.username = "Username is required";
    } else if (loginData.username.length < 3) {
      formError.username = "Username must be at least 3 characters";
    }

    if (!loginData.password.trim()) {
      formError.password = "Password is required";
    } else if (loginData.password.length < 6) {
      formError.password = "Password must be at least 6 characters";
    }

    setErrors(formError);

    if (Object.keys(formError).length === 0) {
      handleLogin();
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    setApiError("");

    axios
      .post(`${url}/auth/login`, loginData)
      .then((res) => {
        console.log("Full Response:", res);
        console.log("Response Data:", res.data);

        const { success, message, token, user } = res.data;

        if (success === true) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Navigate based on role from response
          const userRole = user.role;

          switch (userRole) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "accountant":
              navigate("/accountant-dashboard");
              break;
            case "student":
              navigate("/student-dashboard");
              break;
            default:
              navigate("/");
          }
        } else {
          setApiError(message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);

        if (error.response) {
          const errorMessage =
            error.response.data?.message || "Login failed. Please try again.";
          setApiError(errorMessage);
          console.log("Error from server:", error.response.data);
        } else if (error.request) {
          setApiError(
            "Cannot connect to server. Please check your connection.",
          );
        } else {
          setApiError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLoginClick = () => {
    handleValidate();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 bg-[url('https://images.unsplash.com/20/cambridge.JPG?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dW5pdmVyc2l0eSUyMGJ1aWxkaW5nfGVufDB8fDB8fHww')] bg-cover bg-center bg-blend-overlay"
      onKeyPress={handleKeyPress}
    >
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 border border-white/20 p-8 transition-all duration-300 hover:shadow-black/40">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="text-white/60 hover:text-white transition flex items-center gap-2 mb-6 text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
          </button>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70 text-sm">Sign in to your account</p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {apiError}
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-white font-medium text-sm mb-2">
                Username / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={loginData.username}
                  className={`w-full bg-white/10 text-white placeholder-white/50 border rounded-xl h-12 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                    errors.username
                      ? "border-red-400 ring-1 ring-red-400"
                      : "border-white/20 hover:border-blue-400"
                  }`}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white font-medium text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={loginData.password}
                  className={`w-full bg-white/10 text-white placeholder-white/50 border rounded-xl h-12 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                    errors.password
                      ? "border-red-400 ring-1 ring-red-400"
                      : "border-white/20 hover:border-blue-400"
                  }`}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Info Message */}
            <div className="text-center text-white/60 text-xs">
              <p>Login credentials are provided by the administrator</p>
              <p className="mt-1">
                Contact your admin for username and password
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleLoginClick}
              disabled={isLoading}
              className={`w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl h-12 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin mr-3 h-5 w-5 text-white"
                  />
                  Logging in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs text-center mt-6">
          &copy; {new Date().getFullYear()} Fee Management System. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
