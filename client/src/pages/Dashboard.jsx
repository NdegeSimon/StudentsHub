import React, { useState } from 'react';
import { Search, Bell, Settings, HelpCircle, User, BookOpen, Briefcase, Clock, Star } from 'lucide-react';
import JobCard from '../components/JobCard';
import MyApplications from './MyApplications';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';



const Dashboard = () => {
const navigate = useNavigate();
  const { profile } = useProfile();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-600 hover:text-purple-800">
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link to="/jobs" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">Jobs</Link>
                <Link to="#" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">Internships</Link>
                <Link to="/myapplications" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">My Applications</Link>
                <Link to="#" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">Messages</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search jobs..."
                />
              </div>
              
              <button className="p-2 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <div 
                className="ml-2 cursor-pointer hover:bg-purple-50 rounded-full p-1 transition-colors"
                onClick={() => navigate('/settings')}
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div 
                className="ml-2 cursor-pointer hover:bg-purple-50 rounded-full p-1 transition-colors"
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
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
            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {profile.name.split(' ')[0]}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {profile.role || 'Web Developer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <span>My Applications</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Recent Jobs</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Saved Jobs</span>
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-medium text-purple-800 mb-3">Resources</h3>
              <p className="text-sm text-purple-700 mb-4">Enhance your profile and job search with our resources.</p>
              <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors">
                Explore Resources
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Saved Searches */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Searches</h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Web Development
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Data Science
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
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
                      id: 3,
                      title: 'Backend Engineer',
                      company: 'Twiga Foods',
                      salary: 'KSh 350,000 - 500,000/mo',
                      postedDate: '3 days ago',
                      description: 'Looking for a backend developer to work on our supply chain and logistics platform.',
                      tags: ['Python', 'Django', 'REST API']
                    },
                    {
                      id: 4,
                      title: 'Mobile App Developer',
                      company: 'M-KOPA Solar',
                      salary: 'KSh 300,000 - 450,000/mo',
                      postedDate: '5 days ago',
                      description: 'Develop and maintain our mobile applications used by thousands of customers across Africa.',
                      tags: ['React Native', 'Redux', 'Mobile']
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