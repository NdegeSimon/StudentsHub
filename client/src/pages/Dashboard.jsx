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
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { jobAPI, applicationAPI, userAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('recommended');
  
  // State for dashboard data
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

  // Fetch dashboard data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        // Fetch recommended jobs
        const jobsResponse = await jobAPI.getJobs({ limit: 4 });
        
        // Fetch user applications if user is logged in
        let applicationsResponse = { data: [] };
        if (profile?.id) {
          try {
            applicationsResponse = await applicationAPI.getMyApplications();
          } catch (error) {
            console.error('Error fetching applications:', error);
          }
          
          // Update profile completion status
          try {
            const userProfile = await userAPI.getProfile();
            updateProfile(userProfile.data);
          } catch (error) {
            console.error('Error fetching user profile:', error);
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
  }, [profile?.id]); // Refetch when profile changes

  // Helper function to calculate profile completion percentage
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
    
    const filledFields = fields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      return !!field;
    }).length;
    
    return Math.round((filledFields / fields.length) * 100);
  };
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className={`text-xl font-bold ${
                darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
              } transition-colors`}>
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link 
                  to="/jobs" 
                  className={`${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Jobs
                </Link>
                <Link 
                  to="#" 
                  className={`${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Internships
                </Link>
                <Link 
                  to="/myapplications" 
                  className={`${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  My Applications
                </Link>
                <NavLink 
                  to="/messages"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? darkMode 
          ? 'bg-blue-900 text-white' 
          : 'bg-blue-100 text-blue-700'
        : darkMode 
          ? 'text-gray-300 hover:bg-gray-700' 
          : 'text-gray-700 hover:bg-gray-100'
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
                  <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                  } rounded-md leading-5 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="Search jobs..."
                />
              </div>
              
              <button 
                className={`p-2 rounded-full ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none transition-colors`}
              >
                <HelpCircle className="h-6 w-6" />
              </button>
              <button 
                className={`p-2 rounded-full ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none transition-colors`}
              >
                <Bell className="h-6 w-6" />
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none transition-colors`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
              <div 
                className={`ml-1 cursor-pointer rounded-full p-1 transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'
                }`}
                onClick={() => navigate('/settings')}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  <Settings className="h-5 w-5" />
                </div>
              </div>
              <div 
                className={`ml-1 cursor-pointer rounded-full p-1 transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'
                }`}
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
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
            {/* Profile Section */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <User className={`h-8 w-8 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {profile.name}
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Student
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <NavLink
                  to="/myapplications"
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-purple-50 text-purple-700'
                        : darkMode
                        ? 'hover:bg-gray-700/50 text-gray-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`
                  }
                >
                  <Briefcase className={`h-5 w-5 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <span>My Applications</span>
                </NavLink>
                <button className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700/50 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                }`}>
                  <Clock className={`h-5 w-5 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <span>Recent Jobs</span>
                </button>
                <button className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700/50 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                }`}>
                  <Star className={`h-5 w-5 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <span>Saved Jobs</span>
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-red-900/30' : 'bg-red-100'
                  }`}>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      15
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Safaricom Application
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Due in 2 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'
                  }`}>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      20
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Andela Technical Test
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Due in 1 week
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Resources */}
            <div className={`rounded-xl p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-purple-50'
            }`}>
              <h3 className={`font-medium mb-3 ${
                darkMode ? 'text-white' : 'text-purple-800'
              }`}>
                Resources
              </h3>
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-400' : 'text-purple-700'
              }`}>
                Enhance your profile and job search with our resources.
              </p>
              <button className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              }`}>
                Explore Resources
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Welcome Card */}
            <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-sm p-6 text-white ${
              darkMode ? 'shadow-lg shadow-purple-900/30' : ''
            }`}>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {profile.name.split(' ')[0]}!</h2>
              <p className="mb-4 opacity-90">You have 3 applications in progress. Keep it up!</p>
              <button 
           onClick={() => navigate('/myapplications')}
           className={`px-4 py-2 ${
           darkMode ? 'bg-white/90 text-purple-700 hover:bg-white' : 'bg-white text-purple-600 hover:bg-opacity-90'
          } rounded-lg text-sm font-medium transition`}
>
  View Applications
</button>
            </div>

            {/* Saved Searches */}
            <div className={`rounded-2xl shadow-sm p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Saved Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode 
                    ? 'bg-purple-900/30 text-purple-300' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  Web Development
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode 
                    ? 'bg-purple-900/30 text-purple-300' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  Data Science
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode 
                    ? 'bg-purple-900/30 text-purple-300' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  UI/UX Design
                </span>
              </div>
            </div>

            {/* Job Listings */}
            <div className={`rounded-2xl shadow-sm transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <nav className="flex -mb-px px-6 pt-6">
                <button 
                  onClick={() => setActiveTab('recommended')}
                  className={`border-b-2 px-4 py-4 text-sm font-medium ${
                    activeTab === 'recommended'
                      ? darkMode 
                        ? 'border-indigo-400 text-white' 
                        : 'border-indigo-500 text-indigo-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:border-gray-400' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recommended
                </button>
                <button 
                  onClick={() => setActiveTab('recent')}
                  className={`border-b-2 px-4 py-4 text-sm font-medium ${
                    activeTab === 'recent'
                      ? darkMode 
                        ? 'border-indigo-400 text-white' 
                        : 'border-indigo-500 text-indigo-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:border-gray-400' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recent
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`border-b-2 px-4 py-4 text-sm font-medium ${
                    activeTab === 'saved'
                      ? darkMode 
                        ? 'border-indigo-400 text-white' 
                        : 'border-indigo-500 text-indigo-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:border-gray-400' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved
                </button>
              </nav>
              
              <div className="p-6">
                <p className={`text-sm mb-4 ${
                  darkMode ? 'text-white-400' : 'text-white-500'
                }`}>
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