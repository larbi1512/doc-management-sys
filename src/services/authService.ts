// services/authService.ts
import api from './api';

export const login = async (email: string, password: string) => {
    const response = await api.post(`/auth/login`, {
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
    const response = await api.post(`/auth/register`, {
        username,
        email,
        password,
        role,
    });
    return response.data;
  };