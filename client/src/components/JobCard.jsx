import { Bookmark } from "lucide-react";

export default function JobCard({
  title,
  company,
  salary,
  postedDate,
  description,
  tags = [],
  onBookmark,
  isBookmarked = false
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">
            {company} • {salary} • Posted {postedDate}
          </p>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
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
          onClick={onBookmark}
          className={`p-1 rounded-full ${isBookmarked ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
        >
          <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
