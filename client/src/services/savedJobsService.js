import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get all saved jobs for the current user
export const getSavedJobs = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }

    const response = await axios.get(`${API_URL}/saved-jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

// Save a job
export const saveJob = async (jobId, notes = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
      return null;
    }

    const response = await axios.post(
      `${API_URL}/saved-jobs`,
      { job_id: jobId, notes },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

// Remove a saved job
export const removeSavedJob = async (savedJobId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    await axios.delete(`${API_URL}/saved-jobs/${savedJobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};

// Check if a job is saved
export const isJobSaved = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { is_saved: false, saved_job_id: null };
    }

    const response = await axios.get(`${API_URL}/saved-jobs/check/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return { is_saved: false, saved_job_id: null };
  }
};

// Toggle save status of a job
export const toggleSaveJob = async (jobId, isCurrentlySaved, savedJobId = null) => {
  if (isCurrentlySaved && savedJobId) {
    await removeSavedJob(savedJobId);
    return { isSaved: false, savedJobId: null };
  } else {
    const result = await saveJob(jobId);
    return { isSaved: true, savedJobId: result.id };
  }
};
