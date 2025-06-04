import apiClient from './axiosConfig';

const API_BASE_URL = '/v1/challengecategories';

export const challengeCategoriesAPI = {
  getAll: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  create: async (category) => {
    const response = await apiClient.post(API_BASE_URL, category);
    return response.data;
  },
  
  update: async (id, category) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, category);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
