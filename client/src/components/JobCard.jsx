// src/components/JobCardFull.jsx
import { Bookmark, MapPin, Briefcase, Calendar, Share2, BadgeCheck, DollarSign, BarChart } from "lucide-react";

export default function JobCardFull({
  title,
  company,
  location,
  type,
  deadline,
  stipend,
  summary,
  requirements = [],
  tags = [],
  postedDate,
  applicationMethod,
  estimatedCompensation,
  verified = false,
  logo,
  onApply,
  onSave,
  onShare
}) {
  // Countdown calculation
  const daysLeft = (() => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-4">
        {logo ? (
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            <Briefcase size={18} />
          </div>
        )}

        <div className="flex-1">
          {/* Job Title */}
          <h2 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-1.5">
            {title}
            {verified && <BadgeCheck className="text-blue-500 flex-shrink-0" size={18} />}
          </h2>
          
          {/* Company */}
          <p className="text-sm text-gray-700 font-medium mt-0.5">{company}</p>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onSave} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Save job"
          >
            <Bookmark size={18} />
          </button>
          <button 
            onClick={onShare} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Share job"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Location & Type */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-400" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={14} className="text-gray-400" />
          <span>{type}</span>
        </div>
        {stipend && (
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-gray-400" />
            <span>{stipend}</span>
          </div>
        )}
      </div>

      {/* Deadline - Prominently displayed */}
      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Calendar size={14} className="text-red-500" />
          <span className="text-gray-600">Deadline:</span>
          <span className="text-red-600">
            {deadline}
            {daysLeft > 0 && (
              <span className="ml-1 font-semibold">({daysLeft} days left)</span>
            )}
          </span>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">{summary}</p>
      )}

      {/* Requirements */}
      {requirements.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Requirements</h3>
          <ul className="space-y-1.5">
            {requirements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-gray-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application Method */}
      {applicationMethod && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">How to Apply</h3>
          <p className="text-sm text-gray-600">{applicationMethod}</p>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-lg hover:shadow-md transition-all font-medium text-sm"
      >
        Apply Now
      </button>
    </div>
  );
}
