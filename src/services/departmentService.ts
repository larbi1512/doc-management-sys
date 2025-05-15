import api from './api';

export interface Department {
    id: number;
    name: string;
}



export const fetchDepartments = async (): Promise<Department[]> => {
    const response = await api.get('/departments'); // Gateway route: /departments/**
    return response.data;
};

export const createDepartment = async (name: string): Promise<Department> => {
    const response = await api.post('/departments', { name }); // Gateway route: /departments/**
    return response.data;
  };

export const updateDepartment = async (id: number, name: string): Promise<Department> => {
    const response = await api.put(`/departments/${id}`, { name });
    return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
};