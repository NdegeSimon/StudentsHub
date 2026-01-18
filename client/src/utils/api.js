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
        // Ensure the response has the expected format
        if (response && response.data) {
          // If data is already in the expected format, return as is
          if (response.data.data || response.data.applications || Array.isArray(response.data)) {
            return response;
          }
          // If data is an array, wrap it in the standard format
          if (Array.isArray(response.data)) {
            return { data: { data: response.data } };
          }
        }
        // If we get here, the response format is unexpected
        console.warn('Unexpected API response format:', response);
        return { data: { data: response?.data || [] } };
      } catch (error) {
        console.error('Using mock data for applications:', error.message);
        return { data: { data: mockAPI.applications.getMyApplications() } };
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
const handleApply = async (internshipId) => {
  try {
    const response = await fetch('/api/internships/apply', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ internshipId })
    });
    
    if (response.ok) {
      const result = await response.json();
      // Show success message
      alert('Application submitted successfully!');
    }
  } catch (error) {
    console.error('Error applying:', error);
    alert('Failed to submit application');
  }
};
// GET: /api/saved-jobs
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all saved jobs for this user
    const savedJobs = await SavedJob.find({ user: userId })
      .populate({
        path: 'job',
        select: 'title company location salary type deadline description requirements perks tags applications rating featured status postedDate'
      })
      .sort({ savedAt: -1 });
    
    // Calculate match percentage for each job
    const jobsWithMatch = await Promise.all(
      savedJobs.map(async (savedJob) => {
        const job = savedJob.job.toObject();
        const matchPercentage = await calculateMatchPercentage(userId, job._id);
        return {
          ...job,
          savedId: savedJob._id,
          savedAt: savedJob.savedAt,
          matchPercentage,
          applied: savedJob.applied
        };
      })
    );
    
    res.json({
      success: true,
      count: jobsWithMatch.length,
      data: jobsWithMatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// GET: /api/saved-jobs/upcoming
const getUpcomingDeadlines = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    // Find saved jobs with deadlines in next 7 days
    const savedJobs = await SavedJob.find({ user: userId })
      .populate({
        path: 'job',
        match: { 
          deadline: { 
            $gte: today, 
            $lte: sevenDaysFromNow 
          },
          status: 'open'
        },
        select: 'title company deadline location type'
      })
      .sort({ 'job.deadline': 1 });
    
    // Filter out null jobs (from populate match)
    const upcomingJobs = savedJobs
      .filter(savedJob => savedJob.job !== null)
      .map(savedJob => {
        const job = savedJob.job.toObject();
        const deadline = new Date(job.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        return {
          id: savedJob._id,
          jobId: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          deadline: job.deadline,
          daysLeft: daysLeft,
          applied: savedJob.applied
        };
      });
    
    res.json({
      success: true,
      count: upcomingJobs.length,
      data: upcomingJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// GET: /api/jobs/recommended
const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userSkills = user.profile.skills || [];
    const userLocation = user.profile.location || '';
    const userPreferences = user.preferences || {};
    
    // Find jobs that match user's skills and preferences
    const query = {
      status: 'open',
      deadline: { $gt: new Date() }
    };
    
    // If user has skills, prioritize jobs with matching skills
    if (userSkills.length > 0) {
      query.$or = [
        { tags: { $in: userSkills } },
        { field: { $in: userPreferences.jobTypes || [] } }
      ];
    }
    
    // If user has location preference
    if (userLocation) {
      query.location = new RegExp(userLocation, 'i');
    }
    
    const jobs = await Job.find(query)
      .select('title company location salary type deadline description tags applications postedDate featured')
      .sort({ featured: -1, postedDate: -1 })
      .limit(10);
    
    // Calculate match percentage for each job
    const jobsWithMatch = await Promise.all(
      jobs.map(async (job) => {
        const jobObj = job.toObject();
        const matchPercentage = await calculateMatchPercentage(userId, job._id);
        return {
          ...jobObj,
          matchPercentage
        };
      })
    );
    
    // Sort by match percentage
    jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    res.json({
      success: true,
      count: jobsWithMatch.length,
      data: jobsWithMatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// GET: /api/jobs/:jobId/match-percentage
const getMatchPercentage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    const matchPercentage = await calculateMatchPercentage(userId, jobId);
    
    res.json({
      success: true,
      data: {
        jobId: job._id,
        title: job.title,
        company: job.company,
        matchPercentage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Helper function to calculate match percentage
const calculateMatchPercentage = async (userId, jobId) => {
  try {
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);
    
    if (!user || !job) return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // 1. Skills match (40 points)
    const userSkills = user.profile.skills || [];
    const jobTags = job.tags || [];
    
    if (userSkills.length > 0 && jobTags.length > 0) {
      const matchedSkills = userSkills.filter(skill => 
        jobTags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
      );
      const skillMatchPercentage = (matchedSkills.length / userSkills.length) * 100;
      score += (skillMatchPercentage * 0.4);
    }
    
    // 2. Location match (20 points)
    const userLocation = user.profile.location || '';
    const jobLocation = job.location || '';
    
    if (userLocation && jobLocation) {
      if (jobLocation.toLowerCase().includes('remote')) {
        score += 20;
      } else if (userLocation.toLowerCase().includes(jobLocation.toLowerCase()) || 
                 jobLocation.toLowerCase().includes(userLocation.toLowerCase())) {
        score += 20;
      }
    }
    
    // 3. Job type match (20 points)
    const userPreferences = user.preferences || {};
    const userJobTypes = userPreferences.jobTypes || [];
    
    if (userJobTypes.length > 0) {
      if (userJobTypes.some(type => job.type.toLowerCase().includes(type.toLowerCase()))) {
        score += 20;
      }
    }
    
    // 4. Field/Industry match (20 points)
    const userField = user.profile.education?.[0]?.field || '';
    const jobField = job.field || '';
    
    if (userField && jobField) {
      if (userField.toLowerCase().includes(jobField.toLowerCase()) ||
          jobField.toLowerCase().includes(userField.toLowerCase())) {
        score += 20;
      }
    }
    
    return Math.min(Math.round(score), 100);
  } catch (error) {
    return 0;
  }
};
// POST: /api/jobs/:jobId/save
const saveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if already saved
    const existingSavedJob = await SavedJob.findOne({
      user: userId,
      job: jobId
    });
    
    if (existingSavedJob) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved'
      });
    }
    
    // Save the job
    const savedJob = await SavedJob.create({
      user: userId,
      job: jobId,
      savedAt: new Date(),
      applied: false
    });
    
    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: {
        savedId: savedJob._id,
        jobId: job._id,
        title: job.title,
        company: job.company,
        savedAt: savedJob.savedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// POST: /api/jobs/:jobId/unsave
const unsaveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    
    // Find and delete the saved job
    const deletedSavedJob = await SavedJob.findOneAndDelete({
      user: userId,
      job: jobId
    });
    
    if (!deletedSavedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Job removed from saved',
      data: {
        jobId,
        removedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// DELETE: /api/saved-jobs/:savedJobId
const deleteSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { savedJobId } = req.params;
    
    // Find and delete the saved job
    const deletedSavedJob = await SavedJob.findOneAndDelete({
      _id: savedJobId,
      user: userId
    });
    
    if (!deletedSavedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Job removed from saved',
      data: {
        savedJobId,
        removedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// Export the axios instance as default

export default api;