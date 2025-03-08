// context/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../data/users";
import { Document, documents as initialDocs } from "../data/documents";
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/userService";

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
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // User state
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [errorUsers, setErrorUsers] = useState<string | null>(null);

    // Document state (unchanged)
    const [documents, setDocuments] = useState<Document[]>(initialDocs);

    // User API integration
    const fetchUsersData = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetchUsers();
            setUsers(response.data as User[]);
            setErrorUsers(null);
        } catch (error) {
            setErrorUsers(error instanceof Error ? error.message : 'Failed to fetch users');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, []);

    const handleAddUser = async (userData: Omit<User, 'id'>) => {
        setLoadingUsers(true);
        try {
            const newUser = await createUser(userData);
            setUsers(prev => [...prev, newUser]);
        } catch (error) {
            setErrorUsers(error instanceof Error ? error.message : 'Failed to add user');
            throw error;
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleUpdateUser = async (id: number, userData: Partial<User>) => {
        setLoadingUsers(true);
        try {
            const updatedUser = await updateUser(id.toString(), userData);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedUser, id: u.id } : u));
        } catch (error) {
            setErrorUsers(error instanceof Error ? error.message : 'Failed to update user');
            throw error;
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        setLoadingUsers(true);
        try {
            await deleteUser(id.toString());
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            setErrorUsers(error instanceof Error ? error.message : 'Failed to delete user');
            throw error;
        } finally {
            setLoadingUsers(false);
        }
    };

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
            addUser: handleAddUser,
            updateUser: handleUpdateUser,
            deleteUser: handleDeleteUser,
            refreshUsers: fetchUsersData,

            // Document-related values (unchanged)
            documents,
            addDocument,
            updateDocument
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);