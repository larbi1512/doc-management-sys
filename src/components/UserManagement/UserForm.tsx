// components/UserManagement/UserForm.tsx
import React, { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";

const UserForm: React.FC = () => {
    const { users, addUser, updateUser, departments } = useData();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "USER",
        departmentIds: [] as number[]
    });

    useEffect(() => {
        if (id) {
            const existingUser = users.find(u => u.id === Number(id));
            if (existingUser) {
                setFormData({
                    username: existingUser.username,
                    email: existingUser.email,
                    password: "", // Password not retrieved for security
                    role: existingUser.role,
                    departmentIds: existingUser.departmentIds || []
                });
            }
        }
    }, [id, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userPayload = {
                ...formData,
                departmentIds: formData.departmentIds
            };

            if (id) {
                await updateUser(Number(id), userPayload);
            } else {
                await addUser(userPayload);
            }
            navigate("/users");
        } catch (error) {
            console.error("Operation failed:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions);
        const values = options.map(option => Number(option.value));
        setFormData(prev => ({
            ...prev,
            departmentIds: values
        }));
    };

    return (
        <div className="max-w-2xl p-4 mx-auto">
            <h2 className="mb-6 text-2xl font-bold">
                {id ? "Edit User" : "Create New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block mb-2 font-medium">Username *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Password {!id && '*'}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required={!id}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Role *</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-medium">Departments</label>
                        <select
                            multiple
                            name="departmentIds"
                            value={formData.departmentIds.map(String)}
                            onChange={handleDepartmentChange}
                            className="w-full h-32 p-2 border rounded"
                        >
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    {id ? "Update User" : "Create User"}
                </button>
            </form>
        </div>
    );
};

export default UserForm;