import React, { useState, useEffect } from "react";
import { 
  Search, Filter, X, Briefcase, MapPin, Clock, Bookmark, 
  Sparkles, HelpCircle, Bell, Settings, TrendingUp, 
  ChevronDown, Loader2, AlertCircle, Heart, Star, Building, User,Users
} from "lucide-react";
import { Link, useNavigate,NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobAPI } from "../utils/api"; // Your existing jobAPI
import { toast } from "react-toastify";



export default function JobsPage() {
  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    experience: "All"
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch jobs from backend using your jobAPI
  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const fetchJobs = async () => {
    try {
      if (page === 1) setLoading(true);
      
      // Build query parameters based on your API
      const queryParams = {};
      
      // Add search text if exists
      if (searchText) {
        queryParams.search = searchText;
      }
      
      // Add filters if not "All"
      if (filters.type !== "All") {
        queryParams.type = filters.type;
      }
      
      if (filters.location !== "All") {
        queryParams.location = filters.location;
      }
      
      if (filters.experience !== "All") {
        queryParams.experience = filters.experience;
      }
      
      // Call your jobAPI.getAllJobs()
      const response = await jobAPI.getAllJobs(queryParams);
      
      // Debug log to see response structure
      console.log("API Response:", response);
      
      // Handle different response structures from your API
      let jobsData = [];
      
      // Case 1: response.data is the jobs array
      if (response && Array.isArray(response.data)) {
        jobsData = response.data;
      }
      // Case 2: response is the jobs array directly
      else if (Array.isArray(response)) {
        jobsData = response;
      }
      // Case 3: response has a 'jobs' property
      else if (response && response.jobs && Array.isArray(response.jobs)) {
        jobsData = response.jobs;
      }
      // Case 4: response.data.data structure
      else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        jobsData = response.data.data;
      }
      
      // Load saved jobs from localStorage
      const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const savedJobsSet = new Set(savedJobsFromStorage);
      setSavedJobs(savedJobsSet);
      
      // Mark saved status on jobs
      const jobsWithSavedStatus = jobsData.map(job => ({
        ...job,
        isSaved: savedJobsSet.has(job.id)
      }));
      
      if (page === 1) {
        setJobs(jobsWithSavedStatus);
      } else {
        setJobs(prev => [...prev, ...jobsWithSavedStatus]);
      }
      
      // Check if there are more jobs (simple pagination logic)
      setHasMore(jobsData.length > 0);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching jobs from backend:', err);
      setError('Failed to load jobs from server');
      toast.error('Unable to connect to job server');
      
      // Fallback to local data
      const fallbackJobs = getFallbackJobs();
      const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const savedJobsSet = new Set(savedJobsFromStorage);
      
      const jobsWithSavedStatus = fallbackJobs.map(job => ({
        ...job,
        isSaved: savedJobsSet.has(job.id)
      }));
      
      setJobs(jobsWithSavedStatus);
      
    } finally {
      setLoading(false);
    }
  };

  // Fallback jobs data
  const getFallbackJobs = () => {
    return [
      {
        id: 1,
        title: "Software Engineer Intern",
        company: "Tech Solutions Inc",
        location: "Nairobi",
        type: "Internship",
        salary: "KSh 35,000/month",
        description: "Backend connection failed. Using local data. We're looking for a software engineering intern.",
        postedDate: "2 days ago",
        tags: ['Python', 'Django', 'React'],
        experienceLevel: "Entry Level",
        remote: true
      },
      {
        id: 2,
        title: "Marketing Assistant",
        company: "Digital Marketing Pro",
        location: "Remote",
        type: "Part-time",
        salary: "KSh 25,000/month",
        description: "Backend connection failed. Using local data. Join our marketing team.",
        postedDate: "1 week ago",
        tags: ['Marketing', 'Social Media', 'Content Creation'],
        experienceLevel: "Entry Level",
        remote: true
      }
    ];
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchJobs();
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1); // Reset to first page on filter change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: "All",
      location: "All",
      experience: "All"
    });
    setSearchText("");
    setPage(1);
  };

  // Toggle save job with your jobAPI
  const handleSaveJob = async (jobId) => {
    if (!user) {
      navigate("/login", { state: { from: "/jobs" } });
      return;
    }
    
    try {
      const job = jobs.find(j => j.id === jobId);
      const isCurrentlySaved = savedJobs.has(jobId);
      
      if (isCurrentlySaved) {
        // Call your jobAPI.unsaveJob
        await jobAPI.unsaveJob(jobId);
        toast.success("Job removed from saved");
      } else {
        // Call your jobAPI.saveJob
        await jobAPI.saveJob(jobId);
        toast.success("Job saved successfully");
      }
      
      // Update localStorage
      const updatedSavedJobs = isCurrentlySaved 
        ? [...savedJobs].filter(id => id !== jobId)
        : [...savedJobs, jobId];
      
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(new Set(updatedSavedJobs));
      
      // Update UI
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isSaved: !isCurrentlySaved } : job
      ));
      
    } catch (err) {
      console.error("Error toggling save job:", err);
      toast.error("Failed to update saved status");
      
      // Update UI locally anyway
      const updatedSavedJobs = savedJobs.has(jobId) 
        ? [...savedJobs].filter(id => id !== jobId)
        : [...savedJobs, jobId];
      
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(new Set(updatedSavedJobs));
      
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isSaved: !savedJobs.has(jobId) } : job
      ));
    }
  };

  // Load more jobs
  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  // Filter jobs based on search and filters (client-side fallback)
  const filteredJobs = jobs.filter(job => {
    if (!job) return false;
    
    const matchesSearch = 
      searchText === '' || 
      (job.title && job.title.toLowerCase().includes(searchText.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(searchText.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchText.toLowerCase())) ||
      (job.tags && job.tags.some(tag => 
        tag && typeof tag === 'string' && tag.toLowerCase().includes(searchText.toLowerCase())
      ));
    
    const matchesType = filters.type === "All" || job.type === filters.type;
    const matchesLocation = filters.location === "All" || job.location === filters.location;
    const matchesExperience = filters.experience === "All" || job.experienceLevel === filters.experience;
    
    return matchesSearch && matchesType && matchesLocation && matchesExperience;
  });

  // Extract unique values for filters
  const jobTypes = ["All", ...new Set(jobs.map(job => job.type).filter(Boolean))];
  const locations = ["All", ...new Set(jobs.map(job => job.location).filter(Boolean))];
  const experienceLevels = ["All", "Entry Level", "Mid Level", "Senior", "Executive"];

  // Calculate stats
  const stats = {
    totalJobs: jobs.length,
    remoteJobs: jobs.filter(j => j.remote || j.location?.toLowerCase() === 'remote').length,
    internships: jobs.filter(j => j.type === 'Internship').length,
    savedCount: savedJobs.size
  };

  // Loading state
  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading jobs from backend...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
          Studex
        </Link>
        <nav className="hidden md:ml-10 md:flex space-x-8">
          <NavLink 
            to="/jobs"
            end
            className={({ isActive }) => 
              `px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Jobs
          </NavLink>
          <Link 
            to="#" 
            className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
          >
            Internships
          </Link>
          <NavLink 
            to="/myapplications"
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
            placeholder="Search jobs..."
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
      <div className="container mx-auto px-4 py-8">
        {/* Connection Status */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-yellow-200">{error}</p>
                <p className="text-yellow-400 text-sm mt-1">
                  Backend: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-gray-400 text-lg">
            Connecting to backend API for real-time job listings
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-24 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search jobs by title, company, or keywords..."
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-gray-800/30 rounded-xl p-6">
          <div className="flex flex-wrap gap-4">
            {/* Job Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">Job Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
                <div className="text-sm text-gray-400">Total Jobs</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.remoteJobs}</div>
                <div className="text-sm text-gray-400">Remote Jobs</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.internships}</div>
                <div className="text-sm text-gray-400">Internships</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.savedCount}</div>
                <div className="text-sm text-gray-400">Saved Jobs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Available Jobs ({filteredJobs.length})
          </h2>
          
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                    {/* Job Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                        <p className="text-gray-300">{job.company}</p>
                      </div>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`p-2 rounded-full ${job.isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                      >
                        {job.isSaved ? (
                          <Heart className="h-6 w-6 fill-current" />
                        ) : (
                          <Heart className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                    
                    {/* Job Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span>{job.type}</span>
                        {job.salary && (
                          <span className="ml-4 text-green-400">{job.salary}</span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Star className="h-4 w-4 mr-2" />
                        <span>{job.experienceLevel || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags && job.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Apply Button */}
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && filteredJobs.length >= 6 && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More Jobs'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}