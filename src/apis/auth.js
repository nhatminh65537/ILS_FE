import apiClient from "./axiosConfig";

const prefix = '/v1/auth';

export const authAPI = {
  /**
   * Logs in the user with the provided credentials.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} - The response data from the server.
   * @throws {Error} - Throws an error if the login fails.
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post(`${prefix}/login`, { username, password });

      // Simulate a delay (e.g., for UX purposes)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // Random delay between 500ms and 1500ms

      // Store the authentication token in localStorage
      localStorage.setItem('ILS_AUTH_TOKEN', response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logs out the user by invalidating the session.
   * @returns {Promise<Object>} - The response data from the server.
   * @throws {Error} - Throws an error if the logout fails.
   */
  logout: async () => {
    try {
      const response = await apiClient.post(`${prefix}/logout`);
      // Remove the authentication token from localStorage
      localStorage.removeItem('ILS_AUTH_TOKEN');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Registers a new user with the provided credentials.
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @param {string} email - The email of the new user.
   * @returns {Promise<Object>} - The response data from the server.
   * @throws {Error} - Throws an error if the registration fails.
   */
  register: async (username, password, email) => {
    try {
      const response = await apiClient.post(`${prefix}/register`, { username, password, email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  ,
    /**
     * Resets the user's password.
     * @param {string} oldPassword - The user's current password.
     * @param {string} newPassword - The new password to set.
     * @returns {Promise<Object>} - The response data from the server.
     * @throws {Error} - Throws an error if the reset fails.
     */
    changePassword: async (oldPassword, newPassword) => {
      try {
        const response = await apiClient.post(`${prefix}/changepasswd`, { oldPassword, newPassword });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
};
