import API from "./api";

// Create Submission
// body: { problemId, code, language, status, mistakeTypes[] }
export const createSubmission = async (formData) => {
  const res = await API.post("/submissions", formData);
  return res.data;
};

// Get My Submissions
// filters (optional): { status, problemId, page, limit }
export const getMySubmissions = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await API.get(`/submissions/me${params ? "?" + params : ""}`);
  return res.data;
};

// Get Single Submission
export const getSubmissionById = async (id) => {
  const res = await API.get(`/submissions/${id}`);
  return res.data;
};

// Update Mistake Types
export const updateMistakeTypes = async (id, mistakeTypes) => {
  const res = await API.put(`/submissions/${id}/mistakes`, { mistakeTypes });
  return res.data;
};

// Get Submissions for a Problem
export const getSubmissionsForProblem = async (problemId) => {
  const res = await API.get(`/submissions/problem/${problemId}`);
  return res.data;
};
