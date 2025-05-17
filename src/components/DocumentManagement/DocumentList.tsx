// src/components/DocumentList.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { FilterDropdown } from "../common/FilterDropdown";
import { formatFileSize, formatDate } from "../../utils/helpers";
import { 
  fetchDocuments, 
  deleteDocument, 
  fetchCategories,
  Document 
} from "../../services/documentService";

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load documents and categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [docs, cats] = await Promise.all([
          fetchDocuments(searchQuery, categoryFilter || undefined),
          fetchCategories()
        ]);
        setDocuments(docs);
        setCategories(cats);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchQuery, categoryFilter]);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this document?")) {
      try {
        await deleteDocument(id);
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        setError("Delete failed");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <FilterDropdown
          options={[
            { value: "", label: "All Categories" },
            ...categories.map(cat => ({
              value: cat.id.toString(),
              label: cat.name
            }))
          ]}
          value={categoryFilter?.toString() || ""}
          onChange={(val) => setCategoryFilter(val ? parseInt(val) : null)}
        />
        <Link
          to="/documents/new"
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Add Document
        </Link>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Date Added</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <Link to={`/documents/${doc.id}`} className="text-blue-500">
                  {doc.title}
                </Link>
              </TableCell>
              <TableCell>{doc.category.name}</TableCell>
              <TableCell>
                <a 
                  href={doc.filePath} 
                  target="_blank"
                  className="text-blue-500"
                >
                  {doc.fileType} ({formatFileSize(doc.fileSize || 0)})
                </a>
              </TableCell>
              <TableCell>{formatDate(doc.createdAt)}</TableCell>
              <TableCell>
                <button
                  onClick={() => navigate(`/documents/edit/${doc.id}`)}
                  className="mr-2 text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentList;