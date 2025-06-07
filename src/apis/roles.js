import apiClient from "./axiosConfig";

const prefix = '/v1/roles';

export const rolesAPI = {
  getAll: async () => {
    const response = await apiClient.get(prefix);
    return response.data;
  },

  getById: async (roleId) => {
    const response = await apiClient.get(`${prefix}/${roleId}`);
    return response.data;
  },

  create: async (roleDTO) => {
    const response = await apiClient.post(prefix, roleDTO);
    return response.data;
  },

  update: async (roleId, roleDTO) => {
    const response = await apiClient.put(`${prefix}/${roleId}`, roleDTO);
    return response.data;
  },

  delete: async (roleId) => {
    const response = await apiClient.delete(`${prefix}/${roleId}`);
    return response.data;
  },

  getPermissions: async (roleId) => {
    const response = await apiClient.get(`${prefix}/${roleId}/permissions`);
    return response.data;
  },

  addPermission: async (roleId, permissionId) => {
    const response = await apiClient.post(`${prefix}/${roleId}/permissions/${permissionId}`);
    return response.data;
  },

  removePermission: async (roleId, permissionId) => {
    const response = await apiClient.delete(`${prefix}/${roleId}/permissions/${permissionId}`);
    return response.data;
  }
};
