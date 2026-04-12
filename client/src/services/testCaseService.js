import api from './api';

export const testCaseService = {
  create: (data) => api.post('/api/test-cases', data),
  getByProblem: (problemId) => api.get(`/api/test-cases/problem/${problemId}`),
  getAllByProblem: (problemId) => api.get(`/api/test-cases/problem/${problemId}/all`),
  getById: (id) => api.get(`/api/test-cases/${id}`),
  update: (id, data) => api.put(`/api/test-cases/${id}`, data),
  delete: (id) => api.delete(`/api/test-cases/${id}`),
};