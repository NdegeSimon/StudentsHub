import React from 'react';
import { Search, Bell, Settings, HelpCircle, User, BookOpen, Briefcase, Clock, Star, Bookmark } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">StudentsHub</h1>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Find Jobs</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">My Applications</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Messages</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search jobs..."
                />
              </div>
              
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <Settings className="h-6 w-6" />
              </button>
              <div className="ml-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-6">
            {/* Welcome Card */}
            <div className="bg-indigo-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-4 md:mb-0">
                  <h2 className="text-xl font-bold mb-2">WELCOME TO STUDENTSHUB</h2>
                  <p className="text-indigo-100 mb-4">Start your journey by exploring available opportunities and connecting with potential employers.</p>
                  <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors">
                    Get Started →
                  </button>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <BookOpen className="h-24 w-24 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Job Search */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Search for jobs..."
                />
              </div>
            </div>

            {/* Saved Searches */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Searches</h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Web Development
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Data Science
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  UI/UX Design
                </span>
              </div>
            </div>

            {/* Job Listings */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button className="border-b-2 border-indigo-500 text-indigo-600 px-4 py-4 text-sm font-medium">
                    Recommended
                  </button>
                  <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-4 py-4 text-sm font-medium">
                    Recent
                  </button>
                  <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-4 py-4 text-sm font-medium">
                    Saved
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Find your next opportunity by browsing through our curated job listings.
                </p>
                
                {/* Job Cards will be mapped here */}
                <div className="space-y-4">
                  {[1, 2, 3].map((job) => (
                    <div key={job} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Web Developer Needed for E-commerce Site</h4>
                          <p className="text-sm text-gray-500 mt-1">Company Name • $25-50/hr • Posted 2 days ago</p>
                          <p className="text-sm text-gray-600 mt-2">Looking for an experienced web developer to help build an e-commerce platform using React and Node.js.</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              React
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Node.js
                            </span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600">
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">John D.</h3>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Profile Strength</span>
                  <span className="font-medium">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                  Complete your profile
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  <span>My Applications</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span>Recent Jobs</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Star className="h-5 w-5 text-indigo-600" />
                  <span>Saved Jobs</span>
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="font-medium text-indigo-800 mb-3">Resources</h3>
              <p className="text-sm text-indigo-700 mb-4">Enhance your profile and job search with our resources.</p>
              <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors">
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;