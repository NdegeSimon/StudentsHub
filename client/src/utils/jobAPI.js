import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: `${API_URL}/jobs`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API methods
export const jobAPI = {
  // Get all jobs with optional filters
  getAllJobs: async (filters = {}) => {
    try {
      const response = await api.get('/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error.response?.data || { error: 'Failed to fetch jobs' };
    }
  },

  // Get a single job by ID
  getJob: async (jobId) => {
    try {
      const response = await api.get(`/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job ${jobId}:`, error);
      throw error.response?.data || { error: 'Failed to fetch job details' };
    }
  },

  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await api.post('/', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error.response?.data || { error: 'Failed to create job' };
    }
  },

  // Update an existing job
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error(`Error updating job ${jobId}:`, error);
      throw error.response?.data || { error: 'Failed to update job' };
    }
  },

  // Delete a job (soft delete)
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting job ${jobId}:`, error);
      throw error.response?.data || { error: 'Failed to delete job' };
    }
  },

  // Save a job for the current user
  saveJob: async (jobId) => {
    try {
      const response = await api.post(`/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error(`Error saving job ${jobId}:`, error);
      throw error.response?.data || { error: 'Failed to save job' };
    }
  },

  // Unsave a job for the current user
  unsaveJob: async (jobId) => {
    try {
      const response = await api.delete(`/${jobId}/unsave`);
      return response.data;
    } catch (error) {
      console.error(`Error unsaving job ${jobId}:`, error);
      throw error.response?.data || { error: 'Failed to unsave job' };
    }
  },

  // Get all saved jobs for the current user
  getSavedJobs: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get('/saved', {
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error.response?.data || { error: 'Failed to fetch saved jobs' };
    }
  },

  // Search jobs with filters
  searchJobs: async (searchParams) => {
    try {
      const response = await api.get('/', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error.response?.data || { error: 'Failed to search jobs' };
    }
  },
};

export default jobAPI;
