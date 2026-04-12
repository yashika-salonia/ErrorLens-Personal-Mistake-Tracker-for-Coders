import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/api/analytics/summary'),
  getStatusBreakdown: () => api.get('/api/analytics/status-breakdown'),
  getMistakeTypes: () => api.get('/api/analytics/mistake-types'),
  getDomainPerformance: () => api.get('/api/analytics/domain-performance'),
  getDifficultyPerformance: () => api.get('/api/analytics/difficulty-performance'),
  getTrend: (range = 'week') => api.get(`/api/analytics/trend?range=${range}`),
  getRecurringMistakes: () => api.get('/api/analytics/recurring-mistakes'),
  getLanguageStats: () => api.get('/api/analytics/language-stats'),
  getMistakePersonality: () => api.get('/api/analytics/mistake-personality'),
  getAdminOverview: () => api.get('/api/analytics/admin/overview'),
};