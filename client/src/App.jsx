import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages & Components
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import JobCard from "./components/JobCard.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import Dashboard from './pages/Dashboard.jsx';
import MyApplications from "./pages/MyApplications.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import MessagingSystem from "./pages/messages.jsx";
import JobPostings from "./pages/JobPosting.jsx";

// ------------------- Protected Route -------------------
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.info('Please log in to access this page');
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !hasAnyRole(roles)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ------------------- App -------------------
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/myapplications" element={
              <ProtectedRoute roles={['student']}>
                <MyApplications />
              </ProtectedRoute>
            } />
            <Route path="/jobpostings" element={
              <ProtectedRoute roles={['company']}>
                <JobPostings />
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/job" element={<JobCard />} />
            <Route path="/messages" element={<MessagingSystem />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProfileProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
