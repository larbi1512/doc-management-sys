// src/services/userService.ts
import axios from 'axios';

const API_BASE = 'https://dms-back.vercel.app/api';

interface User {
    id: string;
    name: string;
    email: string;
    position: string;
    status: string;
    department: string;
    hire_date: string;
    address: string;
    phone: string;
    // Add other fields as per your API
}

interface ApiResponse<T> {
    data: T;
    pagination: {
        total_records: number;
        total_pages: number;
        current_page: number;
        per_page: number;
    };
}

export const fetchUsers = async (
    page: number = 1,
    per_page: number = 10,
    sort_by: string = 'id',
    order: 'asc' | 'desc' = 'asc',
    filters: any[] = []
): Promise<ApiResponse<User[]>> => {
    const response = await axios.post(`${API_BASE}/users`, filters, {
        params: { page, per_page, sort_by, order }
    });
    return response.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`${API_BASE}/users/${id}`);
    return response.data.data[0]; // Adjust based on your API response structure
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_BASE}/users`, userData);
    return response.data;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_BASE}/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/users/${id}`);
};