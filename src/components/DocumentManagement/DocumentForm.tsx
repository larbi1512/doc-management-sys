import React, { useState } from "react";
import { Document, documents as initialDocuments } from "../../data/documents";
import { useParams } from "react-router-dom";
import DropZone from "../form/form-elements/DropZone";
import { formatFileSize } from "../../utils/helpers";
import { useData } from "../../context/DataContext";


const DocumentForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addDocument, updateDocument, documents } = useData();
    const editingDoc = id ? documents.find(d => d.id === parseInt(id)) : null;

    const [formData, setFormData] = useState<Document>({
        id: editingDoc?.id || Date.now(),
        name: editingDoc?.name || "",
        type: editingDoc?.type || "PDF",
        fileName: editingDoc?.fileName || "",
        dateAdded: editingDoc?.dateAdded || new Date().toISOString().split('T')[0],
        size: editingDoc?.size || 0,
        addedBy: editingDoc?.addedBy || "Current User", // Default to current user
        lastViewDate: editingDoc?.lastViewDate || "",
        lastViewedBy: editingDoc?.lastViewedBy || "",
        author: editingDoc?.author || "",
        description: editingDoc?.description || ""
    });

    const handleFileUpload = (file: File) => {
        setFormData(prev => ({
            ...prev,
            name: file.name,
            type: (file.type.split('/')[1].toUpperCase() as "PDF" | "DOCX" | "XLSX" | "TXT" | "OTHER") || 'OTHER',
            size: file.size,
            url: URL.createObjectURL(file)
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingDoc) {
            updateDocument(formData);
        } else {
            addDocument({ ...formData, id: Date.now() });
        }

        window.location.href = '/documents';
    };

    return (
        <div className="max-w-3xl p-4 mx-auto">
            <h2 className="mb-4 text-2xl font-semibold">
                {editingDoc ? "Edit Document" : "Create Document"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6">
                    <DropZone
                        onFileUpload={handleFileUpload}
                        existingFile={editingDoc ? {
                            name: formData.name,
                            size: formData.size,
                            type: formData.type
                        } : undefined}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block mb-2 font-medium">Document Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Document Type</label>
                        <select
                            name="type"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="PDF">PDF</option>
                            <option value="DOCX">Word Document</option>
                            <option value="XLSX">Excel Spreadsheet</option>
                            <option value="TXT">Text File</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Author</label>
                        <input
                            type="text"
                            name="author"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">File Size</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-100 border rounded"
                            value={formatFileSize(formData.size)}
                            readOnly
                            disabled
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        className="w-full h-32 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter document description..."
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block mb-2 font-medium">Date Added</label>
                        <input
                            type="date"
                            name="dateAdded"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.dateAdded}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Added By</label>
                        <input
                            type="text"
                            name="addedBy"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.addedBy}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                >
                    {editingDoc ? "Update Document" : "Create Document"}
                </button>
            </form>
        </div>
    );
};

export default DocumentForm;