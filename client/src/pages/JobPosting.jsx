import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, Settings, HelpCircle, User, Loader2, Plus, Edit, Trash2, X, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { jobAPI } from "../utils/api";
import { toast } from "react-toastify";

export default function JobPostings() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // State for job postings
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const emptyForm = {
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
    skills: []
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newSkill, setNewSkill] = useState("");

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    location: ""
  });

  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.location) params.append('location', filters.location);
        
        const response = await jobAPI.getAllJobs(params);
        setJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job postings. Please try again later.');
        toast.error('Failed to load job postings');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  /* ---------------- CREATE / UPDATE ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (editingId) {
        // Update existing job
        const response = await jobAPI.updateJob(editingId, form);
        setJobs(jobs.map(job => job.id === editingId ? response.data : job));
        toast.success('Job updated successfully');
      } else {
        // Create new job
        const response = await jobAPI.createJob(form);
        setJobs([response.data, ...jobs]);
        toast.success('Job posted successfully');
      }
      
      // Reset form
      setForm(emptyForm);
      setEditingId(null);
      setSelectedJob(null);
    } catch (err) {
      console.error('Error saving job:', err);
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }

    if (editingId) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingId
            ? {
                ...job,
                ...form,
                salary: form.salary ? Number(form.salary) : "",
              }
            : job
        )
      );
      setEditingId(null);
    } else {
      setJobs((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          salary: form.salary ? Number(form.salary) : "",
          datePosted: new Date(),
          applied: false,
        },
      ]);
    }

    setForm(emptyForm);
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      deadline: job.deadline.split('T')[0], // Format date for input[type="date"]
      skills: job.skills || []
    });
    setEditingId(job.id);
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      location: ""
    });
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobAPI.deleteJob(id);
        setJobs(jobs.filter((job) => job.id !== id));
        if (selectedJob?.id === id) {
          setSelectedJob(null);
        }
        toast.success('Job deleted successfully');
      } catch (err) {
        console.error('Error deleting job:', err);
        toast.error('Failed to delete job');
      }
    }
  };

  /* ---------------- APPLY ---------------- */

  const handleApply = (id) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, applied: true } : job
      )
    );
  };

  /* ---------------- FILTER / SORT ---------------- */

  // Filter and sort jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.type || job.type === filters.type;
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  // Sort jobs by date posted (newest first)
  const sortedJobs = [...filteredJobs].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  /* ================================================= */

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* ================= HEADER ================= */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-emerald-600">
            Studex
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/jobs">Jobs</Link>
            <Link to="/myapplications">My Applications</Link>
            <NavLink to="/messages">Messages</NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={filters.search}
                onChange={handleFilterChange}
                name="search"
                className="pl-9 pr-3 py-2 border rounded-md text-sm"
                placeholder="Search jobs..."
              />
            </div>

            <HelpCircle />
            <Bell />

            <button onClick={() => navigate("/settings")}>
              <Settings />
            </button>

            <button onClick={() => navigate("/profile")}>
              <User />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto p-6">

        {/* ===== JOB FORM ===== */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
        >
          <h2 className="text-xl font-bold">
            {editingId ? "Edit Job" : "Post Job"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Job Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Job Type</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
              <option>Internship</option>
            </select>

            <input
              type="number"
              className="input"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
            <input
              type="date"
              className="input"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          <textarea
            className="input min-h-[100px]"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <textarea
            className="input min-h-[80px]"
            placeholder="Requirements (comma separated)"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}
            <button className="px-6 py-2 bg-emerald-600 text-white rounded">
              {editingId ? "Update" : "Post"}
            </button>
          </div>
        </form>

        {/* ===== JOB LIST ===== */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading jobs...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job List */}
              <div className={`lg:col-span-1 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Job Postings</h2>
                  <button
                    onClick={() => {
                      setForm(emptyForm);
                      setEditingId(null);
                      setSelectedJob(null);
                    }}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Job
                  </button>
                </div>
                
                {sortedJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No job postings found
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {sortedJobs.map((job) => (
                      <div
                        key={job.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedJob?.id === job.id 
                            ? darkMode 
                              ? 'bg-blue-900/50 border border-blue-700' 
                              : 'bg-blue-50 border border-blue-200'
                            : darkMode 
                              ? 'hover:bg-gray-700/50 border border-gray-700' 
                              : 'hover:bg-gray-50 border border-gray-200'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <h3 className="font-semibold text-sm">{job.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {job.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {job.location}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(job);
                              }}
                              className={`p-1 rounded-full ${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                              title="Edit job"
                            >
                              <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(job.id);
                              }}
                              className={`p-1 rounded-full ${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                              title="Delete job"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-medium mb-3">Filter Jobs</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Search</label>
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Job title or company"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Type</label>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      placeholder="City or country"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center"
          onClick={() => setSelectedJob(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl max-w-lg w-full"
          >
            <h2 className="text-xl font-bold">{selectedJob.title}</h2>
            <p className="text-gray-600">{selectedJob.company}</p>

            <p className="mt-4">{selectedJob.description}</p>

            <ul className="list-disc pl-5 mt-3">
              {selectedJob.requirements
                .split(",")
                .map((r, i) => (
                  <li key={`${r}-${i}`}>{r.trim()}</li>
                ))}
            </ul>

            <button
              className="mt-6 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
