import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProfileProvider } from "./context/ProfileContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import JobPostings from "./pages/JobPosting.jsx";
import MessagingSystem from "./pages/messages.jsx";
import InterviewPrep from "./pages/resources/InterviewPrep.jsx";
import Resources from "./pages/resources/Resources.jsx";
import ResumeBuilder from "./pages/resources/ResumeBuilder.jsx";
import NotFound from "./pages/NotFound.jsx";

// Components
import JobCard from "./components/JobCard.jsx";

// ------------------- Protected Route -------------------
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.info("Please log in to continue");
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (roles.length > 0 && user) {
    const role = user.role || user.user_type;
    if (!roles.includes(role)) {
      toast.error("Access denied");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// ------------------- App -------------------
const App = () => {
  // Apply dark mode to the root HTML element
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ProfileProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-gray-900 text-gray-100">
                <main className="container mx-auto px-4 py-8">
                  <Routes>

                    {/* Redirect root */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/myapplications"
                      element={
                        <ProtectedRoute roles={["student"]}>
                          <MyApplications />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/jobpostings"
                      element={
                        <ProtectedRoute roles={["company"]}>
                          <JobPostings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Public */}
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/job" element={<JobCard />} />
                    <Route path="/messages" element={<MessagingSystem />} />

                    {/* Resources */}
                    <Route 
                      path="/resources" 
                      element={
                        <ProtectedRoute>
                          <Resources />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/resume-builder" 
                      element={
                        <ProtectedRoute>
                          <ResumeBuilder />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/interview-prep" 
                      element={
                        <ProtectedRoute>
                          <InterviewPrep />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />

                  </Routes>
                </main>
              </div>
            </ErrorBoundary>
          </ProfileProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
