import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  Building2,
  GraduationCap,
  Briefcase,
  Star,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
  X,
  Plus,
  Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InternshipsPage = () => {
  // State management
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    duration: '',
    field: '',
    paid: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);

  // Mock data - Replace with API call
  const mockInternships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Safaricom PLC",
      logo: "https://via.placeholder.com/48",
      location: "Nairobi, Kenya",
      type: "Hybrid",
      duration: "3 months",
      stipend: "Ksh 25,000/month",
      postedDate: "2 days ago",
      deadline: "2024-03-15",
      description: "Join our engineering team to work on cutting-edge mobile applications. Gain experience in React Native, Node.js, and cloud technologies.",
      requirements: ["3rd/4th year Computer Science student", "Knowledge of JavaScript/TypeScript", "Basic understanding of REST APIs"],
      perks: ["Mentorship", "Certificate", "Job offer possibility", "Networking events"],
      field: "Technology",
      tags: ["React", "Node.js", "Mobile", "Full-time"],
      applications: 124,
      rating: 4.8,
      featured: true,
      urgent: true
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Equity Bank",
      logo: "https://via.placeholder.com/48",
      location: "Remote",
      type: "Remote",
      duration: "6 months",
      stipend: "Ksh 30,000/month",
      postedDate: "1 week ago",
      deadline: "2024-03-20",
      description: "Work with our data team to analyze customer behavior and develop predictive models using Python and machine learning.",
      requirements: ["Statistics/Mathematics/CS background", "Python programming", "SQL knowledge"],
      perks: ["Flexible hours", "Training budget", "Remote work setup"],
      field: "Data & Analytics",
      tags: ["Python", "Machine Learning", "SQL", "Data Analysis"],
      applications: 89,
      rating: 4.6,
      featured: true,
      urgent: false
    },
    {
      id: 3,
      title: "Marketing Intern",
      company: "Andela",
      logo: "https://via.placeholder.com/48",
      location: "Nairobi, Kenya",
      type: "On-site",
      duration: "4 months",
      stipend: "Ksh 20,000/month",
      postedDate: "3 days ago",
      deadline: "2024-03-10",
      description: "Assist our marketing team in developing campaigns, social media management, and content creation.",
      requirements: ["Marketing/Communications student", "Social media savvy", "Creative writing"],
      perks: ["Portfolio projects", "Industry connections", "Skill development"],
      field: "Marketing",
      tags: ["Digital Marketing", "Content", "Social Media", "Analytics"],
      applications: 67,
      rating: 4.5,
      featured: false,
      urgent: true
    },
    {
      id: 4,
      title: "Finance Intern",
      company: "KCB Bank",
      logo: "https://via.placeholder.com/48",
      location: "Mombasa, Kenya",
      type: "Hybrid",
      duration: "3 months",
      stipend: "Ksh 22,000/month",
      postedDate: "5 days ago",
      deadline: "2024-03-25",
      description: "Gain hands-on experience in financial analysis, reporting, and budgeting in a leading banking institution.",
      requirements: ["Finance/Accounting student", "Excel proficiency", "Attention to detail"],
      perks: ["Banking certification", "Career guidance", "Financial training"],
      field: "Finance",
      tags: ["Accounting", "Excel", "Financial Analysis", "Reporting"],
      applications: 92,
      rating: 4.7,
      featured: false,
      urgent: false
    },
    {
      id: 5,
      title: "UI/UX Design Intern",
      company: "Twiga Foods",
      logo: "https://via.placeholder.com/48",
      location: "Remote",
      type: "Remote",
      duration: "5 months",
      stipend: "Ksh 28,000/month",
      postedDate: "1 day ago",
      deadline: "2024-03-05",
      description: "Design intuitive user interfaces for our agricultural technology platform. Work with product managers and developers.",
      requirements: ["Design portfolio", "Figma/Sketch experience", "User research basics"],
      perks: ["Design software license", "Mentor sessions", "Real project experience"],
      field: "Design",
      tags: ["Figma", "UI/UX", "Product Design", "Prototyping"],
      applications: 45,
      rating: 4.9,
      featured: true,
      urgent: true
    },
    {
      id: 6,
      title: "Human Resources Intern",
      company: "NCBA Bank",
      logo: "https://via.placeholder.com/48",
      location: "Nairobi, Kenya",
      type: "On-site",
      duration: "4 months",
      stipend: "Ksh 18,000/month",
      postedDate: "1 week ago",
      deadline: "2024-03-18",
      description: "Support HR operations including recruitment, onboarding, employee engagement, and policy implementation.",
      requirements: ["HR/Management student", "Communication skills", "Confidentiality"],
      perks: ["HR certification", "Networking", "Professional development"],
      field: "Human Resources",
      tags: ["Recruitment", "HR Operations", "Employee Relations", "Training"],
      applications: 78,
      rating: 4.4,
      featured: false,
      urgent: false
    }
  ];

  // Filter options
  const filterOptions = {
    locations: ["Nairobi", "Mombasa", "Kisumu", "Remote", "Hybrid"],
    types: ["On-site", "Remote", "Hybrid"],
    durations: ["1-3 months", "4-6 months", "7-12 months"],
    fields: ["Technology", "Marketing", "Finance", "Human Resources", "Design", "Data & Analytics", "Sales", "Operations"],
    stipendRanges: ["Paid", "Unpaid", "Stipend + Allowance"]
  };
useEffect(() => {
  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internships');
      const data = await response.json();
      setInternships(data);
      setFilteredInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchInternships();
}, []);
  // Simulate API call
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setInternships(mockInternships);
      setFilteredInternships(mockInternships);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...internships];

    // Search filter
    if (searchTerm) {
      result = result.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter(internship =>
        internship.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      result = result.filter(internship => internship.type === filters.type);
    }

    // Field filter
    if (filters.field) {
      result = result.filter(internship => internship.field === filters.field);
    }

    // Duration filter
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number);
      result = result.filter(internship => {
        const internshipDuration = parseInt(internship.duration);
        return internshipDuration >= min && internshipDuration <= max;
      });
    }

    // Paid filter
    if (filters.paid !== null) {
      if (filters.paid === true) {
        result = result.filter(internship => internship.stipend !== "Unpaid");
      } else {
        result = result.filter(internship => internship.stipend === "Unpaid");
      }
    }

    setFilteredInternships(result);

    // Update applied filters display
    const applied = [];
    if (filters.location) applied.push(`Location: ${filters.location}`);
    if (filters.type) applied.push(`Type: ${filters.type}`);
    if (filters.field) applied.push(`Field: ${filters.field}`);
    if (filters.duration) applied.push(`Duration: ${filters.duration} months`);
    if (filters.paid !== null) applied.push(filters.paid ? "Paid" : "Unpaid");
    setAppliedFilters(applied);
  }, [searchTerm, filters, internships]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      type: '',
      duration: '',
      field: '',
      paid: null
    });
    setSearchTerm('');
  };

  const removeFilter = (filterText) => {
    const [key, value] = filterText.split(': ');
    const filterKey = key.toLowerCase();
    
    if (filterKey === 'location') setFilters(prev => ({ ...prev, location: '' }));
    else if (filterKey === 'type') setFilters(prev => ({ ...prev, type: '' }));
    else if (filterKey === 'field') setFilters(prev => ({ ...prev, field: '' }));
    else if (filterKey === 'duration') setFilters(prev => ({ ...prev, duration: '' }));
    else if (filterText === 'Paid' || filterText === 'Unpaid') setFilters(prev => ({ ...prev, paid: null }));
  };

  const handleApply = async (internshipId) => {
    // This is where you would make the API call to apply
    alert(`Applying for internship ${internshipId}`);
    // API call example:
    // try {
    //   const response = await fetch('/api/internships/apply', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ internshipId, userId: 'current-user-id' })
    //   });
    //   const data = await response.json();
    //   // Handle success
    // } catch (error) {
    //   // Handle error
    // }
  };

  const InternshipCard = ({ internship }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Company Logo & Basic Info */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-2">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{internship.rating}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {internship.featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                )}
                {internship.urgent && (
                  <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                    Urgent
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
              <p className="text-lg font-semibold text-purple-600 mb-3">{internship.company}</p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg font-bold text-gray-900">{internship.stipend}</span>
              <span className="text-sm text-gray-500">Monthly stipend</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{internship.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">{internship.type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{internship.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{internship.postedDate}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">{internship.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {internship.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {internship.applications} applicants
              </span>
              <span>Apply before: {internship.deadline}</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleApply(internship.id)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
              >
                Apply Now
              </button>
              <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FeaturedInternships = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Internships</h2>
          <p className="text-gray-600">Top opportunities with great benefits</p>
        </div>
        <button className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all duration-300">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {internships
          .filter(i => i.featured)
          .slice(0, 3)
          .map(internship => (
            <div key={internship.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{internship.title}</h3>
              <p className="text-purple-600 font-semibold mb-3">{internship.company}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {internship.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  {internship.stipend}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{internship.applications} applicants</span>
                <button 
                  onClick={() => handleApply(internship.id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {[
        { icon: <BookOpen />, value: "1,245+", label: "Internships", color: "from-purple-600 to-pink-600" },
        { icon: <Users />, value: "10,000+", label: "Students", color: "from-blue-600 to-cyan-600" },
        { icon: <Target />, value: "95%", label: "Success Rate", color: "from-green-600 to-emerald-600" },
        { icon: <Award />, value: "500+", label: "Companies", color: "from-orange-600 to-red-600" }
      ].map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-4`}>
            <div className="text-white">
              {stat.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1`}>
            {stat.value}
          </div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Internship Opportunity
              </span>
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Kickstart your career with hands-on experience at top Kenyan companies.
              Apply for internships that match your skills and interests.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search internships by role, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <QuickStats />

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Active Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map((filter, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {filter}
                    <button 
                      onClick={() => removeFilter(filter)}
                      className="hover:text-purple-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                    <div className="space-y-2">
                      {filterOptions.locations.map(location => (
                        <label key={location} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.location === location}
                            onChange={(e) => handleFilterChange('location', e.target.checked ? location : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Internship Type */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Type</h4>
                    <div className="space-y-2">
                      {filterOptions.types.map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.type === type}
                            onChange={(e) => handleFilterChange('type', e.target.checked ? type : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Field */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Field</h4>
                    <div className="space-y-2">
                      {filterOptions.fields.map(field => (
                        <label key={field} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.field === field}
                            onChange={(e) => handleFilterChange('field', e.target.checked ? field : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Duration</h4>
                    <div className="space-y-2">
                      {filterOptions.durations.map(duration => (
                        <label key={duration} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.duration === duration}
                            onChange={(e) => handleFilterChange('duration', e.target.checked ? duration : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{duration}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stipend */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Stipend</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.paid === true}
                          onChange={(e) => handleFilterChange('paid', e.target.checked ? true : null)}
                          className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Paid Internships</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.paid === false}
                          onChange={(e) => handleFilterChange('paid', e.target.checked ? false : null)}
                          className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Unpaid Internships</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={clearFilters}
                  className="w-full mt-8 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Internships List */}
            <div className="lg:w-3/4">
              {/* Featured Internships */}
              <FeaturedInternships />

              {/* All Internships */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">All Internships</h2>
                    <p className="text-gray-600">
                      {filteredInternships.length} opportunities found
                    </p>
                  </div>
                  <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300">
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-600">Loading internships...</p>
                  </div>
                ) : filteredInternships.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No internships found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                    <button 
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredInternships.map(internship => (
                      <InternshipCard key={internship.id} internship={internship} />
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits Section */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Why Choose Studex Internships?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <CheckCircle className="h-8 w-8" />,
                      title: "Verified Companies",
                      description: "All internships are from verified and trusted companies"
                    },
                    {
                      icon: <Target className="h-8 w-8" />,
                      title: "Career Growth",
                      description: "Gain real-world experience and build your portfolio"
                    },
                    {
                      icon: <TrendingUp className="h-8 w-8" />,
                      title: "High Success Rate",
                      description: "95% of our interns receive job offers or recommendations"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 text-center">
                      <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mb-4">
                        <div className="text-purple-600">
                          {benefit.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Career?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of students who launched their careers through Studex internships
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup"
              className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Create Free Account
            </a>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 hover:scale-105">
              Post an Internship
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InternshipsPage;