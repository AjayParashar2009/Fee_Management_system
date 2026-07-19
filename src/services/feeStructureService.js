// src/services/feeStructureService.js
import apiClient from "../utils/apiClient";

export const feeStructureService = {
  /**
   * Get all fee structures
   * @param {Object} params - Query parameters
   * @param {string} params.course - Filter by course
   * @param {string} params.status - Filter by status
   * @returns {Promise} - Axios response
   */
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.course) queryParams.append("course", params.course);
    if (params.status) queryParams.append("status", params.status);
    const queryString = queryParams.toString();
    return apiClient.get(
      `/fee-structures${queryString ? `?${queryString}` : ""}`,
    );
  },

  /**
   * Get fee structure by ID
   * @param {string} id - Fee structure ID
   * @returns {Promise} - Axios response
   */
  getById: (id) => apiClient.get(`/fee-structures/${id}`),

  /**
   * Create a new fee structure
   * @param {Object} data - Fee structure data
   * @param {string} data.course - Course name
   * @param {string} data.semester - Semester
   * @param {string} data.academicYear - Academic year
   * @param {number} data.tuitionFee - Tuition fee amount
   * @param {number} data.admissionFee - Admission fee amount
   * @param {number} data.examFee - Exam fee amount
   * @param {number} data.libraryFee - Library fee amount
   * @param {number} data.otherFee - Other fee amount
   * @param {string} data.status - Active/Inactive
   * @returns {Promise} - Axios response
   */
  create: (data) => apiClient.post("/fee-structures", data),

  /**
   * Update a fee structure
   * @param {string} id - Fee structure ID
   * @param {Object} data - Updated fee structure data
   * @returns {Promise} - Axios response
   */
  update: (id, data) => apiClient.put(`/fee-structures/${id}`, data),

  /**
   * Delete a fee structure
   * @param {string} id - Fee structure ID
   * @returns {Promise} - Axios response
   */
  delete: (id) => apiClient.delete(`/fee-structures/${id}`),

  /**
   * Get fee structure statistics
   * @returns {Promise} - Axios response
   */
  getStats: () => apiClient.get("/fee-structures/stats"),

  /**
   * Get fee structure by course and semester
   * @param {string} course - Course name
   * @param {string} semester - Semester
   * @returns {Promise} - Axios response
   */
  getByCourseSemester: (course, semester) =>
    apiClient.get(`/fee-structures/course/${course}/semester/${semester}`),
};
