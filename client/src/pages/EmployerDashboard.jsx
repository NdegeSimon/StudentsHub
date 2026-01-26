import React, { useState } from 'react';
import { Briefcase, Users, MessageSquare, Calendar, BarChart3, Search, Bell, Settings, Menu, X, Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Send, Filter, Download, MapPin, DollarSign, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EmployerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Sample data
  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', location: 'Remote', salary: '$80k-120k', applicants: 45, status: 'active', posted: '2 days ago', type: 'Full-time' },
    { id: 2, title: 'Product Designer', location: 'Nairobi, Kenya', salary: '$60k-90k', applicants: 32, status: 'active', posted: '5 days ago', type: 'Full-time' },
    { id: 3, title: 'Backend Engineer', location: 'Hybrid', salary: '$90k-130k', applicants: 28, status: 'active', posted: '1 week ago', type: 'Full-time' },
    { id: 4, title: 'Marketing Manager', location: 'Remote', salary: '$70k-100k', applicants: 56, status: 'closed', posted: '2 weeks ago', type: 'Full-time' },
  ];

  const applicants = [
    { id: 1, name: 'Sarah Johnson', job: 'Senior Frontend Developer', experience: '5 years', location: 'Nairobi', status: 'new', applied: '2 hours ago', email: 'sarah.j@email.com', rating: 4.5 },
    { id: 2, name: 'Michael Chen', job: 'Senior Frontend Developer', experience: '7 years', location: 'Remote', status: 'reviewed', applied: '1 day ago', email: 'mchen@email.com', rating: 4.8 },
    { id: 3, name: 'Emily Rodriguez', job: 'Product Designer', experience: '4 years', location: 'Mombasa', status: 'shortlisted', applied: '2 days ago', email: 'emily.r@email.com', rating: 4.3 },
    { id: 4, name: 'David Kim', job: 'Backend Engineer', experience: '6 years', location: 'Remote', status: 'interviewed', applied: '3 days ago', email: 'dkim@email.com', rating: 4.7 },
    { id: 5, name: 'Lisa Wang', job: 'Senior Frontend Developer', experience: '3 years', location: 'Nairobi', status: 'new', applied: '5 hours ago', email: 'lwang@email.com', rating: 4.2 },
    { id: 6, name: 'James Brown', job: 'Product Designer', experience: '5 years', location: 'Kisumu', status: 'rejected', applied: '1 week ago', email: 'jbrown@email.com', rating: 3.8 },
  ];

  const interviews = [
    { id: 1, candidate: 'Emily Rodriguez', job: 'Product Designer', date: 'Jan 28, 2026', time: '10:00 AM', type: 'Video Call' },
    { id: 2, candidate: 'David Kim', job: 'Backend Engineer', date: 'Jan 29, 2026', time: '02:00 PM', type: 'In-Person' },
    { id: 3, candidate: 'Michael Chen', job: 'Senior Frontend Developer', date: 'Jan 30, 2026', time: '11:00 AM', type: 'Video Call' },
  ];

  const analyticsData = [
    { week: 'Week 1', applications: 45, views: 320 },
    { week: 'Week 2', applications: 62, views: 450 },
    { week: 'Week 3', applications: 78, views: 520 },
    { week: 'Week 4', applications: 95, views: 610 },
  ];

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '3', change: '+1 this week', color: 'from-violet-500 to-purple-600' },
    { icon: Users, label: 'Total Applicants', value: '161', change: '+23 today', color: 'from-cyan-500 to-blue-600' },
    { icon: CheckCircle, label: 'Shortlisted', value: '18', change: '+5 this week', color: 'from-emerald-500 to-green-600' },
    { icon: Calendar, label: 'Interviews', value: '3', change: 'This week', color: 'from-pink-500 to-rose-600' },
  ];

  const JobPostModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900">
          <h3 className="text-2xl font-bold text-white">Post New Job</h3>
          <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
            <input type="text" placeholder="e.g. Senior Frontend Developer" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <input type="text" placeholder="e.g. Remote, Nairobi" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
              <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range</label>
              <input type="text" placeholder="e.g. $80k-120k" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
              <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500">
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Level</option>
                <option>Lead/Principal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>
            <textarea rows="5" placeholder="Describe the role, responsibilities, and requirements..." className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Required Skills</label>
            <input type="text" placeholder="e.g. React, TypeScript, Node.js" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowJobModal(false)} className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button onClick={() => setShowJobModal(false)} className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all">
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Send Message</h3>
          <button onClick={() => setShowMessageModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">To</label>
            <input type="text" value={selectedApplicant?.name || ''} readOnly className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message Type</label>
            <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500">
              <option>Interview Invitation</option>
              <option>Acceptance Letter</option>
              <option>Rejection Notice</option>
              <option>General Message</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <input type="text" placeholder="Message subject" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea rows="6" placeholder="Type your message here..." className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"></textarea>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowMessageModal(false)} className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button onClick={() => setShowMessageModal(false)} className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all flex items-center justify-center gap-2">
              <Send size={18} />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Job Postings</h2>
                <p className="text-slate-400">Manage your job listings and track applications</p>
              </div>
              <button onClick={() => setShowJobModal(true)} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all">
                <Plus size={20} />
                Post New Job
              </button>
            </div>

            <div className="grid gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          job.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salary}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {job.posted}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg font-semibold">
                          {job.applicants} applicants
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Eye size={18} className="text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Edit size={18} className="text-slate-400" />
                      </button>
                      {job.status === 'active' && (
                        <button className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                          Close Position
                        </button>
                      )}
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'applicants':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Applicants</h2>
                <p className="text-slate-400">Review and manage candidate applications</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-all">
                  <Filter size={20} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-xl hover:bg-slate-800 transition-all">
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search applicants by name, job, or skills..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {applicants.map(applicant => (
                  <div key={applicant.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-white font-semibold text-lg">{applicant.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-amber-400 fill-amber-400" />
                              <span className="text-sm text-slate-300">{applicant.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                            <span>{applicant.job}</span>
                            <span>•</span>
                            <span>{applicant.experience} experience</span>
                            <span>•</span>
                            <span>{applicant.location}</span>
                          </div>
                          <p className="text-xs text-slate-500">Applied {applicant.applied}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          applicant.status === 'new' ? 'bg-blue-500/10 text-blue-400' :
                          applicant.status === 'reviewed' ? 'bg-amber-500/10 text-amber-400' :
                          applicant.status === 'shortlisted' ? 'bg-violet-500/10 text-violet-400' :
                          applicant.status === 'interviewed' ? 'bg-cyan-500/10 text-cyan-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {applicant.status}
                        </span>
                        <select className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-violet-500">
                          <option>New</option>
                          <option>Reviewed</option>
                          <option>Shortlisted</option>
                          <option>Interviewed</option>
                          <option>Rejected</option>
                        </select>
                        <button 
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setShowMessageModal(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Messages</h2>
                <p className="text-slate-400">Communicate with candidates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-violet-500/10 text-violet-400 rounded-xl hover:bg-violet-500/20 transition-all">
                    <Send size={18} />
                    <span className="font-medium">Interview Invitation</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all">
                    <CheckCircle size={18} />
                    <span className="font-medium">Acceptance Letter</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
                    <XCircle size={18} />
                    <span className="font-medium">Rejection Notice</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Messages</h3>
                <div className="space-y-3">
                  {applicants.slice(0, 4).map(applicant => (
                    <div key={applicant.id} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {applicant.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{applicant.name}</h4>
                            <p className="text-sm text-slate-400">{applicant.job}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">{applicant.applied}</span>
                      </div>
                      <p className="text-sm text-slate-300 ml-13">Application received for {applicant.job}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'interviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Interview Schedule</h2>
                <p className="text-slate-400">Manage and schedule candidate interviews</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all">
                <Plus size={20} />
                Schedule Interview
              </button>
            </div>

            <div className="grid gap-4">
              {interviews.map(interview => (
                <div key={interview.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        {interview.candidate.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">{interview.candidate}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{interview.job}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {interview.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {interview.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-semibold">
                        {interview.type}
                      </span>
                      <button className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                        Send Invite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Calendar View</h3>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-slate-400 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2;
                  const isToday = day === 26;
                  const hasInterview = [28, 29, 30].includes(day);
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square p-2 rounded-lg text-center transition-all cursor-pointer ${
                        day < 1 || day > 31
                          ? 'text-slate-600'
                          : isToday
                          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                          : hasInterview
                          ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30'
                          : 'bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        day < 1 || day > 31 
                          ? 'text-slate-600' 
                          : isToday 
                          ? 'text-cyan-400' 
                          : hasInterview 
                          ? 'text-violet-400' 
                          : 'text-slate-300'
                      }`}>
                        {day > 0 && day <= 31 ? day : ''}
                      </div>
                      {hasInterview && (
                        <div className="w-1 h-1 mx-auto mt-1 bg-violet-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
              <p className="text-slate-400">Track your hiring performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Applications Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="week" stroke="#94a3b8" />
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
                      dataKey="applications" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Job Views vs Applications</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="week" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="views" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="applications" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

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
                Employer Dashboard
              </h1>
              <p className="text-sm text-slate-400">Hire the best talent</p>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                E
              </div>
              <div>
                <p className="text-white font-medium">TechCorp Kenya</p>
                <p className="text-xs text-slate-400">Employer Account</p>
              </div>
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
                    <Star size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Premium Plan</p>
                    <p className="text-sm text-slate-400">Active</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-slate-400">3 of 4 job slots used</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      {showJobModal && <JobPostModal />}
      {showMessageModal && <MessageModal />}
    </div>
  );
};

export default EmployerDashboard;