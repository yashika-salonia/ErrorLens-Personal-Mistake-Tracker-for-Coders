import axios from "axios";

// ─── Axios Instance ───────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401 (expired token → redirect to login)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!localStorage.getItem("token");

// ─── User Services ────────────────────────────────────────────────────────────
export const userService = {
  // Register → { name, email, password }
  register: (data) => API.post("/users/register", data),

  // Login → { email, password }
  login: (data) => API.post("/users/login", data),

  // Get current logged-in user
  getMe: () => API.get("/users/me"),

  // Update profile → { name, bio, avatar }
  updateProfile: (data) => API.put("/users/me", data),

  // Change password → { currentPassword, newPassword }
  changePassword: (data) => API.put("/users/me/password", data),
};

// ─── Problem Services ─────────────────────────────────────────────────────────
export const problemService = {
  // Get all problems
  // params: { domain, difficulty, tag, search, page, limit }
  getAll: (params = {}) => API.get("/problems", { params }),

  // Get single problem by ID
  getById: (id) => API.get(`/problems/${id}`),

  // Create problem → { title, description, domain, difficulty, tags, constraints, examples }
  create: (data) => API.post("/problems", data),

  // Update problem
  update: (id, data) => API.put(`/problems/${id}`, data),

  // Delete problem
  delete: (id) => API.delete(`/problems/${id}`),
};

// ─── TestCase Services ────────────────────────────────────────────────────────
export const testCaseService = {
  // Create test case → { problem, input, expectedOutput, isHidden, explanation }
  create: (data) => API.post("/testcases", data),

  // Get visible (public) test cases for a problem
  getVisible: (problemId) => API.get(`/testcases/problem/${problemId}`),

  // Get ALL test cases including hidden (admin/creator)
  getAll: (problemId) => API.get(`/testcases/problem/${problemId}/all`),

  // Get single test case
  getById: (id) => API.get(`/testcases/${id}`),

  // Update test case
  update: (id, data) => API.put(`/testcases/${id}`, data),

  // Delete test case
  delete: (id) => API.delete(`/testcases/${id}`),
};

// ─── Submission Services ──────────────────────────────────────────────────────
export const submissionService = {
  // Create submission → { problem, code, language, status, notes, timeTaken }
  create: (data) => API.post("/submissions", data),

  // Get my own submissions
  // params: { status, problemId }
  getMine: (params = {}) => API.get("/submissions/me", { params }),

  // Get submissions for a specific problem
  getByProblem: (problemId) => API.get(`/submissions/problem/${problemId}`),

  // Get single submission (owner only)
  getById: (id) => API.get(`/submissions/${id}`),

  // Update mistake tags → { mistakeTags: [], notes: "" }
  updateMistakes: (id, data) => API.put(`/submissions/${id}/mistakes`, data),
};

// ─── Analytics Services ───────────────────────────────────────────────────────
export const analyticsService = {
  // Overall summary stats
  getSummary: () => API.get("/analytics/summary"),

  // Submissions grouped by status
  getStatusBreakdown: () => API.get("/analytics/status-breakdown"),

  // Most common mistake types
  getMistakeTypes: () => API.get("/analytics/mistake-types"),

  // Performance by domain (Arrays, Trees, etc.)
  getDomainPerformance: () => API.get("/analytics/domain-performance"),

  // Performance by difficulty (Easy/Medium/Hard)
  getDifficultyPerformance: () => API.get("/analytics/difficulty-performance"),

  // Submission trend over time
  // range: "week" | "month" | "year"
  getTrend: (range = "week") => API.get("/analytics/trend", { params: { range } }),

  // Problems you keep failing (recurring mistakes)
  // limit: 1-20 (default 5)
  getRecurringMistakes: (limit = 5) =>
    API.get("/analytics/recurring-mistakes", { params: { limit } }),

  // Submissions by programming language
  getLanguageStats: () => API.get("/analytics/language-stats"),

  // Your mistake "personality" (e.g. "The Edge Case Dodger")
  getMistakePersonality: () => API.get("/analytics/mistake-personality"),

  // Admin-only: platform-wide overview
  getAdminOverview: () => API.get("/analytics/admin/overview"),
};

export default API;