import { Bookmark, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({
  id,
  title,
  company,
  salary,
  postedDate,
  description,
  tags = [],
  onBookmark,
  isBookmarked = false,
  showViewButton = true
}) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) onBookmark();
  };

  return (
    <Link 
      to={`/jobs/${id}`}
      className="block border border-white-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-indigo-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-white-900">{title}</h4>
            {showViewButton && (
              <span className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800">
                View Details
                <ExternalLink className="ml-1 h-3 w-3" />
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {company} • {salary} • Posted {postedDate}
          </p>
          <p className="text-sm text-white-600 mt-2 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={handleBookmarkClick}
          className={`ml-2 p-1 rounded-full ${isBookmarked ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
        >
          <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </Link>
  );
}
