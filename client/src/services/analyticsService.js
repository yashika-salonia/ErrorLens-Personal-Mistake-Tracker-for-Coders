import API from "./api";

// Dashboard summary card
export const getDashboardSummary = async () => {
  const res = await API.get("/analytics/summary");
  return res.data;
};

// Status breakdown (pie chart)
export const getStatusBreakdown = async () => {
  const res = await API.get("/analytics/status-breakdown");
  return res.data;
};

// Mistake type frequency (bar chart)
export const getMistakeTypeFrequency = async () => {
  const res = await API.get("/analytics/mistake-types");
  return res.data;
};

// Domain performance
export const getDomainPerformance = async () => {
  const res = await API.get("/analytics/domain-performance");
  return res.data;
};

// Difficulty performance
export const getDifficultyPerformance = async () => {
  const res = await API.get("/analytics/difficulty-performance");
  return res.data;
};

// Submission trend (line chart)
export const getSubmissionTrend = async (range = "month") => {
  const res = await API.get(`/analytics/trend?range=${range}`);
  return res.data;
};

// Recurring mistakes
export const getRecurringMistakes = async (limit = 5) => {
  const res = await API.get(`/analytics/recurring-mistakes?limit=${limit}`);
  return res.data;
};

// Language stats
export const getLanguageStats = async () => {
  const res = await API.get("/analytics/language-stats");
  return res.data;
};

// Mistake personality
export const getMistakePersonality = async () => {
  const res = await API.get("/analytics/mistake-personality");
  return res.data;
};

// Admin overview
export const getAdminOverview = async () => {
  const res = await API.get("/analytics/admin/overview");
  return res.data;
};
