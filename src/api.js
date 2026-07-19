// src/api.js
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Use relative URL - will work with proxy
const API = axios.create({
  baseURL: "https://your-backend-url.onrender.com/api", // This will proxy to http://localhost:3000/api
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "📤 Request:",
      config.method.toUpperCase(),
      config.baseURL + config.url,
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    }
    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please try again.");
    }
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  },
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (credentials) => API.post("/auth/login", credentials),
  register: (userData) => API.post("/auth/register", userData),
  getProfile: () => API.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

// ============================================
// STUDENT API
// ============================================
export const studentAPI = {
  getAll: () => API.get("/students"),
  getById: (id) => API.get(`/students/${id}`),
  create: (data) => API.post("/students", data, { timeout: 120000 }),
  update: (id, data) => API.put(`/students/${id}`, data, { timeout: 10000 }),
  delete: (id) => API.delete(`/students/${id}`),
  getFees: (id) => API.get(`/students/${id}/fees`),
};

// ============================================
// ACCOUNTANT API
// ============================================
export const accountantAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/accountants${query ? `?${query}` : ""}`);
  },
  getById: (id) => API.get(`/accountants/${id}`),
  create: (data) => API.post("/accountants", data, { timeout: 120000 }),
  update: (id, data) =>
    API.put(`/accountants/${id}`, data, { timeout: 120000 }),
  delete: (id) => API.delete(`/accountants/${id}`),
  getStats: () => API.get("/accountants/stats"),
};

// ============================================
// FEE STRUCTURE API
// ============================================
export const feeStructureAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/fee-structures${query ? `?${query}` : ""}`);
  },
  getById: (id) => API.get(`/fee-structures/${id}`),
  create: (data) => API.post("/fee-structures", data),
  update: (id, data) => API.put(`/fee-structures/${id}`, data),
  delete: (id) => API.delete(`/fee-structures/${id}`),
  getStats: () => API.get("/fee-structures/stats"),
  getByCourseSemester: (course, semester) =>
    API.get(`/fee-structures/course/${course}/semester/${semester}`),
};

// ============================================
// FEE COLLECTION API
// ============================================
export const collectionAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/fee-collections${query ? `?${query}` : ""}`);
  },
  getById: (id) => API.get(`/fee-collections/${id}`),
  create: (data) => API.post("/fee-collections", data),
  update: (id, data) => API.put(`/fee-collections/${id}`, data),
  delete: (id) => API.delete(`/fee-collections/${id}`),
  getSummary: () => API.get("/fee-collections/summary"),
};

// ============================================
// RECEIPT API
// ============================================
export const receiptAPI = {
  getAll: () => API.get("/receipts"),
  getById: (id) => API.get(`/receipts/${id}`),
  generatePDF: (id) => API.post(`/receipts/${id}/generate-pdf`),
  downloadPDF: (id) =>
    API.get(`/receipts/${id}/download-pdf`, { responseType: "blob" }),
  shareByEmail: (id, email) => API.post(`/receipts/${id}/share`, { email }),
};

// ============================================
// PAYMENT API
// ============================================
export const paymentAPI = {
  createOrder: (data) => API.post("/payments/create-order", data),
  verifyPayment: (data) => API.post("/payments/verify", data),
  getHistory: () => API.get("/payments/history"),
  getById: (id) => API.get(`/payments/${id}`),
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  getStats: () => API.get("/reports/dashboard"),
};

// ============================================
// REPORT API
// ============================================
export const reportAPI = {
  getFeeReport: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/reports/fee${query ? `?${query}` : ""}`);
  },
  getStudentReport: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/reports/students${query ? `?${query}` : ""}`);
  },
  getCollectionReport: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/reports/collections${query ? `?${query}` : ""}`);
  },
  exportPDF: (type, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/reports/export/${type}/pdf${query ? `?${query}` : ""}`, {
      responseType: "blob",
    });
  },
  exportExcel: (type, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/reports/export/${type}/excel${query ? `?${query}` : ""}`, {
      responseType: "blob",
    });
  },
};

export default API;
