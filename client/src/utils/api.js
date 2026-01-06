import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Point to the correct backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies if using sessions
});

// Add a request interceptor to include auth token if available
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

// API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// In client/src/utils/api.js
export const userAPI = {
  getProfile: () => api.get('/auth/me'),  // Changed from '/auth/profile' to '/auth/me'
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (courseId, courseData) => api.put(`/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
};
// Add this with the other APIs
export const jobAPI = {
  getAllJobs: () => api.get('/jobs'),
  getJob: (jobId) => api.get(`/jobs/${jobId}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (jobId, jobData) => api.put(`/jobs/${jobId}`, jobData),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
  applyToJob: (jobId) => api.post(`/jobs/${jobId}/apply`),
  // Add more endpoints as needed
};
export const uploadAPI = {
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post('/auth/upload-profile-picture', formData);
  },

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/auth/upload-resume', formData);
  },
};
export const applicationAPI = {
  getMyApplications: () => api.get('/applications/me'),
  getApplication: (applicationId) => api.get(`/applications/${applicationId}`),
  applyToJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  withdrawApplication: (applicationId) => api.delete(`/applications/${applicationId}`),
  updateApplication: (applicationId, data) => api.put(`/applications/${applicationId}`, data),
};
export default api;
