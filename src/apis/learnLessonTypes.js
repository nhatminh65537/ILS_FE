import apiClient from "./axiosConfig";

const prefix = '/v1/learnlessontypes';

export const learnLessonTypesAPI = {
  /**
   * Get all lesson types
   * @returns {Promise<Array>} - List of lesson types
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
   * Get a single lesson type by ID
   * @param {number} id - Lesson type ID
   * @returns {Promise<Object>} - Lesson type data
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
   * Create a new lesson type
   * @param {Object} lessonTypeData - Lesson type data including name and description
   * @returns {Promise<Object>} - Created lesson type
   */
  create: async (lessonTypeData) => {
    try {
      const response = await apiClient.post(prefix, lessonTypeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a lesson type
   * @param {number} id - Lesson type ID
   * @param {Object} lessonTypeData - Updated lesson type data
   * @returns {Promise<Object>} - Updated lesson type
   */
  update: async (id, lessonTypeData) => {
    try {
      const response = await apiClient.put(`${prefix}/${id}`, {
        id,
        ...lessonTypeData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a lesson type
   * @param {number} id - Lesson type ID
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
