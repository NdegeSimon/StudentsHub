import { useState } from "react";

export default function JobPostings() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova Ltd",
      location: "Nairobi",
      type: "Remote",
      salary: 80000,
      description: "Build and maintain modern web UIs.",
      requirements: "React, Tailwind, Git",
      deadline: "2025-01-31",
      datePosted: new Date(),
      applied: false,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // search & filter state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortBy, setSortBy] = useState("");

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setJobs(jobs.map(j => j.id === editingId ? { ...j, ...form, salary: Number(form.salary) } : j));
      setEditingId(null);
    } else {
      setJobs([
        ...jobs,
        {
          id: Date.now(),
          ...form,
          salary: Number(form.salary),
          datePosted: new Date(),
          applied: false,
        },
      ]);
    }

    setForm({ title: "", company: "", location: "", type: "", salary: "", description: "", requirements: "", deadline: "" });
  };

  const handleEdit = (job) => {
    setForm(job);
    setEditingId(job.id);
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleApply = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, applied: true } : j));
  };

  // FILTER + SEARCH + SORT
  const filteredJobs = jobs
    .filter(j =>
      (j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())) &&
      (!filterType || j.type === filterType) &&
      (!filterLocation || j.location === filterLocation)
    )
    .sort((a, b) => {
      if (sortBy === "salary") return b.salary - a.salary;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "date") return new Date(b.datePosted) - new Date(a.datePosted);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">Post a Job</h1>
            <p className="">Post to Acquire Talent</p>
          </div>
          <button 
            onClick={() => document.getElementById('jobForm').scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 md:mt-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Post a Job
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                className="input pl-10" 
                placeholder="Search jobs or companies" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <select 
                className="input pl-10 appearance-none" 
                onChange={e => setFilterType(e.target.value)}
                value={filterType}
              >
                <option value="">All Job Types</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">Internship</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <select 
                className="input pl-10 appearance-none" 
                onChange={e => setFilterLocation(e.target.value)}
                value={filterLocation}
              >
                <option value="">All Locations</option>
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
                <option>Nakuru</option>
                <option>Eldoret</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3z" />
                  <path fillRule="evenodd" d="M3 7a1 1 0 100 2h7a1 1 0 100-2H3z" clipRule="evenodd" />
                  <path d="M3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                </svg>
              </div>
              <select 
                className="input pl-10 appearance-none" 
                onChange={e => setSortBy(e.target.value)}
                value={sortBy}
              >
                <option value="">Sort By</option>
                <option value="date">Newest First</option>
                <option value="salary">Highest Salary</option>
                <option value="title">Job Title (A-Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
        </div>

        </div>
        </div>

        {/* JOB FORM */}
        <form 
          id="jobForm"
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-2xl shadow-sm mb-12 space-y-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {editingId ? 'Edit Job Posting' : 'Post a New Job'}
          </h2>
          <p className="text-gray-600 mb-6">
            {editingId ? 'Update the job details below' : 'Fill in the details to post a new job opening'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input 
                className="input w-full" 
                placeholder="e.g. Senior Frontend Developer" 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input 
                className="input w-full" 
                placeholder="Company name" 
                value={form.company} 
                onChange={e => setForm({ ...form, company: e.target.value })} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                className="input w-full" 
                placeholder="e.g. Nairobi, Kenya" 
                value={form.location} 
                onChange={e => setForm({ ...form, location: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select 
                className="input w-full" 
                value={form.type} 
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (KSh)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">KSh</span>
                </div>
                <input 
                  className="input w-full pl-14" 
                  type="number" 
                  placeholder="e.g. 100000" 
                  value={form.salary} 
                  onChange={e => setForm({ ...form, salary: e.target.value })} 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input 
                className="input w-full" 
                type="date" 
                value={form.deadline} 
                onChange={e => setForm({ ...form, deadline: e.target.value })} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <textarea 
              className="input w-full min-h-[120px]" 
              placeholder="Detailed job description, responsibilities, etc." 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
            <textarea 
              className="input w-full min-h-[100px]" 
              placeholder="Required skills, experience, and qualifications" 
              value={form.requirements} 
              onChange={e => setForm({ ...form, requirements: e.target.value })} 
              required
            />
            <p className="mt-1 text-sm text-gray-500">Separate requirements with commas</p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ title: "", company: "", location: "", type: "", salary: "", description: "", requirements: "", deadline: "" });
                  setEditingId(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingId ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <tr key={job.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-emerald-600 font-medium">{job.company.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{new Date(job.datePosted).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600">{job.location || 'Not specified'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.type === 'Remote' ? 'bg-blue-100 text-blue-800' :
                        job.type === 'On-site' ? 'bg-purple-100 text-purple-800' :
                        job.type === 'Hybrid' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {job.salary ? `KSh ${job.salary.toLocaleString()}` : 'Negotiable'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="text-emerald-600 hover:text-emerald-800 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button 
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          setFilterType('');
                          setFilterLocation('');
                          setSortBy('');
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-emerald-600 font-medium">{job.company.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location || 'Location not specified'}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.type || 'N/A'}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.salary ? `KSh ${job.salary.toLocaleString()}` : 'Salary negotiable'}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Posted {new Date(job.datePosted).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <button 
                    onClick={() => handleApply(job.id)} 
                    disabled={job.applied}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex-1 mr-2 ${
                      job.applied 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {job.applied ? 'Applied' : 'Apply Now'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => handleEdit(job)}
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setFilterType('');
                    setFilterLocation('');
                    setSortBy('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* JOB DETAILS MODAL */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedJob(null)}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-1">
                            {selectedJob.title}
                          </h3>
                          <p className="text-lg text-gray-600">
                            {selectedJob.company} • {selectedJob.location}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedJob(null)}
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-500">JOB TYPE</p>
                            <p className="mt-1 text-sm font-medium">{selectedJob.type || 'Not specified'}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-500">SALARY</p>
                            <p className="mt-1 text-sm font-medium">
                              {selectedJob.salary ? `KSh ${selectedJob.salary.toLocaleString()}` : 'Negotiable'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-500">LOCATION</p>
                            <p className="mt-1 text-sm font-medium">{selectedJob.location || 'Not specified'}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-500">DEADLINE</p>
                            <p className="mt-1 text-sm font-medium">
                              {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'Not specified'}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h4>
                          <div className="prose max-w-none text-gray-600">
                            {selectedJob.description || 'No description provided.'}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {selectedJob.requirements ? (
                              selectedJob.requirements.split(',').map((req, i) => (
                                <li key={i} className="text-sm">{req.trim()}</li>
                              ))
                            ) : (
                              <li className="text-sm">No specific requirements listed.</li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Posted on {new Date(selectedJob.datePosted).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={() => {
                                  handleEdit(selectedJob);
                                  setSelectedJob(null);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                              >
                                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleApply(selectedJob.id)}
                                disabled={selectedJob.applied}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                  selectedJob.applied 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                                }`}
                              >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {selectedJob.applied ? 'Applied' : 'Apply Now'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
