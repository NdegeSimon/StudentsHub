import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies and credentials
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User profile API
export const userAPI = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/profile', data),
};

// Job API
export const jobAPI = {
  getAllJobs: () => api.get('/jobs'),
  getJob: (jobId) => api.get(`/jobs/${jobId}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  applyToJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  searchJobs: (filters) => api.get('/jobs/search', { params: filters }),
  saveJob: (jobId) => api.post(`/jobs/${jobId}/save`),
  unsaveJob: (jobId) => api.delete(`/jobs/${jobId}/save`),
  getSavedJobs: () => api.get('/saved-jobs'),
  checkSaved: (jobId) => api.get(`/saved-jobs/check/${jobId}`)
};

// Course API
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
};

// Upload API
export const uploadAPI = {
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post('/upload/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Application API
export const applicationAPI = {
  getMyApplications: () => api.get('/applications'),
  getApplication: (applicationId) => api.get(`/applications/${applicationId}`),
  applyToJob: (jobId, applicationData) => api.post(`/applications`, { jobId, ...applicationData }),
  withdrawApplication: (applicationId) => api.delete(`/applications/${applicationId}`),
  updateApplication: (applicationId, data) => api.put(`/applications/${applicationId}`, data),
  getUpcomingDeadlines: () => api.get('/applications/deadlines'),
  checkApplicationStatus: (jobId) => api.get('/applications/status/check', { params: { job_id: jobId } })
};

// Search API
export const searchAPI = {
  getSavedSearches: () => api.get('/searches/saved'),
  saveSearch: (searchData) => api.post('/searches/save', searchData),
  deleteSavedSearch: (searchId) => api.delete(`/searches/${searchId}`),
};

// Message API
export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}`),
  sendMessage: (conversationId, message) => api.post(`/messages/conversations/${conversationId}`, message),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
  getUpcomingDeadlines: () => api.get('/dashboard/deadlines'), // Alternative endpoint
};

// Mock data for development when backend is down
export const mockAPI = {
  jobs: {
    getAllJobs: async () => {
      return {
        data: [
          {
            id: 1,
            title: 'Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            salary: '$80,000 - $100,000',
            description: 'Looking for React developer',
            type: 'Full-time',
            postedDate: '2024-01-15'
          },
          {
            id: 2,
            title: 'Backend Developer',
            company: 'StartupHub',
            location: 'New York, NY',
            salary: '$90,000 - $120,000',
            description: 'Node.js developer needed',
            type: 'Full-time',
            postedDate: '2024-01-14'
          }
        ]
      };
    }
  },
  
  applications: {
    getUpcomingDeadlines: async () => {
      return {
        data: [
          {
            id: 1,
            jobTitle: 'Senior Developer',
            company: 'TechCorp',
            deadline: '2024-01-25',
            status: 'Submitted'
          },
          {
            id: 2,
            jobTitle: 'Marketing Manager',
            company: 'StartupHub',
            deadline: '2024-01-28',
            status: 'In Review'
          }
        ]
      };
    },
    
    getMyApplications: async () => {
      return {
        data: [
          {
            id: 1,
            jobTitle: 'Frontend Developer',
            company: 'TechCorp',
            appliedDate: '2024-01-10',
            status: 'Under Review'
          }
        ]
      };
    }
  },
  
  searches: {
    getSavedSearches: async () => {
      return {
        data: [
          {
            id: 1,
            query: 'React Developer',
            filters: { location: 'Remote' },
            lastSearch: '2024-01-15'
          }
        ]
      };
    }
  }
};

// Smart API wrapper that falls back to mock data when backend is down
export const smartAPI = {
  jobs: {
    getAllJobs: async () => {
      try {
        const response = await jobAPI.getAllJobs();
        return response;
      } catch (error) {
        console.log('Using mock data for jobs:', error.message);
        return { data: mockAPI.jobs.getAllJobs() };
      }
    },
    saveJob: async (jobId) => {
      try {
        const response = await jobAPI.saveJob(jobId);
        return response;
      } catch (error) {
        console.error('Error saving job:', error.message);
        throw error;
      }
    },
    unsaveJob: async (jobId) => {
      try {
        const response = await jobAPI.unsaveJob(jobId);
        return response;
      } catch (error) {
        console.error('Error unsaving job:', error.message);
        throw error;
      }
    },
    getSavedJobs: async () => {
      try {
        const response = await jobAPI.getSavedJobs();
        return response;
      } catch (error) {
        console.error('Using mock data for saved jobs:', error.message);
        return { data: [] };
      }
    },
    checkSaved: async (jobId) => {
      try {
        const response = await jobAPI.checkSaved(jobId);
        return response;
      } catch (error) {
        console.error('Error checking saved status:', error.message);
        return { data: { is_saved: false } };
      }
    },
    searchJobs: async (query) => {
      try {
        const response = await jobAPI.searchJobs({ q: query });
        return response;
      } catch (error) {
        console.error('Error searching jobs:', error.message);
        return { data: [] };
      }
    }
  },
  
  applications: {
    getUpcomingDeadlines: async () => {
      try {
        const response = await applicationAPI.getUpcomingDeadlines();
        return response;
      } catch (error) {
        console.error('Using mock data for deadlines:', error.message);
        return { data: mockAPI.applications.getUpcomingDeadlines() };
      }
    },
    getMyApplications: async () => {
      try {
        const response = await applicationAPI.getMyApplications();
        return response;
      } catch (error) {
        console.error('Using mock data for applications:', error.message);
        return { data: mockAPI.applications.getMyApplications() };
      }
    },
    applyToJob: async (jobId, data) => {
      try {
        const response = await applicationAPI.applyToJob(jobId, data);
        return response;
      } catch (error) {
        console.error('Error applying to job:', error.message);
        throw error;
      }
    },
    checkStatus: async (jobId) => {
      try {
        const response = await applicationAPI.checkApplicationStatus(jobId);
        return response;
      } catch (error) {
        console.error('Error checking application status:', error.message);
        return { data: { has_applied: false, can_apply: true } };
      }
    }
  },
  
  searches: {
    getSavedSearches: async () => {
      try {
        const response = await searchAPI.getSavedSearches();
        return response;
      } catch (error) {
        console.error('Using mock data for saved searches:', error.message);
        return { data: mockAPI.searches.getSavedSearches() };
      }
    },
    saveSearch: async (query) => {
      try {
        const response = await searchAPI.saveSearch({ query });
        return response;
      } catch (error) {
        console.error('Error saving search:', error.message);
        throw error;
      }
    }
  }
};

// Export the axios instance as default

export default api;