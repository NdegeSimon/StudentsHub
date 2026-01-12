import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from './api'; // Import the main api instance, not individual APIs

// Get authentication token
export const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user data
export const setUserData = (user, rememberMe = true) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(user));
};

// Set authentication token
export const setAuthToken = (token, rememberMe = true) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('token', token);
};

// Logout user
export const logout = (navigate) => {
  // Clear both localStorage and sessionStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  
  toast.success('Logged out successfully');
  
  if (navigate) {
    navigate('/login');
  }
};

// Check user role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

// Verify token with backend
export const verifyToken = async () => {
  const token = getAuthToken();
  if (!token) {
    console.log('No token found');
    return false;
  }

  try {
    const response = await api.get('/auth/me');
    
    // Handle different response structures
    let userData;
    if (response.data.user) {
      // Structure: { user: {...} }
      userData = response.data.user;
    } else if (response.data.data && response.data.data.user) {
      // Structure: { data: { user: {...} } }
      userData = response.data.data.user;
    } else {
      // Structure: direct user object
      userData = response.data;
    }
    
    setUserData(userData);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    
    // Auto logout on 401 (Unauthorized)
    if (error.response?.status === 401) {
      logout();
    }
    return false;
  }
};

// Login function
export const login = async (credentials, rememberMe = true) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success === false) {
      throw new Error(response.data.error || 'Login failed');
    }
    
    // Extract token and user from response
    let token, userData;
    
    if (response.data.token && response.data.user) {
      // Structure: { token: '...', user: {...} }
      token = response.data.token;
      userData = response.data.user;
    } else if (response.data.data && response.data.data.token) {
      // Structure: { data: { token: '...', user: {...} } }
      token = response.data.data.token;
      userData = response.data.data.user;
    } else {
      throw new Error('Invalid response structure');
    }
    
    // Store token and user
    setAuthToken(token, rememberMe);
    setUserData(userData, rememberMe);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    
    // Extract error message
    let errorMessage = 'Login failed';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Register function
export const register = async (userData, rememberMe = true) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success === false) {
      throw new Error(response.data.error || 'Registration failed');
    }
    
    // Extract token and user from response
    let token, newUser;
    
    if (response.data.token && response.data.user) {
      token = response.data.token;
      newUser = response.data.user;
    } else if (response.data.data && response.data.data.token) {
      token = response.data.data.token;
      newUser = response.data.data.user;
    } else {
      throw new Error('Invalid response structure');
    }
    
    // Store token and user
    setAuthToken(token, rememberMe);
    setUserData(newUser, rememberMe);
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Protected route wrapper
export const withAuth = (Component, roles = []) => {
  const WrappedComponent = (props) => {
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const isAuth = await verifyToken();
        
        if (!isAuth) {
          toast.error('Please log in to access this page');
          navigate('/login', { state: { from: props.location?.pathname || '/' } });
          return;
        }

        const user = getCurrentUser();
        if (roles.length > 0 && !roles.includes(user.role)) {
          toast.error('You do not have permission to access this page');
          navigate('/unauthorized');
          return;
        }

        setVerified(true);
        setLoading(false);
      };

      checkAuth();
    }, [navigate, props.location]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return verified ? <Component {...props} /> : null;
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
};

// Simple hook for authentication
export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        const isAuth = await verifyToken();
        if (isAuth) {
          setUser(getCurrentUser());
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: async (credentials, rememberMe) => {
      const result = await login(credentials, rememberMe);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    },
    register: async (userData, rememberMe) => {
      const result = await register(userData, rememberMe);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    },
    logout: () => {
      logout(navigate);
      setUser(null);
    },
    hasRole: (role) => hasRole(role),
    hasAnyRole: (roles) => hasAnyRole(roles)
  };
};

// Export everything
export default {
  getAuthToken,
  isAuthenticated,
  getCurrentUser,
  logout,
  hasRole,
  hasAnyRole,
  verifyToken,
  login,
  register,
  withAuth,
  useAuth
};