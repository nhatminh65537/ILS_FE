import apiClient from './axiosConfig';

const API_BASE_URL = '/v1/challengeproblems';

export const challengeProblemsAPI = {
  getAll: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  create: async (problem) => {
    const response = await apiClient.post(API_BASE_URL, problem);
    return response.data;
  },
  
  update: async (id, problem) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, problem);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Upload a file for a problem
  uploadFile: async (problemId, fileDTO) => {
    const response = await apiClient.post(`${API_BASE_URL}/${problemId}/file`, fileDTO);
    return response.data;
  },

  // Delete a file from a problem
  deleteFile: async (problemId, fileId) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${problemId}/file/${fileId}`);
    return response.data;
  }
};
