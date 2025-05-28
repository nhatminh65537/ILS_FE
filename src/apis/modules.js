import filter from "daisyui/components/filter";
import apiClient from "./axiosConfig";

const prefix = '/v1/learnmodules';

export const modulesAPI = {
  /**
   * Get all modules with pagination and filtering
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Number of items per page
   * @param {string} searchTerm - Optional search term
   * @param {Object} filters - Optional filters (category, tags, lifecycleState)
   * @returns {Promise<Object>} - Paginated list of modules
   */
  getAll: async (page = 1, pageSize = 10, searchTerm = '', filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        pageSize,
        searchTerm,
      });
      for (const key in filters) {
        if (Array.isArray(filters[key])) {
          filters[key].forEach((value) => {
            queryParams.append(key, value);
          });
        } else {
          queryParams.append(key, filters[key]);
        }
      }
      
      const response = await apiClient.get(`${prefix}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single module by ID
   * @param {number} id - Module ID
   * @returns {Promise<Object>} - Module data
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
   * Create a new module
   * @param {Object} moduleData - Module data
   * @returns {Promise<Object>} - Created module
   */
  create: async (moduleData) => {
    try {
      const response = await apiClient.post(prefix, moduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a module
   * @param {number} id - Module ID
   * @param {Object} moduleData - Updated module data
   * @returns {Promise<Object>} - Updated module
   */
  update: async (id, moduleData) => {
    try {
      const response = await apiClient.put(`${prefix}/${id}`, moduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a module
   * @param {number} id - Module ID
   * @returns {Promise<Object>} - Response data
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
