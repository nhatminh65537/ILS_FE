import apiClient from './axiosConfig';

const API_BASE_URL = '/v1/flag';

export const checkFlagAPI = {
  check: async (payload) => {
    // payload: { challengeId, flag }
    const response = await apiClient.post(`${API_BASE_URL}/check`, payload);
    return response.data;
  }
};
