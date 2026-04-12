import api from './api';

export const problemService = {
  getAll: (params) => api.get('/api/problems', { params }),
  getById: (id) => api.get(`/api/problems/${id}`),
  create: (data) => api.post('/api/problems', data),
  update: (id, data) => api.put(`/api/problems/${id}`, data),
  delete: (id) => api.delete(`/api/problems/${id}`),
};