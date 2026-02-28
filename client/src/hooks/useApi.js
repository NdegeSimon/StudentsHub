import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const useApi = (apiCall, options = {}) => {
  const { showToast = true, autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const { logout } = useAuth();

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(params);
      // Support apiCall returning either an axios-like response or the parsed data
      const payload = (response && response.data !== undefined) ? response.data : response;
      setData(payload);
      return payload;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      
      // Handle unauthorized errors
      if (err.response?.status === 401) {
        logout();
        if (showToast) {
          toast.error('Your session has expired. Please log in again.');
        }
      } else if (showToast) {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, logout, showToast]);

  // Auto-fetch when the component mounts if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    error,
    loading,
    fetchData,
    setData, // Allow manual updates to the data
  };
};

export default useApi;
