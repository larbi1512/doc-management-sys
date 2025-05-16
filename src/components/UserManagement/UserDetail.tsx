// components/UserManagement/UserDetail.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import Badge from "../ui/badge/Badge";
import { Link } from "react-router-dom";

const UserDetail: React.FC = () => {
    const { id } = useParams();
    const { users } = useData();
    const user = users.find(u => u.id === Number(id));

    if (!user) return <div className="p-4">User not found</div>;

    return (
        <div className="max-w-4xl p-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Link
                    to={`/users/edit/${user.id}`}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-gray-500">Email</dt>
                            <dd className="font-medium">{user.email}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Role</dt>
                            <dd className="font-medium">{user.role}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Status</dt>
                            <dd>
                                <Badge
                                    color={
                                        user.status === "Active" ? "success" :
                                            user.status === "On Leave" ? "warning" : "danger"
                                    }
                                >
                                    {user.status}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-4 text-xl font-semibold">Additional Information</h2>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-gray-500">Department</dt>
                            <dd className="font-medium">{user.department}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Phone</dt>
                            <dd className="font-medium">{user.phone}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;