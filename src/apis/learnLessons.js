import apiClient from "./axiosConfig";

const prefix = '/v1/learnlessons';

export const learnLessonsAPI = {
  /**
   * Get all lessons
   * @returns {Promise<Array>} - List of lessons
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
   * Get a single lesson by ID
   * @param {number} id - Lesson ID
   * @returns {Promise<Object>} - Lesson data
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
   * Create a new lesson
   * @param {Object} lessonData - Lesson data including parentNodeId, title, typeId, xp, duration, and content
   * @returns {Promise<Object>} - Created lesson
   */
  create: async (lessonData) => {
    try {
      const response = await apiClient.post(prefix, lessonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a lesson
   * @param {number} id - Lesson ID
   * @param {Object} lessonData - Updated lesson data
   * @returns {Promise<Object>} - Updated lesson
   */
  update: async (id, lessonData) => {
    try {
      // According to API definition, update uses a path parameter for ID
      const response = await apiClient.put(`${prefix}/${id}`, {
        id,
        ...lessonData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a lesson
   * @param {number} id - Lesson ID
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
