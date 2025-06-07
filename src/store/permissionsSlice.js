import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionsAPI } from '../apis/permissions';

// Async thunks
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const permissions = await permissionsAPI.getAll();
      return permissions;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, permissionData }, { rejectWithValue }) => {
    try {
      const updatedPermission = await permissionsAPI.update(id, permissionData);
      return updatedPermission;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(perm => perm.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = permissionsSlice.actions;
export default permissionsSlice.reducer;