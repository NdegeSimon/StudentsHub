import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Building2,
  Star,
  Heart,
  Users,
  AlertCircle,
  ChevronRight,
  Bookmark,
  TrendingUp,
  Target,
  CheckCircle,
  Briefcase,
  X,
  Loader2,
  Zap,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavedJobsPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [savedJobs, setSavedJobs] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [matchPercentages, setMatchPercentages] = useState({});
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'upcoming', 'recommended'

  // Simulate user profile
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      userType: "student",
      profile: {
        skills: ["React", "JavaScript", "Node.js", "TypeScript", "MongoDB"],
        location: "Nairobi",
        education: [
          {
            institution: "University of Nairobi",
            degree: "BSc Computer Science",
            field: "Technology"
          }
        ]
      }
    };
    setUserProfile(mockUser);
  }, []);

  // Fetch saved jobs data
  useEffect(() => {
    const fetchSavedJobsData = async () => {
      setLoading(true);
      try {
        // Mock data for saved jobs
        const mockSavedJobs = [
          {
            id: 1,
            jobId: 101,
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            salary: "$120,000 - $180,000",
            type: "Full-time",
            deadline: "2024-04-15",
            postedDate: "2 days ago",
            description: "Build cutting-edge web applications using React and TypeScript.",
            tags: ["React", "TypeScript", "Next.js", "Frontend"],
            applications: 45,
            rating: 4.8,
            featured: true,
            status: "open",
            savedAt: "2024-03-10",
            applied: false,
            matchPercentage: 95
          },
          {
            id: 2,
            jobId: 102,
            title: "Full Stack Engineer",
            company: "StartupXYZ",
            location: "Remote",
            salary: "$90,000 - $140,000",
            type: "Full-time",
            deadline: "2024-04-20",
            postedDate: "1 day ago",
            description: "Build scalable applications from frontend to backend.",
            tags: ["Node.js", "React", "MongoDB", "AWS"],
            applications: 23,
            rating: 4.5,
            featured: true,
            status: "open",
            savedAt: "2024-03-11",
            applied: false,
            matchPercentage: 88
          }
        ];

        // Mock upcoming deadlines
        const mockUpcoming = [
          {
            id: 101,
            title: "Google Software Engineer",
            company: "Google",
            daysLeft: 2,
            deadline: "2024-03-15",
            location: "Remote",
            type: "Full-time",
            applied: false
          },
          {
            id: 102,
            title: "Microsoft PM Intern",
            company: "Microsoft",
            daysLeft: 5,
            deadline: "2024-03-18",
            location: "Redmond, WA",
            type: "Internship",
            applied: true
          },
          {
            id: 103,
            title: "Amazon ML Engineer",
            company: "Amazon",
            daysLeft: 7,
            deadline: "2024-03-20",
            location: "Seattle, WA",
            type: "Full-time",
            applied: false
          }
        ];

        // Mock recommended jobs
        const mockRecommended = [
          {
            id: 201,
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            salary: "$120,000 - $180,000",
            type: "Full-time",
            tags: ["React", "TypeScript", "Next.js"],
            applications: 45,
            postedDate: "2 days ago",
            featured: true,
            matchPercentage: 92
          },
          {
            id: 202,
            title: "Full Stack Engineer",
            company: "StartupXYZ",
            location: "Remote",
            salary: "$90,000 - $140,000",
            type: "Full-time",
            tags: ["Node.js", "MongoDB", "AWS"],
            applications: 23,
            postedDate: "1 day ago",
            featured: true,
            matchPercentage: 85
          }
        ];

        setSavedJobs(mockSavedJobs);
        setUpcomingDeadlines(mockUpcoming);
        setRecommendedJobs(mockRecommended);

        // Create match percentages map
        const matchMap = {};
        mockSavedJobs.forEach(job => {
          matchMap[job.jobId] = job.matchPercentage;
        });
        setMatchPercentages(matchMap);

      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        toast.error('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobsData();
  }, []);

  // API Service functions (replace with actual API calls)
  const handleSaveJob = async (jobId) => {
    try {
      // await api.saveJob(jobId);
      toast.success('Job saved successfully');
      // Refresh data
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      // await api.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job.jobId !== jobId));
      toast.success('Job removed from saved');
    } catch (error) {
      toast.error('Failed to remove job');
    }
  };

  const handleApply = async (jobId) => {
    try {
      // Check if user has resume
      if (!userProfile?.resumeUrl) {
        toast.error('Please upload your resume before applying');
        return;
      }

      // await api.applyToJob(jobId);
      
      // Update local state
      setSavedJobs(prev => prev.map(job => 
        job.jobId === jobId ? { ...job, applied: true } : job
      ));
      
      setUpcomingDeadlines(prev => prev.map(job => 
        job.id === jobId ? { ...job, applied: true } : job
      ));

      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    }
  };

  const UpcomingDeadlinesCard = () => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Upcoming Deadlines</h2>
        <Link to="/myapplications" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {upcomingDeadlines.map((job) => (
          <div key={job.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                job.daysLeft <= 3 ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30' : 'bg-gray-700'
              }`}>
                <span className={`text-lg font-bold ${
                  job.daysLeft <= 3 ? 'text-red-400' : 'text-white'
                }`}>
                  {job.daysLeft}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white">{job.title}</h3>
                <p className="text-sm text-gray-400">{job.company}</p>
                <p className={`text-xs ${job.daysLeft <= 3 ? 'text-red-400' : 'text-gray-500'}`}>
                  {job.daysLeft} days left
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                {job.type}
              </span>
              {job.applied ? (
                <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-lg text-sm font-medium border border-green-800/50">
                  Applied ✓
                </span>
              ) : (
                <button
                  onClick={() => handleApply(job.id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ResourcesCard = () => (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-800/30 p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
          <span className="text-white font-medium">Interview Prep</span>
          <span className="text-purple-400 text-sm">Practice common questions →</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
          <span className="text-white font-medium">Resume Builder</span>
          <span className="text-purple-400 text-sm">Create your resume →</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
          <span className="text-white font-medium">Career Guidance</span>
          <span className="text-purple-400 text-sm">Get expert advice →</span>
        </button>
      </div>
    </div>
  );

  const RecommendedJobCard = ({ job }) => {
    const isSaved = savedJobs.some(savedJob => savedJob.jobId === job.id);

    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-purple-500 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {job.featured && (
                <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
            <p className="text-purple-400 font-semibold mb-3">{job.company}</p>
          </div>
          <button
            onClick={() => isSaved ? handleUnsaveJob(job.id) : handleSaveJob(job.id)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm">{job.type}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {job.applications} applicants
            </span>
            <span>{job.postedDate}</span>
          </div>
          <button
            onClick={() => handleApply(job.id)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  };

  const SavedJobCard = ({ job }) => (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-purple-500 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {job.featured && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                Featured
              </span>
            )}
            <span className="px-2 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full">
              {job.matchPercentage}% Match
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
          <p className="text-purple-400 font-semibold mb-3">{job.company}</p>
        </div>
        <button
          onClick={() => handleUnsaveJob(job.jobId)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Remove from saved"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm">{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Briefcase className="h-4 w-4" />
          <span className="text-sm">{job.type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Saved {job.savedAt}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, index) => (
          <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {job.applications} applicants
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-yellow-400" />
            {job.rating}
          </span>
        </div>
        <div className="flex gap-3">
          {job.applied ? (
            <span className="px-6 py-2.5 bg-green-900/30 text-green-400 rounded-xl font-semibold border border-green-800/50">
              Applied ✓
            </span>
          ) : (
            <button
              onClick={() => handleApply(job.jobId)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Apply Now
            </button>
          )}
          <button className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-all">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

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
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Internships
              </Link>
              <Link 
                to="/saved-jobs" 
                className="text-white px-3 py-2 text-sm font-medium bg-purple-600 rounded-lg transition-colors"
              >
                Saved Jobs
              </Link>
              <Link 
                to="/myapplications"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                My Applications
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
              <Bookmark className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <div 
              className="ml-1 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-800"
              onClick={() => navigate('/profile')}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Saved Jobs
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track your favorite opportunities and never miss a deadline
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900/30 rounded-xl">
                  <Bookmark className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{savedJobs.length}</div>
                  <div className="text-gray-400">Saved Jobs</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900/30 rounded-xl">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{upcomingDeadlines.length}</div>
                  <div className="text-gray-400">Upcoming Deadlines</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-900/30 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">95%</div>
                  <div className="text-gray-400">Avg. Match Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Upcoming Deadlines ({upcomingDeadlines.length})
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'recommended'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Recommended
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="lg:w-1/3">
              <UpcomingDeadlinesCard />
              <ResourcesCard />
              
              {/* Quick Stats */}
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Your Profile Strength</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Skills Match</span>
                      <span className="text-sm font-semibold text-green-400">85%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Resume Complete</span>
                      <span className="text-sm font-semibold text-blue-400">70%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Application Success</span>
                      <span className="text-sm font-semibold text-purple-400">60%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-2/3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-400">Loading saved jobs...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'saved' && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                          Saved Jobs <span className="text-gray-400">({savedJobs.length})</span>
                        </h2>
                        <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                          Sort by: Match <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {savedJobs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                            <Bookmark className="h-10 w-10 text-gray-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">No saved jobs yet</h3>
                          <p className="text-gray-400 mb-6">Save jobs you're interested in to find them here</p>
                          <Link 
                            to="/jobs"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                          >
                            Browse Jobs
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {savedJobs.map(job => (
                            <SavedJobCard key={job.id} job={job} />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'upcoming' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Upcoming Deadlines <span className="text-gray-400">({upcomingDeadlines.length})</span>
                      </h2>
                      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                        {upcomingDeadlines.map(job => (
                          <div key={job.id} className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                                job.daysLeft <= 3 ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30' : 'bg-gray-700'
                              }`}>
                                <span className={`text-lg font-bold ${
                                  job.daysLeft <= 3 ? 'text-red-400' : 'text-white'
                                }`}>
                                  {job.daysLeft}
                                </span>
                                <span className="text-xs text-gray-400">days</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{job.title}</h3>
                                <p className="text-sm text-gray-400">{job.company}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-500">{job.location}</span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-500">{job.type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-400">
                                Due: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleApply(job.id)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                              >
                                {job.applied ? 'Applied ✓' : 'Apply Now'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommended' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
                          <p className="text-gray-400">Based on your profile and saved jobs</p>
                        </div>
                        <Link 
                          to="/jobs"
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View all recommendations →
                        </Link>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {recommendedJobs.map(job => (
                          <RecommendedJobCard key={job.id} job={job} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Benefits Section */}
              <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Why Save Jobs on Studex?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <Clock className="h-8 w-8" />,
                      title: "Track Deadlines",
                      description: "Never miss application deadlines"
                    },
                    {
                      icon: <Target className="h-8 w-8" />,
                      title: "Personalized Matches",
                      description: "Get job recommendations based on your saves"
                    },
                    {
                      icon: <TrendingUp className="h-8 w-8" />,
                      title: "Career Growth",
                      description: "Track your job application progress"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-6 text-center">
                      <div className="inline-flex p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl mb-4">
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

      <Footer />
    </div>
  );
};

export default SavedJobsPage;