// components/DepartmentManagement/DepartmentForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDepartment } from "../../services/departmentService";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useData } from "../../context/DataContext";


const DepartmentForm = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { refreshDepartments } = useData();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await refreshDepartments();
        setLoading(true);
        try {
            await createDepartment(name);
            navigate("/users");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create department");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Create New Department</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Department Name</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter department name"
                        required
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Department"}
                </Button>
            </form>
        </div>
    );
};

export default DepartmentForm;