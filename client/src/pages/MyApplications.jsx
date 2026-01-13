import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, X, Plus, 
  TrendingUp, Users, Target, FileText,
  ChevronDown, Clock, Building, MapPin,
  Briefcase, DollarSign, Zap, Sparkles,
  Eye, Download, Share2, MessageSquare,
  CheckCircle, XCircle, AlertCircle, Loader2,
  Star, Bookmark, ExternalLink, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// API Functions
const applicationAPI = {
  getMyApplications: async (params = new URLSearchParams()) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/applications?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch applications');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  withdrawApplication: async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/withdraw`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to withdraw application');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getApplicationStats: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/applications/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

const ModernMyApplications = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    fromDate: '',
    toDate: ''
  });
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
    withdrawn: 0
  });

  // Status Configuration
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
      gradient: 'from-yellow-400 to-amber-400',
      badgeClass: 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
    },
    reviewing: {
      label: 'Under Review',
      icon: Eye,
      color: 'bg-blue-100 text-blue-800',
      gradient: 'from-blue-400 to-cyan-400',
      badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-200'
    },
    interviewing: {
      label: 'Interviewing',
      icon: Users,
      color: 'bg-purple-100 text-purple-800',
      gradient: 'from-purple-400 to-pink-400',
      badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-200'
    },
    offered: {
      label: 'Offered',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
      gradient: 'from-green-400 to-emerald-400',
      badgeClass: 'bg-green-500/10 text-green-700 border-green-200'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      color: 'bg-red-100 text-red-800',
      gradient: 'from-red-400 to-rose-400',
      badgeClass: 'bg-red-500/10 text-red-700 border-red-200'
    },
    withdrawn: {
      label: 'Withdrawn',
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-800',
      gradient: 'from-gray-400 to-slate-400',
      badgeClass: 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses', icon: FileText },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'reviewing', label: 'Under Review', icon: Eye },
    { value: 'interviewing', label: 'Interviewing', icon: Users },
    { value: 'offered', label: 'Offered', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', icon: XCircle },
    { value: 'withdrawn', label: 'Withdrawn', icon: AlertCircle }
  ];

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await applicationAPI.getMyApplications(params);
      const apps = response.data || response || [];
      setApplications(apps);
      
      // Calculate stats from fetched data
      const newStats = {
        total: apps.length,
        pending: apps.filter(app => app.status === 'pending').length,
        reviewing: apps.filter(app => app.status === 'reviewing').length,
        interviewing: apps.filter(app => app.status === 'interviewing').length,
        offered: apps.filter(app => app.status === 'offered').length,
        rejected: apps.filter(app => app.status === 'rejected').length,
        withdrawn: apps.filter(app => app.status === 'withdrawn').length
      };
      setStats(newStats);
      
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await applicationAPI.getApplicationStats();
      const statsData = response.data || response || {};
      setStats(prev => ({ ...prev, ...statsData }));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchApplications();
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refreshing]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || filters.status !== 'all' || filters.fromDate || filters.toDate) {
        fetchApplications();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      fromDate: '',
      toDate: ''
    });
    setSearchQuery('');
    setShowFilters(false);
  };

  const handleApplyFilters = () => {
    fetchApplications();
    setShowFilters(false);
  };

  const handleWithdraw = async (applicationId, applicationTitle) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${applicationTitle}"?`)) return;
    
    try {
      await applicationAPI.withdrawApplication(applicationId);
      toast.success('Application withdrawn successfully');
      fetchApplications();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      toast.error('Failed to withdraw application');
    }
  };

  const exportApplications = () => {
    if (applications.length === 0) {
      toast.warning('No applications to export');
      return;
    }

    const data = applications.map(app => ({
      'Job Title': app.title || 'N/A',
      'Company': app.company || 'N/A',
      'Applied Date': app.appliedDate || 'N/A',
      'Status': statusConfig[app.status]?.label || 'N/A',
      'Location': app.location || 'N/A',
      'Type': app.type || 'N/A',
      'Salary': app.salary || 'N/A'
    }));
    
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `my-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${applications.length} applications`);
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        `"${String(value || '').replace(/"/g, '""')}"`
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Applications
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Track and manage all your job applications in one place
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center gap-3">
              <button
                onClick={exportApplications}
                disabled={applications.length === 0}
                className="px-5 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2"
              >
                <Loader2 className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Track New
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {applications.length > 0 ? '+12.5%' : '--'}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
              <div className="text-gray-600 font-medium">Total Applications</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stats.pending > 0 ? '+5.2%' : '--'}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.pending + stats.reviewing}</div>
              <div className="text-gray-600 font-medium">In Progress</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stats.interviewing > 0 ? '+8.7%' : '--'}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.interviewing}</div>
              <div className="text-gray-600 font-medium">Interviewing</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stats.offered > 0 ? '+23.1%' : '--'}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.offered}</div>
              <div className="text-gray-600 font-medium">Offers Received</div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    disabled={loading}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              disabled={loading}
              className={`px-6 py-4 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                showFilters || filters.status !== 'all' || filters.fromDate || filters.toDate
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md'
              }`}
            >
              <Filter className="h-5 w-5" />
              Filters
              {(filters.status !== 'all' || filters.fromDate || filters.toDate) && (
                <span className="h-2 w-2 bg-white rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filter Applications</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          disabled={loading}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-50"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* From Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={filters.fromDate}
                          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                          disabled={loading}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* To Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={filters.toDate}
                          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                          disabled={loading}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleClearFilters}
                      disabled={loading}
                      className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                      Clear All Filters
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowFilters(false)}
                        disabled={loading}
                        className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApplyFilters}
                        disabled={loading}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {(filters.status !== 'all' || filters.fromDate || filters.toDate) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  {statusOptions.find(opt => opt.value === filters.status)?.label}
                  <button
                    onClick={() => setFilters({ ...filters, status: 'all' })}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {filters.fromDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                  From: {new Date(filters.fromDate).toLocaleDateString()}
                  <button
                    onClick={() => setFilters({ ...filters, fromDate: '' })}
                    disabled={loading}
                    className="text-emerald-500 hover:text-emerald-700 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {filters.toDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">
                  To: {new Date(filters.toDate).toLocaleDateString()}
                  <button
                    onClick={() => setFilters({ ...filters, toDate: '' })}
                    disabled={loading}
                    className="text-amber-500 hover:text-amber-700 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-blue-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Applications</h3>
              <p className="text-gray-600">Fetching your applications from the server...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={fetchApplications}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-lg shadow-red-500/25"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications List */}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{applications.length}</span> applications
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Click on any application for detailed view</span>
              </div>
            </div>

            {applications.map((app, index) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={app.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left Section */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Company Logo */}
                      <div className="relative">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-700 shadow-sm">
                          {app.company?.charAt(0) || 'C'}
                        </div>
                        {app.isFavorite && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="h-3 w-3 text-white fill-white" />
                          </div>
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                              {app.title || 'Job Title'}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              {app.company || 'Company'} • {app.location || 'Location'}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${status.badgeClass}`}>
                                <StatusIcon className="h-4 w-4" />
                                {status.label}
                              </span>
                              
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Applied {formatDate(app.appliedDate || app.createdAt)}
                              </span>
                              
                              {app.type && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {app.type}
                                  </span>
                                </>
                              )}
                              
                              {app.salary && (
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  {app.salary}
                                </span>
                              )}
                            </div>
                            
                            {app.description && (
                              <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                                {app.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Bookmark className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-3 lg:pl-6 lg:border-l lg:border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 group/btn"
                        >
                          <Eye className="h-4 w-4 group-hover/btn:text-blue-600" />
                          View
                        </button>
                        
                        {app.status === 'pending' || app.status === 'reviewing' ? (
                          <button
                            onClick={() => handleWithdraw(app.id, app.title)}
                            className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 flex items-center gap-2 group/btn"
                          >
                            <XCircle className="h-4 w-4 group-hover/btn:text-red-600" />
                            Withdraw
                          </button>
                        ) : app.status === 'interviewing' ? (
                          <button className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 rounded-xl font-medium hover:from-purple-100 hover:to-pink-100 transition-all duration-200 flex items-center gap-2 group/btn">
                            <Users className="h-4 w-4 group-hover/btn:text-purple-600" />
                            Prepare
                          </button>
                        ) : app.status === 'offered' ? (
                          <button className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 rounded-xl font-medium hover:from-green-100 hover:to-emerald-100 transition-all duration-200 flex items-center gap-2 group/btn">
                            <CheckCircle className="h-4 w-4 group-hover/btn:text-green-600" />
                            Accept
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
          >
            <div className="p-12 text-center">
              <div className="relative mb-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-45 animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                
                <div className="absolute top-0 right-1/4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce">
                  <Zap className="h-4 w-4 text-white m-1" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No applications found
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || filters.status !== 'all' || filters.fromDate || filters.toDate
                  ? "We couldn't find any applications matching your search criteria. Try adjusting your filters."
                  : "You haven't applied to any jobs yet. Start your journey to find your dream role!"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-3"
                >
                  <Sparkles className="h-5 w-5" />
                  Browse Jobs
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ status: 'all', fromDate: '', toDate: '' })}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 border border-gray-200 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Plus className="h-5 w-5" />
                  Track Application
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Get Started Quickly
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { icon: Building, text: 'Search by company', color: 'bg-blue-50 text-blue-600' },
                    { icon: MapPin, text: 'Filter by location', color: 'bg-emerald-50 text-emerald-600' },
                    { icon: DollarSign, text: 'Set salary expectations', color: 'bg-amber-50 text-amber-600' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${item.color.split(' ')[0]} rounded-lg`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pro Tip: Track Everything</h4>
                <p className="text-sm text-gray-600">
                  Keep track of application deadlines, interview dates, and follow-ups to stay organized throughout your job search.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Track Your Progress</h4>
                <p className="text-sm text-gray-600">
                  Monitor your application success rate and identify areas for improvement in your job search strategy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                    <p className="text-gray-600 mt-1">Complete information about this application</p>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
                      {selectedApplication.company?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedApplication.title || 'Job Title'}</h3>
                      <p className="text-gray-600">{selectedApplication.company || 'Company'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${
                          statusConfig[selectedApplication.status]?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusConfig[selectedApplication.status]?.label || 'Unknown Status'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Applied Date" value={formatDate(selectedApplication.appliedDate)} />
                    <DetailItem label="Location" value={selectedApplication.location || 'N/A'} />
                    <DetailItem label="Job Type" value={selectedApplication.type || 'N/A'} />
                    <DetailItem label="Salary" value={selectedApplication.salary || 'Not specified'} />
                    <DetailItem label="Application ID" value={selectedApplication.id || 'N/A'} />
                    <DetailItem label="Status Last Updated" value={formatDate(selectedApplication.updatedAt)} />
                  </div>

                  {/* Description */}
                  {selectedApplication.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-600 whitespace-pre-line">{selectedApplication.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Notes</h4>
                    <textarea
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Add notes about this application (interview experiences, follow-up actions, etc.)"
                      defaultValue={selectedApplication.notes || ''}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex-1"
                    >
                      Close
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex-1">
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-gray-900 font-medium">{value || 'N/A'}</p>
  </div>
);

export default MyApplications;