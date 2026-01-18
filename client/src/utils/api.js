// src/api/index.js
import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
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
      // Handle unauthorized errors
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============== AUTH API ==============
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// ============== USER API ==============
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/users/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post('/users/upload-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ============== JOBS API ==============
export const jobsAPI = {
  // Get all jobs
  getAllJobs: (params) => api.get('/jobs', { params }),
  
  // Get single job
  getJob: (jobId) => api.get(`/jobs/${jobId}`),
  
  // Create job (employer only)
  createJob: (jobData) => api.post('/jobs', jobData),
  
  // Update job (employer only)
  updateJob: (jobId, jobData) => api.put(`/jobs/${jobId}`, jobData),
  
  // Delete job (employer only)
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
  
  // Search jobs with filters
  searchJobs: (filters) => api.get('/jobs/search', { params: filters }),
  
  // Get recommended jobs
  getRecommendedJobs: () => api.get('/jobs/recommended'),
  
  // Get match percentage for a job
  getMatchPercentage: (jobId) => api.get(`/jobs/${jobId}/match-percentage`),
  
  // Apply to a job
  applyToJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  
  // Save/unsave jobs
  saveJob: (jobId) => api.post(`/jobs/${jobId}/save`),
  unsaveJob: (jobId) => api.delete(`/jobs/${jobId}/save`),
  
  // Check if job is saved
  checkSavedStatus: (jobId) => api.get(`/jobs/${jobId}/saved-status`),
};

// ============== SAVED JOBS API ==============
export const savedJobsAPI = {
  // Get all saved jobs
  getSavedJobs: () => api.get('/saved-jobs'),
  
  // Get upcoming deadlines from saved jobs
  getUpcomingDeadlines: () => api.get('/saved-jobs/upcoming'),
  
  // Remove a saved job
  removeSavedJob: (savedJobId) => api.delete(`/saved-jobs/${savedJobId}`),
  
  // Bulk remove saved jobs
  bulkRemoveSavedJobs: (savedJobIds) => api.delete('/saved-jobs/bulk', { data: { savedJobIds } }),
  
  // Get saved job stats
  getStats: () => api.get('/saved-jobs/stats'),
};

// ============== APPLICATIONS API ==============
export const applicationsAPI = {
  // Get all applications for current user
  getMyApplications: () => api.get('/applications'),
  
  // Get single application
  getApplication: (applicationId) => api.get(`/applications/${applicationId}`),
  
  // Create application
  createApplication: (jobId, data) => api.post('/applications', { jobId, ...data }),
  
  // Withdraw application
  withdrawApplication: (applicationId) => api.delete(`/applications/${applicationId}`),
  
  // Update application
  updateApplication: (applicationId, data) => api.put(`/applications/${applicationId}`, data),
  
  // Check application status for a job
  checkApplicationStatus: (jobId) => api.get(`/applications/check/${jobId}`),
  
  // Get upcoming deadlines from applications
  getApplicationDeadlines: () => api.get('/applications/deadlines'),
  
  // Get application stats
  getStats: () => api.get('/applications/stats'),
};

// ============== INTERNSHIPS API ==============
export const internshipsAPI = {
  // Get all internships
  getAllInternships: (params) => api.get('/internships', { params }),
  
  // Get single internship
  getInternship: (internshipId) => api.get(`/internships/${internshipId}`),
  
  // Apply to internship
  applyToInternship: (internshipId, applicationData) => api.post(`/internships/${internshipId}/apply`, applicationData),
  
  // Search internships
  searchInternships: (filters) => api.get('/internships/search', { params: filters }),
  
  // Save/unsave internships
  saveInternship: (internshipId) => api.post(`/internships/${internshipId}/save`),
  unsaveInternship: (internshipId) => api.delete(`/internships/${internshipId}/save`),
  
  // Get saved internships
  getSavedInternships: () => api.get('/saved-internships'),
};

// ============== COURSES API ==============
export const coursesAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getMyCourses: () => api.get('/courses/my-courses'),
  getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
};

// ============== MESSAGES API ==============
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId, params) => api.get(`/messages/conversations/${conversationId}`, { params }),
  sendMessage: (conversationId, message) => api.post(`/messages/conversations/${conversationId}`, { message }),
  createConversation: (userId, initialMessage) => api.post('/messages/conversations', { userId, initialMessage }),
  markAsRead: (conversationId, messageId) => api.put(`/messages/conversations/${conversationId}/read/${messageId}`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

// ============== DASHBOARD API ==============
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
  getUpcomingDeadlines: () => api.get('/dashboard/deadlines'),
  getNotifications: () => api.get('/dashboard/notifications'),
  markNotificationRead: (notificationId) => api.put(`/dashboard/notifications/${notificationId}/read`),
  markAllNotificationsRead: () => api.put('/dashboard/notifications/read-all'),
};

// ============== SEARCH API ==============
export const searchAPI = {
  getSavedSearches: () => api.get('/searches/saved'),
  saveSearch: (searchData) => api.post('/searches/save', searchData),
  deleteSavedSearch: (searchId) => api.delete(`/searches/${searchId}`),
  updateSavedSearch: (searchId, searchData) => api.put(`/searches/${searchId}`, searchData),
  getRecentSearches: () => api.get('/searches/recent'),
  clearRecentSearches: () => api.delete('/searches/recent'),
};

// ============== MOCK DATA FOR DEVELOPMENT ==============
export const mockData = {
  jobs: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $180,000',
      type: 'Full-time',
      deadline: '2024-04-15',
      description: 'Build cutting-edge web applications using React and TypeScript.',
      tags: ['React', 'TypeScript', 'Next.js', 'Frontend'],
      applications: 45,
      rating: 4.8,
      featured: true,
      status: 'open',
      postedDate: '2024-03-10',
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90,000 - $140,000',
      type: 'Full-time',
      deadline: '2024-04-20',
      description: 'Build scalable applications from frontend to backend.',
      tags: ['Node.js', 'React', 'MongoDB', 'AWS'],
      applications: 23,
      rating: 4.5,
      featured: true,
      status: 'open',
      postedDate: '2024-03-11',
    }
  ],
  
  savedJobs: [
    {
      savedId: 1,
      jobId: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      savedAt: '2024-03-10T10:30:00Z',
      applied: false,
      matchPercentage: 95
    },
    {
      savedId: 2,
      jobId: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      savedAt: '2024-03-11T14:20:00Z',
      applied: true,
      matchPercentage: 88
    }
  ],
  
  upcomingDeadlines: [
    {
      id: 1,
      title: 'Google Software Engineer',
      company: 'Google',
      daysLeft: 2,
      deadline: '2024-03-15',
      location: 'Remote',
      type: 'Full-time',
      applied: false
    },
    {
      id: 2,
      title: 'Microsoft PM Intern',
      company: 'Microsoft',
      daysLeft: 5,
      deadline: '2024-03-18',
      location: 'Redmond, WA',
      type: 'Internship',
      applied: true
    }
  ],
  
  recommendedJobs: [
    {
      id: 101,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $180,000',
      type: 'Full-time',
      tags: ['React', 'TypeScript', 'Next.js'],
      applications: 45,
      postedDate: '2 days ago',
      featured: true,
      matchPercentage: 92
    }
  ],
  
  applications: [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      appliedDate: '2024-01-10',
      status: 'Under Review',
      deadline: '2024-03-15'
    }
  ]
};

// ============== SMART API WRAPPER WITH FALLBACK ==============
export const smartAPI = {
  // Jobs
  jobs: {
    getAllJobs: async (params = {}) => {
      try {
        const response = await jobsAPI.getAllJobs(params);
        return response;
      } catch (error) {
        console.log('Using mock data for jobs:', error.message);
        return { data: { success: true, data: mockData.jobs } };
      }
    },
    
    getRecommendedJobs: async () => {
      try {
        const response = await jobsAPI.getRecommendedJobs();
        return response;
      } catch (error) {
        console.log('Using mock data for recommended jobs:', error.message);
        return { data: { success: true, data: mockData.recommendedJobs } };
      }
    },
    
    saveJob: async (jobId) => {
      try {
        const response = await jobsAPI.saveJob(jobId);
        return response;
      } catch (error) {
        console.error('Error saving job:', error.message);
        // Simulate success in mock mode
        return { 
          data: { 
            success: true, 
            message: 'Job saved successfully',
            data: {
              savedId: Date.now(),
              jobId,
              title: 'Mock Job Title',
              company: 'Mock Company',
              savedAt: new Date().toISOString()
            }
          } 
        };
      }
    },
    
    unsaveJob: async (jobId) => {
      try {
        const response = await jobsAPI.unsaveJob(jobId);
        return response;
      } catch (error) {
        console.error('Error unsaving job:', error.message);
        // Simulate success in mock mode
        return { 
          data: { 
            success: true, 
            message: 'Job removed from saved',
            data: { jobId, removedAt: new Date().toISOString() }
          } 
        };
      }
    },
    
    checkSavedStatus: async (jobId) => {
      try {
        const response = await jobsAPI.checkSavedStatus(jobId);
        return response;
      } catch (error) {
        console.error('Error checking saved status:', error.message);
        // Check against mock data
        const isSaved = mockData.savedJobs.some(job => job.jobId === jobId);
        return { 
          data: { 
            success: true, 
            data: { isSaved } 
          } 
        };
      }
    },
    
    getMatchPercentage: async (jobId) => {
      try {
        const response = await jobsAPI.getMatchPercentage(jobId);
        return response;
      } catch (error) {
        console.error('Error getting match percentage:', error.message);
        // Return mock match percentage
        const savedJob = mockData.savedJobs.find(job => job.jobId === jobId);
        return { 
          data: { 
            success: true, 
            data: { 
              jobId, 
              matchPercentage: savedJob?.matchPercentage || Math.floor(Math.random() * 50) + 50 
            } 
          } 
        };
      }
    },
    
    applyToJob: async (jobId, applicationData) => {
      try {
        const response = await jobsAPI.applyToJob(jobId, applicationData);
        return response;
      } catch (error) {
        console.error('Error applying to job:', error.message);
        // Simulate success in mock mode
        return { 
          data: { 
            success: true, 
            message: 'Application submitted successfully',
            data: {
              applicationId: Date.now(),
              jobId,
              appliedAt: new Date().toISOString(),
              status: 'pending'
            }
          } 
        };
      }
    }
  },
  
  // Saved Jobs
  savedJobs: {
    getSavedJobs: async () => {
      try {
        const response = await savedJobsAPI.getSavedJobs();
        return response;
      } catch (error) {
        console.log('Using mock data for saved jobs:', error.message);
        return { data: { success: true, data: mockData.savedJobs } };
      }
    },
    
    getUpcomingDeadlines: async () => {
      try {
        const response = await savedJobsAPI.getUpcomingDeadlines();
        return response;
      } catch (error) {
        console.log('Using mock data for upcoming deadlines:', error.message);
        return { data: { success: true, data: mockData.upcomingDeadlines } };
      }
    },
    
    removeSavedJob: async (savedJobId) => {
      try {
        const response = await savedJobsAPI.removeSavedJob(savedJobId);
        return response;
      } catch (error) {
        console.error('Error removing saved job:', error.message);
        // Simulate success in mock mode
        return { 
          data: { 
            success: true, 
            message: 'Job removed from saved',
            data: { savedJobId, removedAt: new Date().toISOString() }
          } 
        };
      }
    }
  },
  
  // Applications
  applications: {
    getMyApplications: async () => {
      try {
        const response = await applicationsAPI.getMyApplications();
        return response;
      } catch (error) {
        console.log('Using mock data for applications:', error.message);
        return { data: { success: true, data: mockData.applications } };
      }
    },
    
    checkApplicationStatus: async (jobId) => {
      try {
        const response = await applicationsAPI.checkApplicationStatus(jobId);
        return response;
      } catch (error) {
        console.error('Error checking application status:', error.message);
        // Check against mock data
        const hasApplied = mockData.applications.some(app => app.jobId === jobId);
        return { 
          data: { 
            success: true, 
            data: { 
              hasApplied,
              canApply: !hasApplied,
              application: hasApplied ? mockData.applications.find(app => app.jobId === jobId) : null
            } 
          } 
        };
      }
    },
    
    getApplicationDeadlines: async () => {
      try {
        const response = await applicationsAPI.getApplicationDeadlines();
        return response;
      } catch (error) {
        console.log('Using mock data for application deadlines:', error.message);
        return { data: { success: true, data: mockData.upcomingDeadlines } };
      }
    }
  },
  
  // Dashboard
  dashboard: {
    getStats: async () => {
      try {
        const response = await dashboardAPI.getStats();
        return response;
      } catch (error) {
        console.log('Using mock data for dashboard stats:', error.message);
        return { 
          data: { 
            success: true, 
            data: {
              totalSaved: mockData.savedJobs.length,
              totalApplications: mockData.applications.length,
              upcomingDeadlines: mockData.upcomingDeadlines.length,
              avgMatchRate: 85
            }
          } 
        };
      }
    },
    
    getUpcomingDeadlines: async () => {
      try {
        const response = await dashboardAPI.getUpcomingDeadlines();
        return response;
      } catch (error) {
        console.log('Using mock data for dashboard deadlines:', error.message);
        return { data: { success: true, data: mockData.upcomingDeadlines } };
      }
    }
  }
};

// ============== USEFUL HELPER FUNCTIONS ==============
export const apiHelpers = {
  // Format error message
  formatError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message || 'An unknown error occurred';
  },
  
  // Check if response is successful
  isSuccess: (response) => {
    return response?.data?.success === true;
  },
  
  // Extract data from response
  extractData: (response) => {
    return response?.data?.data || response?.data || null;
  },
  
  // Create headers with token
  createHeaders: (additionalHeaders = {}) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...additionalHeaders
    };
  },
  
  // Handle file upload
  uploadFile: async (file, endpoint, fieldName = 'file') => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
};

// Export default api instance
export default api;

// Export all APIs as a single object for convenience
export const API = {
  auth: authAPI,
  user: userAPI,
  jobs: jobsAPI,
  savedJobs: savedJobsAPI,
  applications: applicationsAPI,
  internships: internshipsAPI,
  courses: coursesAPI,
  messages: messagesAPI,
  dashboard: dashboardAPI,
  search: searchAPI,
  smart: smartAPI,
  helpers: apiHelpers,
  mockData
};