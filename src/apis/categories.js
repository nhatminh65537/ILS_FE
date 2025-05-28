import apiClient from "./axiosConfig";

const prefix = '/v1/learncategories';

export const categoriesAPI = {
  /**
   * Get all categories
   * @returns {Promise<Array>} - List of categories
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
   * Get a single category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object>} - Category data
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
   * Create a new category
   * @param {Object} categoryData - Category data with name and optional description
   * @returns {Promise<Object>} - Created category data
   */
  create: async (categoryData) => {
    try {
      const response = await apiClient.post(prefix, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  /**
   * Update an existing category
   * @param {Object} categoryData - Category data with id, name and optional description
   * @returns {Promise<Object>} - Updated category data
   */
  update: async (categoryData) => {
    try {
      const response = await apiClient.put(`${prefix}/${categoryData.id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a category by ID
   * @param {number} id - Category ID
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
