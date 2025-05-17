// // src/components/DocumentForm.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { 
//   fetchDocumentById, 
//   createDocument, 
//   updateDocument, 
//   fetchCategories 
// } from "../../services/documentService";

// const DocumentForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     fileUrl: "",
//     categoryId: 1,
//     departmentId: 1,
//   });
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Load data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const cats = await fetchCategories();
//         setCategories(cats);
//         if (id) {
//           const doc = await fetchDocumentById(parseInt(id));
//           setFormData({
//             title: doc.title,
//             fileUrl: doc.filePath,
//             categoryId: doc.category.id,
//             departmentId: doc.department.id,
//           });
//         }
//       } catch (err) {
//         setError("Failed to load data");
//       }
//     };
//     loadData();
//   }, [id]);

//   // Submit handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (id) {
//         await updateDocument(parseInt(id), formData);
//       } else {
//         await createDocument(formData);
//       }
//       navigate("/documents");
//     } catch (err) {
//       setError("Failed to save");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">
//         {id ? "Edit Document" : "Create Document"}
//       </h2>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label>Title</label>
//           <input
//             type="text"
//             value={formData.title}
//             onChange={(e) => 
//               setFormData({ ...formData, title: e.target.value })
//             }
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label>File URL (from MinIO/S3)</label>
//           <input
//             type="text"
//             value={formData.fileUrl}
//             onChange={(e) => 
//               setFormData({ ...formData, fileUrl: e.target.value })
//             }
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label>Category</label>
//           <select
//             value={formData.categoryId}
//             onChange={(e) => 
//               setFormData({ ...formData, categoryId: parseInt(e.target.value) })
//             }
//             className="w-full p-2 border rounded"
//           >
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DocumentForm;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  fetchDocumentById, 
  createDocument, 
  updateDocument, 
  fetchCategories 
} from "../../services/documentService";
import DropZone from "../form/form-elements/DropZone";
import { formatFileSize } from "../../utils/helpers";
import { uploadFile } from "../../services/Storage";

const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    fileUrl: "",
    categoryId: 1,
    departmentId: 1,
    fileName: "", // For DropZone
    type: "PDF",  // For DropZone
    size: 0,      // For DropZone
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
        if (id) {
          const doc = await fetchDocumentById(parseInt(id));
          setFormData({
            title: doc.title,
            fileUrl: doc.filePath,
            categoryId: doc.category.id,
            departmentId: doc.department.id,
            fileName: doc.title, // Default to title for existing documents
            type: doc.fileType || "PDF",
            size: doc.fileSize || 0,
          });
        }
      } catch (err) {
        setError("Failed to load data");
      }
    };
    loadData();
  }, [id]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    try {
      const response = await uploadFile(form); // Expecting a string URL from backend
      const uploadedFileUrl = response.data; // S3 URL

      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        type: (file.type.split('/')[1]?.toUpperCase() as any) || "PDF",
        size: file.size,
        fileUrl: uploadedFileUrl,
      }));

      console.log("✅ File uploaded successfully. URL:", uploadedFileUrl);
    } catch (error: any) {
      console.error("❌ Error uploading file:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in and try again.");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError("File upload failed. Please try again.");
      }
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateDocument(parseInt(id), {
          title: formData.title,
          fileUrl: formData.fileUrl,
          categoryId: formData.categoryId,
          departmentId: formData.departmentId,
        });
      } else {
        await createDocument({
          title: formData.title,
          fileUrl: formData.fileUrl,
          categoryId: formData.categoryId,
          departmentId: formData.departmentId,
        });
      }
      navigate("/documents");
    } catch (err) {
      setError("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Document" : "Create Document"}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => 
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>File Upload (to S3)</label>
          <DropZone
            onFileUpload={handleFileUpload}
            existingFile={formData.fileName ? {
              name: formData.fileName, // Changed from fileName to name
              size: formData.size,
              type: formData.type,
            } : undefined}
          />
        </div>
        <div>
          <label>File URL (from S3)</label>
          <input
            type="text"
            value={formData.fileUrl}
            onChange={(e) => 
              setFormData({ ...formData, fileUrl: e.target.value })
            }
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label>File Size</label>
          <input
            type="text"
            value={formatFileSize(formData.size)}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
            disabled
          />
        </div>
        <div>
          <label>Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => 
              setFormData({ ...formData, categoryId: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !formData.fileUrl}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;