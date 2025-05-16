// import React, { useState } from "react";
// import { Document, documents as initialDocuments } from "../../data/documents";
// import { useParams } from "react-router-dom";
// import DropZone from "../form/form-elements/DropZone";
// import { formatFileSize } from "../../utils/helpers";
// import { useData } from "../../context/DataContext";
// import { uploadFile } from "../../services/Storage"; 



// const DocumentForm: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const { addDocument, updateDocument, documents } = useData();
//     const editingDoc = id ? documents.find(d => d.id === parseInt(id)) : null;

//     const [formData, setFormData] = useState<Document>({
//         id: editingDoc?.id || Date.now(),
//         name: editingDoc?.name || "",
//         type: editingDoc?.type || "PDF",
//         fileName: editingDoc?.fileName || "",
//         dateAdded: editingDoc?.dateAdded || new Date().toISOString().split('T')[0],
//         size: editingDoc?.size || 0,
//         addedBy: editingDoc?.addedBy || "Current User", // Default to current user
//         lastViewDate: editingDoc?.lastViewDate || "",
//         lastViewedBy: editingDoc?.lastViewedBy || "",
//         author: editingDoc?.author || "",
//         description: editingDoc?.description || ""
//     });

//     // const handleFileUpload = (file: File) => {
//     //     setFormData(prev => ({
//     //         ...prev,
//     //         name: file.name,
//     //         type: (file.type.split('/')[1].toUpperCase() as "PDF" | "DOCX" | "XLSX" | "TXT" | "OTHER") || 'OTHER',
//     //         size: file.size,
//     //         url: URL.createObjectURL(file)
//     //     }));
//     // };

//     const handleFileUpload = async (file: File) => {
//         const form = new FormData();
//         form.append('file', file);

//         try {
//             const response = await uploadFile(form);

//             // If your backend returns additional metadata like S3 URL or filename:
//             const uploadedFileUrl = response.data.url || URL.createObjectURL(file); // fallback for local preview

//             setFormData(prev => ({
//                 ...prev,
//                 name: file.name,
//                 type: (file.type.split('/')[1]?.toUpperCase() as Document['type']) || 'OTHER',
//                 size: file.size,
//                 fileName: file.name,
//                 url: uploadedFileUrl,
//             }));

//             console.log("✅ File uploaded successfully:", response.data);
//         } catch (error) {
//             console.error("❌ Error uploading file:", error);
//             alert("File upload failed. Please try again.");
//         }
//     };


//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//     ) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (editingDoc) {
//             updateDocument(formData);
//         } else {
//             addDocument({ ...formData, id: Date.now() });
//         }

//         window.location.href = '/documents';
//     };

//     return (
//         <div className="max-w-3xl p-4 mx-auto">
//             <h2 className="mb-4 text-2xl font-semibold">
//                 {editingDoc ? "Edit Document" : "Create Document"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="mb-6">
//                     <DropZone
//                         onFileUpload={handleFileUpload}
//                         existingFile={editingDoc ? {
//                             name: formData.name,
//                             size: formData.size,
//                             type: formData.type
//                         } : undefined}
//                     />
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <div>
//                         <label className="block mb-2 font-medium">Document Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-medium">Document Type</label>
//                         <select
//                             name="type"
//                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                             value={formData.type}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="PDF">PDF</option>
//                             <option value="DOCX">Word Document</option>
//                             <option value="XLSX">Excel Spreadsheet</option>
//                             <option value="TXT">Text File</option>
//                             <option value="OTHER">Other</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-medium">Author</label>
//                         <input
//                             type="text"
//                             name="author"
//                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                             value={formData.author}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-medium">File Size</label>
//                         <input
//                             type="text"
//                             className="w-full p-2 bg-gray-100 border rounded"
//                             value={formatFileSize(formData.size)}
//                             readOnly
//                             disabled
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block mb-2 font-medium">Description</label>
//                     <textarea
//                         name="description"
//                         className="w-full h-32 p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Enter document description..."
//                     />
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <div>
//                         <label className="block mb-2 font-medium">Date Added</label>
//                         <input
//                             type="date"
//                             name="dateAdded"
//                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                             value={formData.dateAdded}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-medium">Added By</label>
//                         <input
//                             type="text"
//                             name="addedBy"
//                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                             value={formData.addedBy}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     className="px-6 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
//                 >
//                     {editingDoc ? "Update Document" : "Create Document"}
//                 </button>
//             </form>
//         </div>
//     );
// };
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import DropZone from "../form/form-elements/DropZone";
import { formatFileSize } from "../../utils/helpers";
import { uploadFile } from "../../services/Storage";

// Define the form data type for S3 files (simplified, since we're not using pre-defined documents)
type FormData = {
  name: string;
  type: string;
  fileName: string;
  size: number;
  url?: string; // S3 URL
  author: string;
  description: string;
  dateAdded: string;
  addedBy: string;
};

const DocumentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Use for navigation

  // Initialize form data for S3 file upload
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "PDF",
    fileName: "",
    size: 0,
    url: "",
    author: "",
    description: "",
    dateAdded: new Date().toISOString().split('T')[0],
    addedBy: "Current User", // Replace with actual user data if available
  });

  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    try {
      const response = await uploadFile(form); // Expecting a string URL from backend
      const uploadedFileUrl = response.data; // S3 URL

      setFormData(prev => ({
        ...prev,
        name: file.name,
        type: (file.type.split('/')[1]?.toUpperCase() as FormData['type']) || 'OTHER',
        size: file.size,
        fileName: file.name,
        url: uploadedFileUrl,
      }));

      console.log("✅ File uploaded successfully. URL:", uploadedFileUrl);
    } catch (error: any) {
      console.error("❌ Error uploading file:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in and try again.");
        // Optionally redirect to login page
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError("File upload failed. Please try again.");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure a file has been uploaded
    if (!formData.url) {
      setError("Please upload a file before submitting.");
      return;
    }

    // Since we're only managing S3 files, no need to add/update in a local context
    // The file is already uploaded to S3, so just navigate to the list
    navigate('/documents'); // Use navigate instead of window.location.href
  };

  return (
    <div className="max-w-3xl p-4 mx-auto">
      <h2 className="mb-4 text-2xl font-semibold">
        Create File
      </h2>
      {error && (
        <div className="mb-4 p-2 text-red-500 bg-red-100 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <DropZone
            onFileUpload={handleFileUpload}
            existingFile={formData.fileName ? {
              name: formData.name,
              size: formData.size,
              type: formData.type,
            } : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-medium">File Name</label>
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
            <label className="block mb-2 font-medium">File Type</label>
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
            placeholder="Enter file description..."
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
          Create File
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;