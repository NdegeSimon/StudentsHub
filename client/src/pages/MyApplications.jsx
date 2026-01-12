import { useState, useEffect } from 'react';
import { Search, Bell, Settings, HelpCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Backend API configuration
const API_BASE_URL = 'http://localhost:5001/api'; // Change this to your backend URL

// API functions
const applicationAPI = {
  getMyApplications: async (params) => {
    const response = await fetch(`${API_BASE_URL}/applications?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return await response.json();
  }
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await applicationAPI.getMyApplications(params);
        setApplications(response.data || response || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filterStatus, searchTerm]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger fetch through filterStatus dependency
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter applications locally if needed (optional - can be done on backend)
  const filteredApplications = applications;

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

  const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-xl font-bold text-purple-400">
                Studex
              </div>
              <nav className="hidden md:ml-10 md:flex space-x-1">
                <NavLink>Jobs</NavLink>
                <NavLink>Internships</NavLink>
                <NavLink active>My Applications</NavLink>
                <NavLink>Messages</NavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
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
                  {shortlistedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 rounded-lg leading-5 focus:outline-none sm:text-sm transition-colors"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
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
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && filteredApplications.length > 0 && (
            <div className="space-y-5">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-800 border border-gray-700 hover:border-purple-600 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between transition-all hover:shadow-lg hover:shadow-purple-900/20"
                >
                  {/* Left */}
                  <div className="flex gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center font-bold bg-gray-700 text-purple-400 text-xl">
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
          {!loading && !error && filteredApplications.length === 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  {searchTerm || filterStatus !== 'all' ? 'No applications found' : 'No applications yet'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Start applying for jobs and track them here. Your job search journey begins now!'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/50"
                  >
                    Browse Jobs
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// NavLink component for consistent styling
function NavLink({ children, active = false }) {
  return (
    <button
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-900 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}