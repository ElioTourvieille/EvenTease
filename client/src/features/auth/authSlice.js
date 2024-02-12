import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from "./authService";

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    est_name: '',
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ''
}

export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }}
)

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await authService.logout();
    }
)

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (userData, thunkAPI) => {
        try {
            return await authService.updateUser(userData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }}
)

export const getUserCount = createAsyncThunk(
    'auth/getUserCount',
    async (thunkAPI) => {
        try {
            return await authService.getUserCount();
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isloading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(getUserCount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserCount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userCount = action.payload;
            })
            .addCase(getUserCount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
})

export const {reset} = authSlice.actions;

export default authSlice.reducer;