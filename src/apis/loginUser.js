import apiClient from "./axiosConfig";

subPath = '/v1/my-user'

export const loginUserAPI = {
    fetchAll: async () => {
        try {
            const response = await apiClient.get(`${subPath}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
}

