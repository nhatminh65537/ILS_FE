import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../apis/auth';
import { initializeUserData, clearUserData } from './myUserSlice';

// Check if token exists in localStorage to determine initial authentication state
const getInitialAuthState = () => {
  const token = localStorage.getItem('ILS_AUTH_TOKEN');
//   if ()
  return {
    isAuthenticated: !!token,
    loading: false,
    error: null,
  };
};

const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, { rejectWithValue, dispatch }) => {
        try {
            const responseData = await authAPI.login(username, password);  
            
            // Initialize user data after successful login
            dispatch(initializeUserData());
                      
            return responseData; 
        } catch (error) {
            return rejectWithValue(error.message || "error"); 
        }
    }
);

const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, password, email }, { rejectWithValue, dispatch }) => {
        try {
            const responseData = await authAPI.register(username, password, email);
            dispatch(loginUser({ username, password })); 
            return responseData; 
        } catch (error) {
            return rejectWithValue("error"); 
        }
    }
);

const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch }) => {
        try {
            await authAPI.logout();
            dispatch(clearUserData());
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
);

const changePassword = createAsyncThunk(
    'auth/changePassword',
    async ({ oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const responseData = await authAPI.changePassword(oldPassword, newPassword);
            return responseData; 
        } catch (error) {
            return rejectWithValue(error.message || "error"); 
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialAuthState(),
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = authSlice.actions;
export { loginUser, registerUser, logoutUser, changePassword };
export default authSlice.reducer;