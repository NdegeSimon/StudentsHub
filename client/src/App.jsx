import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import LandingPage from "./pages/LandinPage.jsx";
import SavedJobsPage from './pages/SavedJobs.jsx';
import EmployerDashboard from "./pages/EmployerDashboard.jsx";

// Employer Components - You need to create these files
import EmployerJobs from "./pages/employer/EmployerJobs.jsx";
import EmployerApplicants from "./pages/employer/EmployerApplicants.jsx";
import EmployerAnalytics from "./pages/employer/EmployerAnalytics.jsx";
import EmployerSettings from "./pages/employer/EmployerSettings.jsx";
import EmployerMessages from "./pages/employer/EmployerMessages.jsx";

// Other imports
import JobPostings from "./pages/JobPosting.jsx";
import MessagingSystem from "./pages/messages.jsx";
import InterviewPrep from "./pages/resources/InterviewPrep.jsx";
import Resources from "./pages/resources/Resources.jsx";
import ResumeBuilder from "./pages/resources/ResumeBuilder.jsx";
import CareerTips from "./pages/resources/CareerTips.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import PremiumPayment from "./pages/PremiumPayment.jsx";
import ApplicationsList from "./pages/ApplicationsList.jsx";
import InternshipsPage from "./pages/internships.jsx";

// Company Components
import CompanyProfile from "./pages/company/CompanyProfile.jsx";
import CompanyJobs from "./pages/company/CompanyJobs.jsx";

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
              <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
                <ToastContainer 
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
                <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-[100vw]">
                  <Routes>

                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Employer Dashboard Routes */}
                    <Route
                      path="/employer"
                      element={
                        <ProtectedRoute roles={['employer', 'company']}>
                          <EmployerDashboard />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<EmployerDashboard />} />
                      <Route path="jobs" element={<EmployerJobs />} />
                      <Route path="applicants" element={<EmployerApplicants />} />
                      <Route path="analytics" element={<EmployerAnalytics />}>
                        <Route path="overview" element={<div>Overview</div>} />
                        <Route path="reports" element={<div>Reports</div>} />
                      </Route>
                      <Route path="settings" element={<EmployerSettings />} />
                      <Route path="messages" element={<EmployerMessages />} />
                    </Route>

                    <Route
                      path="/employer/dashboard"
                      element={
                        <ProtectedRoute roles={['employer', 'company']}>
                          <EmployerDashboard />
                        </ProtectedRoute>
                      }
                    />

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
                    
                    {/* Admin Routes - Only accessible to users with 'admin' role */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <ErrorBoundary>
                            <AdminDashboard />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<div>User Management</div>} />
                      <Route path="settings" element={<div>Admin Settings</div>} />
                      <Route path="reports" element={<div>Reports</div>} />
                    </Route>

                    {/* Redirect old admin route to new one */}
                    <Route 
                      path="/admindashboard" 
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <Navigate to="/admin" replace />
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
                      path="/my-applications"
                      element={
                        <ProtectedRoute roles={["student"]}>
                          <ApplicationsList />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Redirect old route to new one for backward compatibility */}
                    <Route 
                      path="/myapplications"
                      element={
                        <Navigate to="/my-applications" replace />}
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
                    
                    <Route path="/messages" element={<MessagingSystem />} />
                    <Route path="/premium-payment" element={<PremiumPayment />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route path="/internships" element={<InternshipsPage />} />
                    <Route path="/saved-jobs" element={<SavedJobsPage />} />                
                                         
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

                    <Route 
                      path="/career-tips" 
                      element={
                        <ProtectedRoute>
                          <CareerTips />
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