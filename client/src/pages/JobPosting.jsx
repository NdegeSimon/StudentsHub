import { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, Settings, HelpCircle, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function JobPostings() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova Ltd",
      location: "Nairobi",
      type: "Remote",
      salary: 80000,
      description: "Build and maintain modern web UIs.",
      requirements: "React, Tailwind, Git",
      deadline: "2025-01-31",
      datePosted: new Date(),
      applied: false,
    },
  ]);

  const emptyForm = {
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortBy, setSortBy] = useState("");

  /* ---------------- CREATE / UPDATE ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingId
            ? {
                ...job,
                ...form,
                salary: form.salary ? Number(form.salary) : "",
              }
            : job
        )
      );
      setEditingId(null);
    } else {
      setJobs((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          salary: form.salary ? Number(form.salary) : "",
          datePosted: new Date(),
          applied: false,
        },
      ]);
    }

    setForm(emptyForm);
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      type: job.type || "",
      salary: job.salary ? String(job.salary) : "",
      description: job.description || "",
      requirements: job.requirements || "",
      deadline: job.deadline || "",
    });
    setEditingId(job.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  /* ---------------- APPLY ---------------- */

  const handleApply = (id) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, applied: true } : job
      )
    );
  };

  /* ---------------- FILTER / SORT ---------------- */

  const filteredJobs = jobs
    .filter(
      (j) =>
        (j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase())) &&
        (!filterType || j.type === filterType) &&
        (!filterLocation || j.location === filterLocation)
    )
    .sort((a, b) => {
      if (sortBy === "salary") return b.salary - a.salary;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "date") return new Date(b.datePosted) - new Date(a.datePosted);
      return 0;
    });

  /* ================================================= */

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* ================= HEADER ================= */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-emerald-600">
            Studex
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/jobs">Jobs</Link>
            <Link to="/myapplications">My Applications</Link>
            <NavLink to="/messages">Messages</NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border rounded-md text-sm"
                placeholder="Search jobs..."
              />
            </div>

            <HelpCircle />
            <Bell />

            <button onClick={() => navigate("/settings")}>
              <Settings />
            </button>

            <button onClick={() => navigate("/profile")}>
              <User />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto p-6">

        {/* ===== JOB FORM ===== */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
        >
          <h2 className="text-xl font-bold">
            {editingId ? "Edit Job" : "Post Job"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Job Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Job Type</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
              <option>Internship</option>
            </select>

            <input
              type="number"
              className="input"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
            <input
              type="date"
              className="input"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          <textarea
            className="input min-h-[100px]"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <textarea
            className="input min-h-[80px]"
            placeholder="Requirements (comma separated)"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}
            <button className="px-6 py-2 bg-emerald-600 text-white rounded">
              {editingId ? "Update" : "Post"}
            </button>
          </div>
        </form>

        {/* ===== JOB LIST ===== */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location || "N/A"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setSelectedJob(job)}>View</button>
                  <button onClick={() => handleEdit(job)}>Edit</button>
                  <button onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              </div>

              <button
                onClick={() => handleApply(job.id)}
                disabled={job.applied}
                className={`mt-4 px-4 py-2 rounded ${
                  job.applied
                    ? "bg-gray-200 text-gray-500"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {job.applied ? "Applied" : "Apply"}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center"
          onClick={() => setSelectedJob(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl max-w-lg w-full"
          >
            <h2 className="text-xl font-bold">{selectedJob.title}</h2>
            <p className="text-gray-600">{selectedJob.company}</p>

            <p className="mt-4">{selectedJob.description}</p>

            <ul className="list-disc pl-5 mt-3">
              {selectedJob.requirements
                .split(",")
                .map((r, i) => (
                  <li key={`${r}-${i}`}>{r.trim()}</li>
                ))}
            </ul>

            <button
              className="mt-6 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
