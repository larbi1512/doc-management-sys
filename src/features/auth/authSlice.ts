import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, restoreSession } from "./authThunks";

// features/auth/authSlice.ts
const initialState = {
    isAuthenticated: false,
    user: null as { 
        email: string;
        role: string;
     } | null,
    token: null as string | null,
    isLoading: false,
    isInitializing: true,
    error: null as string | null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login payload:', action.payload); 
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = { 
                    email: action.payload.email,
                    role: action.payload.role,
                };
                console.log('Stored user role:', state.user.role); 
            })
            .addCase(loginUser.rejected, (state: { isLoading: boolean; error: string; }, action: { payload: string; }) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state: { isLoading: boolean; error: null; }) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state: { isLoading: boolean; }) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state: { isLoading: boolean; error: string; }, action: { payload: string; }) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.isLoading = false;
                state.error = null;
            })
        .addCase(logoutUser.rejected, (state, action) => {
            state.error = action.payload as string;
        })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.isInitializing = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = {
                    email: action.payload.email,
                    role: action.payload.role,
                };
            })
            .addCase(restoreSession.rejected, (state) => {
                state.isInitializing = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            });
    },
});

export default authSlice.reducer;