import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  User, 
  Sun, 
  Moon,
} from 'lucide-react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import JobCard from '../components/JobCard';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { jobAPI, userAPI } from '../services/api';


const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('recommended');
  const [dashboardData, setDashboardData] = useState({
    recommendedJobs: [],
    recentApplications: [],
    stats: {
      totalApplications: 0,
      activeJobs: 0,
      profileCompletion: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch jobs
        const jobsResponse = await jobAPI.getJobs({ limit: 4 });
        let applicationsResponse = { data: [] };
        
        if (profile?.id) {
          try {
            // Fetch applications
            const appsResponse = await applicationAPI.getMyApplications();
            applicationsResponse = { data: appsResponse.data || [] };
            
            // Update user profile
            const userProfile = await userAPI.getProfile();
            updateProfile(userProfile.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

        setDashboardData({
          recommendedJobs: jobsResponse.data || [],
          recentApplications: applicationsResponse.data?.slice(0, 3) || [],
          stats: {
            totalApplications: applicationsResponse.data?.length || 0,
            activeJobs: jobsResponse.data?.length || 0,
            profileCompletion: calculateProfileCompletion(profile)
          },
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data. Please try again later.'
        }));
      }
    };

    fetchDashboardData();
  }, [profile?.id, updateProfile]);

  const calculateProfileCompletion = (userProfile) => {
    if (!userProfile) return 0;
    const fields = [
      userProfile.first_name,
      userProfile.last_name,
      userProfile.email,
      userProfile.phone,
      userProfile.bio,
      userProfile.skills,
      userProfile.experience,
      userProfile.education
    ];
    const filledFields = fields.filter(field => 
      Array.isArray(field) ? field.length > 0 : !!field
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className={`text-xl font-bold ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'} transition-colors`}>
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <NavLink to="/jobs" className={({ isActive }) => `px-3 py-2 rounded-lg transition-colors ${isActive ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-700') : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}>
                  Jobs
                </NavLink>
                <NavLink to="/myapplications" className={({ isActive }) => `px-3 py-2 rounded-lg transition-colors ${isActive ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-700') : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}>
                  My Applications
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'} rounded-md leading-5 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="Search jobs..."
                />
              </div>

              <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-gray-600 hover:text-gray-900'} focus:outline-none transition-colors`} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              
              <div className={`ml-1 cursor-pointer rounded-full p-1 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'}`} onClick={() => navigate('/profile')} title="View Profile">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Profile */}
          <div className="lg:w-1/4 space-y-6">
            <div className={`rounded-xl shadow-sm p-6 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center space-x-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <User className={`h-8 w-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.name || 'User'}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {profile?.role || 'Student'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Welcome Card */}
            <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-sm p-6 text-white ${darkMode ? 'shadow-lg shadow-purple-900/30' : ''}`}>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.name?.split(' ')[0] || 'User'}!</h2>
              <p className="mb-4 opacity-90">
                {dashboardData.stats.totalApplications > 0 
                  ? `You have ${dashboardData.stats.totalApplications} applications in progress. Keep it up!`
                  : 'Start applying to jobs to see your applications here.'}
              </p>
              <button 
                onClick={() => navigate('/myapplications')} 
                className={`px-4 py-2 ${darkMode ? 'bg-white/90 text-purple-700 hover:bg-white' : 'bg-white text-purple-600 hover:bg-opacity-90'} rounded-lg text-sm font-medium transition`}
              >
                {dashboardData.stats.totalApplications > 0 ? 'View Applications' : 'Browse Jobs'}
              </button>
            </div>

            {/* Loading State */}
            {dashboardData.loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            )}

            {/* Error State */}
            {dashboardData.error && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
                {dashboardData.error}
              </div>
            )}

            {/* Recommended Jobs */}
            {!dashboardData.loading && dashboardData.recommendedJobs.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recommended Jobs</h3>
                  <button 
                    onClick={() => navigate('/jobs')}
                    className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
                  >
                    View all
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dashboardData.recommendedJobs.map(job => (
                    <JobCard key={job.id} job={job} darkMode={darkMode} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;