import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, TrendingUp, DollarSign, Award, Search, 
  Bell, Settings, Menu, X, BarChart3, Calendar, MessageSquare, 
  Download, Filter, Plus, Edit, Trash2, Eye, Mail, Phone, 
  MapPin, Clock, CheckCircle, XCircle, ExternalLink, FileText, 
  Building, Star, Bookmark, Send, Target, Users as UsersIcon, 
  GraduationCap, FileCheck, Shield, Database, Network, Globe,
  CreditCard, PieChart as PieChartIcon, Activity, Zap, AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminJobPlatformDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for real data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeJobs: 0,
      totalApplications: 0,
      revenue: 0
    },
    recentJobs: [],
    recentUsers: [],
    platformStats: [],
    userDistribution: [],
    jobCategories: [],
    revenueData: []
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  // Main function to fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch(activeTab) {
        case 'overview':
          await Promise.all([
            fetchStats(),
            fetchRecentJobs(),
            fetchRecentUsers(),
            fetchPlatformStats()
          ]);
          break;
        case 'users':
          await fetchAllUsers();
          break;
        case 'jobs':
          await fetchAllJobs();
          break;
        case 'analytics':
          await fetchAnalytics();
          break;
        default:
          await fetchStats();
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch overall platform statistics
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setDashboardData(prev => ({
        ...prev,
        stats: response.data
      }));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch recent job postings
  const fetchRecentJobs = async () => {
    try {
      const response = await apiClient.get('/admin/jobs/recent', {
        params: { limit: 5 }
      });
      setDashboardData(prev => ({
        ...prev,
        recentJobs: response.data
      }));
    } catch (err) {
      console.error('Error fetching recent jobs:', err);
    }
  };

  // Fetch recent users
  const fetchRecentUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users/recent', {
        params: { limit: 5 }
      });
      setDashboardData(prev => ({
        ...prev,
        recentUsers: response.data
      }));
    } catch (err) {
      console.error('Error fetching recent users:', err);
    }
  };

  // Fetch platform growth statistics
  const fetchPlatformStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats/growth', {
        params: { months: 6 }
      });
      setDashboardData(prev => ({
        ...prev,
        platformStats: response.data
      }));
    } catch (err) {
      console.error('Error fetching platform stats:', err);
    }
  };

  // Fetch all users (for users tab)
  const fetchAllUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setDashboardData(prev => ({
        ...prev,
        recentUsers: response.data
      }));
    } catch (err) {
      console.error('Error fetching all users:', err);
    }
  };

  // Fetch all jobs (for jobs tab)
  const fetchAllJobs = async () => {
    try {
      const response = await apiClient.get('/admin/jobs');
      setDashboardData(prev => ({
        ...prev,
        recentJobs: response.data.jobs || [],
        jobCategories: response.data.categories || []
      }));
    } catch (err) {
      console.error('Error fetching all jobs:', err);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {okay
      const response = await apiClient.get('/admin/analytics');
      setDashboardData(prev => ({
        ...prev,
        userDistribution: response.data.userDistribution || [],
        revenueData: response.data.revenueData || []
      }));
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      fetchAllUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  // Delete job
  const deleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await apiClient.delete(`/admin/jobs/${jobId}`);
      fetchAllJobs(); // Refresh the list
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job');
    }
  };

  // Update user status
  const updateUserStatus = async (userId, status) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { status });
      fetchAllUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  // Quick stats with real data
  const quickStats = [
    { 
      icon: Users, 
      label: 'Total Users', 
      value: dashboardData.stats.totalUsers?.toLocaleString() || '0', 
      change: dashboardData.stats.userGrowth || '+0%', 
      color: 'from-violet-500 to-purple-600' 
    },
    { 
      icon: Briefcase, 
      label: 'Active Jobs', 
      value: dashboardData.stats.activeJobs?.toLocaleString() || '0', 
      change: dashboardData.stats.jobGrowth || '+0%', 
      color: 'from-cyan-500 to-blue-600' 
    },
    { 
      icon: FileCheck, 
      label: 'Applications', 
      value: dashboardData.stats.totalApplications?.toLocaleString() || '0', 
      change: dashboardData.stats.applicationGrowth || '+0%', 
      color: 'from-emerald-500 to-green-600' 
    },
    { 
      icon: DollarSign, 
      label: 'Revenue', 
      value: `$${(dashboardData.stats.revenue || 0).toLocaleString()}`, 
      change: dashboardData.stats.revenueGrowth || '+0%', 
      color: 'from-pink-500 to-rose-600' 
    }
  ];

  // User distribution colors
  const userDistributionColors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'];

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'revenue', label: 'Revenue', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
    </div>
  );

  // Error Component
  const ErrorMessage = ({ message }) => (
    <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="text-red-400" size={24} />
        <div>
          <p className="text-red-400 font-semibold">Error</p>
          <p className="text-red-300 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    switch(activeTab) {
      case 'overview':
        return (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Platform Growth Chart */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Platform Growth</h3>
                    <p className="text-sm text-slate-400">Last 6 months performance</p>
                  </div>
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <Download size={20} className="text-slate-400" />
                  </button>
                </div>
                {dashboardData.platformStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={dashboardData.platformStats}>
                      <defs>
                        <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fill="url(#userGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    No data available
                  </div>
                )}
              </div>

              {/* User Distribution */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">User Distribution</h3>
                    <p className="text-sm text-slate-400">By platform role</p>
                  </div>
                </div>
                {dashboardData.userDistribution.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={dashboardData.userDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {dashboardData.userDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={userDistributionColors[index % userDistributionColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #334155',
                              borderRadius: '12px',
                              color: '#fff'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {dashboardData.userDistribution.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: userDistributionColors[idx % userDistributionColors.length] }}></div>
                          <span className="text-sm text-slate-400">{item.name}</span>
                          <span className="text-sm text-white font-semibold ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Recent Job Postings</h3>
                    <p className="text-sm text-slate-400">Latest job listings</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className="text-violet-400 hover:text-violet-300 font-medium text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentJobs.length > 0 ? (
                    dashboardData.recentJobs.map(job => (
                      <div key={job.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-semibold mb-1">{job.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Building size={14} />
                                {job.company || 'Company Name'}
                              </span>
                              <span>•</span>
                              <span>{job.applicants || 0} applicants</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            job.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No recent jobs</p>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Recent Users</h3>
                    <p className="text-sm text-slate-400">New platform registrations</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="text-violet-400 hover:text-violet-300 font-medium text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentUsers.length > 0 ? (
                    dashboardData.recentUsers.map(user => (
                      <div key={user.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                              {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{user.first_name || user.name}</h4>
                              <p className="text-sm text-slate-400">{user.role} • {user.joined || 'Recently'}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            user.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No recent users</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
                <p className="text-slate-400">Manage all platform users and permissions</p>
              </div>
              <button 
                onClick={fetchAllUsers}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all"
              >
                <Plus size={20} />
                Refresh
              </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search users by name, email, or role..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-all">
                  <Filter size={20} />
                  Filter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentUsers.length > 0 ? (
                      dashboardData.recentUsers.map(user => (
                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="text-slate-200 font-medium block">{user.first_name || user.name}</span>
                                <span className="text-slate-400 text-sm">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-lg text-sm">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={user.status || 'active'}
                              onChange={(e) => updateUserStatus(user.id, e.target.value)}
                              className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs"
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-slate-400 text-sm">{user.joined || user.created_at || 'N/A'}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="View">
                                <Eye size={16} className="text-slate-400" />
                              </button>
                              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                                <Edit size={16} className="text-slate-400" />
                              </button>
                              <button 
                                onClick={() => deleteUser(user.id)}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors" 
                                title="Delete"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-slate-400">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Job Management</h2>
                <p className="text-slate-400">Manage job postings and listings</p>
              </div>
              <button 
                onClick={fetchAllJobs}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all"
              >
                <Plus size={20} />
                Refresh
              </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="grid gap-4">
                {dashboardData.recentJobs.length > 0 ? (
                  dashboardData.recentJobs.map(job => (
                    <div key={job.id} className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">{job.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Building size={14} />
                              {job.company || 'Company'}
                            </span>
                            <span>•</span>
                            <span>{job.applicants || 0} applicants</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            job.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {job.status}
                          </span>
                          <button 
                            onClick={() => deleteJob(job.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-8">No jobs found</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Platform Analytics</h2>
              <p className="text-slate-400">Detailed insights and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Revenue Sources</h3>
                <div className="space-y-4">
                  {dashboardData.revenueData.length > 0 ? (
                    dashboardData.revenueData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                            <DollarSign size={20} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.source}</p>
                            <p className="text-sm text-emerald-400">{item.growth || '+0%'}</p>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-white">
                          ${(item.amount || 0).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No revenue data available</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Platform Growth</h3>
                {dashboardData.platformStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.platformStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="jobs" 
                        stroke="#06b6d4" 
                        strokeWidth={3}
                        dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    No analytics data available
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Platform Settings</h2>
              <p className="text-slate-400">Configure platform preferences and security</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">API Base URL</label>
                  <input 
                    type="text" 
                    value={API_BASE_URL}
                    readOnly
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Authentication</label>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-emerald-400" />
                    <span className="text-slate-300">Token authentication active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-200">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                JobConnect Admin
              </h1>
              <p className="text-sm text-slate-400">Platform Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh data"
            >
              <Activity size={22} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={22} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'}`}>
          <div className="p-6">
            <nav className="space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-violet-400 border border-violet-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Admin Pro</p>
                    <p className="text-sm text-slate-400">Connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>API Status: Online</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminJobPlatformDashboard;