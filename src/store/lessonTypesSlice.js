import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { learnLessonTypesAPI } from '../apis/learnLessonTypes';

const initialState = {
  lessonTypes: [],
  loading: false,
  error: null
};

export const fetchLessonTypes = createAsyncThunk(
  'lessonTypes/fetchLessonTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await learnLessonTypesAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch lesson types');
    }
  }
);

export const fetchLessonTypeById = createAsyncThunk(
  'lessonTypes/fetchLessonTypeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await learnLessonTypesAPI.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch lesson type');
    }
  }
);

export const createLessonType = createAsyncThunk(
  'lessonTypes/createLessonType',
  async (lessonTypeData, { rejectWithValue, dispatch }) => {
    try {
      const response = await learnLessonTypesAPI.create(lessonTypeData);
      // Refresh lesson types after creating a new one
      dispatch(fetchLessonTypes());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create lesson type');
    }
  }
);

export const updateLessonType = createAsyncThunk(
  'lessonTypes/updateLessonType',
  async ({ id, lessonTypeData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await learnLessonTypesAPI.update(id, lessonTypeData);
      // Refresh lesson types after updating
      dispatch(fetchLessonTypes());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update lesson type');
    }
  }
);

export const deleteLessonType = createAsyncThunk(
  'lessonTypes/deleteLessonType',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await learnLessonTypesAPI.delete(id);
      // Refresh lesson types after deleting
      dispatch(fetchLessonTypes());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete lesson type');
    }
  }
);

const lessonTypesSlice = createSlice({
  name: 'lessonTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchLessonTypes
      .addCase(fetchLessonTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonTypes = action.payload;
      })
      .addCase(fetchLessonTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch lesson types';
      })
      // Handle fetchLessonTypeById
      .addCase(fetchLessonTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonTypeById.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific lesson type in the array
        const index = state.lessonTypes.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
          state.lessonTypes[index] = action.payload;
        } else {
          state.lessonTypes.push(action.payload);
        }
      })
      .addCase(fetchLessonTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch lesson type';
      });
  }
});

// Selectors
export const selectLessonTypes = state => state.lessonTypes.lessonTypes;
export const selectLessonTypesLoading = state => state.lessonTypes.loading;
export const selectLessonTypesError = state => state.lessonTypes.error;

export default lessonTypesSlice.reducer;
