import React, { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { FilterDropdown } from "../common/FilterDropdown";
import { ActionIcons } from "../common/ActionIcons";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon } from "../../icons";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { User, Department } from "../../type";

const UserList: React.FC = () => {
    const {
        users,
        loadingUsers,
        errorUsers,
        deleteUser,
        refreshUsers,
        departments,
        refreshDepartments
    } = useData();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<keyof User>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const pageSize = 10;

    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    const departmentOptions = departments.map(dept => ({
        value: dept.id.toString(), // Use ID for filtering
        label: dept.name
    }));

    const filteredUsers = users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            user.username?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower);

        const matchesDepartment = departmentFilter
            ? Array.isArray(user.departmentIds) && user.departmentIds.includes(Number(departmentFilter))
            : true;

        return matchesSearch && matchesDepartment;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortBy]?.toString().toLowerCase() || "";
        const bValue = b[sortBy]?.toString().toLowerCase() || "";
        return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const handleSort = (key: keyof User) => {
        if (sortBy === key) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    const handleRowClick = (userId: number, e: React.MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.action-icon')) {
            navigate(`/users/${userId}`);
        }
    };

    const handleDelete = async (userId: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                setCurrentPage(prev => Math.min(prev, totalPages - 1));
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };

    const getDepartmentNames = (departmentIds: number[]): string => {
        if (!departmentIds || departmentIds.length === 0) return "None";
        return departmentIds
            .map(id => departments.find(d => d.id === id)?.name)
            .filter(Boolean)
            .join(", ");
    };

    useEffect(() => {
        refreshUsers();
        refreshDepartments();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, departmentFilter]);

    if (loadingUsers) return <div className="p-4">Loading users...</div>;
    if (errorUsers) return <div className="p-4 text-red-500">Error: {errorUsers}</div>;

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="p-2 border rounded md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FilterDropdown
                        options={departmentOptions}
                        placeholder="All Departments"
                        value={departmentFilter}
                        onChange={setDepartmentFilter}
                    />
                </div>
                {currentUser?.role === "ADMIN" && (
                    <div className="flex gap-2">
                        <Link
                            to="/departments/new"
                            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Department
                        </Link>
                        <Link
                            to="/users/new"
                            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add User
                        </Link>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {["name", "email", "role"].map((header) => (
                                <TableCell
                                    key={header}
                                    isHeader
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort(header as keyof User)}
                                >
                                    <div className="flex items-center gap-1">
                                        {header.charAt(0).toUpperCase() + header.slice(1)}
                                        {sortBy === header && (
                                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </TableCell>
                            ))}
                            <TableCell isHeader>Departments</TableCell>
                            <TableCell isHeader>Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow
                                key={user.id}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={(e) => handleRowClick(user.id, e)}
                            >
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge color="primary">{user.role}</Badge>
                                </TableCell>
                                <TableCell>{getDepartmentNames(user.departmentIds)}</TableCell>
                                <TableCell>
                                    <ActionIcons
                                        className="action-icon"
                                        editUrl={`/users/edit/${user.id}`}
                                        onDelete={() => handleDelete(user.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserList;