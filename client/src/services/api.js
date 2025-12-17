import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Student API
export const studentAPI = {
  getStudents: () => api.get('/students'),
  getStudent: (id) => api.get(`/students/${id}`),
  updateStudentProfile: (profileData) => api.put('/students/profile', profileData),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Company API
export const companyAPI = {
  getCompanies: () => api.get('/companies'),
  getCompany: (id) => api.get(`/companies/${id}`),
  updateCompanyProfile: (profileData) => api.put('/companies/profile', profileData),
  getCompanyJobs: (companyId) => api.get(`/jobs?company_id=${companyId}`),
  getJobApplicants: (jobId) => api.get(`/jobs/${jobId}/applications`),
};

// Job API
export const jobAPI = {
  getJobs: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    return api.get(`/jobs?${params.toString()}`);
  },
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
};

// Application API
export const applicationAPI = {
  applyForJob: (jobId, applicationData) => 
    api.post('/applications', { ...applicationData, job_id: jobId }),
  getMyApplications: () => api.get('/applications/student'),
  getApplication: (applicationId) => api.get(`/applications/${applicationId}`),
  updateApplicationStatus: (applicationId, status, notes = '') => 
    api.put(`/applications/${applicationId}/status`, { status, notes }),
};

// Search API
export const searchAPI = {
  searchJobs: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return api.get(`/search/jobs?${params.toString()}`);
  },
  searchStudents: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return api.get(`/search/students?${params.toString()}`);
  },
};

// Upload API
export const uploadAPI = {
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  student: studentAPI,
  company: companyAPI,
  job: jobAPI,
  application: applicationAPI,
  search: searchAPI,
  upload: uploadAPI,
};