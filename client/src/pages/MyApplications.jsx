import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, HelpCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { applicationAPI } from "../utils/api";

export default function MyApplications() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest'
  });

  // Fetch applications when component mounts or filters change
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params
        const params = new URLSearchParams();
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.sort) params.append('sort', filters.sort);
        
        const response = await applicationAPI.getMyApplications(params);
        setApplications(response.data || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filters]);

  const handleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? 'all' : status
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sort: e.target.value
    }));
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 mr-1.5" />;
      case 'accepted':
      case 'hired':
        return <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 mr-1.5 text-red-500" />;
      case 'withdrawn':
        return <AlertCircle className="h-4 w-4 mr-1.5 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 mr-1.5" />;
    }
  };

  const statusStyles = {
    'pending': 'bg-blue-900/50 text-blue-100 border-blue-700',
    'under_review': 'bg-purple-900/50 text-purple-100 border-purple-700',
    'shortlisted': 'bg-green-900/50 text-green-100 border-green-700',
    'interview': 'bg-yellow-900/50 text-yellow-100 border-yellow-700',
    'accepted': 'bg-green-900/50 text-green-100 border-green-700',
    'rejected': 'bg-red-900/50 text-red-100 border-red-700',
    'withdrawn': 'bg-gray-700 text-gray-200 border-gray-600'
  };

  const statusLabels = {
    'pending': 'Pending',
    'under_review': 'Under Review',
    'shortlisted': 'Shortlisted',
    'interview': 'Interview',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'withdrawn': 'Withdrawn'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-1">
                <NavLink to="/jobs">Jobs</NavLink>
                <NavLink to="/internships">Internships</NavLink>
                <NavLink to="/myapplications" active>My Applications</NavLink>
                <NavLink to="/messages">Messages</NavLink>
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
              
              <button className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Applications
              </h1>
              <p className="mt-2 text-gray-400">
                Monitor your job applications and follow their progress
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-6 md:mt-0">
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-center">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">
                  {applications.length}
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-center">
                <p className="text-sm text-gray-400">Shortlisted</p>
                <p className="text-2xl font-bold text-green-400">
                  {applications.filter(app => app.status === 'Shortlisted').length}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-2xl p-6 text-center">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && applications.length > 0 && (
            <div className="space-y-5">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-800 border border-gray-700 hover:border-purple-600 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between transition-all hover:shadow-lg hover:shadow-purple-900/20"
                >
                  {/* Left */}
                  <div className="flex gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center font-bold bg-gray-700 text-purple-400">
                      {app.company.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-white">
                        {app.title}
                      </h2>
                      <p className="text-sm text-gray-300">
                        {app.company}
                      </p>
                      <div className="flex gap-3 text-xs mt-2 text-gray-400">
                        <span>{app.type}</span>
                        <span>•</span>
                        <span>Applied on {app.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4 mt-5 lg:mt-0">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                      statusStyles[app.status] || statusStyles['pending']
                    }`}>
                      {statusLabels[app.status] || app.status}
                    </span>

                    <button className="px-4 py-2 rounded-full border border-purple-600 text-purple-400 hover:bg-purple-900/50 text-sm font-medium transition-colors">
                      View Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && applications.length === 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-6">
                  <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  No applications yet
                </h2>
                <p className="text-gray-400 mb-6">
                  Start applying for jobs and track them here. Your job search journey begins now!
                </p>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/50"
                >
                  Browse Jobs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// NavLink component for consistent styling
function NavLink({ to, children, active = false }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-900 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}