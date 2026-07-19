// src/services/studentService.js
import apiClient from "../utils/apiClient";

export const studentService = {
  /**
   * Get all students
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {string} params.course - Filter by course
   * @param {string} params.semester - Filter by semester
   * @returns {Promise} - Axios response
   */
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.course) queryParams.append('course', params.course);
    if (params.semester) queryParams.append('semester', params.semester);
    const queryString = queryParams.toString();
    return apiClient.get(`/students${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get student by ID
   * @param {string} id - Student ID
   * @returns {Promise} - Axios response
   */
  getById: (id) => apiClient.get(`/students/${id}`),
  
  /**
   * Create a new student
   * @param {Object} data - Student data
   * @param {string} data.name - Full name
   * @param {string} data.email - Email address
   * @param {string} data.phone - Phone number
   * @param {string} data.course - Course
   * @param {string} data.semester - Semester
   * @param {string} data.address - Address
   * @param {string} data.enrollmentNo - Enrollment number
   * @param {string} data.username - Username
   * @param {string} data.password - Password
   * @param {string} data.dob - Date of birth
   * @returns {Promise} - Axios response
   */
  create: (data) => apiClient.post("/students", data),
  
  /**
   * Update a student
   * @param {string} id - Student ID
   * @param {Object} data - Updated student data
   * @returns {Promise} - Axios response
   */
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  
  /**
   * Delete a student
   * @param {string} id - Student ID
   * @returns {Promise} - Axios response   */
  delete: (id) => apiClient.delete(`/students/${id}`),
  
  /**
   * Get student statistics
   * @returns {Promise} - Axios response
   */
  getStats: () => apiClient.get("/students/stats"),
  
  /**
   * Get student fees
   * @param {string} id - Student ID
   * @returns {Promise} - Axios response
   */
  getFees: (id) => apiClient.get(`/students/${id}/fees`),
  
  /**
   * Get student payment history
   * @param {string} id - Student ID
   * @returns {Promise} - Axios response
   */
  getPayments: (id) => apiClient.get(`/students/${id}/payments`),
};