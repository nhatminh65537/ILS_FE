import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scoreboardAPI } from '../apis/scoreboard';

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalCount: 0
};

// Async thunks
export const fetchScoreboard = createAsyncThunk(
  'scoreboard/fetchScoreboard',
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      return await scoreboardAPI.getScoreboard(page, pageSize);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the slice
const scoreboardSlice = createSlice({
  name: 'scoreboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScoreboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScoreboard.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.items || [];
        state.currentPage = action.payload.page || 1;
        state.pageSize = action.payload.pageSize || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchScoreboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch scoreboard";
      });
  }
});

export default scoreboardSlice.reducer;
