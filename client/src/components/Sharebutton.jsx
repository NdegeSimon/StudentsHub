// components/ShareButton.jsx
import React, { useState } from 'react';
import { 
  Mail, 
  Share2, 
  Link as LinkIcon, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  X,
  Copy,
  Check
} from 'lucide-react';

const ShareButton = ({ job }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareViaEmail = (provider = 'gmail') => {
    const subject = `${job.title} - ${job.company}`;
    const body = `
Check out this job opportunity:

**${job.title}**
Company: ${job.company}
Location: ${job.location}
Type: ${job.job_type}
Salary: ${job.salary || 'Not specified'}

${job.description.substring(0, 300)}...

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
    setShowOptions(false);
  };

  const shareViaSocial = (platform) => {
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
      setShowOptions(false);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/jobs/${job.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowOptions(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {/* Share Options Dropdown */}
      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowOptions(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Share Job</h3>
                <button
                  onClick={() => setShowOptions(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Email Options */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => shareViaEmail('gmail')}
                      className="flex items-center space-x-2 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Gmail</span>
                    </button>
                    <button
                      onClick={() => shareViaEmail('outlook')}
                      className="flex items-center space-x-2 p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Outlook</span>
                    </button>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Social Media</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => shareViaSocial('facebook')}
                      className="flex flex-col items-center p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    >
                      <Facebook className="w-4 h-4 mb-1" />
                      <span className="text-xs">Facebook</span>
                    </button>
                    <button
                      onClick={() => shareViaSocial('twitter')}
                      className="flex flex-col items-center p-2 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg transition-colors"
                    >
                      <Twitter className="w-4 h-4 mb-1" />
                      <span className="text-xs">Twitter</span>
                    </button>
                    <button
                      onClick={() => shareViaSocial('linkedin')}
                      className="flex flex-col items-center p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-4 h-4 mb-1" />
                      <span className="text-xs">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => shareViaSocial('whatsapp')}
                      className="flex flex-col items-center p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mb-1" />
                      <span className="text-xs">WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Copy Link */}
                <div>
                  <button
                    onClick={copyLink}
                    className="flex items-center space-x-2 w-full p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;