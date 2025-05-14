// features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { register } from "../../services/authService";
import axios from "axios";


const API_BASE = 'http://localhost:8081'; 

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE}/auth/login`, {
                username: credentials.email,
                password: credentials.password,
            });

            // Decode JWT payload
            const tokenPayload = JSON.parse(
                atob(response.data.token.split('.')[1])
            );

            // Extract role from token
            const role = tokenPayload.role?.replace('ROLE_', '') || 'USER';
            console.log('Decoded token payload:', tokenPayload); // Debugging line
            console.log('Role extracted from token:', role); // Debugging line
            return {
                token: response.data.token,
                email: credentials.email,
                role: role.toUpperCase()
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);
      

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData: { username: string; email: string; password: string ; role: string}, { rejectWithValue }) => {
        try {
            await register(userData.username, userData.email, userData.password, userData.role);
            return;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);