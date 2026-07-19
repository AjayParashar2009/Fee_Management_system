// src/utils/apiClient.js
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: `${baseUrl}/api`, // ✅ This adds /api automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - adds token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
