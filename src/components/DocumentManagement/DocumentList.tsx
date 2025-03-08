import React, { useState, useMemo } from "react";
import { documents, Document } from "../../data/documents";
import { paginate } from "../../utils/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { DocumentActions } from "../common/DocumentActions";
import { FilterDropdown } from "../common/FilterDropdown";
import { formatFileSize, formatDate } from "../../utils/helpers";
import { Link } from "react-router";
import { useData } from "../../context/DataContext";


const DocumentList: React.FC = () => {
    const { documents } = useData();
    const [searchQuery, setSearchQuery] = useState("");
    const[typeFilter, setTypeFilter] = useState("");
    const [addedByFilter, setAddedByFilter] = useState("");
    const [sortKey, setSortKey] = useState<keyof Document>("dateAdded");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Filter and sort logic
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.author.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = typeFilter ? doc.type === typeFilter : true;
            const matchesAddedBy = addedByFilter ? doc.addedBy === addedByFilter : true;

            return matchesSearch && matchesType && matchesAddedBy;
        });
    }, [searchQuery, typeFilter, addedByFilter]);

    const sortedDocuments = useMemo(() => {
        return [...filteredDocuments].sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredDocuments, sortKey, sortOrder]);

    // Filter options
    const typeOptions = useMemo(() => [
        { value: "", label: "All Types" },
        ...Array.from(new Set(documents.map(d => d.type))).map(type => ({
            value: type,
            label: type
        }))
    ], []);

    const addedByOptions = useMemo(() => [
        { value: "", label: "All Uploaders" },
        ...Array.from(new Set(documents.map(d => d.addedBy))).map(user => ({
            value: user,
            label: user
        }))
    ], []);

    // Pagination
    const paginatedDocuments = paginate(sortedDocuments, currentPage, pageSize);
    const totalPages = Math.ceil(sortedDocuments.length / pageSize);

    const handleSort = (key: keyof Document) => {
        if (sortKey === key) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    };

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="flex-1 p-2 border rounded"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <FilterDropdown
                    options={typeOptions}
                    value={typeFilter}
                    onChange={setTypeFilter}
                    placeholder="Document Type"
                />
                <FilterDropdown
                    options={addedByOptions}
                    value={addedByFilter}
                    onChange={setAddedByFilter}
                    placeholder="Uploaded By"
                />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader onClick={() => handleSort("name")}>
                                        Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                                    </TableCell>
                                    <TableCell isHeader onClick={() => handleSort("type")}>
                                        Type {sortKey === "type" && (sortOrder === "asc" ? "▲" : "▼")}
                                    </TableCell>
                                    <TableCell isHeader onClick={() => handleSort("dateAdded")}>
                                        Date Added {sortKey === "dateAdded" && (sortOrder === "asc" ? "▲" : "▼")}
                                    </TableCell>
                                    <TableCell isHeader onClick={() => handleSort("size")}>
                                        Size {sortKey === "size" && (sortOrder === "asc" ? "▲" : "▼")}
                                    </TableCell>
                                    <TableCell isHeader>Last Viewed</TableCell>
                                    <TableCell isHeader>Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {paginatedDocuments.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                to={`/documents/${doc.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {doc.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{doc.type}</TableCell>
                                        <TableCell>{formatDate(doc.dateAdded)}</TableCell>
                                        <TableCell>{formatFileSize(doc.size)}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {formatDate(doc.lastViewDate)}
                                                <div className="text-xs text-gray-500">
                                                    by {doc.lastViewedBy}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DocumentActions
                                                viewUrl={`/documents/${doc.id}`}
                                                editUrl={`/documents/edit/${doc.id}`}
                                                onDelete={() => console.log("Delete", doc.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DocumentList;
