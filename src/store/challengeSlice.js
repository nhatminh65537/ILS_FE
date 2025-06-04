import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { challengeNodesAPI } from '../apis/challengeNodes';
import { challengeCategoriesAPI } from '../apis/challengeCategories';
import { challengeTagsAPI } from '../apis/challengeTags';
import { challengeStatesAPI } from '../apis/challengeStates';
import { challengeProblemsAPI } from '../apis/challengeProblems';

// Initial state
const initialState = {
  folders: [], // Non-problem nodes
  problems: [], // Problem nodes
  categories: [],
  tags: [],
  states: [],
  currentProblem: null,
  currentParentId: 1, // Default root node ID
  breadcrumbs: [{ id: 1, title: 'Root' }],
  loadingFolders: false,
  loadingProblems: false,
  loadingFilters: false,
  loadingProblem: false,
  foldersTotalPages: 0,
  problemsTotalPages: 0,
  foldersTotalCount: 0,
  problemsTotalCount: 0,
  error: null,
  filters: {
    folderPage: 1,
    problemPage: 1,
    pageSize: 8,
    searchTerm: '',
    tagIds: [],
    categoryIds: [],
    stateIds: [],
    getSolved: false
  }
};

// Async thunks
export const fetchChallengeNodes = createAsyncThunk(
  'challenge/fetchChallengeNodes',
  async ({ parentId, isProblem = false, filters }, { rejectWithValue }) => {
    try {
      const filterParams = {
        page: isProblem ? filters.problemPage : filters.folderPage,
        pageSize: filters.pageSize,
        searchTerm: filters.searchTerm || '',
        tagIds: filters.tagIds || [],
        categoryIds: filters.categoryIds || [],
        stateIds: filters.stateIds || [],
        getSolved: filters.getSolved || false,
        isProblem,
        parentNodeId: parentId
      };
      
      const response = await challengeNodesAPI.getPaginated(parentId, filterParams);
      return { data: response, isProblem };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChallengeCategories = createAsyncThunk(
  'challenge/fetchChallengeCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await challengeCategoriesAPI.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChallengeTags = createAsyncThunk(
  'challenge/fetchChallengeTags',
  async (_, { rejectWithValue }) => {
    try {
      return await challengeTagsAPI.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChallengeStates = createAsyncThunk(
  'challenge/fetchChallengeStates',
  async (_, { rejectWithValue }) => {
    try {
      return await challengeStatesAPI.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChallengeProblem = createAsyncThunk(
  'challenge/fetchChallengeProblem',
  async (id, { rejectWithValue }) => {
    try {
      return await challengeProblemsAPI.getById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createChallengeNode = createAsyncThunk(
  'challenge/createChallengeNode',
  async (node, { rejectWithValue, dispatch }) => {
    try {
      if (node.isProblem) {
        const result = await challengeProblemsAPI.create(node);
      } else {
        const result = await challengeNodesAPI.create(node);
    }
      // Refresh nodes after creation
      dispatch(fetchChallengeNodes({ 
        parentId: node.parentNodeId, 
        isProblem: node.isProblem, 
        filters: initialState.filters 
      }));
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateChallengeNode = createAsyncThunk(
  'challenge/updateChallengeNode',
  async ({ id, node }, { rejectWithValue, dispatch, getState }) => {
    try {
      const result = await challengeNodesAPI.update(id, node);
      const { currentParentId, filters } = getState().challenge;
      
      // Refresh nodes after update
      dispatch(fetchChallengeNodes({ 
        parentId: currentParentId, 
        isProblem: node.isProblem, 
        filters 
      }));
      
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteChallengeNode = createAsyncThunk(
  'challenge/deleteChallengeNode',
  async ({ id, isProblem }, { rejectWithValue, dispatch, getState }) => {
    try {
      if (isProblem) {
        await challengeProblemsAPI.delete(id);
      } else {
        await challengeNodesAPI.delete(id);
     }
      const { currentParentId, filters } = getState().challenge;
      
      // Refresh nodes after deletion
      dispatch(fetchChallengeNodes({ 
        parentId: currentParentId, 
        isProblem, 
        filters 
      }));
      
      return { id, isProblem };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createChallengeTag = createAsyncThunk(
  'challenge/createChallengeTag',
  async (tag, { rejectWithValue }) => {
    try {
      return await challengeTagsAPI.create(tag);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateChallengeTag = createAsyncThunk(
  'challenge/updateChallengeTag',
  async ({ id, tag }, { rejectWithValue }) => {
    try {
      return await challengeTagsAPI.update(id, tag);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteChallengeTag = createAsyncThunk(
  'challenge/deleteChallengeTag',
  async (id, { rejectWithValue }) => {
    try {
      await challengeTagsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createChallengeCategory = createAsyncThunk(
  'challenge/createChallengeCategory',
  async (category, { rejectWithValue }) => {
    try {
      return await challengeCategoriesAPI.create(category);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateChallengeCategory = createAsyncThunk(
  'challenge/updateChallengeCategory',
  async ({ id, category }, { rejectWithValue }) => {
    try {
      return await challengeCategoriesAPI.update(id, category);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteChallengeCategory = createAsyncThunk(
  'challenge/deleteChallengeCategory',
  async (id, { rejectWithValue }) => {
    try {
      await challengeCategoriesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createChallengeProblem = createAsyncThunk(
  'challenge/createChallengeProblem',
  async (problem, { rejectWithValue, dispatch }) => {
    try {
      const result = await challengeProblemsAPI.create(problem);
      // Refresh problems after creation
      // Wait for a second to ensure the problem is created
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(fetchChallengeNodes({
        parentId: problem.parentNodeId,
        isProblem: true,
        filters: initialState.filters
      }));
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateChallengeProblem = createAsyncThunk(
    'challenge/updateChallengeProblem',
    async ({ id, problem }, { rejectWithValue, dispatch, getState }) => {
    try {
        console.log('Updating problem:', id, problem);
        const result = await challengeProblemsAPI.update(id, problem);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { currentParentId, filters } = getState().challenge;
        // Refresh problems after update
        dispatch(fetchChallengeNodes({
            parentId: currentParentId,
            isProblem: true,
            filters
        }));
        return result;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
export const deleteChallengeProblem = createAsyncThunk(
  'challenge/deleteChallengeProblem',
    async (id, { rejectWithValue, dispatch, getState }) => {
        try {
        await challengeProblemsAPI.delete(id);
        const { currentParentId, filters } = getState().challenge;
        // Refresh problems after deletion
        dispatch(fetchChallengeNodes({
            parentId: currentParentId,
            isProblem: true,
            filters
        }));
        return id;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Create the challenge slice
const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        ...state.filters,
        searchTerm: '',
        tagIds: [],
        categoryIds: [],
        stateIds: [],
        getSolved: false
      };
    },
    setCurrentParentId: (state, action) => {
      state.currentParentId = action.payload;
    },
    addBreadcrumb: (state, action) => {
      // Check if the breadcrumb already exists
      const exists = state.breadcrumbs.find(b => b.id === action.payload.id);
      if (!exists) {
        state.breadcrumbs.push(action.payload);
      } else {
        // Truncate breadcrumbs to this point
        const index = state.breadcrumbs.findIndex(b => b.id === action.payload.id);
        state.breadcrumbs = state.breadcrumbs.slice(0, index + 1);
      }
    },
    clearBreadcrumbsAfter: (state, action) => {
      const index = state.breadcrumbs.findIndex(b => b.id === action.payload);
      if (index !== -1) {
        state.breadcrumbs = state.breadcrumbs.slice(0, index + 1);
      }
    },
    resetBreadcrumbs: (state) => {
      state.breadcrumbs = [{ id: 1, title: 'Root' }];
      state.currentParentId = 1;
    }, 
    setCurrentProblem: (state, action) => {
      state.currentProblem = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchChallengeNodes
      .addCase(fetchChallengeNodes.pending, (state, action) => {
        const { isProblem } = action.meta.arg;
        if (isProblem) {
          state.loadingProblems = true;
        } else {
          state.loadingFolders = true;
        }
        state.error = null;
      })
      .addCase(fetchChallengeNodes.fulfilled, (state, action) => {
        const { data, isProblem } = action.payload;
        if (isProblem) {
          state.problems = data.items || [];
          state.problemsTotalPages = data.totalPages || 1;
          state.problemsTotalCount = data.totalCount || 0;
          state.loadingProblems = false;
        } else {
          state.folders = data.items || [];
          state.foldersTotalPages = data.totalPages || 1;
          state.foldersTotalCount = data.totalCount || 0;
          state.loadingFolders = false;
        }
      })
      .addCase(fetchChallengeNodes.rejected, (state, action) => {
        const { isProblem } = action.meta.arg;
        if (isProblem) {
          state.loadingProblems = false;
        } else {
          state.loadingFolders = false;
        }
        state.error = action.payload || "Failed to fetch challenge nodes";
      })

      // Handle fetchChallengeCategories
      .addCase(fetchChallengeCategories.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(fetchChallengeCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loadingFilters = false;
      })
      .addCase(fetchChallengeCategories.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload || "Failed to fetch challenge categories";
      })

      // Handle fetchChallengeTags
      .addCase(fetchChallengeTags.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(fetchChallengeTags.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.loadingFilters = false;
      })
      .addCase(fetchChallengeTags.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload || "Failed to fetch challenge tags";
      })

      // Handle fetchChallengeStates
      .addCase(fetchChallengeStates.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(fetchChallengeStates.fulfilled, (state, action) => {
        state.states = action.payload;
        state.loadingFilters = false;
      })
      .addCase(fetchChallengeStates.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload || "Failed to fetch challenge states";
      })

      // Handle fetchChallengeProblem
      .addCase(fetchChallengeProblem.pending, (state) => {
        state.loadingProblem = true;
        state.error = null;
      })
      .addCase(fetchChallengeProblem.fulfilled, (state, action) => {
        state.currentProblem = action.payload;
        state.loadingProblem = false;
      })
      .addCase(fetchChallengeProblem.rejected, (state, action) => {
        state.loadingProblem = false;
        state.error = action.payload || "Failed to fetch challenge problem";
      })

      // CRUD operations for tags and categories
      .addCase(createChallengeTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      .addCase(updateChallengeTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(tag => tag.id === action.payload.id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })
      .addCase(deleteChallengeTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(tag => tag.id !== action.payload);
        // Also remove from filters if selected
        state.filters.tagIds = state.filters.tagIds.filter(id => id !== action.payload);
      })
      .addCase(createChallengeCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateChallengeCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteChallengeCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        // Also remove from filters if selected
        state.filters.categoryIds = state.filters.categoryIds.filter(id => id !== action.payload);
      });
      
  }
});

export const { 
  setFilter, 
  resetFilters, 
  setCurrentParentId, 
  addBreadcrumb, 
  clearBreadcrumbsAfter,
  resetBreadcrumbs,
    setCurrentProblem
} = challengeSlice.actions;

export default challengeSlice.reducer;
