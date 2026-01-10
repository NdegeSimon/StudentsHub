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
  updateProfile: (data) => api.put('/profile', data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
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
  getUpcomingDeadlines: () => api.get('/applications/upcoming-deadlines'),
};
export const initSocket = (token, userId) => {
  if (socket) socket.disconnect();
  
  socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
    auth: { token },
    query: { userId }
  });
  
  return socket;
};

// Get socket instance
export const getSocket = () => socket;

// API calls
export const messageAPI = {
  // Get all conversations
  getConversations: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  // Create or get conversation
  createConversation: async (otherUserId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/messages/conversations/${otherUserId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  
  // Get messages
  getMessages: async (conversationId, page = 1, perPage = 50) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE_URL}/messages/conversations/${conversationId}/messages`,
      {
        params: { page, per_page: perPage },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },
  
  // Upload file
  uploadFile: async (file, conversationId) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', conversationId);
    
    const response = await axios.post(
      `${API_BASE_URL}/messages/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },
  
  // Mark message as read
  markAsRead: async (messageId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/messages/${messageId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

// WebSocket events
export const setupSocketEvents = (socket, callbacks) => {
  if (!socket) return;
  
  socket.on('connect', () => {
    console.log('Connected to WebSocket');
    socket.emit('join', { user_id: callbacks.userId });
  });
  
  socket.on('new_message', (message) => {
    callbacks.onNewMessage && callbacks.onNewMessage(message);
  });
  
  socket.on('user_typing', (data) => {
    callbacks.onUserTyping && callbacks.onUserTyping(data);
  });
  
  socket.on('message_read_status', (data) => {
    callbacks.onMessageRead && callbacks.onMessageRead(data);
  });
  
  socket.on('reaction_added', (data) => {
    callbacks.onReactionAdded && callbacks.onReactionAdded(data);
  });
  
  socket.on('user_online', (data) => {
    callbacks.onUserOnline && callbacks.onUserOnline(data);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};
export default api;
