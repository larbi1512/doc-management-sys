import api from './api';

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