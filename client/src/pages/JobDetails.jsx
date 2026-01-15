import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { 
  ArrowLeft, Bookmark, BookmarkCheck, Clock, MapPin, 
  Briefcase, DollarSign, Calendar, CheckCircle, XCircle,
  Building, Users, Globe, ExternalLink, Share2, AlertCircle,
  ChevronRight, FileText, Mail, Phone, Award, Heart, Star,
  TrendingUp, Target, Zap, Shield, GraduationCap, Briefcase as BriefcaseIcon
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const [jobRes, savedRes, similarRes] = await Promise.all([
          api.get(`/api/jobs/${id}`),
          user ? api.get(`/api/saved-jobs/check/${id}`).catch(() => null) : Promise.resolve(null),
          api.get(`/api/jobs/similar/${id}`).catch(() => ({ data: [] }))
        ]);
        
        const jobData = jobRes.data;
        setJob(jobData);
        setSaved(savedRes?.data?.saved || false);
        setSimilarJobs(similarRes.data?.slice(0, 3) || []);
        
        // Fetch application count if available
        if (jobData.application_count !== undefined) {
          setApplicationCount(jobData.application_count);
        }

        // Check if user has already applied
        if (user) {
          try {
            const appRes = await api.get(`/api/applications/check/${id}`);
            setApplicationStatus(appRes.data.status || 'applied');
          } catch (error) {
            setApplicationStatus(null);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, user]);

  const handleSaveJob = async () => {
    if (!user) {
      toast.info('Please log in to save jobs');
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }

    try {
      if (saved) {
        await api.delete(`/api/saved-jobs/${id}`);
        setSaved(false);
        toast.success('Job removed from saved jobs');
      } else {
        await api.post('/api/saved-jobs', { job_id: id });
        setSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.info('Please log in to apply for this job');
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }

    if (user.role === 'company') {
      toast.error('Companies cannot apply for jobs');
      return;
    }

    setApplying(true);
    try {
      // Show application modal or navigate to application form
      // For now, we'll do a direct application
      const response = await api.post('/api/applications/apply', { 
        job_id: id,
        cover_letter: '',
        resume_url: user.resume_url || ''
      });
      
      setApplicationStatus('applied');
      setApplicationCount(prev => prev + 1);
      
      // Show success with application ID
      const appId = response.data?.application_id;
      toast.success(
        <div>
          <p className="font-semibold">Application submitted successfully!</p>
          {appId && <p className="text-sm opacity-90">Application ID: {appId}</p>}
        </div>
      );
      
    } catch (error) {
      console.error('Error applying for job:', error);
      const errorMsg = error.response?.data?.error || 'Failed to apply for job';
      
      if (errorMsg.includes('already applied')) {
        setApplicationStatus('applied');
        toast.info('You have already applied for this position');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setApplying(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/job/${id}`;
    const shareText = `Check out this job: ${job?.title} at ${job?.company?.company_name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success('Link copied to clipboard!');
        setShowShareMenu(false);
      } catch (error) {
        console.error('Error copying:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY');
  };

  const isExpired = job?.application_deadline && new Date(job.application_deadline) < new Date();
  const daysLeft = job?.application_deadline 
    ? Math.ceil((new Date(job.application_deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysLeft && daysLeft <= 3;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Job Not Found</h1>
            <p className="text-slate-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate match score based on user skills
  const calculateMatchScore = () => {
    if (!user?.skills || !job?.required_skills) return 0;
    const userSkills = user.skills.map(s => s.toLowerCase());
    const requiredSkills = job.required_skills.map(s => s.toLowerCase());
    const matchedSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );
    return Math.round((matchedSkills.length / requiredSkills.length) * 100);
  };

  const matchScore = calculateMatchScore();
  const isHighMatch = matchScore >= 80;
  const isMediumMatch = matchScore >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all relative"
              >
                <Share2 className="h-5 w-5 text-slate-400" />
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="p-2">
                      <button
                        onClick={handleShare}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        Share Job
                      </button>
                      <button
                        onClick={() => {
                          window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`, '_blank');
                          setShowShareMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        Share on LinkedIn
                      </button>
                    </div>
                  </div>
                )}
              </button>
              
              <button
                onClick={handleSaveJob}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  saved 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {job.company?.company_name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                    <div className="flex items-center gap-4 text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.company?.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.job_type || 'Full-time'}
                      </span>
                    </div>
                    
                    {user && matchScore > 0 && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        isHighMatch 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : isMediumMatch
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        <Target className="h-3 w-3" />
                        {matchScore}% Match with your profile
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-400">Salary</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {job.salary_min ? (
                      <>
                        {job.salary_currency || '$'}{job.salary_min.toLocaleString()}
                        {job.salary_max ? ` - ${job.salary_currency || '$'}${job.salary_max.toLocaleString()}` : '+'}
                      </>
                    ) : 'Negotiable'}
                  </p>
                </div>
                
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-400">Posted</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {job.created_at ? formatDate(job.created_at) : 'Recently'}
                  </p>
                </div>
                
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-400">Applicants</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {applicationCount > 0 ? applicationCount.toLocaleString() : 'No applicants yet'}
                  </p>
                </div>
                
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
                    <span className="text-sm text-slate-400">Deadline</span>
                  </div>
                  <p className={`text-lg font-semibold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
                    {job.application_deadline 
                      ? `${formatDate(job.application_deadline)} (${daysLeft} days left)`
                      : 'Not specified'
                    }
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleApply}
                  disabled={!!applicationStatus || isExpired || applying || user?.role === 'company'}
                  className={`px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 ${
                    applicationStatus
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 cursor-default'
                      : isExpired || user?.role === 'company'
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                  }`}
                >
                  {applying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Applying...
                    </>
                  ) : applicationStatus ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      {applicationStatus === 'applied' ? 'Applied Successfully' : applicationStatus}
                    </>
                  ) : isExpired ? (
                    <>
                      <XCircle className="h-5 w-5" />
                      Application Closed
                    </>
                  ) : user?.role === 'company' ? (
                    'Not Available'
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      Apply Now
                    </>
                  )}
                </button>
                
                {!user && (
                  <button
                    onClick={() => navigate('/login', { state: { from: `/job/${id}` } })}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl text-white font-medium transition-all hover:scale-105"
                  >
                    Login to Apply
                  </button>
                )}
              </div>

              {isUrgent && !applicationStatus && !isExpired && (
                <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Urgent: Only {daysLeft} day{daysLeft === 1 ? '' : 's'} left to apply!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-1 mb-6">
              <div className="flex gap-1">
                {['overview', 'requirements', 'responsibilities', 'benefits'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all rounded-xl ${
                      activeSection === section
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Content Sections */}
            <div className="space-y-6">
              {/* Overview Section */}
              <div id="overview" className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {job.description || 'No description provided.'}
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              {(job.requirements || job.required_skills?.length > 0) && (
                <div id="requirements" className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Requirements & Skills</h2>
                  </div>
                  
                  {job.requirements && (
                    <div className="prose prose-invert max-w-none mb-6">
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {job.requirements}
                      </div>
                    </div>
                  )}

                  {job.required_skills?.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${
                              user?.skills?.some(userSkill => 
                                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                skill.toLowerCase().includes(userSkill.toLowerCase())
                              )
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {skill}
                            {user?.skills?.some(userSkill => 
                              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                              skill.toLowerCase().includes(userSkill.toLowerCase())
                            ) && (
                              <CheckCircle className="h-4 w-4 inline ml-1" />
                            )}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {job.experience_level && (
                    <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <h3 className="text-lg font-semibold text-white mb-2">Experience Level</h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-amber-400" />
                        <span className="text-slate-300">{job.experience_level}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Responsibilities Section */}
              {job.responsibilities && (
                <div id="responsibilities" className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <BriefcaseIcon className="h-6 w-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Responsibilities</h2>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {job.responsibilities}
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              {job.benefits?.length > 0 && (
                <div id="benefits" className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-6 w-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Benefits & Perks</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Company Info & Similar Jobs */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-lg font-bold text-white">
                  {job.company?.company_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{job.company?.company_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Globe className="h-3 w-3" />
                    <span>{job.company?.website || 'Website not available'}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {job.company?.description || 'No company description available.'}
              </p>
              
              <div className="space-y-2 mb-6">
                {job.company?.industry && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{job.company.industry}</span>
                  </div>
                )}
                {job.company?.size && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{job.company.size} employees</span>
                  </div>
                )}
                {job.company?.founded && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">Founded {job.company.founded}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Link
                  to={`/company/${job.company?.id}`}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white text-sm font-medium text-center transition-all hover:scale-105"
                >
                  View Company
                </Link>
                {job.company?.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white text-sm font-medium flex items-center gap-1 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Similar Jobs</h3>
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      to={`/job/${similarJob.id}`}
                      className="block p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700/50 transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {similarJob.title}
                        </h4>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                        <Building className="h-3 w-3" />
                        <span>{similarJob.company?.company_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{similarJob.location}</span>
                        <span>•</span>
                        <span>{similarJob.job_type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link
                  to="/jobs"
                  className="w-full mt-4 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-white text-sm font-medium text-center transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse All Jobs
                </Link>
              </div>
            )}

            {/* Application Tips */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-white">Application Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Customize your resume to match job requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Write a personalized cover letter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Highlight relevant skills and experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Apply early for better chances</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;