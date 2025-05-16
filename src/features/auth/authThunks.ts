// features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { register } from "../../services/authService";
import api from "../../services/api";
import type { RegistrationData } from "../../type";


// features/auth/authThunks.ts
// features/auth/authThunks.ts
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            // Ensure token is removed before the request
            localStorage.removeItem('token');

            const response = await api.post('/auth/login', {
                username: credentials.email,
                password: credentials.password,
            });

            const token = response.data.token;
            if (!token) throw new Error('No token received');

            // Persist the token
            localStorage.setItem('token', token);

            // Decode and extract role
            const decoded = JSON.parse(atob(token.split('.')[1]));
            let role = decoded.role || decoded.authorities?.[0] || 'USER';
            role = role.replace('ROLE_', '').toUpperCase();

            return { token, email: credentials.email, role: role as 'USER' | 'ADMIN' };
        } catch (err: any) {
            console.error('Login failed:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Login failed due to an unexpected error');
        }
    }
  );
  
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData: RegistrationData, { rejectWithValue }) => {
        try {
            const response = await register(
                userData.username,
                userData.email,
                userData.password,
                userData.role
            );

            if (!response.data) {
                throw new Error("Registration succeeded but no confirmation received");
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || "Registration failed due to unexpected error";

            return rejectWithValue(errorMessage);
        }
    }
);

// features/auth/authThunks.ts
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // Clear token from localStorage
            localStorage.removeItem('token');
            return {};
        } catch (err: any) {
            console.error('Logout failed:', err.message);
            return rejectWithValue(err.message);
        }
    }
);

export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Decode the token
            const decoded = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000; // Current time in seconds
            if (decoded.exp < currentTime) {
                localStorage.removeItem('token'); // Remove expired token
                throw new Error('Token expired');
            }

            const email = decoded.sub; // Assuming 'sub' contains the email
            let role = decoded.role || decoded.authorities?.[0] || 'USER';
            role = role.replace('ROLE_', '').toUpperCase();

            return { token, email, role: role as 'USER' | 'ADMIN' };
        } catch (err: any) {
            console.error('Failed to restore session:', err.message);
            return rejectWithValue(err.message);
        }
    }
);