import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock, 
  Calendar, 
  Bookmark, 
  Share2, 
  Mail, 
  ExternalLink,
  X,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError('Failed to load job details');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const shareViaEmail = (provider = 'gmail') => {
    if (!job) return;
    
    const subject = `${job.title} - ${job.company}`;
    const body = `
Check out this job opportunity:

**${job.title}**
Company: ${job.company}
Location: ${job.location}
Type: ${job.type || job.job_type}
Salary: ${job.salary || 'Not specified'}

${job.description ? job.description.substring(0, 300) : ''}...

View the full job: ${window.location.origin}/jobs/${job.id}

Best regards,
`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    const emailProviders = {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedBody}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodedSubject}&body=${encodedBody}`,
      yahoo: `https://compose.mail.yahoo.com/?subject=${encodedSubject}&body=${encodedBody}`,
      default: `mailto:?subject=${encodedSubject}&body=${encodedBody}`
    };

    window.open(emailProviders[provider] || emailProviders.default, '_blank');
    setShowShareOptions(false);
  };

  const shareViaSocial = (platform) => {
    if (!job) return;
    
    const text = `Check out this job: ${job.title} at ${job.company}`;
    const url = `${window.location.origin}/jobs/${job.id}`;
    
    const socialUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };

    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank', 'width=600,height=400');
      setShowShareOptions(false);
    }
  };

  const copyLink = async () => {
    if (!job) return;
    
    const url = `${window.location.origin}/jobs/${job.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowShareOptions(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading job details...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Share Options Modal/Overlay */}
      {showShareOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setShowShareOptions(false)}
          />
          
          {/* Share Options Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Share Job</h3>
                  <button
                    onClick={() => setShowShareOptions(false)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-300" />
                  </button>
                </div>

                {/* Job Preview */}
                <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                  <h4 className="font-semibold text-white truncate">{job.title}</h4>
                  <p className="text-slate-300 text-sm truncate mt-1">
                    {job.company} • {job.location}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email Options */}
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-3">Email</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => shareViaEmail('gmail')}
                        className="flex items-center justify-center space-x-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-medium">Gmail</span>
                      </button>
                      <button
                        onClick={() => shareViaEmail('outlook')}
                        className="flex items-center justify-center space-x-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-medium">Outlook</span>
                      </button>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-3">Social Media</p>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => shareViaSocial('facebook')}
                        className="flex flex-col items-center p-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl border border-blue-600/30 transition-colors"
                      >
                        <Facebook className="w-5 h-5 mb-1" />
                        <span className="text-xs">Facebook</span>
                      </button>
                      <button
                        onClick={() => shareViaSocial('twitter')}
                        className="flex flex-col items-center p-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30 transition-colors"
                      >
                        <Twitter className="w-5 h-5 mb-1" />
                        <span className="text-xs">Twitter</span>
                      </button>
                      <button
                        onClick={() => shareViaSocial('linkedin')}
                        className="flex flex-col items-center p-3 bg-blue-700/10 hover:bg-blue-700/20 text-blue-300 rounded-xl border border-blue-700/30 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 mb-1" />
                        <span className="text-xs">LinkedIn</span>
                      </button>
                      <button
                        onClick={() => shareViaSocial('whatsapp')}
                        className="flex flex-col items-center p-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5 mb-1" />
                        <span className="text-xs">WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Copy Link */}
                  <div>
                    <button
                      onClick={copyLink}
                      className="flex items-center justify-center space-x-2 w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 text-slate-300" />
                          <span className="text-slate-300 font-medium">Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                  {job.company[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                  <div className="flex items-center gap-4 mt-1 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-lg border border-blue-500/30">
                  {job.type || job.job_type}
                </span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-lg border border-purple-500/30">
                  {job.category || 'Technology'}
                </span>
                {job.isRemote && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg border border-green-500/30">
                    Remote
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">Experience</div>
                  <div className="text-white font-medium">{job.experience || 'Not specified'}</div>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">Salary</div>
                  <div className="text-white font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary || 'Negotiable'}
                  </div>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">Posted</div>
                  <div className="text-white font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(job.postedAt || job.posted_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                <button className="flex-1 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-slate-300" />
                </button>
                
                {/* Updated Share Button */}
                <button 
                  onClick={() => setShowShareOptions(true)}
                  className="flex-1 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 text-slate-300" />
                </button>
                
                {/* Gmail Quick Share Button */}
                <button 
                  onClick={() => shareViaEmail('gmail')}
                  className="flex-1 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center"
                  title="Share via Gmail"
                >
                  <Mail className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">Job Description</h2>
            <div 
              className="prose prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />

            {job.requirements && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-300">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-300">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">About {job.company}</h3>
              <p className="text-slate-300 mb-4">{job.companyDescription || 'No company description available.'}</p>
              
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit company website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}