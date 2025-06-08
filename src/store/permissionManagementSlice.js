import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionsAPI } from '../apis/permissions';
import { usersAPI } from '../apis/users';
import { rolesAPI } from '../apis/roles';
import { all } from 'axios';

// Initial state
const initialState = {
  listPermissions: [], // list of all available permissions
  currentPermissions: [], // list of permission objects with {id, name, description}
  isRole: true, // true if working with role, false if working with user
  object: null, // current role or user object
  listRoles: [], // list of all available roles
  currentFetchedUser: null, // current fetched user to potentially select
  userRoles: [], // roles assigned to the current user (when isRole is false)
  loading: false,
  error: null
};

export const fetchAllPermissions = createAsyncThunk(
  'permissionManagement/fetchAllPermissions',
  async (_, { rejectWithValue }) => {
    try {
      return await permissionsAPI.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch permissions');
    }
  }
);

// Thunks
export const fetchRolePermissions = createAsyncThunk(
  'permissionManagement/fetchRolePermissions',
  async (roleId, { rejectWithValue }) => {
    try {
      return await rolesAPI.getPermissions(roleId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch role permissions');
    }
  }
);

export const fetchUserPermissions = createAsyncThunk(
  'permissionManagement/fetchUserPermissions',
  async (userId, { rejectWithValue }) => {
    try {
      return await usersAPI.getPermissions(userId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user permissions');
    }
  }
);

export const fetchUserRoles = createAsyncThunk(
  'permissionManagement/fetchUserRoles',
  async (userId, { rejectWithValue }) => {
    try {
      return await usersAPI.getRoles(userId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user roles');
    }
  }
);

export const fetchAllRoles = createAsyncThunk(
  'permissionManagement/fetchAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      return await rolesAPI.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch roles');
    }
  }
);

export const fetchUserByIdentifier = createAsyncThunk(
  'permissionManagement/fetchUserByIdentifier',
  async ({ identifier, type }, { rejectWithValue }) => {
    try {
      if (type === 'username') {
        return await usersAPI.getByUsername(identifier);
      } else {
        return await usersAPI.getByEmail(identifier);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'User not found');
    }
  }
);

export const addPermissionToRole = createAsyncThunk(
  'permissionManagement/addPermissionToRole',
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    try {
      await rolesAPI.addPermission(roleId, permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add permission');
    }
  }
);

export const removePermissionFromRole = createAsyncThunk(
  'permissionManagement/removePermissionFromRole',
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    try {
      await rolesAPI.removePermission(roleId, permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove permission');
    }
  }
);

export const addPermissionToUser = createAsyncThunk(
  'permissionManagement/addPermissionToUser',
  async ({ userId, permissionId }, { rejectWithValue }) => {
    try {
      await usersAPI.addPermission(userId, permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add permission');
    }
  }
);

export const removePermissionFromUser = createAsyncThunk(
  'permissionManagement/removePermissionFromUser',
  async ({ userId, permissionId }, { rejectWithValue }) => {
    try {
      await usersAPI.removePermission(userId, permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove permission');
    }
  }
);

export const addRoleToUser = createAsyncThunk(
  'permissionManagement/addRoleToUser',
  async ({ userId, roleId }, { rejectWithValue, dispatch }) => {
    try {
      await usersAPI.addRole(userId, roleId);
      await dispatch(fetchUserPermissions(userId));
      return roleId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add role');
    }
  }
);

export const removeRoleFromUser = createAsyncThunk(
  'permissionManagement/removeRoleFromUser',
  async ({ userId, roleId }, { rejectWithValue, dispatch }) => {
    try {
      await usersAPI.removeRole(userId, roleId);
      await dispatch(fetchUserPermissions(userId));
      return roleId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove role');
    }
  }
);

export const updatePermissionDescription = createAsyncThunk(
  'permissionManagement/updatePermissionDescription',
  async ({ editingPermission }, { rejectWithValue }) => {
    try {
      await permissionsAPI.update(editingPermission.id, { 
        id: editingPermission.id,
        name: editingPermission.name,
        description: editingPermission.newDescription 
      });
      return { id: editingPermission.id, description: editingPermission.newDescription };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update permission');
    }
  }
);

// Add these new role management thunks after the existing thunks
export const createRole = createAsyncThunk(
  'permissionManagement/createRole',
  async (roleData, { rejectWithValue, dispatch }) => {
    try {
      const response = await rolesAPI.create(roleData);
      // Refresh the roles list after creating a new role
      dispatch(fetchAllRoles());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create role');
    }
  }
);

export const updateRole = createAsyncThunk(
  'permissionManagement/updateRole',
  async ({ roleId, roleData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await rolesAPI.update(roleId, roleData);
      // Refresh the roles list after updating
      dispatch(fetchAllRoles());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'permissionManagement/deleteRole',
  async (roleId, { rejectWithValue, dispatch, getState }) => {
    try {
      await rolesAPI.delete(roleId);
      // Refresh the roles list after deleting
      dispatch(fetchAllRoles());
      
      // If the deleted role was selected, clear it
      const { object, isRole } = getState().permissionManagement;
      if (isRole && object && object.id === roleId) {
        dispatch(setObject(null));
      }
      
      return roleId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete role');
    }
  }
);

const permissionManagementSlice = createSlice({
  name: 'permissionManagement',
  initialState,
  reducers: {
    setIsRole(state, action) {
      state.isRole = action.payload;
      state.object = null;
      state.currentPermissions = [];
      state.userRoles = [];
    },
    setObject(state, action) {
      state.object = action.payload;
    },
    clearCurrentFetchedUser(state) {
      state.currentFetchedUser = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchRolePermissions
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPermissions = action.payload;
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserPermissions
      .addCase(fetchUserPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPermissions = action.payload;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserRoles
      .addCase(fetchUserRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.userRoles = action.payload;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchAllRoles
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.listRoles = action.payload;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserByIdentifier
      .addCase(fetchUserByIdentifier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdentifier.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFetchedUser = action.payload;
      })
      .addCase(fetchUserByIdentifier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentFetchedUser = { error: action.payload };
      })
      
      // Handle permission changes
      .addCase(addPermissionToRole.fulfilled, (state, action) => {
        const permissionId = action.payload;
        if (!state.currentPermissions.find(p => p.id === permissionId)) {
          state.currentPermissions.push({ id: permissionId });
        }
      })
      .addCase(removePermissionFromRole.fulfilled, (state, action) => {
        state.currentPermissions = state.currentPermissions.filter(
          p => p.id !== action.payload
        );
      })
      .addCase(addPermissionToUser.fulfilled, (state, action) => {
        const permissionId = action.payload;
        if (!state.currentPermissions.find(p => p.id === permissionId)) {
          state.currentPermissions.push({ id: permissionId });
        }
      })
      .addCase(removePermissionFromUser.fulfilled, (state, action) => {
        state.currentPermissions = state.currentPermissions.filter(
          p => p.id !== action.payload
        );
      })
      
      // Handle role changes
      .addCase(addRoleToUser.fulfilled, (state, action) => {
        const roleId = action.payload;
        const role = state.listRoles.find(r => r.id === roleId);
        if (role && !state.userRoles.find(r => r.id === roleId)) {
          state.userRoles.push(role);
        }
      })
      .addCase(removeRoleFromUser.fulfilled, (state, action) => {
        state.userRoles = state.userRoles.filter(
          r => r.id !== action.payload
        );
      })
      
      // Handle permission description update
      .addCase(updatePermissionDescription.fulfilled, (state, action) => {
        const { id, description } = action.payload;
        const permission = state.listPermissions.find(p => p.id === id);
        if (permission) {
          permission.description = description;
        }
      })
      
      // Handle createRole
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.loading = false;
        // The roles list will be refreshed by fetchAllRoles
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle updateRole
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.loading = false;
        // The roles list will be refreshed by fetchAllRoles
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle deleteRole
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state) => {
        state.loading = false;
        // The roles list will be refreshed by fetchAllRoles
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchAllPermissions
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.listPermissions = action.payload;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setIsRole, 
  setObject, 
  clearCurrentFetchedUser,
  clearError
} = permissionManagementSlice.actions;

export default permissionManagementSlice.reducer;
