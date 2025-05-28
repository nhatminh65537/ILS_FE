import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { modulesAPI } from '../apis/modules';
import { categoriesAPI } from '../apis/categories';
import { tagsAPI } from '../apis/tags';
import { lifecycleStatesAPI } from '../apis/lifecycleStates';

// Async thunks for modules
export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async ({ page, pageSize, searchTerm, filters }, { rejectWithValue }) => {
    try {      
      const response = await modulesAPI.getAll(page, pageSize, searchTerm, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createModule = createAsyncThunk(
  'modules/createModule',
  async (moduleData, { rejectWithValue, dispatch }) => {
    try {
      const response = await modulesAPI.create(moduleData);
      // Refresh the modules list after creating a new one
      dispatch(fetchModules({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        filters: {}
      }));
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunks for filter data
export const fetchCategories = createAsyncThunk(
  'modules/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTags = createAsyncThunk(
  'modules/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tagsAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLifecycleStates = createAsyncThunk(
  'modules/fetchLifecycleStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lifecycleStatesAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// New async thunk for creating tags
export const createTag = createAsyncThunk(
  'modules/createTag',
  async (tagData, { rejectWithValue, dispatch }) => {
    try {
      const response = await tagsAPI.create(tagData);
      // Refresh the tags list after creating a new one
      dispatch(fetchTags());
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// New async thunk for deleting tags
export const deleteTag = createAsyncThunk(
  'modules/deleteTag',
  async (tagId, { rejectWithValue }) => {
    try {
      const response = await tagsAPI.delete(tagId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add updateTag action
export const updateTag = createAsyncThunk(
  'modules/updateTag',
  async (tagData, { rejectWithValue, dispatch }) => {
    try {
      const response = await tagsAPI.update(tagData);
      // Refresh the tags list after updating
      dispatch(fetchTags());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tag');
    }
  }
);

// New async thunk for creating categories
export const createCategory = createAsyncThunk(
  'modules/createCategory',
  async (categoryData, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoriesAPI.create(categoryData);
      // Refresh the categories list after creating a new one
      dispatch(fetchCategories());
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// New async thunk for deleting categories
export const deleteCategory = createAsyncThunk(
  'modules/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.delete(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New async thunk for updating categories
export const updateCategory = createAsyncThunk(
  'modules/updateCategory',
  async (categoryData, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoriesAPI.update(categoryData);
      // Refresh the categories list after updating
      dispatch(fetchCategories()) 
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const modulesSlice = createSlice({
  name: 'modules',
  initialState: {
    modules: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10, // Default to 10, will be adjusted based on permissions
    searchTerm: '',
    filters: {},
    loading: false,
    error: null,
    // Filter options data
    categories: [],
    tags: [],
    lifecycleStates: [],
    filtersLoading: false,
    filtersError: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when search term changes
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },
    // New action to initialize page size based on permissions
    initializePageSize: (state, action) => {
      // If user has add module permission, set pageSize to 9, otherwise 10
      state.pageSize = action.payload ? 9 : 10;
    },
    clearError: (state) => {
      state.error = null;
      state.filtersError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchModules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle createModule
      .addCase(createModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModule.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle filter data fetching
      .addCase(fetchCategories.pending, (state) => {
        state.filtersLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
      })
      
      .addCase(fetchTags.pending, (state) => {
        state.filtersLoading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
      })
      
      .addCase(fetchLifecycleStates.pending, (state) => {
        state.filtersLoading = true;
      })
      .addCase(fetchLifecycleStates.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.lifecycleStates = action.payload;
      })
      .addCase(fetchLifecycleStates.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
      })
      
      // Add cases for createTag
      .addCase(createTag.pending, (state) => {
        state.filtersLoading = true;
        state.filtersError = null;
      })
      .addCase(createTag.fulfilled, (state) => {
        state.filtersLoading = false;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
      })

      // Add cases for deleteTag
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter(tag => tag.id !== action.meta.arg);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete tag';
      })

      // Add cases for updateTag
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.map(tag => 
          tag.id === action.payload.id ? action.payload : tag
        );
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add cases for createCategory
      .addCase(createCategory.pending, (state) => {
        state.filtersLoading = true;
        state.filtersError = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.filtersLoading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
      })

      // Add cases for deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.meta.arg);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete category';
      })

      // Add cases for updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Update the category in state
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update category';
      });
  }
});

export const { 
  setSearchTerm, 
  setFilters, 
  setPage, 
  setPageSize,
  initializePageSize,
  clearError
} = modulesSlice.actions;
export default modulesSlice.reducer;
