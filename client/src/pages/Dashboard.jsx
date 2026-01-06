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
  X 
} from 'lucide-react';

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
  const { profile, updateProfile, loading: profileLoading } = useProfile();
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

  // Fetch dashboard data when component mounts or when profile changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (profileLoading) return;
      
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        // Calculate profile completion first
        const profileCompletion = calculateProfileCompletion(profile);
        
        // Fetch jobs and applications in parallel
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
        
        // Update user profile if needed
        if (profile?.id) {
          try {
            const userProfile = await userAPI.getProfile();
            updateProfile(userProfile.data);
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
              <h3 className="font-medium mb-4 text-white">
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-red-900/30">
                    <span className="text-sm font-medium text-red-400">
                      15
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      Safaricom Application
                    </p>
                    <p className="text-sm text-gray-400">
                      Due in 2 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-yellow-900/30">
                    <span className="text-sm font-medium text-yellow-400">
                      20
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      Andela Technical Test
                    </p>
                    <p className="text-sm text-gray-400">
                      Due in 1 week
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-lg p-6 bg-gray-800 shadow-lg border border-gray-700">
              <h3 className="font-medium mb-3 text-white">
                Resources
              </h3>
              <p className="text-sm mb-4 text-gray-400">
                Enhance your profile and job search with our resources.
              </p>
              <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-700 text-white hover:bg-gray-600">
                Explore Resources
              </button>
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
            <div className="rounded-2xl shadow-sm p-6 bg-gray-800 border border-gray-700">
              <h3 className="text-lg font-medium mb-4 text-white">
                Saved Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300">
                  Web Development
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300">
                  Data Science
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300">
                  UI/UX Design
                </span>
              </div>
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
                  onClick={() => setActiveTab('saved')}
                  className={`border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'saved'
                      ? 'border-indigo-400 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
                  }`}
                >
                  Saved
                </button>
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