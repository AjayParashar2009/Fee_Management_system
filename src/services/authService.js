// src/services/authService.js
import apiClient from "../utils/apiClient";

export const authService = {
  // Login user
  login: (credentials) => apiClient.post("/auth/login", credentials),
  
  // Register new user (admin only)
  register: (userData) => apiClient.post("/auth/register", userData),
  
  // Get current user profile
  getProfile: () => apiClient.get("/auth/me"),
  
  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};