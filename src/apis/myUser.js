import apiClient from "./axiosConfig";

const prefix = '/v1/my-user';

export const myUserAPI = {
  /**
   * Get current user data
   * @returns {Promise<Object>} - User data
   */
  getUser: async () => {
    try {
      const response = await apiClient.get(prefix);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update current user data
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} - Updated user data
   */
  updateUser: async (userData) => {
    try {
      const response = await apiClient.put(prefix, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get current user permissions
   * @returns {Promise<Array>} - List of permission strings
   */
  getPermissions: async () => {
    try {
      const response = await apiClient.get(`${prefix}/permissions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} - User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(`${prefix}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get current user roles
   * @returns {Promise<Array>} - List of role objects
   */
  getRoles: async () => {
    try {
      const response = await apiClient.get(`${prefix}/roles`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get module progress states for current user
   * @returns {Promise<Array>} - List of module progress states
   */
  getModuleProgress: async () => {
    try {
      const response = await apiClient.get(`${prefix}/progress-states`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update progress state for a specific module
   * @param {number} moduleId - Module ID
   * @param {Object} progressDTO - Progress data (must include ModuleId)
   * @returns {Promise<void>}
   */
  updateLearnModuleProgress: async (moduleId, progressDTO) => {
    try {
      await apiClient.put(`${prefix}/modules/${moduleId}/progress-state`, progressDTO);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Mark a lesson as finished
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<void>}
   */
  markLessonFinished: async (lessonId) => {
    try {
      await apiClient.post(`${prefix}/lessons/${lessonId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get list of finished lesson IDs for a specific module
   * @param {number} moduleId - Module ID
   * @returns {Promise<Array<number>>} - List of finished lesson IDs
   */
  getFinishedLessons: async (moduleId) => {
    try {
      const response = await apiClient.get(`${prefix}/modules/${moduleId}/lesson-finished`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
