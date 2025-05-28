import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { myUserAPI } from '../apis/myUser';

// Async thunks for fetching user data
export const fetchUserData = createAsyncThunk(
  'myUser/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await myUserAPI.getUser();
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserPermissions = createAsyncThunk(
  'myUser/fetchUserPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const permissions = await myUserAPI.getPermissions();
      return permissions;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'myUser/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await myUserAPI.getProfile();
      return profile;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserRoles = createAsyncThunk(
  'myUser/fetchUserRoles',
  async (_, { rejectWithValue }) => {
    try {
      const roles = await myUserAPI.getRoles();
      return roles;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserData = createAsyncThunk(
  'myUser/updateUserData',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const updatedData = await myUserAPI.updateUser(userData);
      // Refresh user data after update
      dispatch(fetchUserData());
      return updatedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add thunk for fetching module progress
export const fetchModuleProgress = createAsyncThunk(
  'myUser/fetchModuleProgress',
  async (_, { rejectWithValue }) => {
    try {
      const progress = await myUserAPI.getModuleProgress();
      return progress;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add thunk for updating module progress
export const updateModuleProgress = createAsyncThunk(
  'myUser/updateModuleProgress',
  async ({ moduleId, progressStateId }, { rejectWithValue, dispatch }) => {
    try {
      const progressDTO = { moduleId, progressStateId, UserId: 0 };
      await myUserAPI.updateLearnModuleProgress(moduleId, progressDTO);
      // Optionally refresh progress after update
      dispatch(fetchModuleProgress());
      return { moduleId, ...progressDTO };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add thunk for marking lesson as finished
export const markLessonAsFinished = createAsyncThunk(
  'myUser/markLessonAsFinished',
  async (lessonId, { rejectWithValue }) => {
    try {
      await myUserAPI.markLessonFinished(lessonId);
      return lessonId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add thunk for fetching finished lessons
export const fetchFinishedLessons = createAsyncThunk(
  'myUser/fetchFinishedLessons',
  async (moduleId, { rejectWithValue }) => {
    try {
      const finishedLessons = await myUserAPI.getFinishedLessons(moduleId);
      return { moduleId, finishedLessons };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update the initializeUserData thunk to include module progress
export const initializeUserData = createAsyncThunk(
  'myUser/initializeUserData',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchUserData()),
      dispatch(fetchModuleProgress())
      // Finished lessons are fetched separately when a module is loaded
    ]);
    return true;
  }
);

const myUserSlice = createSlice({
  name: 'myUser',
  initialState: {
    userData: null,
    profile: null,
    permissions: [],
    permissionNames: [],
    roles: [],
    moduleProgress: [],
    finishedLessons: {}, // Map of moduleId -> array of finished lesson IDs
    loading: false,
    error: null
  },
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
      state.profile = null;
      state.permissions = [];
      state.permissionNames = [];
      state.roles = [];
      state.moduleProgress = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserData
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.permissions = action.payload.permissions || []; // Ensure permissions are set
        state.permissionNames = action.payload.permissions.map(p => p.name) || []; // Ensure permission names are set
        state.roles = action.payload.roles || []; // Ensure roles are set
        state.profile = action.payload.profile || {}; // Ensure profile is set
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserPermissions
      .addCase(fetchUserPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        state.permissionNames = action.payload.map(p => p.name); // Ensure permission names are set
        state.error = null;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserRoles
      .addCase(fetchUserRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle updateUserData
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchModuleProgress
      .addCase(fetchModuleProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModuleProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleProgress = action.payload;
        state.error = null;
      })
      .addCase(fetchModuleProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle updateModuleProgress
      .addCase(updateModuleProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateModuleProgress.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateModuleProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchFinishedLessons
      .addCase(fetchFinishedLessons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinishedLessons.fulfilled, (state, action) => {
        const { moduleId, finishedLessons } = action.payload;
        state.loading = false;
        state.finishedLessons[moduleId] = finishedLessons;
        state.error = null;
      })
      .addCase(fetchFinishedLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle markLessonAsFinished
      .addCase(markLessonAsFinished.pending, (state) => {
        state.loading = true;
      })
      .addCase(markLessonAsFinished.fulfilled, (state, action) => {
        state.loading = false;
        const lessonId = action.payload;
        
        // Add the lessonId to all relevant module arrays
        // (This is a simple implementation - in a real app, you'd know which module this lesson belongs to)
        Object.keys(state.finishedLessons).forEach(moduleId => {
          if (!state.finishedLessons[moduleId].includes(lessonId)) {
            state.finishedLessons[moduleId] = [...state.finishedLessons[moduleId], lessonId];
          }
        });
        
        state.error = null;
      })
      .addCase(markLessonAsFinished.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Create a selector for checking permissions
export const hasPermission = (state, permission) => {
  return state.myUser.permissionNames.includes(permission);
};

// Create a selector for getting module progress by module ID
export const getModuleProgressById = createSelector(
  [(state) => state.myUser.moduleProgress, (_, moduleId) => moduleId],
  (moduleProgress, moduleId) => {
    return moduleProgress.find(progress => 
      progress.moduleId === moduleId || progress.moduleId === parseInt(moduleId)
    ) || null;
  }
);

// Create a function to get button text based on progress state
export const getModuleButtonText = (moduleProgress) => {
  if (!moduleProgress || !moduleProgress.progressState) {
    return "Start Learning";
  }
  
  const stateName = moduleProgress.progressState.name;
  
  if (stateName === "Completed") {
    return "Review";
  } else if (stateName === "Learning") {
    return "Continue";
  }
  
  return "Start Learning";
};

// Create a selector to check if a lesson is finished
export const isLessonFinished = createSelector(
  [
    (state) => state.myUser.finishedLessons,
    (_, moduleId) => moduleId,
    (_, __, lessonId) => lessonId
  ],
  (finishedLessons, moduleId, lessonId) => {
    return finishedLessons[moduleId]?.includes(lessonId) || false;
  }
);

export const { clearUserData, clearError } = myUserSlice.actions;
export default myUserSlice.reducer;
