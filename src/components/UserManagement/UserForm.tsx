// components/UserManagement/UserForm.tsx
import React, { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";

const UserForm: React.FC = () => {
    const { users, addUser, updateUser } = useData();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        status: "Active",
        department: "",
        phone: ""
    });

    useEffect(() => {
        if (id) {
            const existingUser = users.find(u => u.id === Number(id));
            if (existingUser) {
                setFormData({
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    status: existingUser.status,
                    department: existingUser.department,
                    phone: existingUser.phone
                });
            }
        }
    }, [id, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await updateUser(Number(id), formData);
            } else {
                await addUser(formData);
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

    return (
        <div className="max-w-2xl p-4 mx-auto">
            <h2 className="mb-6 text-2xl font-bold">
                {id ? "Edit User" : "Create New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block mb-2 font-medium">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                        <label className="block mb-2 font-medium">Role *</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
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