import React, { useState, useEffect } from 'react';
import { 
  Briefcase,
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  Building2,
  Star,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Award,
  Zap,
  TrendingUp,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  Heart,
  HelpCircle,
  Bell,
  Settings as SettingsIcon,
  User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InternshipsPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    duration: '',
    field: '',
    paid: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState(new Set());
  const [userProfile, setUserProfile] = useState(null);

  // Filter options
  const filterOptions = {
    locations: ["Nairobi", "Mombasa", "Kisumu", "Remote", "Hybrid"],
    types: ["On-site", "Remote", "Hybrid"],
    durations: ["1-3 months", "4-6 months", "7-12 months"],
    fields: ["Technology", "Marketing", "Finance", "Human Resources", "Design", "Data & Analytics", "Sales", "Operations"],
    stipendRanges: ["Paid", "Unpaid", "Stipend + Allowance"]
  };

  // Simulate user profile (replace with actual auth context)
  useEffect(() => {
    // In real app, get user from context/API
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      userType: "student",
      resumeUrl: "https://example.com/resume.pdf"
    };
    setUserProfile(mockUser);
  }, []);

  // Fetch internships from API
  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        // Real API call (uncomment when backend is ready)
        // const response = await fetch('/api/internships');
        // const data = await response.json();
        // setInternships(data.internships || []);
        // setFilteredInternships(data.internships || []);
        
        // Mock data for now
        setTimeout(() => {
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
              urgent: true,
              status: "open"
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
              urgent: false,
              status: "open"
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
              urgent: true,
              status: "open"
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
              urgent: false,
              status: "open"
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
              urgent: true,
              status: "open"
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
              urgent: false,
              status: "open"
            }
          ];
          setInternships(mockInternships);
          setFilteredInternships(mockInternships);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching internships:', error);
        toast.error('Failed to load internships. Please try again.');
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...internships];

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
  }, [filters, internships]);

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
    try {
      // Check if user is logged in
      if (!userProfile) {
        toast.error('Please login to apply for internships');
        return;
      }

      // Check if user is a student
      if (userProfile.userType !== 'student') {
        toast.error('Only students can apply for internships');
        return;
      }

      // Check if user has uploaded resume
      if (!userProfile.resumeUrl) {
        toast.error('Please upload your resume in your profile before applying');
        return;
      }

      // Check if already applied
      if (appliedInternships.has(internshipId)) {
        toast.info('You have already applied for this internship');
        return;
      }

      // Real API call (uncomment when backend is ready)
      /*
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/internships/${internshipId}/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resume: userProfile.resumeUrl,
          coverLetter: '',
          screeningQuestions: []
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      const result = await response.json();
      */

      // Simulate API success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update UI
      setAppliedInternships(prev => new Set([...prev, internshipId]));
      
      // Update internship applications count
      setInternships(prev => prev.map(internship => 
        internship.id === internshipId 
          ? { ...internship, applications: internship.applications + 1 }
          : internship
      ));
      
      setFilteredInternships(prev => prev.map(internship => 
        internship.id === internshipId 
          ? { ...internship, applications: internship.applications + 1 }
          : internship
      ));

      toast.success('Application submitted successfully!');
      
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    }
  };

  const handleSaveInternship = (internshipId) => {
    // Implement save functionality
    toast.info('Internship saved to your favorites!');
  };

  // Header Component
  const Header = () => (
    <header className="bg-gray-900 shadow-sm border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
              Studex
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link 
                to="/jobs" 
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Jobs
              </Link>
              <Link 
                to="/internships" 
                className="text-white px-3 py-2 text-sm font-medium bg-purple-600 rounded-lg transition-colors"
              >
                Internships
              </Link>
              <Link 
                to="/myapplications"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                My Applications
              </Link>
              <Link 
                to="/messages"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Messages
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
              <HelpCircle className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <div 
              className="ml-1 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-800"
              onClick={() => navigate('/settings')}
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-800 text-purple-400">
                <SettingsIcon className="h-5 w-5" />
              </div>
            </div>
            <div 
              className="ml-1 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-800"
              onClick={() => navigate('/profile')}
              title="View Profile"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-800 text-purple-400">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const InternshipCard = ({ internship }) => {
    const isApplied = appliedInternships.has(internship.id);
    const deadlineDate = new Date(internship.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    const isUrgent = daysUntilDeadline <= 3;

    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Company Logo & Basic Info */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center mb-2 border border-purple-800/30">
              <Building2 className="h-8 w-8 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-300">{internship.rating}</span>
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
                  {isUrgent && (
                    <span className="px-2 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-semibold rounded-full">
                      Urgent
                    </span>
                  )}
                  {isApplied && (
                    <span className="px-2 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full">
                      Applied
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{internship.title}</h3>
                <p className="text-lg font-semibold text-purple-400 mb-3">{internship.company}</p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-white">{internship.stipend}</span>
                <span className="text-sm text-gray-400">Monthly stipend</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{internship.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">{internship.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{internship.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{internship.postedDate}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4 line-clamp-2">{internship.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {internship.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600">
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {internship.applications} applicants
                </span>
                <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-400 font-semibold' : ''}`}>
                  <AlertCircle className="h-4 w-4" />
                  Apply before: {internship.deadline} {isUrgent && `(${daysUntilDeadline} days left)`}
                </span>
              </div>
              
              <div className="flex gap-3">
                {isApplied ? (
                  <button 
                    disabled
                    className="px-6 py-2.5 bg-green-900/30 text-green-400 rounded-xl font-semibold cursor-not-allowed border border-green-800/50"
                  >
                    ✓ Applied
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApply(internship.id)}
                    disabled={internship.status !== 'open'}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      internship.status === 'open' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                    }`}
                  >
                    {internship.status === 'open' ? 'Apply Now' : 'Closed'}
                  </button>
                )}
                <button 
                  onClick={() => handleSaveInternship(internship.id)}
                  className="px-4 py-2.5 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FeaturedInternships = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Featured Internships</h2>
          <p className="text-gray-400">Top opportunities with great benefits</p>
        </div>
        <button className="flex items-center gap-2 text-purple-400 font-semibold hover:gap-3 transition-all duration-300">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {internships
          .filter(i => i.featured)
          .slice(0, 3)
          .map(internship => (
            <div key={internship.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center border border-purple-900/50">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{internship.title}</h3>
              <p className="text-purple-400 font-semibold mb-3">{internship.company}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {internship.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  {internship.stipend}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{internship.applications} applicants</span>
                <button 
                  onClick={() => handleApply(internship.id)}
                  disabled={appliedInternships.has(internship.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    appliedInternships.has(internship.id)
                      ? 'bg-green-900/30 text-green-400 cursor-not-allowed border border-green-800/50'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  {appliedInternships.has(internship.id) ? 'Applied ✓' : 'Apply'}
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
        <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-4`}>
            <div className="text-white">
              {stat.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1`}>
            {stat.value}
          </div>
          <div className="text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Hero content removed */}
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
                <h3 className="text-lg font-semibold text-white">Active Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map((filter, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 text-purple-300 rounded-full text-sm font-medium border border-purple-800/50"
                  >
                    {filter}
                    <button 
                      onClick={() => removeFilter(filter)}
                      className="hover:text-purple-100"
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
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Location</h4>
                    <div className="space-y-2">
                      {filterOptions.locations.map(location => (
                        <label key={location} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.location === location}
                            onChange={(e) => handleFilterChange('location', e.target.checked ? location : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-800"
                          />
                          <span className="text-gray-300">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Internship Type */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Type</h4>
                    <div className="space-y-2">
                      {filterOptions.types.map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.type === type}
                            onChange={(e) => handleFilterChange('type', e.target.checked ? type : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-800"
                          />
                          <span className="text-gray-300">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Field */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Field</h4>
                    <div className="space-y-2">
                      {filterOptions.fields.map(field => (
                        <label key={field} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.field === field}
                            onChange={(e) => handleFilterChange('field', e.target.checked ? field : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-800"
                          />
                          <span className="text-gray-300">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Duration</h4>
                    <div className="space-y-2">
                      {filterOptions.durations.map(duration => (
                        <label key={duration} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.duration === duration}
                            onChange={(e) => handleFilterChange('duration', e.target.checked ? duration : '')}
                            className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-800"
                          />
                          <span className="text-gray-300">{duration}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stipend */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Stipend</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.paid === true}
                          onChange={(e) => handleFilterChange('paid', e.target.checked ? true : null)}
                          className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-800"
                        />
                        <span className="text-gray-300">Paid Internships</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.paid === false}
                          onChange={(e) => handleFilterChange('paid', e.target.checked ? false : null)}
                          className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-800"
                        />
                        <span className="text-gray-300">Unpaid Internships</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={clearFilters}
                  className="w-full mt-8 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
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
                    <h2 className="text-3xl font-bold text-white">All Internships</h2>
                    <p className="text-gray-400">
                      {filteredInternships.length} opportunities found
                      {appliedInternships.size > 0 && ` • ${appliedInternships.size} applied`}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-400">Loading internships...</p>
                  </div>
                ) : filteredInternships.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                      <div className="h-12 w-12 text-gray-400">No results</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No internships found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your filters</p>
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
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-12 border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
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
                    <div key={index} className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                      <div className="inline-flex p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl mb-4 border border-purple-800/30">
                        <div className="text-purple-400">
                          {benefit.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Career?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who launched their careers through Studex internships
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Create Free Account
            </Link>
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