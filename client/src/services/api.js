import axios from "axios";

/**
 * IMPORTANT:
 * Backend runs on http://localhost:5000
 * All Flask routes are prefixed with /api
 */
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // REQUIRED for CORS + auth
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor – attach JWT token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor – handle auth errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ===================== AUTH ===================== */

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
};

/* ===================== USERS ===================== */

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
};

/* ===================== STUDENTS ===================== */

export const studentAPI = {
  getStudents: () => api.get("/students"),
  getStudent: (id) => api.get(`/students/${id}`),
  updateProfile: (data) => api.put("/students/profile", data),

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    return api.post("/upload/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

/* ===================== COMPANIES ===================== */

export const companyAPI = {
  getCompanies: () => api.get("/companies"),
  getCompany: (id) => api.get(`/companies/${id}`),
  updateProfile: (data) => api.put("/companies/profile", data),
  getCompanyJobs: (companyId) =>
    api.get("/jobs", { params: { company_id: companyId } }),
};

/* ===================== JOBS ===================== */

export const jobAPI = {
  getJobs: (filters = {}) => api.get("/jobs", { params: filters }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post("/jobs", data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getJobApplications: (jobId) =>
    api.get(`/jobs/${jobId}/applications`),
};

/* ===================== APPLICATIONS ===================== */

export const applicationAPI = {
  applyForJob: (jobId, data) =>
    api.post("/applications", { ...data, job_id: jobId }),
  getMyApplications: () => api.get("/applications/student"),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status, notes = "") =>
    api.put(`/applications/${id}/status`, { status, notes }),
};

/* ===================== SEARCH ===================== */

export const searchAPI = {
  searchJobs: (query, filters = {}) =>
    api.get("/search/jobs", {
      params: { q: query, ...filters },
    }),
  searchStudents: (query, filters = {}) =>
    api.get("/search/students", {
      params: { q: query, ...filters },
    }),
};

/* ===================== UPLOAD ===================== */

export const uploadAPI = {
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/upload/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
