// searchService.js
import axios from 'axios';

// Use a direct URL instead of environment variable
const API_URL = 'http://localhost:5000/api';

// Get all saved searches for the current user
export const getSavedSearches = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }

    const response = await axios.get(`${API_URL}/searches`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    throw error;
  }
};

// Save a new search or update an existing one
export const saveSearch = async (searchQuery, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return null;
    }

    const response = await axios.post(
      `${API_URL}/searches`,
      { search_query: searchQuery, filters },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};

// Delete a saved search
export const deleteSavedSearch = async (searchId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    await axios.delete(`${API_URL}/searches/${searchId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    throw error;
  }
};