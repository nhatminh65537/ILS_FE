import apiClient from "./axiosConfig";

const prefix = '/v1/learnlifecyclestates';

export const lifecycleStatesAPI = {
  /**
   * Get all lifecycle states
   * @returns {Promise<Array>} - List of lifecycle states
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
   * Get a single lifecycle state by ID
   * @param {number} id - Lifecycle state ID
   * @returns {Promise<Object>} - Lifecycle state data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${prefix}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
