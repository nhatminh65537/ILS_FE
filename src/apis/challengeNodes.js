import apiClient from './axiosConfig';

const API_BASE_URL = '/v1/challengenodes';

export const challengeNodesAPI = {
  // Get paginated nodes with filters
  getPaginated: async (parentId, filterDTO) => {
    const response = await apiClient.post(`${API_BASE_URL}/${parentId}`, filterDTO);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  create: async (node) => {
    const response = await apiClient.post(API_BASE_URL, node);
    return response.data;
  },
  
  update: async (id, node) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, node);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
