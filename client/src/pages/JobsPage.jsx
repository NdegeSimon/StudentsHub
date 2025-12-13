// src/pages/JobsPage.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Search, X } from "lucide-react";
import JobCardFull from "../components/JobCard";

export default function JobsPage() {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterAgency, setFilterAgency] = useState("All");

  // -------------------------
  // SAMPLE JOB DATA
  // -------------------------
  const jobs = [
    {
      id: 1,
      title: "ICT Support Intern",
      company: "KRA",
      location: "Nairobi",
      type: "Internship",
      deadline: "2025-12-31",
      stipend: "KSh 15,000/month",
      summary: "Assist with IT support and troubleshooting duties.",
      requirements: ["Diploma in IT", "No experience required", "Be a final-year student"],
      tags: ["Government Opportunity", "Urgent"],
      postedDate: "2025-12-01",
      verified: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/KRA_Logo.png",
      applicationMethod: "Apply via official KRA portal",
      estimatedCompensation: "KSh 15,000 - 20,000",
    },
    {
      id: 2,
      title: "Data Entry Clerk",
      company: "Huduma",
      location: "Nairobi",
      type: "Full-Time",
      deadline: "2025-12-15",
      stipend: "KSh 20,000/month",
      summary: "Input and validate official records for public services.",
      requirements: ["KCSE Certificate", "Basic Excel knowledge"],
      tags: ["Government Opportunity", "Trending"],
      postedDate: "2025-12-05",
      verified: true,
      logo: "https://via.placeholder.com/50",
      applicationMethod: "Submit CV through email",
      estimatedCompensation: "KSh 18,000 - 22,000",
    },
    {
      id: 3,
      title: "Data Entry Assistant",
      company: "NGO X",
      location: "Remote",
      type: "Contract",
      deadline: "2025-12-15",
      stipend: "KSh 20,000/month",
      summary: "Assist with data entry for field projects.",
      requirements: ["High school diploma", "Attention to detail"],
      tags: ["NGO", "Remote"],
      postedDate: "2025-12-05",
      verified: false,
      logo: "https://via.placeholder.com/50",
      applicationMethod: "Email CV",
      estimatedCompensation: "KSh 18,000 - 22,000",
    },
  ];

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = filterType === "All" || job.type === filterType;
    const matchesLocation = filterLocation === "All" || job.location === filterLocation;
    const matchesAgency = filterAgency === "All" || job.company === filterAgency;

    return matchesSearch && matchesType && matchesLocation && matchesAgency;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO HEADER */}
      <section className="w-full bg-gradient-to-b from-[#064e3b] to-[#075740] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">


          {/* Search Bar */}
          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 w-6 h-6" />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search jobs, companies or skills..."
              className="w-full bg-white text-gray-900 rounded-xl pl-14 pr-28 py-4 shadow-md border border-green-400 
                       focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Search button */}
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 
                           text-white px-5 py-2 rounded-lg shadow">
              Search
            </button>

            {/* Clear icon */}
            {searchText && (
              <X
                onClick={() => setSearchText("")}
                className="absolute right-24 top-1/2 -translate-y-1/2 cursor-pointer 
                           text-orange-500 hover:text-orange-600 w-5 h-5"
              />
            )}
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap gap-3 mt-5">
            {["ICT Jobs", "HR & Admin", "Procurement", "Engineering", "Internship Only", "Government Only"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchText(cat)}
                className="bg-[#0a5d46] text-white px-4 py-2 rounded-full text-sm shadow 
                           hover:bg-[#0c6a50] transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SMOOTH TRANSITION */}
      <div className="h-6 bg-gradient-to-b from-[#075740] to-transparent w-full"></div>

      {/* ========================================================== */}
      {/* MAIN CONTENT (SIDEBAR + JOB GRID)                         */}
      {/* ========================================================== */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-6 py-10">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 bg-[#064e3b] text-white p-5 rounded-xl shadow-xl">
          <h3 className="font-semibold text-white mb-4 text-lg">Filters</h3>

          {/* Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full mb-4 bg-[#043f31] border border-green-700 rounded-lg px-3 py-2 text-white 
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option className="text-black">All</option>
            <option className="text-black">Internship</option>
            <option className="text-black">Government Placement</option>
            <option className="text-black">Contract</option>
            <option className="text-black">Part-Time</option>
            <option className="text-black">Full-Time</option>
          </select>

          {/* Location */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full mb-4 bg-[#043f31] border border-green-700 rounded-lg px-3 py-2 text-white 
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option className="text-black">All</option>
            <option className="text-black">Nairobi</option>
            <option className="text-black">Mombasa</option>
            <option className="text-black">Kisumu</option>
            <option className="text-black">Remote</option>
          </select>

          {/* Agency */}
          <select
            value={filterAgency}
            onChange={(e) => setFilterAgency(e.target.value)}
            className="w-full mb-4 bg-[#043f31] border border-green-700 rounded-lg px-3 py-2 text-white 
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option className="text-black">All</option>
            <option className="text-black">KRA</option>
            <option className="text-black">NTSA</option>
            <option className="text-black">Huduma</option>
            <option className="text-black">ICT Authority</option>
          </select>

          <h3 className="font-semibold text-white mt-6 mb-3 text-lg">Categories</h3>

          <div className="flex flex-col gap-3">
            {[
              "ICT & Tech",
              "HR & Admin",
              "Engineering",
              "Procurement",
              "Internships Only",
              "Government Only",
            ].map((cat) => (
              <button
                key={cat}
                className="text-left px-3 py-2 bg-[#0f6b53] text-white rounded-lg hover:bg-[#0a5a46] transition"
                onClick={() => setSearchText(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* JOB CARDS GRID */}
        <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
            <p className="text-center text-gray-500 col-span-full">No jobs found.</p>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* FOOTER */}
      {/* ========================================================== */}
      <footer className="mt-12 bg-white py-6 shadow-inner">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between text-gray-600 text-sm px-6">
          <div>About</div>
          <p></p> 
          <div>FAQ</div>
          <div>Contact</div>
          <div>Terms</div>
          <div>Privacy</div>
          <div>Career Tips / Blog</div>
        </div>
      </footer>
    </div>
  );
}
