// src/services/feeService.js
import apiClient from "../utils/apiClient";

export const feeService = {
  // Get all fees
  getAll: () => apiClient.get("/fee-collections"),
  
  // Get single fee by ID
  getById: (id) => apiClient.get(`/fee-collections/${id}`),
  
  // Create new fee
  create: (data) => apiClient.post("/fee-collections", data),
  
  // Update fee
  update: (id, data) => apiClient.put(`/fee-collections/${id}`, data),
  
  // Delete fee
  delete: (id) => apiClient.delete(`/fee-collections/${id}`),
  
  // Get reports
  getReports: () => apiClient.get("/reports"),
};