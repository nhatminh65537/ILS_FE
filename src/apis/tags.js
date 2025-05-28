import apiClient from "./axiosConfig";

const prefix = '/v1/learntags';

export const tagsAPI = {
  /**
   * Get all tags
   * @returns {Promise<Array>} - List of tags
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
   * Get a single tag by ID
   * @param {number} id - Tag ID
   * @returns {Promise<Object>} - Tag data
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
   * Create a new tag
   * @param {Object} tagData - Tag data with name and optional description
   * @returns {Promise<Object>} - Created tag data
   */
  create: async (tagData) => {
    try {
      const response = await apiClient.post(prefix, tagData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update an existing tag
   * @param {Object} tagData - Tag data with id, name, and optional description
   * @returns {Promise<Object>} - Updated tag data
   */
  update: async (tagData) => {
    try {
      const response = await apiClient.put(`${prefix}/${tagData.id}`, tagData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a tag by ID
   * @param {number} id - Tag ID
   * @returns {Promise<void>} - No content
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${prefix}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
