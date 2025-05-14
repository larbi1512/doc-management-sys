// src/types.ts

// User Type
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    department: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    hire_date?: string;
    address?: string;
    phone?: string;
}

// Department Type
export interface Department {
    id: number;
    name: string;
}

// API Response Structure
export interface ApiResponse<T> {
    data: T;
    pagination?: {
        total_records: number;
        total_pages: number;
        current_page: number;
        per_page: number;
    };
}

// Auth State Type
export interface AuthState {
    isAuthenticated: boolean;
    user: {
        email: string;
        role: 'USER' | 'ADMIN';
    } | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

// Form Data Types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
}

export interface DepartmentFormData {
    name: string;
}

// Error Response Type
export interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

// Filter Option Type
export interface FilterOption {
    value: string;
    label: string;
}

// Action Icons Props
export interface ActionIconsProps {
    editUrl: string;
    onDelete: () => void;
    className?: string;
}

// Pagination Controls Props
export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
  }