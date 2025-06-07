import apiClient from "./axiosConfig";

const prefix = '/v1/permissions';

export const permissionsAPI = {
  /**
   * Get all permissions
   * @returns {Promise<Array>} - List of permissions
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(prefix);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single permission by ID
   * @param {number} id - Permission ID
   * @returns {Promise<Object>} - Permission data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${prefix}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update an existing permission
   * @param {Object} permissionData - Permission data with id and other fields
   * @returns {Promise<void>} - No content
   */
  update: async (id, permissionData) => {
    try {
      const response = await apiClient.put(`${prefix}/${id}`, permissionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
