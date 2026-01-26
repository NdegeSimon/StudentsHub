import React, { useState } from 'react';
import { 
  Users, Briefcase, TrendingUp, DollarSign, Award, Search, 
  Bell, Settings, Menu, X, BarChart3, Calendar, MessageSquare, 
  Download, Filter, Plus, Edit, Trash2, Eye, Mail, Phone, 
  MapPin, Clock, CheckCircle, XCircle, ExternalLink, FileText, 
  Building, Star, Bookmark, Send, Target, Users as UsersIcon, 
  GraduationCap, FileCheck, Shield, Database, Network, Globe,
  CreditCard, PieChart as PieChartIcon, Activity, Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const AdminJobPlatformDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Platform statistics
  const platformStats = [
    { month: 'Jan', users: 1250, applications: 4500, jobs: 320, revenue: 28500 },
    { month: 'Feb', users: 1420, applications: 5200, jobs: 380, revenue: 32400 },
    { month: 'Mar', users: 1680, applications: 6800, jobs: 450, revenue: 41200 },
    { month: 'Apr', users: 1950, applications: 7500, jobs: 520, revenue: 48500 },
    { month: 'May', users: 2240, applications: 8200, jobs: 580, revenue: 52800 },
    { month: 'Jun', users: 2680, applications: 9500, jobs: 650, revenue: 61200 }
  ];

  // User distribution by role
  const userDistribution = [
    { name: 'Job Seekers', value: 68, color: '#8b5cf6' },
    { name: 'Employers', value: 24, color: '#06b6d4' },
    { name: 'Recruiters', value: 5, color: '#ec4899' },
    { name: 'Admins', value: 2, color: '#f59e0b' },
    { name: 'Other', value: 1, color: '#10b981' }
  ];

  // Job categories
  const jobCategories = [
    { category: 'Technology', jobs: 1250, applications: 4500, avgSalary: '$95,000' },
    { category: 'Business', jobs: 850, applications: 3200, avgSalary: '$78,000' },
    { category: 'Healthcare', jobs: 680, applications: 2800, avgSalary: '$82,000' },
    { category: 'Education', jobs: 420, applications: 1800, avgSalary: '$65,000' },
    { category: 'Engineering', jobs: 720, applications: 3100, avgSalary: '$92,000' }
  ];

  // Recent job postings
  const recentJobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', status: 'active', posted: '2 hours ago', applicants: 45, views: 320 },
    { id: 2, title: 'Product Manager', company: 'Innovate Inc', status: 'active', posted: '5 hours ago', applicants: 32, views: 210 },
    { id: 3, title: 'Data Scientist', company: 'DataWorks', status: 'pending', posted: '1 day ago', applicants: 28, views: 180 },
    { id: 4, title: 'UX Designer', company: 'DesignHub', status: 'active', posted: '2 days ago', applicants: 38, views: 250 },
    { id: 5, title: 'DevOps Engineer', company: 'CloudSystems', status: 'active', posted: '3 days ago', applicants: 52, views: 380 }
  ];

  // Recent users
  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'Job Seeker', status: 'active', joined: '2 hours ago' },
    { id: 2, name: 'Michael Chen', email: 'mchen@email.com', role: 'Employer', status: 'verified', joined: '5 hours ago' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.r@email.com', role: 'Job Seeker', status: 'pending', joined: '1 day ago' },
    { id: 4, name: 'David Kim', email: 'dkim@email.com', role: 'Recruiter', status: 'active', joined: '2 days ago' },
    { id: 5, name: 'Lisa Wang', email: 'lwang@email.com', role: 'Job Seeker', status: 'active', joined: '3 days ago' }
  ];

  // Revenue data
  const revenueData = [
    { source: 'Premium Subscriptions', amount: 45200, growth: '+18.5%' },
    { source: 'Job Postings', amount: 28600, growth: '+12.3%' },
    { source: 'Featured Listings', amount: 15400, growth: '+8.7%' },
    { source: 'Recruitment Tools', amount: 9200, growth: '+25.1%' },
    { source: 'Other', amount: 3800, growth: '+5.2%' }
  ];

  // Performance metrics
  const performanceData = [
    { metric: 'Application Rate', value: 42, target: 45 },
    { metric: 'Interview Rate', value: 28, target: 30 },
    { metric: 'Hire Rate', value: 18, target: 20 },
    { metric: 'User Retention', value: 76, target: 80 },
    { metric: 'Satisfaction', value: 88, target: 85 }
  ];

  // Quick stats
  const quickStats = [
    { icon: Users, label: 'Total Users', value: '12,847', change: '+15.5%', color: 'from-violet-500 to-purple-600' },
    { icon: Briefcase, label: 'Active Jobs', value: '2,450', change: '+12.2%', color: 'from-cyan-500 to-blue-600' },
    { icon: FileCheck, label: 'Applications', value: '45,200', change: '+18.7%', color: 'from-emerald-500 to-green-600' },
    { icon: DollarSign, label: 'Revenue', value: '$102,400', change: '+22.8%', color: 'from-pink-500 to-rose-600' }
  ];

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

  // Render content based on active tab
  const renderContent = () => {
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
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                      <Download size={20} className="text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                      <Filter size={20} className="text-slate-400" />
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={platformStats}>
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
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* User Distribution */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">User Distribution</h3>
                    <p className="text-sm text-slate-400">By platform role</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                  {userDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-slate-400">{item.name}</span>
                      <span className="text-sm text-white font-semibold ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
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
                  <button className="text-violet-400 hover:text-violet-300 font-medium text-sm">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentJobs.map(job => (
                    <div key={job.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold mb-1">{job.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Building size={14} />
                              {job.company}
                            </span>
                            <span>•</span>
                            <span>{job.applicants} applicants</span>
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
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Eye size={18} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Recent Users</h3>
                    <p className="text-sm text-slate-400">New platform registrations</p>
                  </div>
                  <button className="text-violet-400 hover:text-violet-300 font-medium text-sm">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentUsers.map(user => (
                    <div key={user.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{user.name}</h4>
                            <p className="text-sm text-slate-400">{user.role} • {user.joined}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          user.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : user.status === 'verified'
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
              <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all">
                <Plus size={20} />
                Add User
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
                    {recentUsers.map(user => (
                      <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="text-slate-200 font-medium block">{user.name}</span>
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
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            user.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : user.status === 'verified'
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-sm">{user.joined}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="View">
                              <Eye size={16} className="text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                              <Edit size={16} className="text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
              <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all">
                <Plus size={20} />
                Post New Job
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobCategories.map((category, idx) => (
                <div key={idx} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{category.category}</h3>
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-sm">
                      {category.jobs} Jobs
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Applications</span>
                      <span className="text-white font-semibold">{category.applications.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Avg Salary</span>
                      <span className="text-emerald-400 font-semibold">{category.avgSalary}</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 px-4 py-2 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Job Postings</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 transition-colors text-sm">
                    Export
                  </button>
                  <button className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors text-sm">
                    View All
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                {recentJobs.map(job => (
                  <div key={job.id} className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-2">{job.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Building size={14} />
                            {job.company}
                          </span>
                          <span>•</span>
                          <span>{job.applicants} applicants</span>
                          <span>•</span>
                          <span>{job.views} views</span>
                        </div>
                        <p className="text-slate-400 text-sm">Posted: {job.posted}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          job.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {job.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit size={18} className="text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar 
                      name="Current" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Target" 
                      dataKey="target" 
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.1} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Revenue Sources</h3>
                <div className="space-y-4">
                  {revenueData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                          <DollarSign size={20} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.source}</p>
                          <p className="text-sm text-emerald-400">{item.growth}</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white">{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Platform Growth Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={platformStats}>
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
                    dataKey="applications" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* General Settings */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
                      <input 
                        type="text" 
                        defaultValue="JobConnect Pro" 
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                      <input 
                        type="email" 
                        defaultValue="support@jobconnect.com" 
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Platform Description</label>
                      <textarea 
                        rows={3}
                        defaultValue="A modern platform connecting job seekers with top employers worldwide."
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Security & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-400">Add an extra layer of security</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-400">Receive platform updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Data Analytics</p>
                        <p className="text-sm text-slate-400">Collect usage data for improvements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-slate-800/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Database size={20} className="text-cyan-400" />
                        <span>Backup Database</span>
                      </div>
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-emerald-400" />
                        <span>Security Audit</span>
                      </div>
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <UsersIcon size={20} className="text-violet-400" />
                        <span>User Permissions</span>
                      </div>
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Globe size={20} className="text-amber-400" />
                        <span>Platform Updates</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Server Load</span>
                        <span className="text-emerald-400 font-semibold">42%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Database</span>
                        <span className="text-emerald-400 font-semibold">Healthy</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">API Response</span>
                        <span className="text-emerald-400 font-semibold">98ms</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-violet-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
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
                    <p className="text-white font-semibold">Pro Plan</p>
                    <p className="text-sm text-slate-400">Active</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-slate-400">65% of resources used</p>
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