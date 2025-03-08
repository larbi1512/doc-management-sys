import { createAsyncThunk } from "@reduxjs/toolkit";
import { fakeLogin } from "../../services/authService";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const user = await fakeLogin(credentials.email, credentials.password);
            if (user) {
                localStorage.setItem("auth", JSON.stringify(user));
                return user.email;
            }
            return rejectWithValue("Invalid credentials");
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Login failed");
        }
    }
);