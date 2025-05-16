// // import React, { useState, useMemo } from "react";
// // import { documents, Document } from "../../data/documents";
// // import { paginate } from "../../utils/pagination";
// // import {
// //     Table,
// //     TableBody,
// //     TableCell,
// //     TableHeader,
// //     TableRow,
// // } from "../ui/table";
// // import { DocumentActions } from "../common/DocumentActions";
// // import { FilterDropdown } from "../common/FilterDropdown";
// // import { formatFileSize, formatDate } from "../../utils/helpers";
// // import { Link } from "react-router";
// // import { useData } from "../../context/DataContext";


// // const DocumentList: React.FC = () => {
// //     const { documents } = useData();
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const[typeFilter, setTypeFilter] = useState("");
// //     const [addedByFilter, setAddedByFilter] = useState("");
// //     const [sortKey, setSortKey] = useState<keyof Document>("dateAdded");
// //     const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const pageSize = 5;

// //     // Filter and sort logic
// //     const filteredDocuments = useMemo(() => {
// //         return documents.filter(doc => {
// //             const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                 doc.author.toLowerCase().includes(searchQuery.toLowerCase());

// //             const matchesType = typeFilter ? doc.type === typeFilter : true;
// //             const matchesAddedBy = addedByFilter ? doc.addedBy === addedByFilter : true;

// //             return matchesSearch && matchesType && matchesAddedBy;
// //         });
// //     }, [searchQuery, typeFilter, addedByFilter]);

// //     const sortedDocuments = useMemo(() => {
// //         return [...filteredDocuments].sort((a, b) => {
// //             if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
// //             if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
// //             return 0;
// //         });
// //     }, [filteredDocuments, sortKey, sortOrder]);

// //     // Filter options
// //     const typeOptions = useMemo(() => [
// //         { value: "", label: "All Types" },
// //         ...Array.from(new Set(documents.map(d => d.type))).map(type => ({
// //             value: type,
// //             label: type
// //         }))
// //     ], []);

// //     const addedByOptions = useMemo(() => [
// //         { value: "", label: "All Uploaders" },
// //         ...Array.from(new Set(documents.map(d => d.addedBy))).map(user => ({
// //             value: user,
// //             label: user
// //         }))
// //     ], []);

// //     // Pagination
// //     const paginatedDocuments = paginate(sortedDocuments, currentPage, pageSize);
// //     const totalPages = Math.ceil(sortedDocuments.length / pageSize);

// //     const handleSort = (key: keyof Document) => {
// //         if (sortKey === key) {
// //             setSortOrder(prev => prev === "asc" ? "desc" : "asc");
// //         } else {
// //             setSortKey(key);
// //             setSortOrder("desc");
// //         }
// //     };

// //     return (
// //         <div className="p-4">
// //             <div className="flex flex-col gap-4 mb-4 md:flex-row">
// //                 <input
// //                     type="text"
// //                     placeholder="Search documents..."
// //                     className="flex-1 p-2 border rounded"
// //                     value={searchQuery}
// //                     onChange={(e) => {
// //                         setSearchQuery(e.target.value);
// //                         setCurrentPage(1);
// //                     }}
// //                 />
// //                 <FilterDropdown
// //                     options={typeOptions}
// //                     value={typeFilter}
// //                     onChange={setTypeFilter}
// //                     placeholder="Document Type"
// //                 />
// //                 <FilterDropdown
// //                     options={addedByOptions}
// //                     value={addedByFilter}
// //                     onChange={setAddedByFilter}
// //                     placeholder="Uploaded By"
// //                 />
// //             </div>
// //             <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
// //                 <div className="max-w-full overflow-x-auto">
// //                     <div className="min-w-[600px]">
// //                         <Table>
// //                             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
// //                                 <TableRow>
// //                                     <TableCell isHeader onClick={() => handleSort("name")}>
// //                                         Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
// //                                     </TableCell>
// //                                     <TableCell isHeader onClick={() => handleSort("type")}>
// //                                         Type {sortKey === "type" && (sortOrder === "asc" ? "▲" : "▼")}
// //                                     </TableCell>
// //                                     <TableCell isHeader onClick={() => handleSort("dateAdded")}>
// //                                         Date Added {sortKey === "dateAdded" && (sortOrder === "asc" ? "▲" : "▼")}
// //                                     </TableCell>
// //                                     <TableCell isHeader onClick={() => handleSort("size")}>
// //                                         Size {sortKey === "size" && (sortOrder === "asc" ? "▲" : "▼")}
// //                                     </TableCell>
// //                                     <TableCell isHeader>Last Viewed</TableCell>
// //                                     <TableCell isHeader>Actions</TableCell>
// //                                 </TableRow>
// //                             </TableHeader>
// //                             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
// //                                 {paginatedDocuments.map(doc => (
// //                                     <TableRow key={doc.id}>
// //                                         <TableCell className="font-medium">
// //                                             <Link
// //                                                 to={`/documents/${doc.id}`}
// //                                                 className="text-blue-500 hover:underline"
// //                                             >
// //                                                 {doc.name}
// //                                             </Link>
// //                                         </TableCell>
// //                                         <TableCell>{doc.type}</TableCell>
// //                                         <TableCell>{formatDate(doc.dateAdded)}</TableCell>
// //                                         <TableCell>{formatFileSize(doc.size)}</TableCell>
// //                                         <TableCell>
// //                                             <div className="text-sm">
// //                                                 {formatDate(doc.lastViewDate)}
// //                                                 <div className="text-xs text-gray-500">
// //                                                     by {doc.lastViewedBy}
// //                                                 </div>
// //                                             </div>
// //                                         </TableCell>
// //                                         <TableCell>
// //                                             <DocumentActions
// //                                                 viewUrl={`/documents/${doc.id}`}
// //                                                 editUrl={`/documents/edit/${doc.id}`}
// //                                                 onDelete={() => console.log("Delete", doc.id)}
// //                                             />
// //                                         </TableCell>
// //                                     </TableRow>
// //                                 ))}
// //                             </TableBody>
// //                         </Table>
// //                     </div>
// //                 </div>
// //             </div>
// //             <div className="flex items-center justify-between mt-4">
// //                 <button
// //                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
// //                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
// //                     disabled={currentPage === 1}
// //                 >
// //                     Prev
// //                 </button>
// //                 <span>
// //                     Page {currentPage} of {totalPages}
// //                 </span>
// //                 <button
// //                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
// //                     onClick={() =>
// //                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
// //                     }
// //                     disabled={currentPage === totalPages}
// //                 >
// //                     Next
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default DocumentList;
// import React, { useState, useMemo, useEffect } from "react";
// import { documents, Document } from "../../data/documents";
// import { paginate } from "../../utils/pagination";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHeader,
//     TableRow,
// } from "../ui/table";
// import { DocumentActions } from "../common/DocumentActions";
// import { FilterDropdown } from "../common/FilterDropdown";
// import { formatFileSize, formatDate } from "../../utils/helpers";
// import { Link } from "react-router";
// import { useData } from "../../context/DataContext";
// import { uploadFile, listFiles, downloadFile } from "../../services/Storage"; // Import storage service functions

// const DocumentList: React.FC = () => {
//     const { documents } = useData();
//     const [searchQuery, setSearchQuery] = useState("");
//     const [typeFilter, setTypeFilter] = useState("");
//     const [addedByFilter, setAddedByFilter] = useState("");
//     const [sortKey, setSortKey] = useState<keyof Document>("dateAdded");
//     const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//     const [currentPage, setCurrentPage] = useState(1);
//     const pageSize = 5;

//     // State for storage functionality
//     const [files, setFiles] = useState<string[]>([]); // List of files from S3
//     const [selectedFile, setSelectedFile] = useState<File | null>(null); // File selected for upload

//     // Fetch files from storage microservice on component mount
//     useEffect(() => {
//         fetchFiles();
//     }, []);

//     const fetchFiles = async () => {
//         try {
//             const response = await listFiles();
//             setFiles(response.data); // Assuming response.data is a list of file names
//         } catch (error) {
//             console.error("Error fetching files:", error);
//         }
//     };

//     // Handle file selection for upload
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) setSelectedFile(e.target.files[0]);
//     };


//     // Handle file download
//     const handleDownload = async (fileName: string) => {
//         try {
//             const response = await downloadFile(fileName);
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", fileName);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error("Error downloading file:", error);
//         }
//     };

//     // Filter and sort logic for documents
//     const filteredDocuments = useMemo(() => {
//         return documents.filter(doc => {
//             const matchesSearch =
//                 doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 doc.author.toLowerCase().includes(searchQuery.toLowerCase());

//             const matchesType = typeFilter ? doc.type === typeFilter : true;
//             const matchesAddedBy = addedByFilter ? doc.addedBy === addedByFilter : true;

//             return matchesSearch && matchesType && matchesAddedBy;
//         });
//     }, [documents, searchQuery, typeFilter, addedByFilter]);

//     const sortedDocuments = useMemo(() => {
//         return [...filteredDocuments].sort((a, b) => {
//             const valueA = a[sortKey] as string | number; // Cast to a comparable type
//             const valueB = b[sortKey] as string | number; // Cast to a comparable type
//             if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
//             if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
//             return 0;
//         });
//     }, [filteredDocuments, sortKey, sortOrder]);

//     // Filter options
//     const typeOptions = useMemo(() => [
//         { value: "", label: "All Types" },
//         ...Array.from(new Set(documents.map(d => d.type))).map(type => ({
//             value: type,
//             label: type,
//         })),
//     ], [documents]);

//     const addedByOptions = useMemo(() => [
//         { value: "", label: "All Uploaders" },
//         ...Array.from(new Set(documents.map(d => d.addedBy))).map(user => ({
//             value: user,
//             label: user,
//         })),
//     ], [documents]);

//     // Pagination for documents
//     const paginatedDocuments = paginate(sortedDocuments, currentPage, pageSize);
//     const totalPages = Math.ceil(sortedDocuments.length / pageSize);

//     const handleSort = (key: keyof Document) => {
//         if (sortKey === key) {
//             setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
//         } else {
//             setSortKey(key);
//             setSortOrder("desc");
//         }
//     };

//     return (
//         <div className="p-4">

//             {/* Document Filters and Search */}
//             <div className="flex flex-col gap-4 mb-4 md:flex-row">
//                 <input
//                     type="text"
//                     placeholder="Search documents..."
//                     className="flex-1 p-2 border rounded"
//                     value={searchQuery}
//                     onChange={(e) => {
//                         setSearchQuery(e.target.value);
//                         setCurrentPage(1);
//                     }}
//                 />
//                 <FilterDropdown
//                     options={typeOptions}
//                     value={typeFilter}
//                     onChange={setTypeFilter}
//                     placeholder="Document Type"
//                 />
//                 <FilterDropdown
//                     options={addedByOptions}
//                     value={addedByFilter}
//                     onChange={setAddedByFilter}
//                     placeholder="Uploaded By"
//                 />
//             </div>

//             {/* Combined Table for Documents and Files */}
//             <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//                 <div className="max-w-full overflow-x-auto">
//                     <div className="min-w-[600px]">
//                         <Table>
//                         <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//     <TableRow>
//         <TableCell isHeader>
//             <div onClick={() => handleSort("name")} className="cursor-pointer">
//                 Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
//             </div>
//         </TableCell>
//         <TableCell isHeader>
//             <div onClick={() => handleSort("type")} className="cursor-pointer">
//                 Type {sortKey === "type" && (sortOrder === "asc" ? "▲" : "▼")}
//             </div>
//         </TableCell>
//         <TableCell isHeader>
//             <div onClick={() => handleSort("dateAdded")} className="cursor-pointer">
//                 Date Added {sortKey === "dateAdded" && (sortOrder === "asc" ? "▲" : "▼")}
//             </div>
//         </TableCell>
//         <TableCell isHeader>
//             <div onClick={() => handleSort("size")} className="cursor-pointer">
//                 Size {sortKey === "size" && (sortOrder === "asc" ? "▲" : "▼")}
//             </div>
//         </TableCell>
//         <TableCell isHeader>Last Viewed</TableCell>
//         <TableCell isHeader>Actions</TableCell>
//     </TableRow>
// </TableHeader>
//                             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//                                 {/* Render Documents */}
//                                 {paginatedDocuments.map(doc => (
//                                     <TableRow key={`doc-${doc.id}`}>
//                                         <TableCell className="font-medium">
//                                             <Link
//                                                 to={`/documents/${doc.id}`}
//                                                 className="text-blue-500 hover:underline"
//                                             >
//                                                 {doc.name}
//                                             </Link>
//                                         </TableCell>
//                                         <TableCell>{doc.type}</TableCell>
//                                         <TableCell>{formatDate(doc.dateAdded)}</TableCell>
//                                         <TableCell>{formatFileSize(doc.size)}</TableCell>
//                                         <TableCell>
//                                             <div className="text-sm">
//                                                 {formatDate(doc.lastViewDate)}
//                                                 <div className="text-xs text-gray-500">
//                                                     by {doc.lastViewedBy}
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <DocumentActions
//                                                 viewUrl={`/documents/${doc.id}`}
//                                                 editUrl={`/documents/edit/${doc.id}`}
//                                                 onDelete={() => console.log("Delete", doc.id)}
//                                             />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                                 {/* Render Files from Storage */}
//                                 {files.map(file => (
//                                     <TableRow key={`file-${file}`}>
//                                         <TableCell className="font-medium">
//                                             <span>{file}</span>
//                                         </TableCell>
//                                         <TableCell>{file.split('.').pop()?.toUpperCase() || 'Unknown'}</TableCell>
//                                         <TableCell>-</TableCell> {/* Date Added not available */}
//                                         <TableCell>-</TableCell> {/* Size not available */}
//                                         <TableCell>-</TableCell> {/* Last Viewed not available */}
//                                         <TableCell>
//                                             <button
//                                                 onClick={() => handleDownload(file)}
//                                                 className="text-blue-500 hover:underline"
//                                             >
//                                                 Download
//                                             </button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </div>
//             </div>

//             {/* Pagination for Documents */}
//             <div className="flex items-center justify-between mt-4">
//                 <button
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                 >
//                     Prev
//                 </button>
//                 <span>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                     onClick={() =>
//                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                     }
//                     disabled={currentPage === totalPages}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };
import React, { useState, useMemo, useEffect } from "react";
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
import { listFiles } from "../../services/Storage";

// Define the type for S3 files
type DisplayItem = { id: string; name: string; type: string; isFile: true; url?: string };

// Define sortable keys for S3 files
type SortableKeys = 'name' | 'type';

const DocumentList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortableKeys>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // State for S3 files
  const [files, setFiles] = useState<DisplayItem[]>([]);

  // Fetch files from S3 on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await listFiles();
      const fetchedFiles: DisplayItem[] = response.data.map((fileName: string) => ({
        id: fileName,
        name: fileName,
        type: fileName.split('.').pop()?.toUpperCase() || 'Unknown',
        isFile: true,
        url: `/files/download/${fileName}`,
      }));
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Filter logic for S3 files
  const filteredItems = useMemo(() => {
    return files.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter ? item.type === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [files, searchQuery, typeFilter]);

  // Sort logic for S3 files
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const valueA = a[sortKey] as string;
      const valueB = b[sortKey] as string;
      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortKey, sortOrder]);

  // Filter options for types
  const typeOptions = useMemo(() => [
    { value: "", label: "All Types" },
    ...Array.from(new Set(files.map(item => item.type))).map(type => ({
      value: type,
      label: type,
    })),
  ], [files]);

  // Pagination for S3 files
  const paginatedItems = paginate(sortedItems, currentPage, pageSize);
  const totalPages = Math.ceil(sortedItems.length / pageSize);

  const handleSort = (key: SortableKeys) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // Type guard for S3 files (not strictly needed anymore but kept for clarity)
  const isFileItem = (item: DisplayItem): item is DisplayItem => {
    return 'isFile' in item && item.isFile === true;
  };

  // Handle delete for S3 files
  const handleDeleteS3File = async (fileName: string) => {
    console.log("Delete S3 file:", fileName);
    // Example: await api.delete(`/files/delete/${fileName}`);
    await fetchFiles();
  };

  return (
    <div className="p-4">
      {/* Document Filters and Search */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <input
          type="text"
          placeholder="Search files..."
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
          placeholder="File Type"
        />
      </div>

      {/* Table for S3 Files */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader>
                    <div onClick={() => handleSort("name")} className="cursor-pointer">
                      Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                    </div>
                  </TableCell>
                  <TableCell isHeader>
                    <div onClick={() => handleSort("type")} className="cursor-pointer">
                      Type {sortKey === "type" && (sortOrder === "asc" ? "▲" : "▼")}
                    </div>
                  </TableCell>
                  <TableCell isHeader>Date Added</TableCell>
                  <TableCell isHeader>Size</TableCell>
                  <TableCell isHeader>Last Viewed</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedItems.map(item => (
                  <TableRow key={`file-${item.id}`}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/documents/${item.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>-</TableCell> {/* Fallback for missing dateAdded */}
                    <TableCell>-</TableCell> {/* Fallback for missing size */}
                    <TableCell>-</TableCell> {/* Fallback for missing lastViewDate */}
                    <TableCell>
                      <DocumentActions
                        viewUrl={`/documents/${item.id}`}
                        editUrl={`/documents/edit/${item.id}`}
                        onDelete={() => handleDeleteS3File(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination for S3 Files */}
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
