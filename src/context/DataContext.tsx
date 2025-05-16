// context/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Document, documents as initialDocs } from "../data/documents";
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/userService";
import { User, Department, ApiResponse } from "../type";
import { fetchDepartments, createDepartment } from "../services/departmentService";

interface DataContextType {
    // User-related properties
    users: User[];
    loadingUsers: boolean;
    errorUsers: string | null;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    updateUser: (id: number, user: Partial<User>) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    refreshUsers: () => Promise<void>;

    // Document-related properties (unchanged)
    documents: Document[];
    addDocument: (doc: Document) => void;
    updateDocument: (doc: Document) => void;

    departments: Department[];
    loadingDepts: boolean;
    errorDepts: string | null;
    refreshDepartments: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // User state
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [errorUsers, setErrorUsers] = useState<string | null>(null);

    // Document state (unchanged)
    const [documents, setDocuments] = useState<Document[]>(initialDocs);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [errorDepts, setErrorDepts] = useState<string | null>(null);

    // User API integration
    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const users = await fetchUsers();
            setUsers(users);
            setErrorUsers(null);
        } catch (error) {
            setErrorUsers(error instanceof Error ? error.message : 'Failed to fetch users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadDepartments = async () => {
        setLoadingDepts(true);
        try {
            const data = await fetchDepartments();
            setDepartments(data);
            setErrorDepts(null);
        } catch (error) {
            setErrorDepts(error instanceof Error ? error.message : 'Failed to fetch departments');
        } finally {
            setLoadingDepts(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadDepartments();
    }, []);

    

    // Document functions (unchanged)
    const addDocument = (doc: Document) => setDocuments(prev => [...prev, doc]);
    const updateDocument = (doc: Document) => setDocuments(prev =>
        prev.map(d => d.id === doc.id ? doc : d)
    );

    return (
        <DataContext.Provider value={{
            // User-related values
            users,
            loadingUsers,
            errorUsers,
            addUser: async (userData) => {
                const newUser = await createUser(userData);
                setUsers(prev => [...prev, newUser]);
            },
            updateUser: async (id, userData) => {
                const updatedUser = await updateUser(id, userData);
                setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
            },
            deleteUser: async (id) => {
                await deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
            },
            refreshUsers: loadUsers,

            // Document-related values (unchanged)
            documents,
            addDocument,
            updateDocument,

            // Department-related values
            departments,
            loadingDepts,
            errorDepts,
            refreshDepartments: loadDepartments
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);