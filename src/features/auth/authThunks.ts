// features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { register } from "../../services/authService";
import api from "../../services/api";
import type { RegistrationData } from "../../type";


// features/auth/authThunks.ts
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', {
                username: credentials.email,
                password: credentials.password,
            });

            const token = response.data.token;
            if (!token) throw new Error('No token received');

            // persist the token
            localStorage.setItem('token', token);

            // decode and extract role…
            const decoded = JSON.parse(atob(token.split('.')[1]));
            let role = decoded.role || decoded.authorities?.[0] || 'USER';
            role = role.replace('ROLE_', '').toUpperCase();

            return { token, email: credentials.email, role: role as 'USER' | 'ADMIN' };
        } catch (err: any) {
            console.error('Login failed:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || err.message);
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