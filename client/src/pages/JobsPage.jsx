import React, { useState, useEffect } from "react";
import { Search, Filter, X, Briefcase, MapPin, Clock, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";
import { jobAPI } from "../utils/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    experience: "All"
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobAPI.getAllJobs();
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchText);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Toggle save job
  const handleSaveJob = async (jobId) => {
    if (!user) {
      navigate("/login", { state: { from: "/jobs" } });
      return;
    }
    
    try {
      // Toggle save/unsave job
      const isCurrentlySaved = jobs.find(job => job.id === jobId)?.isSaved;
      
      if (isCurrentlySaved) {
        await jobAPI.unsaveJob(jobId);
      } else {
        await jobAPI.saveJob(jobId);
      }
      
      // Update UI
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      ));
      
    } catch (err) {
      console.error("Error toggling save job:", err);
    }
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    // Search text filter
    const matchesSearch = 
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description.toLowerCase().includes(searchText.toLowerCase());
    
    // Additional filters
    const matchesType = filters.type === "All" || job.type === filters.type;
    const matchesLocation = filters.location === "All" || job.location === filters.location;
    const matchesExperience = filters.experience === "All" || job.experienceLevel === filters.experience;
    
    return matchesSearch && matchesType && matchesLocation && matchesExperience;
  });

  // Sample job types, locations, and experience levels
  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship"];
  const locations = ["All", "Nairobi", "Mombasa", "Kisumu", "Remote"];
  const experienceLevels = ["All", "Entry Level", "Mid Level", "Senior", "Executive"];
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filter Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search for jobs, companies, or keywords"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <button
                type="button"
                className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showMobileFilters ? 'Hide Filters' : 'Filters'}
              </button>
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredJobs.length}</span> jobs
              </p>
            </div>

            <div className="hidden md:flex space-x-4">
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type === 'All' ? 'All' : type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location === 'All' ? 'All' : location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level === 'All' ? 'All' : level}>
                    {level}
                  </option>
                ))}
              </select>

              {(filters.type !== 'All' || filters.location !== 'All' || filters.experience !== 'All') && (
                <button
                  type="button"
                  onClick={() => setFilters({ type: 'All', location: 'All', experience: 'All' })}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear filters
                  <X className="ml-1 h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="md:hidden bg-gray-50 px-4 py-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type === 'All' ? 'All' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location} value={location === 'All' ? 'All' : location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level === 'All' ? 'All' : level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFilters({ type: 'All', location: 'All', experience: 'All' })}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchText('');
                  setFilters({ type: 'All', location: 'All', experience: 'All' });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company}
                salary={job.salary}
                postedDate={job.postedDate}
                description={job.description}
                tags={job.tags || []}
                isBookmarked={job.isSaved || false}
                onBookmark={() => handleSaveJob(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
      tags: ['Python', 'Data Analysis', 'Internship']
    },
    {
      id: 6,
      title: "Data Entry Assistant",
      company: "NGO X",
      location: "Remote",
      type: "Contract",
      deadline: "2025-12-15",
      salary: "KSh 20,000/month",
      description: "Assist with data entry for field projects.",
      requirements: ["High school diploma", "Attention to detail"],
      tags: ["NGO", "Remote"],
      postedDate: "5 days ago",
      verified: false,
      logo: "https://via.placeholder.com/50"
    }
  ];

  // FILTER LOGIC
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = filterType === "All" || job.type === filterType;
    const matchesLocation = filterLocation === "All" || job.location === filterLocation;
    const matchesAgency = filterAgency === "All" || job.company === filterAgency;

    return matchesSearch && matchesType && matchesLocation && matchesAgency;
  });

  const jobTypes = ["All", "Internship", "Full-Time", "Contract", "Part-Time"];
  const locations = ["All", "Nairobi", "Remote", "Mombasa", "Kisumu"];

  const clearFilters = () => {
    setFilterType("All");
    setFilterLocation("All");
    setSearchText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Studex
                </span>
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-1">
                <Link to="/jobs" className="text-white bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Jobs
                </Link>
                <Link to="/Internships" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Internships
                </Link>
                <Link to="/myapplications" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  My Applications
                </Link>
                <Link to="/messages" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Messages
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative hidden lg:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
                  placeholder="Quick search..."
                />
              </div>
              
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
              </button>
              <Link to="/settings" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="relative container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">{jobs.length} Opportunities Available</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover opportunities that match your skills and ambitions
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-4 py-4 border border-gray-700/50 bg-gray-800/50 backdrop-blur-xl text-white placeholder-gray-400 rounded-2xl leading-5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-lg transition-all"
              placeholder="Search for jobs, companies, or keywords..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-transparent"></div>
              Filters
            </h2>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white transition-all"
            >
              <Filter className="h-4 w-4" />
              {showMobileFilters ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <div className={`${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-2">
              {['All', 'Full-time', 'Part-time', 'Internship', 'Remote'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{jobs.length}</div>
                  <div className="text-xs text-gray-400">Total Jobs</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-900/20 border border-blue-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-xs text-gray-400">Locations</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/40 to-green-900/20 border border-green-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Clock className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-xs text-gray-400">New Today</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-900/40 to-orange-900/20 border border-orange-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-gray-400">Trending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  salary={job.salary}
                  postedDate={job.postedDate}
                  description={job.description}
                  tags={job.tags}
                  onBookmark={() => console.log('Bookmarked', job.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                  <Search className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No jobs found matching your criteria</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-16 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">FAQ</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">Partners</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">Contact</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 transform">Blog</a>
          </div>
          <div className="pt-8 border-t border-gray-800/50 text-center">
            <p className="text-gray-500 text-sm">© 2025 Studex. Empowering careers across Africa.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}