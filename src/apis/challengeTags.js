import apiClient from './axiosConfig';

const API_BASE_URL = '/v1/challengetags';

export const challengeTagsAPI = {
  getAll: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  create: async (tag) => {
    const response = await apiClient.post(API_BASE_URL, tag);
    return response.data;
  },
  
  update: async (id, tag) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, tag);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
