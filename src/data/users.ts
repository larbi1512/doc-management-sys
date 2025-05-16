// src/data/users.ts

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    hireDate: string;
    department: string;
    position: string;
    status: 'On Leave' | 'Active' | 'Inactive';
    lastLogin: string;
    docsUploaded: number;
    address: string;
    phoneNumber: string;
}

export const users: User[] = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "Admin",
        hireDate: "2020-02-15",
        department: "Human Resources",
        position: "HR Manager",
        status: "Active",
        lastLogin: "2023-01-01",
        docsUploaded: 10,
        address: "123 Main St, Springfield, IL",
        phoneNumber: "123-456-7890",

    },
    {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        role: "User",
        hireDate: "2022-08-01",
        department: "Engineering",
        position: "Software Engineer",
        status: "Active",
        lastLogin: "2023-01-05",
        docsUploaded: 5,
        address: "456 Elm St, Springfield, IL",
        phoneNumber: "234-567-8901",

    },

    {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        role: "Editor",
        hireDate: "2023-01-10",
        department: "Marketing",
        position: "Content Writer",
        status: "On Leave",
        lastLogin: "2023-01-15",
        docsUploaded: 15,
        address: "789 Oak St, Springfield, IL",
        phoneNumber: "345-678-9012",
    },
    {
        id: 4,
        name: "David Lee",
        email: "david@gmail.com",
        role: "Admin",
        hireDate: "2021-05-20",
        department: "Engineering",
        position: "Engineering Manager",
        status: "Inactive",
        lastLogin: "2023-01-20",
        docsUploaded: 20,
        address: "101 Pine St, Springfield, IL",
        phoneNumber: "456-789-0123",
    },
];
