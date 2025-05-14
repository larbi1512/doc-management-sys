// services/authService.ts
import axios from 'axios';


const API_BASE = 'http://localhost:8081'; 

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE}/auth/login`, {
        username: email,
        password,
    });
    return {
        token: response.data.token,
        role: response.data.role,
        id: response.data.id,
    }
};

export const register = async (username: string, email: string, password: string, role: string) => {
    const response = await axios.post(`${API_BASE}/auth/register`, {
        username,
        email,
        password,
        role,
    });
    return response.data;
  };