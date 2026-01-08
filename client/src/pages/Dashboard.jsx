import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  User, 
  BookOpen, 
  Briefcase, 
  Clock, 
  Star, 
  Sun, 
  Moon,
  Menu, 
  X,
  FileText,
  Mic,
  Zap,
  TrendingUp,
  Award,
  UserCheck,
  FileQuestion,
  ChevronRight,
  X as XIcon,
} from 'lucide-react';
import { getSavedSearches, deleteSavedSearch } from '../services/searchService';
import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, BookOpenText } from 'lucide-react';
import { getSavedJobs, toggleSaveJob } from '../services/savedJobsService';

import { NavLink } from "react-router-dom";
import JobCard from '../components/JobCard';
import MyApplications from './MyApplications';
import Profile from './Profile';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { jobAPI, applicationAPI, userAPI } from '../utils/api';


// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (userProfile) => {
  if (!userProfile) return 0;
  
  // Define required fields and their weights
  const fields = [
    { key: 'first_name', weight: 20 },
    { key: 'last_name', weight: 15 },
    { key: 'email', weight: 15 },
    { key: 'phone', weight: 10 },
    { key: 'bio', weight: 10 },
    { key: 'skills', weight: 15, isArray: true },
    { key: 'experience', weight: 10, isArray: true },
    { key: 'education', weight: 5, isArray: true }
  ];
  
  // Calculate completion based on filled fields and their weights
  return fields.reduce((total, field) => {
    const value = userProfile[field.key];
    const isFilled = field.isArray 
      ? Array.isArray(value) && value.length > 0 
      : !!value;
    return total + (isFilled ? field.weight : 0);
  }, 0);
};

const Dashboard = () => {
const navigate = useNavigate();
const [savedJobs, setSavedJobs] = useState([]);
const [savedJobIds, setSavedJobIds] = useState({});
const [isLoadingSavedJobs, setIsLoadingSavedJobs] = useState(false);

  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('recommended');
  const [savedSearches, setSavedSearches] = useState([]);
  const [loadingSearches, setLoadingSearches] = useState(true);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
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

  // Function to fetch upcoming deadlines
  const fetchUpcomingDeadlines = async () => {
    try {
      // Assuming you have an API endpoint to get upcoming deadlines
      // This is a placeholder - replace with your actual API call
      const response = await applicationAPI.getUpcomingDeadlines();
      if (response.data) {
        setUpcomingDeadlines(response.data);
      }
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
    }
  };

  // Fetch saved searches
  const fetchSavedSearches = async () => {
    try {
      setLoadingSearches(true);
      const searches = await getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoadingSearches(false);
    }
  };

  // Handle delete saved search
  const handleDeleteSearch = async (searchId, e) => {
    e.stopPropagation();
    try {
      await deleteSavedSearch(searchId);
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
    } catch (error) {
      console.error('Error deleting saved search:', error);
    }
  };

  // Fetch dashboard data when component mounts or when profile changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (profileLoading) return;
      
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        // Calculate profile completion first
        const profileCompletion = calculateProfileCompletion(profile);
        
        // Fetch jobs, applications, and saved searches in parallel
        const [jobsResponse, appsResponse] = await Promise.allSettled([
          jobAPI.getAllJobs({ limit: 4 }),
          profile?.id ? applicationAPI.getMyApplications() : Promise.resolve({ data: [] })
        ]);
        
        const jobs = jobsResponse.status === 'fulfilled' ? jobsResponse.value.data : [];
        const applications = appsResponse.status === 'fulfilled' ? appsResponse.value.data : [];
        
        // Calculate stats
        const totalApplications = applications.length;
        const activeJobs = applications.filter(app => 
          ['applied', 'interview', 'offer'].includes(app.status)
        ).length;
        
        // Update dashboard data
        setDashboardData({
          recommendedJobs: Array.isArray(jobs) ? jobs : [],
          recentApplications: Array.isArray(applications) ? applications.slice(0, 3) : [],
          stats: {
            totalApplications,
            activeJobs,
            profileCompletion
          },
          loading: false,
          error: null
        });
        
        // Fetch upcoming deadlines after dashboard data is loaded
        if (profile?.id) {
          await fetchUpcomingDeadlines();
        }
        
        // Update user profile if needed
        if (profile?.id) {
          try {
            const userProfile = await userAPI.getProfile();
            updateProfile(userProfile.data);
            // Fetch saved searches after profile is loaded
            await fetchSavedSearches();
          } catch (error) {
            console.error('Error updating user profile:', error);
          }
        }
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
  }, [profile?.id, profileLoading, updateProfile]);
  
  // Show loading state while data is being fetched
  if (profileLoading || dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const loadSavedJobs = async () => {
  try {
    setIsLoadingSavedJobs(true);
    const jobs = await getSavedJobs();
    setSavedJobs(jobs);
    
  const savedMap = {};
    jobs.forEach(job => {
      savedMap[job.job_id] = { 
        isSaved: true, 
        savedJobId: job.id 
      };
    });
    setSavedJobIds(savedMap);
  } catch (error) {
    console.error('Error loading saved jobs:', error);
  } finally {
    setIsLoadingSavedJobs(false);
  }
};
useEffect(() => {
  if (activeTab === 'saved') {
    loadSavedJobs();
  }
}, [activeTab]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link 
                  to="/jobs" 
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Jobs
                </Link>
                <Link 
                  to="#" 
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Internships
                </Link>
                <Link 
                  to="/myapplications" 
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  My Applications
                </Link>
                <NavLink 
                  to="/messages"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Messages
                </NavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 rounded-md leading-5 focus:outline-none sm:text-sm transition-colors"
                  placeholder="Search jobs..."
                />
              </div>
              
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              {/* <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-yellow-300 hover:text-yellow-200 focus:outline-none transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button> */}
              <div 
                className="ml-1 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-700"
                onClick={() => navigate('/settings')}
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-700 text-purple-400">
                  <Settings className="h-5 w-5" />
                </div>
              </div>
              <div 
                className="ml-1 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-700"
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-700 text-purple-400">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
       
        
        {/* Dashboard Layout - Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Profile & Quick Actions */}
          <div className="lg:w-80 space-y-6">
            {/* Profile Card */}
            <div className="rounded-lg p-6 bg-gray-800 shadow-lg border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-purple-900/30">
                  <User className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {profile?.first_name || 'Guest User'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Student
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg p-6 bg-gray-800 shadow-lg border border-gray-700">
              <h3 className="font-medium mb-4 text-white">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <NavLink
                  to="/myapplications"
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'hover:bg-gray-700/50 text-gray-200'
                    }`
                  }
                >
                  <Briefcase className="h-5 w-5 text-purple-400" />
                  <span>My Applications</span>
                </NavLink>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-700/50 text-gray-200">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>Recent Jobs</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-700/50 text-gray-200">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span>Saved Jobs</span>
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-lg p-6 bg-gray-800 shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-white">
                  Upcoming Deadlines
                </h3>
                <button 
                  onClick={fetchUpcomingDeadlines}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  disabled={dashboardData.loading}
                >
                  {dashboardData.loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {dashboardData.loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                </div>
              ) : upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => {
                    // Calculate days until deadline
                    const dueDate = new Date(deadline.due_date);
                    const today = new Date();
                    const timeDiff = dueDate - today;
                    const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    
                    // Determine color based on urgency
                    const isUrgent = daysUntilDue <= 3;
                    const isWarning = daysUntilDue <= 7 && daysUntilDue > 3;
                    
                    return (
                      <div key={index} className="flex items-start group">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          isUrgent ? 'bg-red-900/30' : isWarning ? 'bg-yellow-900/30' : 'bg-blue-900/30'
                        }`}>
                          <span className={`text-sm font-medium ${
                            isUrgent ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400'
                          }`}>
                            {daysUntilDue}
                          </span>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate" title={deadline.title}>
                            {deadline.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {daysUntilDue === 0 
                              ? 'Due today' 
                              : daysUntilDue < 0 
                                ? `${Math.abs(daysUntilDue)} days ago` 
                                : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">
                  No upcoming deadlines
                </p>
              )}
            </div>

            {/* Resources */}
            <div className="rounded-lg p-6 bg-gray-800 shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-white">Resources</h3>
                <Link 
                  to="/resources" 
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {/* Interview Prep Card - Now functional */}
                <Link 
                  to="/interview-prep"
                  className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 transition-colors group"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Interview Prep</p>
                    <p className="text-xs text-gray-400">Practice common questions</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-500 group-hover:text-white transition-colors" />
                </Link>

                {/* Resume Builder Card - Now a Link */}
                <Link 
                  to="/resume-builder"
                  className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 transition-colors group"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Resume Builder</p>
                    <p className="text-xs text-gray-400">Create an ATS-friendly resume</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-500 group-hover:text-white transition-colors" />
                </Link>

                {/* Career Tips Card - Now a Link */}
                <Link 
                  to="/career-tips"
                  className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 transition-colors group"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Career Tips</p>
                    <p className="text-xs text-gray-400">Boost your job search</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-500 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Welcome Card with Profile Completion */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-900/30 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {profile?.first_name?.split(' ')[0] || 'there'}!
              </h2>
              <p className="mb-4 opacity-90">
                {dashboardData.stats.totalApplications > 0 
                  ? `You have ${dashboardData.stats.activeJobs} active applications. ${dashboardData.stats.totalApplications} total applications.`
                  : "You don't have any applications yet. Start applying to jobs!"}
              </p>
              {dashboardData.stats.profileCompletion < 80 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span>{dashboardData.stats.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${dashboardData.stats.profileCompletion}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-yellow-200">
                    Complete your profile to increase your chances of getting hired!
                  </p>
                </div>
              )}
              <button 
                onClick={() => navigate('/myapplications')}
                className="px-4 py-2 bg-white/90 text-purple-700 hover:bg-white rounded-lg text-sm font-medium transition"
              >
                View Applications
              </button>
            </div>

            {/* Saved Searches */}
            <div className="rounded-2xl shadow-sm p-4 sm:p-6 bg-gray-800 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">
                  Saved Searches
                </h3>
                {savedSearches.length > 3 && (
                  <button 
                    onClick={() => {}}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>
              
              {loadingSearches ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : savedSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {savedSearches.slice(0, 5).map((search) => (
                    <div 
                      key={search.id} 
                      className="group relative inline-flex items-center px-3 py-1.5 pr-7 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors cursor-pointer"
                      onClick={() => {
                        // Navigate to search results with the saved search query
                        navigate(`/jobs?q=${encodeURIComponent(search.search_query)}`);
                      }}
                    >
                      {search.search_query}
                      <button 
                        className="absolute right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-purple-800/50"
                        onClick={(e) => handleDeleteSearch(search.id, e)}
                        title="Remove saved search"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Your saved searches will appear here</p>
              )}
            </div>

            {/* Job Listings */}
            <div className="rounded-2xl shadow-sm bg-gray-800 border border-gray-700">
              <nav className="flex border-b border-gray-700 px-6 pt-6">
                <button 
                  onClick={() => setActiveTab('recommended')}
                  className={`border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'recommended'
                      ? 'border-indigo-400 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
                  }`}
                >
                  Recommended
                </button>
                <button 
                  onClick={() => setActiveTab('recent')}
                  className={`border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'recent'
                      ? 'border-indigo-400 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
                  }`}
                >
                  Recent
                </button>
                <button 
  onClick={() => {
    setActiveTab('saved');
    loadSavedJobs();
  }}
  className={`border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
    activeTab === 'saved'
      ? 'border-indigo-400 text-white' 
      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
  }`}
>
  Saved
</button>

// Add this after your tab buttons to display the saved jobs
{activeTab === 'saved' && (
  <div className="p-6">
    {isLoadingSavedJobs ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ) : savedJobs.length > 0 ? (
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <div 
            key={job.id} 
            className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">{job.job_title}</h4>
                <p className="text-sm text-gray-400">{job.company_name}</p>
                <p className="text-xs text-gray-500 mt-1">{job.location}</p>
              </div>
              <button
                onClick={() => handleSaveJob(job.job_id)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
                title={savedJobIds[job.job_id]?.isSaved ? "Remove from saved" : "Save job"}
              >
                {savedJobIds[job.job_id]?.isSaved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full">
                {job.job_type || 'Full-time'}
              </span>
              <span className="text-xs text-gray-400">
                {job.salary_min && job.salary_max ? 
                  `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()} ${job.salary_currency || ''}`.trim() : 
                  'Salary not specified'}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <BookOpenText className="h-12 w-12 mx-auto text-gray-600 mb-3" />
        <p className="text-gray-400">No saved jobs yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Save jobs to view them here
        </p>
      </div>
    )}
  </div>
)}
              </nav>
              
              <div className="p-6">
                <p className="text-sm mb-4 text-gray-400">
                  Find your next opportunity by browsing through our curated job listings.
                </p>
                
                {/* Job Cards */}
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: 'Full Stack Developer',
                      company: 'Safaricom PLC',
                      salary: 'KSh 250,000 - 400,000/mo',
                      postedDate: '2 days ago',
                      description: 'Join our technology team to develop and maintain enterprise applications for East Africa\'s leading telco.',
                      tags: ['React', 'Node.js', 'TypeScript']
                    },
                    {
                      id: 2,
                      title: 'UI/UX Designer Intern',
                      company: 'Andela Kenya',
                      salary: 'KSh 50,000 - 80,000/mo',
                      postedDate: '1 day ago',
                      description: 'Internship opportunity for creative designers to work on global projects and build their portfolio.',
                      tags: ['Figma', 'UI/UX', 'Internship']
                    },
                    {
                      id: 5,
                      title: 'Data Science Intern',
                      company: 'BasiGo',
                      salary: 'KSh 40,000 - 70,000/mo',
                      postedDate: '1 week ago',
                      description: 'Internship for data enthusiasts to work on electric vehicle data analytics.',
                      tags: ['Python', 'Data Analysis', 'Internship']
                    }
                  ].map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.title}
                      company={job.company}
                      salary={job.salary}
                      postedDate={job.postedDate}
                      description={job.description}
                      tags={job.tags}
                      onBookmark={() => console.log('Bookmarked:', job.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;