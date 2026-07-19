// src/services/reportService.js
import apiClient from "../utils/apiClient";

export const reportService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} - Axios response
   */
  getDashboard: () => apiClient.get("/reports/dashboard"),

  /**
   * Get fee reports
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.course - Filter by course
   * @param {string} params.status - Filter by status
   * @returns {Promise} - Axios response
   */
  getFeeReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.course) queryParams.append("course", params.course);
    if (params.status) queryParams.append("status", params.status);
    const queryString = queryParams.toString();
    return apiClient.get(`/reports/fee${queryString ? `?${queryString}` : ""}`);
  },

  /**
   * Get student reports
   * @param {Object} params - Query parameters
   * @param {string} params.course - Filter by course
   * @param {string} params.status - Filter by status
   * @returns {Promise} - Axios response
   */
  getStudentReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.course) queryParams.append("course", params.course);
    if (params.status) queryParams.append("status", params.status);
    const queryString = queryParams.toString();
    return apiClient.get(
      `/reports/students${queryString ? `?${queryString}` : ""}`,
    );
  },

  /**
   * Get collection reports
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.method - Filter by payment method
   * @returns {Promise} - Axios response
   */
  getCollectionReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.method) queryParams.append("method", params.method);
    const queryString = queryParams.toString();
    return apiClient.get(
      `/reports/collections${queryString ? `?${queryString}` : ""}`,
    );
  },

  /**
   * Export report as PDF
   * @param {string} type - Report type (fee, student, collection)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Axios response with blob
   */
  exportPDF: (type, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });
    const queryString = queryParams.toString();
    return apiClient.get(
      `/reports/export/${type}/pdf${queryString ? `?${queryString}` : ""}`,
      {
        responseType: "blob",
      },
    );
  },

  /**
   * Export report as Excel
   * @param {string} type - Report type (fee, student, collection)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Axios response with blob
   */
  exportExcel: (type, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });
    const queryString = queryParams.toString();
    return apiClient.get(
      `/reports/export/${type}/excel${queryString ? `?${queryString}` : ""}`,
      {
        responseType: "blob",
      },
    );
  },
};
