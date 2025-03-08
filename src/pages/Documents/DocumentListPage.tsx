import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentList from "../../components/DocumentManagement/DocumentList";
import { Link } from "react-router-dom";
import { PlusIcon } from "../../icons";


export default function DocumentListPage() {
    return (
        <>
            <PageMeta
                title="Document Management Dashboard"
                description="Manage documents with search, pagination, sorting, and filters."
            />
            <div className="flex items-center justify-between">
                <PageBreadcrumb pageTitle="Document Management" />
                <Link
                    to="/documents/new"
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Document
                </Link>
            </div>
            <div className="space-y-6">
                <ComponentCard title="Document List">
                    <DocumentList />
                </ComponentCard>
            </div>
        </>
    );
}
