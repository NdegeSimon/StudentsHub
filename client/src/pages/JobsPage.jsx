// src/pages/JobsPage.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Search, X } from "lucide-react";
import JobCardFull from "../components/JobCard";
import ProfileCard from "../components/ProfileCard";

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

  // Define filter options
  const jobTypes = ["All", "Internship", "Full-Time", "Contract", "Part-Time"];
  const locations = ["All", "Nairobi", "Remote", "Mombasa", "Kisumu"];

  // Clear all filters
  const clearFilters = () => {
    setFilterType("All");
    setFilterLocation("All");
    setSearchText("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO HEADER */}
      <section className="w-full bg-gradient-to-b from-[#064e3b] to-[#075740] text-white py-12 px-6 mt-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Find Your Next Opportunity</h1>
            <p className="text-green-100 max-w-2xl mx-auto">
              Discover the best internships and job opportunities in Kenya. Apply now and kickstart your career.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              className="w-full pl-12 pr-10 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-base"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {searchText && (
              <div>
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
            )}
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-200" size={20} />
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
        <div className="w-full lg:w-80">
          <ProfileCard />
        </div>

        {/* JOB CARDS GRID */}
        <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
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
          <div>Partners</div>
          <div>Contact</div>
          <div>Terms</div>
          <div>Privacy</div>
          <div>Career Tips / Blog</div>
        </div>
      </footer>
    </div>
  );
}
