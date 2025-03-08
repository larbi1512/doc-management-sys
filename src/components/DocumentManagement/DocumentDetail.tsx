// components/DocumentManagement/DocumentDetail.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { Document, documents } from "../../data/documents";
import { formatFileSize, formatDate } from "../../utils/helpers";
import Button from "../ui/button/Button";

const DocumentDetail: React.FC = () => {
const { id } = useParams<{ id: string }>();
const selectedDocument = documents.find(d => d.id === Number(id));

if (!selectedDocument) {
    return <div className="p-4 text-red-500">Document not found</div>;
}

// Direct path to files in public/documents directory
const fileUrl = `/documents/${selectedDocument.fileName}`;

const handleDownload = () => {
    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = selectedDocument.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

    const getPreviewComponent = () => {
        if (selectedDocument.type === 'PDF') {
            return (
                <div className="w-full h-[700px]">
                    <embed
                        src={`${fileUrl}#view=FitH`}
                        type="application/pdf"
                        className="w-full h-full"
                        title={selectedDocument.name}
                    />
                    <p className="mt-2 text-sm text-center text-gray-500">
                        Can't see the preview? {' '}
                        <button
                            onClick={handleDownload}
                            className="text-blue-500 hover:underline"
                        >
                            Download the file
                        </button>
                    </p>
                </div>
            );
        }
    return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">
                Preview not available for {selectedDocument.type} files
            </p>
        </div>
    );
};

return (
    <div className="p-4 space-y-6">
        <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold">{selectedDocument.name}</h1>
            <Button
                onClick={handleDownload}
                variant="primary"
                size="sm"
            >
                Download ({formatFileSize(selectedDocument.size)})
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-lg font-semibold">Preview</h2>
                {getPreviewComponent()}
            </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-lg font-semibold">Details</h2>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-gray-500">Type</dt>
                                <dd className="font-medium">{selectedDocument.type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">File Name</dt>
                                <dd className="font-medium">{selectedDocument.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Upload Date</dt>
                                <dd className="font-medium">{formatDate(selectedDocument.dateAdded)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">File Size</dt>
                                <dd className="font-medium">{formatFileSize(selectedDocument.size)}</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-sm text-gray-500">Description</dt>
                                <dd className="font-medium text-gray-700">
                                    {selectedDocument.description || "No description available"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;