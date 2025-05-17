// src/services/documentService.ts
import api from './api';

// Types
export interface DocumentCategory {
  id: number;
  name: string;
}

export interface Document {
  id: number;
  title: string;
  filePath: string; 
  category: DocumentCategory;
  department: { id: number; name: string };
  createdAt: string;
  createdBy: number;
  fileSize?: number;
  fileType?: string;
}

export interface DocumentRequest {
  title: string;
  fileUrl: string;
  categoryId: number;
  departmentId: number;
}

// Fetch all documents
export const fetchDocuments = async (
  search?: string, 
  categoryId?: number
): Promise<Document[]> => {
  const params = new URLSearchParams();
  if (search) params.append('title', search);
  if (categoryId) params.append('categoryId', categoryId.toString());
  
  const response = await api.get<Document[]>(`/documents?${params.toString()}`);
  return response.data;
};

// Fetch single document
export const fetchDocumentById = async (id: number): Promise<Document> => {
  const response = await api.get<Document>(`/documents/${id}`);
  return response.data;
};

// Create document
export const createDocument = async (
  documentData: DocumentRequest
): Promise<Document> => {
  const response = await api.post<Document>('/documents', documentData);
  return response.data;
};

// Update document
export const updateDocument = async (
  id: number, 
  documentData: Partial<DocumentRequest>
): Promise<Document> => {
  const response = await api.put<Document>(`/documents/${id}`, documentData);
  return response.data;
};

// Delete document
export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/documents/${id}`);
};

// Fetch categories
export const fetchCategories = async (): Promise<DocumentCategory[]> => {
  const response = await api.get<DocumentCategory[]>('/categories');
  return response.data;
};

// MinIO/S3 File Handling 
export const uploadFile = (file: FormData) => {
  const token = localStorage.getItem('token');
  return api.post('/files/upload', file);
};

export const listFiles = () => api.get('/files/list');

export const downloadFile = (fileName: string) =>
  api.get(`/files/download/${fileName}`, { responseType: 'blob' });

export const viewDocument = (idOrName: string) =>
  api.get(`/files/view/${idOrName}`, {
    responseType: "blob",
  });
// Translate document title
export const translateDocumentTitle = async (id: number, sourceLanguage: string, targetLanguage: string): Promise<string> => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwidXNlcklkIjoyLCJzdWIiOiJuaWhlbCIsImlhdCI6MTc0NzQxNjA2OSwiZXhwIjoxNzQ3NDE5NjY9fQ.xBNUcCpfaC5-CIZoP31Y72tBgZhEectmhQ9f4CdAlr_OzO3SZFgkRsdQktizi5zu1kZ6xKyvMcGO4HzYUydZZw";
  await api.post(`/documents/${id}/translate?sourceLanguage=${sourceLanguage}&targetLanguage=${targetLanguage}`);

  const response = await api.get(`/documents/${id}/translate-resp`, );
  return response.data.translatedText;
};