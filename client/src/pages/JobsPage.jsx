import React, { useState } from "react";
import { Search, Bell, Settings, HelpCircle } from "lucide-react";
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

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = filterType === "All" || job.type === filterType;
    const matchesLocation = filterLocation === "All" || job.location === filterLocation;
    const matchesAgency = filterAgency === "All" || job.company === filterAgency;

    return matchesSearch && matchesType && matchesLocation && matchesAgency;
  });

  // Define filter options
  const jobTypes = ["All", "Internship", "Full-Time", "Contract", "Part-Time"];
  const locations = ["All", "Nairobi", "Remote", "Mombasa", "Kisumu"];

  // Clear all filters
  const clearFilters = () => {
    setFilterType("All");
    setFilterLocation("All");
    setSearchText("");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-purple-400">Studex</h1>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link to="/jobs" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Jobs
                </Link>
                <Link to="/Internships" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Internships
                </Link>
                <Link to="/myapplications" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  My Applications
                </Link>
                <Link to="/messages" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Messages
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md leading-5 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                  placeholder="Search jobs..."
                />
              </div>
              
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {/* NAVBAR */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-colors"
              placeholder="Search for jobs, companies, or keywords..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', 'Full-time', 'Part-time', 'Internship', 'Remote'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* JOB CARDS GRID */}
        <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
            <p className="text-center text-gray-400 col-span-full">No jobs found.</p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 bg-gray-800 py-6 shadow-inner border-t border-gray-700">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between text-gray-400 text-sm px-6">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">FAQ</a>
          <a href="#" className="hover:text-white transition-colors">Partners</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Career Tips / Blog</a>
        </div>
      </footer>
    </div>
  );
}