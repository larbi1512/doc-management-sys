// // components/DocumentManagement/DocumentDetail.tsx
// import React from "react";
// import { useParams } from "react-router-dom";
// import { Document, documents } from "../../data/documents";
// import { formatFileSize, formatDate } from "../../utils/helpers";
// import Button from "../ui/button/Button";

// const DocumentDetail: React.FC = () => {
// const { id } = useParams<{ id: string }>();
// const selectedDocument = documents.find(d => d.id === Number(id));

// if (!selectedDocument) {
//     return <div className="p-4 text-red-500">Document not found</div>;
// }

// // Direct path to files in public/documents directory
// const fileUrl = `/documents/${selectedDocument.fileName}`;

// const handleDownload = () => {
//     // Create a temporary link for download
//     const link = document.createElement('a');
//     link.href = fileUrl;
//     link.download = selectedDocument.fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };

//     const getPreviewComponent = () => {
//         if (selectedDocument.type === 'PDF') {
//             return (
//                 <div className="w-full h-[700px]">
//                     <embed
//                         src={`${fileUrl}#view=FitH`}
//                         type="application/pdf"
//                         className="w-full h-full"
//                         title={selectedDocument.name}
//                     />
//                     <p className="mt-2 text-sm text-center text-gray-500">
//                         Can't see the preview? {' '}
//                         <button
//                             onClick={handleDownload}
//                             className="text-blue-500 hover:underline"
//                         >
//                             Download the file
//                         </button>
//                     </p>
//                 </div>
//             );
//         }
//     return (
//         <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//             <p className="text-gray-500">
//                 Preview not available for {selectedDocument.type} files
//             </p>
//         </div>
//     );
// };

// return (
//     <div className="p-4 space-y-6">
//         <div className="flex items-start justify-between">
//             <h1 className="text-2xl font-bold">{selectedDocument.name}</h1>
//             <Button
//                 onClick={handleDownload}
//                 variant="primary"
//                 size="sm"
//             >
//                 Download ({formatFileSize(selectedDocument.size)})
//             </Button>
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             <div className="p-6 bg-white rounded-lg shadow">
//                 <h2 className="mb-4 text-lg font-semibold">Preview</h2>
//                 {getPreviewComponent()}
//             </div>

//                 <div className="space-y-6">
//                     <div className="p-6 bg-white rounded-lg shadow">
//                         <h2 className="mb-4 text-lg font-semibold">Details</h2>
//                         <dl className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <dt className="text-sm text-gray-500">Type</dt>
//                                 <dd className="font-medium">{selectedDocument.type}</dd>
//                             </div>
//                             <div>
//                                 <dt className="text-sm text-gray-500">File Name</dt>
//                                 <dd className="font-medium">{selectedDocument.name}</dd>
//                             </div>
//                             <div>
//                                 <dt className="text-sm text-gray-500">Upload Date</dt>
//                                 <dd className="font-medium">{formatDate(selectedDocument.dateAdded)}</dd>
//                             </div>
//                             <div>
//                                 <dt className="text-sm text-gray-500">File Size</dt>
//                                 <dd className="font-medium">{formatFileSize(selectedDocument.size)}</dd>
//                             </div>
//                             <div className="col-span-2">
//                                 <dt className="text-sm text-gray-500">Description</dt>
//                                 <dd className="font-medium text-gray-700">
//                                     {selectedDocument.description || "No description available"}
//                                 </dd>
//                             </div>
//                         </dl>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// 
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, documents } from "../../data/documents";
import { formatFileSize, formatDate } from "../../utils/helpers";
import Button from "../ui/button/Button";
import { uploadFile, listFiles, downloadFile, viewDocument } from "../../services/Storage";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedItem, setSelectedItem] = useState<Document | null>(null);
  const [fileData, setFileData] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError("No document ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const parsedId = Number(id);
        const preDefinedDoc = documents.find(d => d.id === parsedId);

        if (preDefinedDoc) {
          setSelectedItem(preDefinedDoc);
          setIsLoading(false);
          return;
        }

        // Fetch the file content directly as a Blob using viewDocument
        const response = await viewDocument(id);
        const blob = response.data; // The response is already a Blob

        // Construct Document object with fallbacks (since viewDocument returns a Blob, not metadata)
        const fetchedDoc: Document = {
          id: isNaN(parsedId) ? Date.now() : parsedId,
          name: id, // Fallback to id as the name since we don't have metadata
          type: blob.type || (id.split('.').pop()?.toUpperCase() || 'Unknown'),
          author: '',
          dateAdded: new Date().toISOString(),
          size: blob.size || 0,
          lastViewDate: '',
          lastViewedBy: '',
          description: '',
          fileName: id,
          addedBy: '',
        };

        setSelectedItem(fetchedDoc);
        setFileData(blob); // Use the Blob directly for rendering
      } catch (err) {
        setError("Failed to load document");
        console.error("Error fetching document:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (error || !selectedItem) {
    return <div className="p-4 text-red-500">{error || "Document not found"}</div>;
  }

  const handleDownload = () => {
    if (fileData) {
      const url = window.URL.createObjectURL(fileData);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedItem.fileName || selectedItem.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else if (selectedItem.fileName) {
      // Fallback for predefined documents
      const link = document.createElement('a');
      link.href = `/documents/${selectedItem.fileName}`;
      link.download = selectedItem.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getPreviewComponent = () => {
    const isPdf =
      (fileData && fileData.type === 'application/pdf') ||
      selectedItem.fileName?.toLowerCase().endsWith('.pdf');

    if (isPdf && (fileData || selectedItem.fileName)) {
      const fileUrl = fileData
        ? window.URL.createObjectURL(fileData)
        : `/documents/${selectedItem.fileName}`;

      return (
        <div className="w-full h-[700px]">
          <embed
            src={`${fileUrl}#view=FitH`}
            type="application/pdf"
            className="w-full h-full"
            title={selectedItem.name}
          />
          <p className="mt-2 text-sm text-center text-gray-500">
            Can't see the preview?{' '}
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
          Preview not available for this file type
        </p>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">{selectedItem.name}</h1>
        <Button onClick={handleDownload} variant="primary" size="sm">
          Download ({formatFileSize(selectedItem.size || 0)})
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
                <dd className="font-medium">{selectedItem.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">File Name</dt>
                <dd className="font-medium">{selectedItem.fileName || selectedItem.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Upload Date</dt>
                <dd className="font-medium">
                  {selectedItem.dateAdded ? formatDate(selectedItem.dateAdded) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">File Size</dt>
                <dd className="font-medium">
                  {selectedItem.size ? formatFileSize(selectedItem.size) : '-'}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-gray-500">Description</dt>
                <dd className="font-medium text-gray-700">
                  {selectedItem.description || "No description available"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Added By</dt>
                <dd className="font-medium">{selectedItem.addedBy || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;