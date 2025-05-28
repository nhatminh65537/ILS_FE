import apiClient from "./axiosConfig";

const prefix = '/v1/learnnodes';

export const learnNodesAPI = {
  /**
   * Get all nodes
   * @returns {Promise<Array>} - List of nodes
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
   * Get a single node by ID
   * @param {number} id - Node ID
   * @returns {Promise<Object>} - Node data
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
   * Get the content tree for a node (typically used for modules)
   * @param {number} id - The ID of the node
   * @returns {Promise<Object>} - NodeTree object
   */
  getNodeTree: async (id) => {
    try {
      const response = await apiClient.get(`${prefix}/${id}/tree`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a node tree structure
   * @param {number} id - The ID of the root node
   * @param {object} treeData - The updated tree structure
   * @returns {Promise<Object>} - Updated tree data
   */
  updateNodeTree: async (id, treeData) => {
    try {
      const response = await apiClient.put(`${prefix}/${id}/tree`, treeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new node
   * @param {Object} nodeData - Node data
   * @returns {Promise<Object>} - Created node
   */
  create: async (nodeData) => {
    try {
      const response = await apiClient.post(prefix, nodeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a node
   * @param {number} id - Node ID
   * @param {Object} nodeData - Updated node data
   * @returns {Promise<Object>} - Updated node
   */
  update: async (id, nodeData) => {
    try {
      const response = await apiClient.put(`${prefix}/${id}`, nodeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a node
   * @param {number} id - Node ID
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
