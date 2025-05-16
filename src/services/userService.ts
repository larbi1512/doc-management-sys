// src/services/userService.ts
import api from './api'; // Import the gateway-configured axios instance
import { User } from '../type'; // Assuming you have a central types file


export const fetchUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};
  
export const fetchUserById = async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data[0];
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const updateUser = async (id: string, userData: Partial<{ username: string; email: string; password: string; role: string }>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};

export const assignDepartmentToUser = async (userId: number, departmentId: number): Promise<void> => {
    await api.post(`/users/${userId}/departments`, { departmentId });
};

export const unassignDepartmentFromUser = async (userId: number, departmentId: number): Promise<void> => {
    await api.delete(`/users/${userId}/departments/${departmentId}`);
};

export const fetchUserDepartments = async (userId: number): Promise<{ userId: number; departmentId: number }[]> => {
    const response = await api.get(`/users/${userId}/departments`);
    return response.data;
};