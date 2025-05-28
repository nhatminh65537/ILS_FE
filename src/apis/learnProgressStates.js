import apiClient from "./axiosConfig";

const prefix = '/v1/LearnProgressStates';

export const PROGRESS_STATES = {
  LOCKED: 'Locked',
  LEARNING: 'Learning', 
  COMPLETED: 'Completed'
};

export const learnProgressStatesAPI = {
  /**
   * Get all learn progress states
   * @returns {Promise<Array>} - List of progress state objects
   */
  getAllProgressStates: async () => {
    try {
      const response = await apiClient.get(prefix);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific progress state by ID
   * @param {number} id - Progress state ID
   * @returns {Promise<Object>} - Progress state object
   */
  getProgressStateById: async (id) => {
    try {
      const response = await apiClient.get(`${prefix}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  /**
   * Find progress state by name (client-side filtering)
   * @param {string} name - Name of the progress state
   * @param {Array} states - List of progress states (optional)
   * @returns {Promise<Object|null>} - Progress state or null if not found
   */
  findProgressStateByName: async (name, states = null) => {
    try {
      if (!states) {
        const response = await apiClient.get(prefix);
        states = response.data;
      }
      
      return states.find(state => state.name === name) || null;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
