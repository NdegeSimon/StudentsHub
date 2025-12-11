import { 
  Bookmark, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Share2, 
  BadgeCheck 
} from "lucide-react";

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
  // Countdown
  const daysLeft = (() => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-6 hover:shadow-2xl transition">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        {logo ? (
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 object-cover rounded-full border"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
            <Briefcase size={22} />
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {title}
            {verified && <BadgeCheck className="text-blue-600" size={20} />}
          </h2>
          <p className="text-sm text-gray-500">{company}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onSave} className="text-gray-600 hover:text-black">
            <Bookmark size={20} />
          </button>
          <button onClick={onShare} className="text-gray-600 hover:text-black">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="mt-3 text-sm text-gray-700">{summary}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          <span>{type}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            Deadline: {deadline}{" "}
            {daysLeft > 0 && (
              <span className="text-red-600 font-medium ml-1">
                ({daysLeft} days left)
              </span>
            )}
          </span>
        </div>

        {postedDate && (
          <div className="flex items-center gap-2 text-gray-600">
            🗓️ <span>Posted: {postedDate}</span>
          </div>
        )}

        {stipend && (
          <div className="flex items-center gap-2 text-gray-600">
            💰 <span>{stipend}</span>
          </div>
        )}

        {estimatedCompensation && (
          <div className="flex items-center gap-2 text-gray-600">
            📊 <span>Estimated: {estimatedCompensation}</span>
          </div>
        )}
      </div>

      {/* Requirements */}
      {requirements.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 text-sm">Requirements:</h3>
          <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
            {requirements.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Application Method */}
      {applicationMethod && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 text-sm">Application Method:</h3>
          <p className="text-sm text-gray-700">{applicationMethod}</p>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        Apply Now
      </button>
    </div>
  );
}
