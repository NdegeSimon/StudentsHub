import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, X, Plus, TrendingUp, Users, Target, FileText,
  ChevronDown, Clock, Building, MapPin, Briefcase, DollarSign, Zap, Sparkles,
  Eye, Download, Share2, MessageSquare, CheckCircle, XCircle, AlertCircle, 
  Loader2, Star, Bookmark, ExternalLink, BarChart3, Bell, Trash2, Edit3,
  ArrowUpRight, TrendingDown, Activity, Award, Send, Phone, Mail, Moon, Sun,
  HelpCircle, Settings, User
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { applicationAPI, smartAPI } from '../utils/api';
import { toast } from 'react-toastify';

const MyApplicationsDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    fromDate: '',
    toDate: '',
    favoriteOnly: false
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
    inProgress: 0,
    successRate: 0
  });

  // Status Configuration - Dark Mode Colors
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      color: 'bg-yellow-500',
      darkBg: 'bg-yellow-500/20',
      lightBg: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
      gradient: 'from-yellow-500 to-amber-500'
    },
    reviewing: {
      label: 'Under Review',
      icon: Eye,
      color: 'bg-blue-500',
      darkBg: 'bg-blue-500/20',
      lightBg: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      gradient: 'from-blue-500 to-cyan-500'
    },
    interviewing: {
      label: 'Interviewing',
      icon: Users,
      color: 'bg-purple-500',
      darkBg: 'bg-purple-500/20',
      lightBg: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      gradient: 'from-purple-500 to-pink-500'
    },
    offered: {
      label: 'Offered',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      darkBg: 'bg-emerald-500/20',
      lightBg: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      gradient: 'from-emerald-500 to-green-500'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      color: 'bg-red-500',
      darkBg: 'bg-red-500/20',
      lightBg: 'bg-red-500/10',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      gradient: 'from-red-500 to-rose-500'
    },
    withdrawn: {
      label: 'Withdrawn',
      icon: AlertCircle,
      color: 'bg-gray-500',
      darkBg: 'bg-gray-500/20',
      lightBg: 'bg-gray-500/10',
      textColor: 'text-gray-400',
      borderColor: 'border-gray-500/30',
      gradient: 'from-gray-500 to-slate-500'
    }
  };

  // Initialize - fetch real data
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await smartAPI.applications.getMyApplications(filters);
      
      if (response.data && response.data.applications) {
        setApplications(response.data.applications);
        setFilteredApplications(response.data.applications);
        
        // Update stats if provided
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else if (response.data) {
        // Handle array response
        setApplications(response.data);
        setFilteredApplications(response.data);
        
        // Calculate stats from data
        calculateStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: apps.filter(app => app.status === 'pending' || app.status === 'new').length,
      reviewing: apps.filter(app => app.status === 'reviewing' || app.status === 'under_review').length,
      interviewing: apps.filter(app => app.status === 'interviewing' || app.status === 'interview_scheduled').length,
      offered: apps.filter(app => app.status === 'offered' || app.status === 'hired').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      inProgress: apps.filter(app => ['pending', 'reviewing', 'interviewing', 'new', 'under_review', 'interview_scheduled'].includes(app.status)).length,
      successRate: apps.length > 0 ? Math.round((apps.filter(app => app.status === 'offered' || app.status === 'hired').length / apps.length) * 100) : 0
    };
    setStats(newStats);
  };

  // Update toggleFavorite to use API
  const toggleFavorite = async (id) => {
    try {
      const app = applications.find(a => a.id === id);
      const isFavorite = !(app.isFavorite || app.is_favorite);
      
      // Update locally first for instant feedback
      setApplications(prev => prev.map(app =>
        app.id === id ? { ...app, isFavorite, is_favorite: isFavorite } : app
      ));
      
      // Try to update via API
      try {
        await applicationAPI.toggleFavorite(id, isFavorite);
      } catch (apiError) {
        console.log('Using local favorite toggle due to API error');
      }
      
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  // Update handleDelete to use API
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationAPI.deleteApplication(id);
        setApplications(prev => prev.filter(app => app.id !== id));
        if (selectedApplication?.id === id) {
          setSelectedApplication(null);
        }
        toast.success('Application deleted successfully');
      } catch (error) {
        console.error('Failed to delete application:', error);
        toast.error('Failed to delete application');
      }
    }
  };

  // Update handleWithdraw to use API
  const handleWithdraw = async (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationAPI.withdrawApplication(id, 'User initiated withdrawal');
        setApplications(prev => prev.map(app =>
          app.id === id ? { ...app, status: 'withdrawn' } : app
        ));
        toast.success('Application withdrawn successfully');
      } catch (error) {
        console.error('Failed to withdraw application:', error);
        toast.error('Failed to withdraw application');
      }
    }
  };

  // Update exportToCSV to use API
  const exportToCSV = async () => {
    try {
      const response = await applicationAPI.exportApplications(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Applications exported successfully');
    } catch (error) {
      console.error('Failed to export:', error);
      toast.error('Failed to export applications');
    }
  };

  // Filter and Search
  useEffect(() => {
    // Apply filters to applications
    let filtered = [...applications];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter - map your UI status to backend status
    if (filters.status !== 'all') {
      const statusMap = {
        'pending': ['pending', 'new'],
        'reviewing': ['reviewing', 'under_review'],
        'interviewing': ['interviewing', 'interview_scheduled'],
        'offered': ['offered', 'hired'],
        'rejected': ['rejected'],
        'withdrawn': ['withdrawn']
      };
      
      const backendStatuses = statusMap[filters.status] || [filters.status];
      filtered = filtered.filter(app => backendStatuses.includes(app.status));
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(app => app.type === filters.type || app.job_type === filters.type);
    }

    // Favorite filter
    if (filters.favoriteOnly) {
      filtered = filtered.filter(app => app.isFavorite || app.is_favorite);
    }

    // Date filters
    if (filters.fromDate) {
      filtered = filtered.filter(app => new Date(app.appliedDate || app.applied_date || app.applied_at || app.created_at) >= new Date(filters.fromDate));
    }
    if (filters.toDate) {
      filtered = filtered.filter(app => new Date(app.appliedDate || app.applied_date || app.applied_at || app.created_at) <= new Date(filters.toDate));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.appliedDate || b.applied_date || b.applied_at || b.created_at) - 
               new Date(a.appliedDate || a.applied_date || a.applied_at || a.created_at);
      } else if (sortBy === 'company') {
        return (a.company_name || a.company?.company_name || a.company || '').localeCompare(
               b.company_name || b.company?.company_name || b.company || '');
      }
      return 0;
    });

    setFilteredApplications(filtered);
  }, [searchQuery, filters, applications, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
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
                <NavLink 
                  to="/myapplications"
                  end
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-purple-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  My Applications
                </NavLink>
                <NavLink 
                  to="/messages"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
                  placeholder="Search my applications..."
                />
              </div>
              
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <Bell className="h-6 w-6" />
              </button>
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

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  My Applications
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Track, manage, and optimize your job search journey
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="px-5 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-700 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export
              </button>
              <button className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Application
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all duration-200 border border-gray-700"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-green-400">+12%</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Applications</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-sm font-semibold text-green-400">+8%</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-amber-400" />
                </div>
                <span className="text-sm font-semibold text-green-400">+15%</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.interviewing}</div>
              <div className="text-sm text-gray-400">Interviewing</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Award className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-green-400">+25%</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.offered}</div>
              <div className="text-sm text-gray-400">Offers</div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/80 to-indigo-600/80 rounded-2xl p-6 shadow-lg border border-blue-500/30 hover:shadow-xl transition-all duration-300 hover:shadow-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.successRate}%</div>
              <div className="text-sm text-blue-200">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700 backdrop-blur-sm shadow-md hover:bg-gray-800'
                }`}
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md appearance-none cursor-pointer text-gray-100"
              >
                <option value="date" className="bg-gray-800">Sort by Date</option>
                <option value="company" className="bg-gray-800">Sort by Company</option>
              </select>

              <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 rounded-l-2xl transition-all ${
                    viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 rounded-r-2xl transition-all ${
                    viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl p-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  >
                    <option value="all" className="bg-gray-800">All Statuses</option>
                    <option value="pending" className="bg-gray-800">Pending</option>
                    <option value="reviewing" className="bg-gray-800">Reviewing</option>
                    <option value="interviewing" className="bg-gray-800">Interviewing</option>
                    <option value="offered" className="bg-gray-800">Offered</option>
                    <option value="rejected" className="bg-gray-800">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  >
                    <option value="all" className="bg-gray-800">All Types</option>
                    <option value="Full-time" className="bg-gray-800">Full-time</option>
                    <option value="Part-time" className="bg-gray-800">Part-time</option>
                    <option value="Contract" className="bg-gray-800">Contract</option>
                    <option value="Remote" className="bg-gray-800">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.favoriteOnly}
                    onChange={(e) => setFilters({ ...filters, favoriteOnly: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-300">Show favorites only</span>
                </label>

                <button
                  onClick={() => setFilters({ status: 'all', type: 'all', fromDate: '', toDate: '', favoriteOnly: false })}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(filters.status !== 'all' || filters.type !== 'all' || filters.favoriteOnly) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full">
                  {statusConfig[filters.status]?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-blue-300" 
                    onClick={() => setFilters({ ...filters, status: 'all' })} 
                  />
                </span>
              )}
              {filters.type !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-full">
                  {filters.type}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-purple-300" 
                    onClick={() => setFilters({ ...filters, type: 'all' })} 
                  />
                </span>
              )}
              {filters.favoriteOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full">
                  Favorites
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-amber-300" 
                    onClick={() => setFilters({ ...filters, favoriteOnly: false })} 
                  />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Applications Display */}
        {filteredApplications.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No applications found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filters.status !== 'all' 
                ? "Try adjusting your search or filters"
                : "Start tracking your job applications to see them here"}
            </p>
            <button 
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Find Jobs to Apply
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">
                Showing <span className="font-semibold text-gray-200">{filteredApplications.length}</span> of {applications.length} applications
              </p>
            </div>

            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
              : "space-y-4"
            }>
              {filteredApplications.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status?.icon || Clock;
                const companyName = app.company_name || app.company?.company_name || app.company || 'Unknown';
                const jobTitle = app.job_title || app.title || 'Untitled Position';
                const location = app.location || 'Location not specified';
                const jobType = app.type || app.job_type || 'Not specified';
                const salary = app.salary || 'Salary not disclosed';
                const isFavorite = app.isFavorite || app.is_favorite;

                return (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 group hover:border-blue-500/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center text-xl font-bold text-gray-300 shadow-lg">
                          {companyName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                            {jobTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Building className="h-4 w-4" />
                            <span className="font-medium text-gray-300">{companyName}</span>
                            <span className="text-gray-600">•</span>
                            <MapPin className="h-4 w-4" />
                            <span className="text-gray-400">{location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(app.id)}
                          className={`p-2 rounded-lg transition-all ${
                            isFavorite
                              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-2 bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300 rounded-lg transition-all">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {status && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${status.darkBg} ${status.textColor} border ${status.borderColor} rounded-lg text-sm font-medium`}>
                          <StatusIcon className="h-4 w-4" />
                          {status.label}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-lg text-sm">
                        <Briefcase className="h-4 w-4" />
                        {jobType}
                      </span>
                      {salary && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-medium">
                          <DollarSign className="h-4 w-4" />
                          {salary}
                        </span>
                      )}
                    </div>

                    {app.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {app.description}
                      </p>
                    )}

                    {app.next_action && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <Bell className="h-4 w-4 text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-300">{app.next_action}</p>
                            {app.next_action_date && (
                              <p className="text-xs text-blue-400 mt-1">
                                Due: {new Date(app.next_action_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        Applied {formatDate(app.applied_date || app.applied_at || app.appliedDate || app.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium hover:bg-blue-500/30 transition-all flex items-center gap-2 hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        {(app.status === 'pending' || app.status === 'reviewing' || app.status === 'new' || app.status === 'under_review') && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all hover:text-red-300"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Quick Actions & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-600/80 to-indigo-600/80 rounded-2xl p-6 shadow-xl border border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-2">AI-Powered Insights</h4>
                <p className="text-blue-200 text-sm mb-4">
                  Get personalized recommendations to improve your application success rate
                </p>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all text-sm">
                  View Insights
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 rounded-2xl p-6 shadow-xl border border-purple-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-2">Interview Preparation</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Access curated resources to ace your upcoming interviews
                </p>
                <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all text-sm">
                  Start Preparing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Application Details</h2>
                  <p className="text-gray-400 mt-1">Complete information and timeline</p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-800">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-300 shadow-lg">
                  {(selectedApplication.company_name || selectedApplication.company?.company_name || selectedApplication.company || 'Unknown').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedApplication.job_title || selectedApplication.title || 'Untitled Position'}</h3>
                  <div className="flex items-center gap-3 text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span className="font-medium text-gray-300">{selectedApplication.company_name || selectedApplication.company?.company_name || selectedApplication.company || 'Unknown'}</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedApplication.location || 'Location not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusConfig[selectedApplication.status] && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusConfig[selectedApplication.status].darkBg} ${statusConfig[selectedApplication.status].textColor} border ${statusConfig[selectedApplication.status].borderColor} rounded-lg text-sm font-medium`}>
                        {React.createElement(statusConfig[selectedApplication.status].icon, { className: "h-4 w-4" })}
                        {statusConfig[selectedApplication.status].label}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg text-sm">
                      {selectedApplication.type || selectedApplication.job_type || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Applied Date</p>
                  <p className="font-semibold text-white">{formatDate(selectedApplication.applied_date || selectedApplication.applied_at || selectedApplication.appliedDate || selectedApplication.created_at)}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                  <p className="font-semibold text-white">{formatDate(selectedApplication.updated_at || selectedApplication.updatedAt || selectedApplication.applied_date || selectedApplication.applied_at || selectedApplication.appliedDate || selectedApplication.created_at)}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Salary Range</p>
                  <p className="font-semibold text-white">{selectedApplication.salary || 'Not specified'}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Job Type</p>
                  <p className="font-semibold text-white">{selectedApplication.type || selectedApplication.job_type || 'Not specified'}</p>
                </div>
              </div>

              {/* Description */}
              {selectedApplication.description && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Job Description</h4>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-300 leading-relaxed">{selectedApplication.description}</p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(selectedApplication.contact_person || selectedApplication.contact_email || selectedApplication.contactPerson || selectedApplication.contactEmail) && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Contact Information</h4>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-2">
                    {(selectedApplication.contact_person || selectedApplication.contactPerson) && (
                      <div className="flex items-center gap-2 text-blue-300">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{selectedApplication.contact_person || selectedApplication.contactPerson}</span>
                      </div>
                    )}
                    {(selectedApplication.contact_email || selectedApplication.contactEmail) && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${selectedApplication.contact_email || selectedApplication.contactEmail}`} className="hover:underline hover:text-blue-300">
                          {selectedApplication.contact_email || selectedApplication.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next Action */}
              {(selectedApplication.next_action || selectedApplication.nextAction) && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Next Action</h4>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Bell className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-amber-300 mb-1">{selectedApplication.next_action || selectedApplication.nextAction}</p>
                        {(selectedApplication.next_action_date || selectedApplication.nextActionDate) && (
                          <p className="text-sm text-amber-400">
                            Due: {new Date(selectedApplication.next_action_date || selectedApplication.nextActionDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div>
                <h4 className="font-semibold text-white mb-3">Your Notes</h4>
                <textarea
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-100 placeholder-gray-500"
                  rows="4"
                  placeholder="Add your notes, follow-ups, or interview feedback..."
                  defaultValue={selectedApplication.notes || ''}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-800">
                <button
                  onClick={() => handleDelete(selectedApplication.id)}
                  className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 hover:text-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete Application
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all flex items-center justify-center gap-2 hover:text-white">
                  <Edit3 className="h-5 w-5" />
                  Edit Details
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsDashboard;