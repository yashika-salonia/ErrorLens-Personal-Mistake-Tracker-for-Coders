import api from './api';

export const submissionService = {
  submit: (data) => api.post('/api/submissions', data),
  getMine: () => api.get('/api/submissions/me'),
  getByProblem: (problemId) => api.get(`/api/submissions/problem/${problemId}`),
  getById: (id) => api.get(`/api/submissions/${id}`),
  updateMistakes: (id, data) => api.put(`/api/submissions/${id}/mistakes`, data),
};