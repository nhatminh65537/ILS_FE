import apiClient from './axiosConfig';

const API_BASE_URL = '/v1/challengestates';

export const challengeStatesAPI = {
  getAll: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  update: async (id, state) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, state);
    return response.data;
  }
};
