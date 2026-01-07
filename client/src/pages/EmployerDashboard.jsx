import React, { useState } from 'react';
import { Briefcase, Users, FileText, Settings, PlusCircle, Eye, MessageSquare, TrendingUp, Calendar, Search, Filter } from 'lucide-react';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock data
  const stats = {
    activeJobs: 12,
    totalApplicants: 48,
    interviewsScheduled: 8,
    hiredThisMonth: 3
  };

  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      posted: '5 days ago',
      applicants: 24,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      posted: '12 days ago',
      applicants: 18,
      status: 'Active'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Contract',
      posted: '3 days ago',
      applicants: 6,
      status: 'Active'
    }
  ];

  const applicants = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      appliedDate: '2 days ago',
      status: 'Under Review',
      experience: '8 years',
      match: '92%'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Senior Software Engineer',
      appliedDate: '3 days ago',
      status: 'Interview Scheduled',
      experience: '6 years',
      match: '88%'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Product Manager',
      appliedDate: '1 day ago',
      status: 'New',
      experience: '5 years',
      match: '85%'
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'UX Designer',
      appliedDate: '4 hours ago',
      status: 'New',
      experience: '4 years',
      match: '90%'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.activeJobs}</p>
            </div>
            <div className="bg-blue-900 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Applicants</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalApplicants}</p>
            </div>
            <div className="bg-green-900 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Interviews Scheduled</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.interviewsScheduled}</p>
            </div>
            <div className="bg-purple-900 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Hired This Month</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.hiredThisMonth}</p>
            </div>
            <div className="bg-orange-900 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Applicants</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {applicants.slice(0, 3).map(applicant => (
              <div key={applicant.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {applicant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{applicant.name}</p>
                    <p className="text-sm text-gray-400">{applicant.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    applicant.status === 'New' ? 'bg-blue-900 text-blue-300' :
                    applicant.status === 'Under Review' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {applicant.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{applicant.appliedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
        <button 
          onClick={() => setActiveTab('postJob')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Job Title</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Department</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Location</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Applicants</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-750">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-white">{job.title}</p>
                    <p className="text-sm text-gray-400">{job.posted}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{job.department}</td>
                <td className="px-6 py-4 text-gray-300">{job.location}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-900 text-blue-300 rounded-full font-semibold text-sm">
                    {job.applicants}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium">
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => {
                      setSelectedJob(job);
                      setActiveTab('applicants');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                  >
                    View Applicants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApplicants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {selectedJob ? `Applicants for ${selectedJob.title}` : 'All Applicants'}
        </h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applicants..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applicants.map(applicant => (
          <div key={applicant.id} className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {applicant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">{applicant.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      applicant.status === 'New' ? 'bg-blue-900 text-blue-300' :
                      applicant.status === 'Under Review' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {applicant.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">{applicant.position}</p>
                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                    <span>Experience: {applicant.experience}</span>
                    <span>Applied: {applicant.appliedDate}</span>
                    <span className="text-green-400 font-semibold">Match: {applicant.match}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Eye className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPostJob = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Post a New Job</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Department</label>
              <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Engineering</option>
                <option>Product</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Job Type</label>
              <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
            <input
              type="text"
              placeholder="e.g. Remote, New York, NY"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Salary Range</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Min"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Max"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Job Description</label>
            <textarea
              rows={6}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Required Skills</label>
            <input
              type="text"
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => setActiveTab('jobs')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Post Job
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className="px-6 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Company Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Company Name</label>
            <input
              type="text"
              defaultValue="Tech Company Inc."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Company Email</label>
            <input
              type="email"
              defaultValue="contact@techcompany.com"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Company Website</label>
            <input
              type="url"
              defaultValue="https://techcompany.com"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Company Description</label>
            <textarea
              rows={4}
              defaultValue="We are a leading technology company focused on innovation..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Industry</label>
            <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Technology</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Retail</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Company Size</label>
            <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>1-10 employees</option>
              <option>11-50 employees</option>
              <option>51-200 employees</option>
              <option>201-500 employees</option>
              <option>500+ employees</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={() => alert('Settings saved!')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Employer Dashboard</h1>
                <p className="text-sm text-gray-400">Tech Company Inc.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:bg-gray-700 rounded-lg">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                TC
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-gray-800 rounded-lg p-2 shadow-xl border border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>My Jobs</span>
          </button>
          <button
            onClick={() => {
              setSelectedJob(null);
              setActiveTab('applicants');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'applicants'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Applicants</span>
          </button>
          <button
            onClick={() => setActiveTab('postJob')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'postJob'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Post Job</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'applicants' && renderApplicants()}
          {activeTab === 'postJob' && renderPostJob()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}