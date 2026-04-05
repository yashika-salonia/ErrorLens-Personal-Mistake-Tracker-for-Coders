import API from "./api";

// Get All Problems
export const getAllProblems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await API.get(`/problems${params ? "?" + params : ""}`);
  return res.data;
};

// Get Single Problem
export const getProblemById = async (id) => {
  const res = await API.get(`/problems/${id}`);
  return res.data;
};

// Create Problem
// body: { title, description, domain, difficulty, tags[], expectedTimeComplexity }
export const createProblem = async (formData) => {
  const res = await API.post("/problems", formData);
  return res.data;
};

// Update Problem
export const updateProblem = async (id, formData) => {
  const res = await API.put(`/problems/${id}`, formData);
  return res.data;
};

// Delete Problem
export const deleteProblem = async (id) => {
  const res = await API.delete(`/problems/${id}`);
  return res.data;
};
