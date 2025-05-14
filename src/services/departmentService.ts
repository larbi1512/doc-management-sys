import axios from 'axios';

const API_BASE = 'http://localhost:8081'; 

export interface Department {
    id: number;
    name: string;
}

export const fetchDepartments = async (): Promise<Department[]> => {
    const response = await axios.get(`${API_BASE}/departments`);
    return response.data;
};

export const createDepartment = async (name: string): Promise<Department> => {
    const response = await axios.post(`${API_BASE}/departments`, { name });
    return response.data;
};

export const updateDepartment = async (id: number, name: string): Promise<Department> => {
    const response = await axios.put(`${API_BASE}/departments/${id}`, { name });
    return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/departments/${id}`);
};