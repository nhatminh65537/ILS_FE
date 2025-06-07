import apiClient from "./axiosConfig";

const prefix = '/v1/users';

export const usersAPI = {
  getAll: async () => {
    const response = await apiClient.get(prefix);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`${prefix}/${id}`);
    return response.data;
  },

  getByUsername: async (username) => {
    const response = await apiClient.get(`${prefix}/by-username/${encodeURIComponent(username)}`);
    return response.data;
  },

  getByEmail: async (email) => {
    const response = await apiClient.get(`${prefix}/by-email/${encodeURIComponent(email)}`);
    return response.data;
  },

  create: async (userDTO) => {
    const response = await apiClient.post(prefix, userDTO);
    return response.data;
  },

  update: async (id, userDTO) => {
    const response = await apiClient.put(`${prefix}/${id}`, userDTO);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${prefix}/${id}`);
    return response.data;
  },

  getProfile: async (id) => {
    const response = await apiClient.get(`${prefix}/${id}/profile`);
    return response.data;
  },

  getPermissions: async (id) => {
    const response = await apiClient.get(`${prefix}/${id}/permissions`);
    return response.data;
  },

  addPermission: async (id, permissionId) => {
    const response = await apiClient.post(`${prefix}/${id}/permissions/${permissionId}`);
    return response.data;
  },

  removePermission: async (id, permissionId) => {
    const response = await apiClient.delete(`${prefix}/${id}/permissions/${permissionId}`);
    return response.data;
  },

  getRoles: async (id) => {
    const response = await apiClient.get(`${prefix}/${id}/roles`);
    return response.data;
  },

  addRole: async (id, roleId) => {
    const response = await apiClient.post(`${prefix}/${id}/roles/${roleId}`);
    return response.data;
  },

  removeRole: async (id, roleId) => {
    const response = await apiClient.delete(`${prefix}/${id}/roles/${roleId}`);
    return response.data;
  },

  getScoreboard: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`${prefix}/scoreboard?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
};
