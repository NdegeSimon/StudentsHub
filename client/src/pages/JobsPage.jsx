// src/pages/JobsPage.jsx
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import JobCardFull from "../components/JobCard";

export default function JobsPage() {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterAgency, setFilterAgency] = useState("All");

  // Sample jobs (replace with API from Flask later)
  const jobs = [
    {
      id: 1,
      title: "ICT Support Intern",
      company: "KRA",
      location: "Nairobi",
      type: "Internship",
      deadline: "2025-12-31",
      stipend: "KSh 15,000/month",
      summary: "Assist with IT support and troubleshooting.",
      requirements: ["Diploma in IT", "No experience required", "Final-year students only"],
      tags: ["Government Opportunity", "Urgent"],
      postedDate: "2025-12-01",
      verified: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/KRA_Logo.png",
      applicationMethod: "Apply on Portal",
      estimatedCompensation: "KSh 15,000 - 20,000",
    },
    {
      id: 2,
      title: "Data Entry Contractor",
      company: "NGO X",
      location: "Remote",
      type: "Contract",
      deadline: "2025-12-15",
      stipend: "KSh 20,000/month",
      summary: "Input and verify data records for projects.",
      requirements: ["High school diploma", "Basic Excel skills"],
      tags: ["NGO", "Trending"],
      postedDate: "2025-12-05",
      verified: false,
      logo: "https://via.placeholder.com/50",
      applicationMethod: "Email CV",
      estimatedCompensation: "KSh 18,000 - 22,000",
    },
    {
      id: 3,
      title: "Data Clerk",
      company: "Huduma",
      location: "Nairobi",
      type: "Full-Time",
      deadline: "2025-12-15",
      stipend: "KSh 20,000/month",
      summary: "Input and verify data records for projects.",
      requirements: ["High school diploma", "Basic Excel skills"],
      tags: ["Government Opportunity", "Trending"],
      postedDate: "2025-12-05",
      verified: false,
      logo: "https://via.placeholder.com/50",
      applicationMethod: "Email CV",
      estimatedCompensation: "KSh 18,000 - 22,000",
    },
  ];

  // Filtered jobs logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === "All" || job.type === filterType;
    const matchesLocation = filterLocation === "All" || job.location === filterLocation;
    const matchesAgency = filterAgency === "All" || job.company === filterAgency;
    return matchesSearch && matchesType && matchesLocation && matchesAgency;
  });

  // Stats
  const totalJobs = jobs.length;
  const governmentJobs = jobs.filter((job) => job.tags.includes("Government Opportunity")).length;
  const closingSoon = jobs.filter(
    (job) => new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Available Opportunities</h1>
        <p className="text-green-700 mt-1 text-lg">
          Verified opportunities from government agencies, companies, and NGOs
        </p>

        {/* Search */}
        <div className="relative w-full max-w-xl mx-auto mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search jobs, companies or skills..."
            className="w-full border border-green-400 rounded-lg pl-10 pr-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {searchText && (
            <X
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 w-5 h-5 cursor-pointer hover:text-orange-600 transition-colors"
              onClick={() => setSearchText("")}
            />
          )}
        </div>

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {["ICT Jobs", "HR & Admin", "Procurement", "Engineering", "Internship Only", "Government Only"].map((cat) => (
            <button
              key={cat}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
              onClick={() => setSearchText(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-6 mt-6 text-gray-700 font-medium">
          <div>Total Jobs: {totalJobs}</div>
          <div>Government: {governmentJobs}</div>
          <div>Closing Soon: {closingSoon}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto flex flex-wrap gap-4 mb-6 justify-center">
        {/* Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-green-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>All</option>
          <option>Internship</option>
          <option>Government Placement</option>
          <option>Contract</option>
          <option>Part-Time</option>
          <option>Full-Time</option>
        </select>

        {/* Location */}
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="border border-green-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>All</option>
          <option>Nairobi</option>
          <option>Mombasa</option>
          <option>Kisumu</option>
          <option>Remote</option>
        </select>

        {/* Agency */}
        <select
          value={filterAgency}
          onChange={(e) => setFilterAgency(e.target.value)}
          className="border border-green-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>All</option>
          <option>KRA</option>
          <option>NTSA</option>
          <option>Huduma</option>
          <option>ICT Authority</option>
        </select>
      </div>

      {/* Job Listings Grid */}
      <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCardFull
              key={job.id}
              {...job}
              onApply={() => alert(`Applying for ${job.title}`)}
              onSave={() => alert(`Saved ${job.title}`)}
              onShare={() => alert(`Sharing ${job.title}`)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white py-6 shadow-inner">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between text-gray-600 text-sm">
          <div>About</div>
          <div>Contact</div>
          <div>Terms</div>
          <div>Privacy</div>
          <div>Career Tips / Blog</div>
        </div>
      </footer>
    </div>
  );
}
