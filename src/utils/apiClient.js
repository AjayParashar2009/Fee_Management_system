// src/utils/apiClient.js
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

console.log("🔍 VITE_BASE_URL:", baseUrl);

const apiClient = axios.create({
  baseURL: `${baseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

console.log("🔍 apiClient baseURL:", apiClient.defaults.baseURL);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("📤 Full Request URL:", config.baseURL + config.url);
    console.log(
      "🔑 Token:",
      token ? "Present (first 20 chars): " + token.substring(0, 20) : "Missing",
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "✅ Response from:",
      response.config.url,
      "Status:",
      response.status,
    );
    return response;
  },
  (error) => {
    console.error("❌ Error Response:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default apiClient;
