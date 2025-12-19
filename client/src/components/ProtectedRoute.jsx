import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, hasAnyRole } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;

      if (!isAuthenticated) {
        // Not authenticated, redirect to login with return URL
        toast.info('Please log in to access this page');
        return;
      }

      // If roles are specified, check if user has any of the required roles
      if (roles.length > 0 && !hasAnyRole(roles)) {
        toast.error('You do not have permission to access this page');
        return;
      }

      // If we get here, user is authenticated and authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, loading, hasAnyRole, roles]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // User is authenticated but not authorized
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
