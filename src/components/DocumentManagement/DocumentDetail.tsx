// // src/components/DocumentDetail.tsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { fetchDocumentById , translateDocumentTitle} from "../../services/documentService";
// import { formatFileSize, formatDate } from "../../utils/helpers";

// const DocumentDetail = () => {
//   const { id } = useParams();
//   const [document, setDocument] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);

//   // Load document
//   useEffect(() => {
//     const loadDocument = async () => {
//       try {
//         if (!id) throw new Error("No ID provided");
//         const doc = await fetchDocumentById(parseInt(id));
//         setDocument(doc);
//       } catch (err) {
//         setError("Failed to load document");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadDocument();
//   }, [id]);

  
//   // Handle translation
//   const handleTranslateTitle = async () => {
//     try {
//       if (!id) throw new Error("No ID provided");
//       const translatedText = await translateDocumentTitle(parseInt(id), "en", "es");
//       setTranslatedTitle(translatedText);
//     } catch (err) {
//       setError("Failed to translate title");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;
//   if (!document) return <div>Document not found</div>;
  

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">{document.title}</h1>
//       {translatedTitle && <p className="mt-2">Translated Title (Spanish): {translatedTitle}</p>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//         <div>
//           <h2 className="font-semibold">Details</h2>
//           <p>Category: {document.category.name}</p>
//           <p>File Type: {document.fileType || "Unknown"}</p>
//           <p>Size: {formatFileSize(document.fileSize || 0)}</p>
//           <p>Created: {formatDate(document.createdAt)}</p>
//         </div>
//         <div>
//           <a
//             href={document.filePath}
//             target="_blank"
//             className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Download File
//           </a>
//           <button
//             onClick={handleTranslateTitle}
//             className="ml-2 inline-block px-4 py-2 bg-green-500 text-white rounded"
//           >
//             Translate Title to Spanish
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default DocumentDetail;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { fetchDocumentById, translateDocumentTitle, viewDocument } from "../../services/documentService";
// import { formatFileSize, formatDate } from "../../utils/helpers";

// const DocumentDetail = () => {
//   const { id } = useParams();
//   const [document, setDocument] = useState<any>(null);
//   const [fileBlob, setFileBlob] = useState<Blob | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);

//   // Load document and fetch file
//   useEffect(() => {
//     const fetchDocument = async () => {
//       if (!id) {
//         setError("No document ID provided");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const parsedId = parseInt(id);
//         const doc = await fetchDocumentById(parsedId);
//         setDocument(doc);

//         // Fetch file content as blob using file name from filePath
//         const fileName = doc.filePath.split('/').pop();
//         if (!fileName) throw new Error("Invalid file path");
//         const response = await viewDocument(fileName);
//         const blob = response.data;
//         setFileBlob(blob);
//       } catch (err: any) {
//         setError(`Failed to load document: ${err.response?.status === 403 ? "Access denied to file" : err.message}`);
//         console.error("Error fetching document:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDocument();
//   }, [id]);

//   // Handle translation
//   const handleTranslateTitle = async () => {
//     try {
//       if (!id) throw new Error("No ID provided");
//       const translatedText = await translateDocumentTitle(parseInt(id), "en", "es");
//       setTranslatedTitle(translatedText);
//     } catch (err) {
//       setError("Failed to translate title");
//     }
//   };

//   // Handle file download
//   const handleDownload = () => {
//     if (!fileBlob || !document) return;
//     const url = window.URL.createObjectURL(fileBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = document.filePath.split('/').pop() || document.title || "document.pdf";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   // Render PDF preview
//   const getPreviewComponent = () => {
//     const isPdf =
//       (fileBlob && fileBlob.type === "application/pdf") ||
//       document?.filePath?.toLowerCase().endsWith(".pdf");

//     if (isPdf && fileBlob) {
//       const fileUrl = window.URL.createObjectURL(fileBlob);

//       return (
//         <div className="w-full h-[700px]">
//           <embed
//             src={`${fileUrl}#view=FitH`}
//             type="application/pdf"
//             className="w-full h-full"
//             title={document.title}
//           />
//           <p className="mt-2 text-sm text-center text-gray-500">
//             Can't see the preview?{' '}
//             <button
//               onClick={handleDownload}
//               className="text-blue-500 hover:underline"
//             >
//               Download the file
//             </button>
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//         <p className="text-gray-500">Preview not available for this file type</p>
//       </div>
//     );
//   };

//   if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
//   if (error || !document) return <div className="p-4 text-red-500">{error || "Document not found"}</div>;

//   return (
//     <div className="p-4 space-y-6">
//       <div className="flex items-start justify-between">
//         <h1 className="text-2xl font-bold">{document.title}</h1>
//         <button
//           onClick={handleDownload}
//           className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Download ({formatFileSize(document.fileSize || 0)})
//         </button>
//       </div>

//       {translatedTitle && (
//         <p className="mt-2">Translated Title (Spanish): {translatedTitle}</p>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="p-6 bg-white rounded-lg shadow">
//           <h2 className="mb-4 text-lg font-semibold">Preview</h2>
//           {getPreviewComponent()}
//         </div>

//         <div className="space-y-6">
//           <div className="p-6 bg-white rounded-lg shadow">
//             <h2 className="mb-4 text-lg font-semibold">Details</h2>
//             <dl className="grid grid-cols-2 gap-4">
//               <div>
//                 <dt className="text-sm text-gray-500">Category</dt>
//                 <dd className="font-medium">{document.category.name}</dd>
//               </div>
//               <div>
//                 <dt className="text-sm text-gray-500">File Name</dt>
//                 <dd className="font-medium">{document.filePath.split('/').pop() || document.title}</dd>
//               </div>
//               <div>
//                 <dt className="text-sm text-gray-500">File Type</dt>
//                 <dd className="font-medium">{document.fileType || "Unknown"}</dd>
//               </div>
//               <div>
//                 <dt className="text-sm text-gray-500">File Size</dt>
//                 <dd className="font-medium">{formatFileSize(document.fileSize || 0)}</dd>
//               </div>
//               <div>
//                 <dt className="text-sm text-gray-500">Created</dt>
//                 <dd className="font-medium">{formatDate(document.createdAt)}</dd>
//               </div>
//             </dl>
//           </div>

//           <div>
//             <button
//               onClick={handleTranslateTitle}
//               className="inline-block px-4 py-2 bg-green-500 text-white rounded"
//             >
//               Translate Title to Spanish
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentDetail;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchDocumentById, translateDocumentTitle, viewDocument, downloadFile } from "../../services/documentService";
import { formatFileSize, formatDate } from "../../utils/helpers";

const DocumentDetail = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState<any>(null);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);

  // Load document and fetch file
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError("No document ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const parsedId = parseInt(id);
        const fetchedDoc = await fetchDocumentById(parsedId);
        setDoc(fetchedDoc);

        // Fetch file content as blob using file name from filePath
        const fileName = fetchedDoc.filePath.split('/').pop();
        if (!fileName) throw new Error("Invalid file path");
        const response = await viewDocument(fileName);
        const blob = response.data;
        setFileBlob(blob);
      } catch (err: any) {
        setError(`Failed to load document: ${err.response?.status === 403 ? "Access denied to file" : err.message}`);
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  // Handle translation
  const handleTranslateTitle = async () => {
    try {
      if (!id) throw new Error("No ID provided");
      const translatedText = await translateDocumentTitle(parseInt(id), "en", "es");
      setTranslatedTitle(translatedText);
    } catch (err) {
      setError("Failed to translate title");
    }
  };

  // Handle file download
  const handleDownload = async () => {
    if (!doc) return;
    const fileName = doc.filePath.split('/').pop() || doc.title || "document.pdf";
    
    try {
      // Try downloading using downloadFile service
      const response = await downloadFile(fileName);
      const blob = response.data;
      console.log("Download blob:", blob);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback to fileBlob if available
      if (fileBlob) {
        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Fallback to direct URL
        const link = document.createElement('a');
        link.href = `/documents/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Render PDF preview
  const getPreviewComponent = () => {
    const isPdf =
      (fileBlob && fileBlob.type === "application/pdf") ||
      doc?.filePath?.toLowerCase().endsWith(".pdf");

    if (isPdf && fileBlob) {
      const fileUrl = window.URL.createObjectURL(fileBlob);

      return (
        <div className="w-full h-[700px]">
          <embed
            src={`${fileUrl}#view=FitH`}
            type="application/pdf"
            className="w-full h-full"
            title={doc.title}
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
        <p className="text-gray-500">Preview not available for this file type</p>
      </div>
    );
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error || !doc) return <div className="p-4 text-red-500">{error || "Document not found"}</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        <button
          onClick={handleDownload}
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download ({formatFileSize(doc.fileSize || 0)})
        </button>
      </div>

      {translatedTitle && (
        <p className="mt-2">Translated Title (Spanish): {translatedTitle}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Preview</h2>
          {getPreviewComponent()}
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="font-medium">{doc.category.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">File Name</dt>
                <dd className="font-medium">{doc.filePath.split('/').pop() || doc.title}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">File Type</dt>
                <dd className="font-medium">{doc.fileType || "Unknown"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">File Size</dt>
                <dd className="font-medium">{formatFileSize(doc.fileSize || 0)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="font-medium">{formatDate(doc.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div>
            <button
              onClick={handleTranslateTitle}
              className="inline-block px-4 py-2 bg-green-500 text-white rounded"
            >
              Translate Title to Spanish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;