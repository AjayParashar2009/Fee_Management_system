// src/services/receiptService.js
import apiClient from "../utils/apiClient";

export const receiptService = {
  // Get all receipts
  getAll: () => apiClient.get("/receipts"),
  
  // Get receipt by ID
  getById: (id) => apiClient.get(`/receipts/${id}`),
  
  // Generate PDF for receipt
  generatePDF: (id) => apiClient.post(`/receipts/${id}/generate-pdf`),
  
  // Download receipt PDF
  downloadPDF: (id) => apiClient.get(`/receipts/${id}/download-pdf`, {
    responseType: 'blob'
  }),
  
  // Share receipt via email
  shareByEmail: (id, email) => apiClient.post(`/receipts/${id}/share`, { email }),
};