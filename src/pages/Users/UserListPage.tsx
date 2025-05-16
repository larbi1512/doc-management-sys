import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserList from "../../components/UserManagement/UserList";

export default function UserListPage() {
    return (
        <>
            <PageMeta
                title="User Management Dashboard"
                description="Manage users with search, pagination, sorting, and filters."
            />
            <PageBreadcrumb pageTitle="User Management" />
            <div className="space-y-6">
                <ComponentCard title="User List">
                    <UserList />
                </ComponentCard>
            </div>
        </>
    );
}
