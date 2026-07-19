// src/services/accountantService.js
import apiClient from "../utils/apiClient";

export const accountantService = {
  /**
   * Get all accountants
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {string} params.department - Filter by department
   * @returns {Promise} - Axios response
   */
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.department) queryParams.append('department', params.department);
    const queryString = queryParams.toString();
    return apiClient.get(`/accountants${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get accountant by ID
   * @param {string} id - Accountant ID
   * @returns {Promise} - Axios response
   */
  getById: (id) => apiClient.get(`/accountants/${id}`),
  
  /**
   * Create a new accountant
   * @param {Object} data - Accountant data
   * @param {string} data.name - Full name
   * @param {string} data.email - Email address
   * @param {string} data.phone - Phone number
   * @param {string} data.department - Department
   * @param {string} data.address - Address
   * @param {string} data.employeeId - Employee ID
   * @param {string} data.username - Username
   * @param {string} data.password - Password
   * @param {string} data.joinDate - Joining date
   * @returns {Promise} - Axios response
   */
  create: (data) => apiClient.post("/accountants", data),
  
  /**
   * Update an accountant
   * @param {string} id - Accountant ID
   * @param {Object} data - Updated accountant data
   * @returns {Promise} - Axios response
   */
  update: (id, data) => apiClient.put(`/accountants/${id}`, data),
  
  /**
   * Delete an accountant
   * @param {string} id - Accountant ID
   * @returns {Promise} - Axios response
   */
  delete: (id) => apiClient.delete(`/accountants/${id}`),
  
  /**
   * Get accountant statistics
   * @returns {Promise} - Axios response
   */
  getStats: () => apiClient.get("/accountants/stats"),
};