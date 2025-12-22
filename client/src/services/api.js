import axios from "axios";

/**
 * Backend base URL
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Attach JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle global auth errors
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
  logout: () => api.post("/auth/logout"),

  /**
   * Safely get current user
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return { data: null }; // skip request if no token

    try {
      const res = await api.get("/auth/me");
      return res;
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { data: null };
    }
  },
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
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
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
    api.get("/search/jobs", { params: { q: query, ...filters } }),
  searchStudents: (query, filters = {}) =>
    api.get("/search/students", { params: { q: query, ...filters } }),
};

export default api;
