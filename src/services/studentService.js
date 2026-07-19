// src/services/studentService.js
import apiClient from "../utils/apiClient"; // ✅ Correct path
export const studentService = {
  // Get all students
  getAll: () => apiClient.get("/students"),
  
  // Get single student by ID
  getById: (id) => apiClient.get(`/students/${id}`),
  
  // Create new student
  create: (data) => apiClient.post("/students", data),
  
  // Update student
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  
  // Delete student
  delete: (id) => apiClient.delete(`/students/${id}`),
  
  // Get student fees
  getFees: (id) => apiClient.get(`/students/${id}/fees`),
};