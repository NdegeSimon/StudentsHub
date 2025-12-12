// src/components/JobCard.jsx
import React from "react";
import { Bookmark, Share2, CheckCircle } from "lucide-react";

export default function JobCard({
  title,
  company,
  location,
  type,
  deadline,
  stipend,
  summary,
  requirements,
  tags,
  postedDate,
  verified,
  logo,
  onApply,
  onSave,
  onShare,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-start gap-4 border-l-4 border-green-500">
      <img src={logo} alt={company} className="w-16 h-16 object-contain rounded-md" />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {verified && <CheckCircle className="text-green-600 w-5 h-5" />}
        </div>
        <p className="text-gray-600">{company} • {location} • {type}</p>
        <p className="mt-2 text-gray-700">{summary}</p>
        <p className="mt-1 text-orange-500 font-medium">{stipend}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-2 text-gray-400 text-sm">Posted: {postedDate} | Deadline: {deadline}</p>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <button
          onClick={onApply}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Apply
        </button>
        <div className="flex gap-2">
          <Bookmark className="w-5 h-5 text-green-600 cursor-pointer" onClick={onSave} />
          <Share2 className="w-5 h-5 text-green-600 cursor-pointer" onClick={onShare} />
        </div>
      </div>
    </div>
  );
}
