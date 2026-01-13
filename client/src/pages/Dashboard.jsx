import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Settings, HelpCircle, User, BookOpen, Briefcase, Clock, 
  Star, Sun, Moon, Menu, X, FileText, Mic, Zap, TrendingUp, Award, 
  UserCheck, ChevronRight, Bookmark, BookmarkCheck, Calendar, Target,
  ArrowUpRight, TrendingDown, Activity, CheckCircle, XCircle, Eye,
  MapPin, DollarSign, Sparkles, Phone, Mail, Link as LinkIcon,
  Building, Plus, Filter, Download, Share2, Flame, Crown, Rocket
} from 'lucide-react';

const NextLevelDashboard = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Mock data
  const stats = [
    { 
      label: 'Applications', 
      value: '24', 
      change: '+12%', 
      icon: FileText, 
      color: 'from-blue-500 to-cyan-500',
      trend: 'up'
    },
    { 
      label: 'Active Jobs', 
      value: '8', 
      change: '+5%', 
      icon: Briefcase, 
      color: 'from-purple-500 to-pink-500',
      trend: 'up'
    },
    { 
      label: 'Interviews', 
      value: '3', 
      change: '+2', 
      icon: Calendar, 
      color: 'from-amber-500 to-orange-500',
      trend: 'up'
    },
    { 
      label: 'Profile Views', 
      value: '156', 
      change: '+23%', 
      icon: Eye, 
      color: 'from-green-500 to-emerald-500',
      trend: 'up'
    }
  ];

  const upcomingDeadlines = [
    { title: 'Google Software Engineer', daysLeft: 2, urgent: true },
    { title: 'Microsoft PM Intern', daysLeft: 5, urgent: false },
    { title: 'Amazon ML Engineer', daysLeft: 7, urgent: false }
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      logo: 'T',
      posted: '2 days ago',
      applicants: 45,
      match: 95,
      tags: ['React', 'TypeScript', 'Next.js'],
      featured: true
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $140k',
      logo: 'S',
      posted: '1 day ago',
      applicants: 23,
      match: 88,
      tags: ['Node.js', 'MongoDB', 'AWS']
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80/hour',
      logo: 'D',
      posted: '3 days ago',
      applicants: 67,
      match: 82,
      tags: ['Figma', 'Sketch', 'Prototyping']
    }
  ];

  const recentApplications = [
    { 
      id: 1,
      company: 'Google', 
      position: 'Software Engineer',
      status: 'interviewing',
      date: '2025-01-10',
      nextStep: 'Technical Interview',
      nextDate: '2025-01-20'
    },
    { 
      id: 2,
      company: 'Microsoft', 
      position: 'Product Manager',
      status: 'reviewing',
      date: '2025-01-08',
      nextStep: 'Pending Review'
    },
    { 
      id: 3,
      company: 'Amazon', 
      position: 'Cloud Engineer',
      status: 'applied',
      date: '2025-01-05',
      nextStep: 'Application Submitted'
    }
  ];

  const notifications = [
    { id: 1, type: 'interview', message: 'Interview scheduled with Google', time: '2 hours ago', unread: true },
    { id: 2, type: 'application', message: 'Application viewed by Amazon', time: '5 hours ago', unread: true },
    { id: 3, type: 'recommendation', message: 'New job matches your profile', time: '1 day ago', unread: false }
  ];

  const savedSearches = [
    'Frontend Developer Remote',
    'UX Designer San Francisco',
    'Product Manager',
    'Software Engineer',
    'Data Scientist NYC'
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'interviewing': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'reviewing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'applied': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offered': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Studex
                </span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <a href="#" className="px-4 py-2 rounded-xl text-white font-medium bg-slate-800/50 hover:bg-slate-800 transition-all">
                  Dashboard
                </a>
                <a href="#" className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                  Jobs
                </a>
                <a href="#" className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                  Applications
                </a>
                <a href="#" className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                  Messages
                </a>
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="pl-10 pr-4 py-2 w-64 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all relative"
                >
                  <Bell className="h-5 w-5 text-slate-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <button className="text-xs text-blue-400 hover:text-blue-300">Mark all as read</button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 hover:bg-slate-700/30 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-500/5' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-white">{notif.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all">
                <Settings className="h-5 w-5 text-slate-400" />
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-700/50">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Premium Member</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900"></div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">John Doe</h3>
                <p className="text-sm text-slate-400 mb-4">Software Developer</p>
                
                {/* Profile Stats */}
                <div className="w-full space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Profile Strength</span>
                    <span className="text-green-400 font-medium">85%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-500/30">
                  Complete Profile
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all group">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Briefcase className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-white font-medium">Browse Jobs</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all group">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm text-white font-medium">My Applications</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all group">
                  <div className="p-2 bg-amber-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Star className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-sm text-white font-medium">Saved Jobs</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Upcoming Deadlines</h3>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${deadline.urgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800/50'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${deadline.urgent ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                      <span className={`text-lg font-bold ${deadline.urgent ? 'text-red-400' : 'text-blue-400'}`}>
                        {deadline.daysLeft}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{deadline.title}</p>
                      <p className="text-xs text-slate-400">
                        {deadline.daysLeft} day{deadline.daysLeft !== 1 ? 's' : ''} left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Banner */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-3 mb-4">
                <Crown className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white mb-1">Upgrade to Premium</h3>
                  <p className="text-xs text-slate-300">Get 3x more visibility and exclusive features</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl text-white font-medium transition-all shadow-lg">
                Upgrade Now
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl shadow-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {getGreeting()}, John! 👋
                    </h1>
                    <p className="text-blue-100 mb-6">
                      You have 3 interviews scheduled this week. Keep up the great work!
                    </p>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 bg-white/90 hover:bg-white text-purple-700 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Apply to Jobs
                      </button>
                      <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all backdrop-blur-sm border border-white/20">
                        View Applications
                      </button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-right">
                      <p className="text-blue-100 text-sm mb-1">{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                      <p className="text-white text-2xl font-bold">
                        {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                      {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Saved Searches */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Saved Searches</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((search, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm text-white transition-all cursor-pointer group"
                  >
                    {search}
                    <X className="h-3 w-3 text-slate-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </span>
                ))}
              </div>
            </div>

            {/* Job Listings */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-xl overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-slate-800/50 px-6">
                <div className="flex gap-1">
                  {['recommended', 'recent', 'saved'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium transition-all relative ${
                        activeTab === tab
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {job.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                {job.title}
                              </h3>
                              {job.featured && (
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg border border-amber-500/30">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                              <span className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/30"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{job.posted}</span>
                              <span>•</span>
                              <span>{job.applicants} applicants</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                            <Target className="h-4 w-4" />
                            <span className="text-sm font-medium">{job.match}% Match</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all">
                              <Bookmark className="h-5 w-5 text-slate-400 hover:text-amber-400" />
                            </button>
                            <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all">
                              <Share2 className="h-5 w-5 text-slate-400 hover:text-blue-400" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-lg border border-purple-500/30">
                          {job.type}
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all shadow-lg group-hover:shadow-xl flex items-center gap-2">
                          Apply Now
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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

export default NextLevelDashboard;