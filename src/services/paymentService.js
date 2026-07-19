// src/services/paymentService.js
import apiClient from "../utils/apiClient";

export const paymentService = {
  // Create payment order
  createOrder: (data) => apiClient.post("/payments/create-order", data),

  // Verify payment
  verifyPayment: (data) => apiClient.post("/payments/verify", data),

  // Get payment history
  getHistory: () => apiClient.get("/payments/history"),

  // Get payment by ID
  getById: (id) => apiClient.get(`/payments/${id}`),
};
