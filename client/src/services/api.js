// services/api.js
import axios from 'axios';

// --------------------- CONFIGURATION ---------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --------------------- AUTHENTICATION API ---------------------
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return api.post('/auth/logout').then(res => res.data);
  },
  getCurrentUser: () => api.get('/auth/me').then(res => res.data),
  refreshToken: () => api.post('/auth/refresh').then(res => {
    const { access_token } = res.data;
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    return res.data;
  }),
  verifyToken: () => api.get('/auth/verify').then(res => res.data),
  changePassword: (data) => api.post('/auth/change-password', data).then(res => res.data),
};

// --------------------- USERS API ---------------------
export const userAPI = {
  getProfile: () => api.get('/auth/profile').then(res => res.data),
  updateProfile: (data) => api.put('/auth/profile', data).then(res => res.data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  }
};

// --------------------- JOBS API ---------------------
export const jobAPI = {
  getJobs: (params = {}) => api.get('/jobs', { params }).then(res => res.data),
  getJob: (id) => api.get(`/jobs/${id}`).then(res => res.data),
  createJob: (data) => api.post('/jobs', data).then(res => res.data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data).then(res => res.data),
  deleteJob: (id) => api.delete(`/jobs/${id}`).then(res => res.data),
  getCompanyJobs: (companyId) => api.get(`/companies/${companyId}/jobs`).then(res => res.data),
};

// --------------------- APPLICATIONS API ---------------------
export const applicationAPI = {
  getMyApplications: () => api.get('/applications/me').then(res => res.data),
  getApplication: (id) => api.get(`/applications/${id}`).then(res => res.data),
  createApplication: (jobId, data) => 
    api.post('/applications', { ...data, job_id: jobId }).then(res => res.data),
  updateApplication: (id, data) => 
    api.put(`/applications/${id}`, data).then(res => res.data),
  deleteApplication: (id) => 
    api.delete(`/applications/${id}`).then(res => res.data),
  getJobApplications: (jobId) => 
    api.get(`/jobs/${jobId}/applications`).then(res => res.data),
};

// --------------------- UPLOAD API ---------------------
export const uploadAPI = {
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  }
};

// --------------------- PASSWORD RESET ---------------------
export const passwordAPI = {
  requestReset: (email) => 
    api.post('/auth/request-password-reset', { email }).then(res => res.data),
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, new_password: newPassword }).then(res => res.data),
};

// --------------------- EMAIL VERIFICATION ---------------------
export const verificationAPI = {
  sendVerification: () => 
    api.post('/auth/send-verification-email').then(res => res.data),
  verifyEmail: (token) => 
    api.post('/auth/verify-email', { token }).then(res => res.data),
};

// Export the axios instance as default
export default api;