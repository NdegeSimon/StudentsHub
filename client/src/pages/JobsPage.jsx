import React, { useState } from "react";
import { Search, Bell, Settings, HelpCircle, Sparkles, MapPin, Briefcase, Clock, TrendingUp, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useTheme } from "../context/ThemeContext";

export default function JobsPage() {
  const { darkMode } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterAgency, setFilterAgency] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Job listings data
  const jobs = [
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