import React, { useState, useEffect } from "react";
import { Search, Filter, X, Briefcase, MapPin, Clock, Bookmark, Sparkles, HelpCircle, Bell, Settings, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";
import { jobAPI } from "../utils/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "Tech Solutions Inc",
      location: "Nairobi",
      type: "Internship",
      salary: "KSh 35,000/month",
      description: "We are looking for a software engineering intern...",
      postedDate: "2 days ago",
      tags: ['Python', 'Django', 'React'],
      isSaved: false
    },
    {
      id: 2,
      title: "Marketing Assistant",
      company: "Digital Marketing Pro",
      location: "Remote",
      type: "Part-time",
      salary: "KSh 25,000/month",
      description: "Join our marketing team as an assistant...",
      postedDate: "1 week ago",
      tags: ['Marketing', 'Social Media', 'Content Creation'],
      isSaved: false
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Data Insights Ltd",
      location: "Nairobi",
      type: "Full-time",
      salary: "KSh 120,000/month",
      description: "Looking for an experienced data analyst...",
      postedDate: "3 days ago",
      tags: ['Python', 'Data Analysis', 'SQL'],
      isSaved: false
    },
    {
      id: 4,
      title: "UI/UX Designer",
      company: "Creative Minds",
      location: "Mombasa",
      type: "Contract",
      salary: "KSh 90,000/month",
      description: "We need a creative UI/UX designer...",
      postedDate: "5 days ago",
      tags: ['Figma', 'UI/UX', 'Prototyping'],
      isSaved: false
    },
    {
      id: 5,
      title: "Data Science Intern",
      company: "AI Research Lab",
      location: "Nairobi",
      type: "Internship",
      salary: "KSh 30,000/month",
      description: "Join our AI research team as a data science intern...",
      postedDate: "1 day ago",
      tags: ['Python', 'Data Analysis', 'Internship'],
      isSaved: false
    },
    {
      id: 6,
      title: "Data Entry Assistant",
      company: "NGO X",
      location: "Remote",
      type: "Contract",
      salary: "KSh 20,000/month",
      description: "Assist with data entry for field projects...",
      postedDate: "5 days ago",
      tags: ['NGO', 'Remote'],
      isSaved: false
    }
  ]);
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
      // Ensure we're working with an array
      setJobs(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
      setJobs([]); // Ensure jobs is always an array
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
              <Link to="/settings" className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all">
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
            <span className="text-sm font-medium text-purple-300">{filteredJobs.length} Opportunities Available</span>
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
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Job Type Filter */}
            <select
              className="rounded-xl border border-gray-700/50 bg-gray-800/50 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              className="rounded-xl border border-gray-700/50 bg-gray-800/50 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Experience Filter */}
            <select
              className="rounded-xl border border-gray-700/50 bg-gray-800/50 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {(filters.type !== 'All' || filters.location !== 'All' || filters.experience !== 'All') && (
              <button
                type="button"
                onClick={() => setFilters({ type: 'All', location: 'All', experience: 'All' })}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Clear filters
                <X className="ml-1 h-4 w-4" />
              </button>
            )}
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
                  <div className="text-2xl font-bold text-white">{filteredJobs.length}</div>
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
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg">No jobs found matching your criteria</p>
              <button 
                onClick={() => {
                  setSearchText('');
                  setFilters({ type: 'All', location: 'All', experience: 'All' });
                }}
                className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  salary={job.salary}
                  postedDate={job.postedDate}
                  description={job.description}
                  tags={job.tags}
                  isBookmarked={job.isSaved}
                  onBookmark={() => handleSaveJob(job.id)}
                />
              ))}
            </div>
          )}
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
    </div>
  );
}