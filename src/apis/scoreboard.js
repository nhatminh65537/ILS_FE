import apiClient from './axiosConfig';

export const scoreboardAPI = {
  getScoreboard: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`/v1/Users/scoreboard?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
};
