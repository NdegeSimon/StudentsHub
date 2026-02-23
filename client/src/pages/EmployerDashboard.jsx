import { useState, useEffect, useCallback } from "react";
import {
  Briefcase, Users, MessageSquare, Calendar, BarChart3,
  Bell, Plus, X, Send, Filter, Download, Star,
  AlertCircle, Loader2, RefreshCw, ChevronRight,
  Menu, CheckCircle, Clock, TrendingUp, MapPin,
  DollarSign, Zap, Target, Award
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── API ───────────────────────────────────────────────────────────────────────
const BASE = (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) || "http://localhost:5001/api";
const getToken = () => localStorage.getItem("access_token");

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...opts.headers },
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `HTTP ${res.status}`); }
  return res.status === 204 ? null : res.json();
}

const API = {
  company: async () => {
    const res = await apiFetch("/employer/dashboard");
    return {
      name: res.company?.name || res.company?.company_name || "Your Company",
      plan: res.company?.plan || "Free",
      active_job_count: res.stats?.active_jobs || 0,
      job_slots: res.company?.job_slots || 4,
      ...(res.company || {})
    };
  },
  jobs: async () => {
    const res = await apiFetch('/jobs/employer/my-jobs');
    const list = res.jobs || res || [];
    return (list || []).map(j => ({
      id: j.id, title: j.title, location: j.location || '',
      salary: j.salary_min && j.salary_max ? `${j.salary_min} - ${j.salary_max}` : (j.salary || ''),
      type: j.job_type || j.type || '',
      posted: j.created_at ? new Date(j.created_at).toLocaleDateString() : (j.posted || ''),
      applicants: j.applications_count || j.applicants_count || 0,
      status: j.is_active ? 'active' : 'closed'
    }));
  },
  createJob: (d) => {
    const payload = { title: d.title, description: d.description, location: d.location, job_type: d.job_type, experience_level: d.experience_level, requirements: d.required_skills || '' };
    if (d.salary) {
      const parts = String(d.salary).split(/[–-]/).map(s => s.replace(/[^0-9]/g, '')).filter(Boolean);
      if (parts.length === 1) payload.salary_min = Number(parts[0]);
      else if (parts.length >= 2) { payload.salary_min = Number(parts[0]); payload.salary_max = Number(parts[1]); }
    }
    return apiFetch('/jobs', { method: 'POST', body: JSON.stringify(payload) });
  },
  closeJob: (id) => apiFetch(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify({ is_active: false }) }),
  applicants: async () => { const res = await apiFetch('/employer/applications'); return res.applications || []; },
  patchApplicant: (id, d) => apiFetch(`/employer/applications/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  interviews: async () => { const res = await apiFetch('/dashboard/upcoming-deadlines'); return res || []; },
  messages: () => apiFetch('/messages/conversations'),
  sendMessage: (d) => {
    if (d.conversation_id) return apiFetch(`/messages/conversations/${d.conversation_id}/messages`, { method: 'POST', body: JSON.stringify(d) });
    return apiFetch('/messages/conversations', { method: 'POST', body: JSON.stringify(d) });
  },
  analytics: () => apiFetch('/dashboard/stats')
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────
function useApi(fn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try   { setData(await fn()); }
    catch (e) { setError(e.message); }
    finally   { setLoading(false); }
  // eslint-disable-next-line
  }, deps);
  useEffect(() => { load(); }, [load]);
  return { data, setData, loading, error, refetch: load };
}

// ─── TINY UI ───────────────────────────────────────────────────────────────────
const Spinner = ({ size = 18 }) => (
  <Loader2 size={size} className="animate-spin text-violet-400" />
);

const Skeletons = () => (
  <div className="flex flex-col gap-3">
    {[0,1,2].map(i => (
      <div key={i} className="h-22 rounded-2xl bg-slate-800/60 animate-pulse" style={{ height: 88, animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
);

const Err = ({ msg, retry }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
    <AlertCircle size={15} className="shrink-0" />
    <span className="flex-1">{msg}</span>
    {retry && (
      <button onClick={retry} className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors">
        <RefreshCw size={11} /> Retry
      </button>
    )}
  </div>
);

const Empty = ({ icon: Icon, text }) => (
  <div className="text-center py-16 text-slate-500">
    <Icon size={28} className="mx-auto mb-3 opacity-20" />
    <p className="text-sm">{text}</p>
  </div>
);

const statusStyles = {
  active:      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  closed:      "bg-slate-700/50 text-slate-400 border-slate-600/50",
  new:         "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  reviewed:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shortlisted: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  interviewed: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  rejected:    "bg-red-500/20 text-red-400 border-red-500/30",
  hired:       "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  draft:       "bg-slate-700/50 text-slate-500 border-slate-600/50",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase border ${statusStyles[status] || statusStyles.closed}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);

const AV_GRADS = [
  "from-violet-500 to-cyan-500",
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-pink-500",
  "from-cyan-400 to-violet-500",
  "from-purple-500 to-cyan-400",
];

const Avatar = ({ name = "", id = 0, size = 42 }) => {
  const letters = name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  const grad = AV_GRADS[id % AV_GRADS.length];
  return (
    <div
      className={`bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center font-extrabold text-white shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.3, letterSpacing: "0.04em" }}
    >
      {letters}
    </div>
  );
};

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs">
      <p className="text-slate-400 uppercase tracking-widest text-[10px] mb-1.5">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}</p>)}
    </div>
  );
};

// ─── JOB MODAL ────────────────────────────────────────────────────────────────
const JobModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ title: "", location: "", job_type: "full-time", salary: "", experience_level: "mid", description: "", required_skills: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState(null);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.description) return setErr("Title and description are required.");
    setBusy(true); setErr(null);
    try { await API.createJob(form); onSuccess(); onClose(); }
    catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[fadeUp_0.22s_ease]">
        <div className="flex items-center justify-between px-7 py-6 border-b border-slate-700/50">
          <div>
            <p className="text-xl font-bold text-white">Post a New Role</p>
            <p className="text-xs text-slate-400 mt-1">Fill in the details to publish your listing</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"><X size={15} /></button>
        </div>
        <div className="px-7 py-6 flex flex-col gap-4">
          {err && <Err msg={err} />}
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Job Title *</label>
            <input className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" value={form.title} onChange={set("title")} placeholder="e.g. Senior Frontend Developer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Location</label>
              <input className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" value={form.location} onChange={set("location")} placeholder="Remote / City" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Salary Range</label>
              <input className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" value={form.salary} onChange={set("salary")} placeholder="$80k – $120k" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Job Type</label>
              <select className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-violet-500 appearance-none cursor-pointer transition-all" value={form.job_type} onChange={set("job_type")}>
                <option value="full-time">Full-time</option><option value="part-time">Part-time</option>
                <option value="contract">Contract</option><option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Experience</label>
              <select className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-violet-500 appearance-none cursor-pointer transition-all" value={form.experience_level} onChange={set("experience_level")}>
                <option value="entry">Entry Level</option><option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option><option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Description *</label>
            <textarea className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-y" rows={4} value={form.description} onChange={set("description")} placeholder="Describe the role…" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Required Skills</label>
            <input className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" value={form.required_skills} onChange={set("required_skills")} placeholder="React, Python, Figma — comma separated" />
          </div>
        </div>
        <div className="flex gap-3 px-7 pb-6">
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:text-slate-200 hover:border-slate-600 transition-colors">Cancel</button>
          <button onClick={submit} disabled={busy} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/40 disabled:opacity-50 transition-all">
            {busy ? <Spinner size={14} /> : <Zap size={14} />} {busy ? "Publishing…" : "Publish Job"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MESSAGE MODAL ────────────────────────────────────────────────────────────
const MsgModal = ({ applicant, onClose }) => {
  const [form, setForm] = useState({ message_type: "general", subject: "", body: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err,  setErr]  = useState(null);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.subject || !form.body) return setErr("Subject and message are required.");
    setBusy(true); setErr(null);
    try { await API.sendMessage({ ...form, applicant: applicant.id }); setSent(true); setTimeout(onClose, 1600); }
    catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Avatar name={applicant.name} id={applicant.id} size={38} />
            <div>
              <p className="text-sm font-bold text-white">{applicant.name}</p>
              <p className="text-xs text-slate-400">{applicant.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"><X size={15} /></button>
        </div>
        <div className="px-7 py-5 flex flex-col gap-4">
          {sent && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
              <CheckCircle size={15} /> Message delivered!
            </div>
          )}
          {err && <Err msg={err} />}
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Message Type</label>
            <select className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-violet-500 appearance-none cursor-pointer" value={form.message_type} onChange={set("message_type")}>
              <option value="interview_invite">Interview Invitation</option>
              <option value="acceptance">Acceptance Letter</option>
              <option value="rejection">Rejection Notice</option>
              <option value="general">General Message</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Subject</label>
            <input className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" value={form.subject} onChange={set("subject")} placeholder="Subject line…" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Message</label>
            <textarea className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-y" rows={5} value={form.body} onChange={set("body")} placeholder="Write your message…" />
          </div>
        </div>
        <div className="flex gap-3 px-7 pb-6">
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:text-slate-200 hover:border-slate-600 transition-colors">Cancel</button>
          <button onClick={submit} disabled={busy || sent} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/40 disabled:opacity-50 transition-all">
            {busy ? <Spinner size={14} /> : <Send size={14} />} {busy ? "Sending…" : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── JOBS SECTION ─────────────────────────────────────────────────────────────
const Jobs = () => {
  const { data, loading, error, refetch } = useApi(API.jobs);
  const [modal, setModal] = useState(false);

  const closeJob = async id => {
    if (!window.confirm("Close this job posting?")) return;
    try { await API.closeJob(id); refetch(); } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Postings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your listings and track applications</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/40 transition-all">
          <Plus size={15} /> Post New Role
        </button>
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <div className="flex flex-col gap-3">
          {(data || []).map(job => (
            <div key={job.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                  <Briefcase size={19} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="text-[15px] font-bold text-white">{job.title}</p>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="flex items-center gap-3.5 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={11} /> {job.location}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><DollarSign size={11} /> {job.salary}</span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-700/60 text-slate-400 border border-slate-700">{job.type}</span>
                    <span className="text-xs text-slate-500">{job.posted}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent leading-none">{job.applicants}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">applicants</p>
                  </div>
                  {job.status === "active" && (
                    <button onClick={() => closeJob(job.id)} className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-400 text-xs font-semibold hover:text-slate-200 hover:border-slate-500 transition-colors">Close</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!loading && !(data || []).length && <Empty icon={Briefcase} text="No jobs posted yet — create your first listing!" />}
        </div>
      )}
      {modal && <JobModal onClose={() => setModal(false)} onSuccess={refetch} />}
    </div>
  );
};

// ─── APPLICANTS SECTION ───────────────────────────────────────────────────────
const Applicants = () => {
  const { data, setData, loading, error, refetch } = useApi(API.applicants);
  const [msgTarget, setMsgTarget] = useState(null);
  const [filter, setFilter]       = useState("all");

  const updateStatus = async (id, status) => {
    try { await API.patchApplicant(id, { status }); setData(prev => prev.map(a => a.id === id ? { ...a, status } : a)); }
    catch (e) { alert(e.message); }
  };

  const filtered = (data || []).filter(a => filter === "all" || a.status === filter);
  const stages   = ["all", "new", "reviewed", "shortlisted", "interviewed", "rejected"];

  return (
    <div>
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Applicants</h1>
          <p className="text-slate-400 text-sm mt-1">Review and manage candidate applications</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:text-slate-200 hover:border-slate-600 transition-colors"><Filter size={13} /> Filter</button>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:text-slate-200 hover:border-slate-600 transition-colors"><Download size={13} /> Export</button>
        </div>
      </div>

      {/* Stage filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {stages.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${
              filter === s
                ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white border-transparent shadow-lg shadow-violet-500/30"
                : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300"
            }`}>
            {s === "all" ? `All (${(data || []).length})` : s}
          </button>
        ))}
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => (
            <div key={a.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-3.5">
                <Avatar name={a.name} id={a.id} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{a.name}</p>
                    {a.rating > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                        <Star size={11} fill="currentColor" /> {a.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{a.job_title} · {a.experience} · {a.location}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><Clock size={10} /> Applied {a.applied}</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <select
                    value={a.status}
                    onChange={e => updateStatus(a.id, e.target.value)}
                    className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border cursor-pointer outline-none appearance-none ${statusStyles[a.status] || statusStyles.closed} bg-transparent`}
                  >
                    {["new","reviewed","shortlisted","interviewed","rejected","hired"].map(s => (
                      <option key={s} value={s} style={{ background: "#0f172a", color: "#f1f5f9" }} className="capitalize">{s}</option>
                    ))}
                  </select>
                  <button onClick={() => setMsgTarget(a)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-violet-500/40 transition-all">
                    <Send size={12} /> Message
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !filtered.length && <Empty icon={Users} text="No candidates in this stage." />}
        </div>
      )}
      {msgTarget && <MsgModal applicant={msgTarget} onClose={() => setMsgTarget(null)} />}
    </div>
  );
};

// ─── INTERVIEWS SECTION ───────────────────────────────────────────────────────
const Interviews = () => {
  const { data, loading, error, refetch } = useApi(API.interviews);

  return (
    <div>
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview Schedule</h1>
          <p className="text-slate-400 text-sm mt-1">Upcoming sessions across all open roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/40 transition-all">
          <Plus size={15} /> Schedule Interview
        </button>
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <div className="flex flex-col gap-3">
          {(data || []).map(iv => (
            <div key={iv.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <Avatar name={iv.candidate} id={(iv.id || 0) + 5} />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded border-2 border-slate-900 flex items-center justify-center text-white text-[8px] font-black ${iv.interview_type === "video" ? "bg-cyan-500" : "bg-violet-500"}`}>
                    {iv.interview_type === "video" ? "V" : "P"}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{iv.candidate}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{iv.job_title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{String(iv.date)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{String(iv.time)}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-700/60 text-slate-400 border border-slate-700">{iv.type}</span>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-400 text-xs font-semibold hover:text-slate-200 hover:border-slate-500 transition-colors">Reschedule</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-violet-500/40 transition-all">Send Invite</button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !(data || []).length && <Empty icon={Calendar} text="No interviews scheduled." />}
        </div>
      )}
    </div>
  );
};

// ─── MESSAGES SECTION ─────────────────────────────────────────────────────────
const Messages = () => {
  const { data, loading, error, refetch } = useApi(API.messages);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">All outbound candidate communications</p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "190px 1fr" }}>
        {/* Quick compose */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 h-fit">
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-3">Quick Actions</p>
          {["Interview Invitation", "Acceptance Letter", "Rejection Notice"].map(l => (
            <button key={l} className="w-full flex items-center gap-2 px-3 py-2 mb-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold text-left hover:text-slate-200 hover:border-slate-600 transition-colors">
              <ChevronRight size={11} /> {l}
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <p className="text-sm font-bold text-white">Recent Messages</p>
          </div>
          {error && <div className="p-4"><Err msg={error} retry={refetch} /></div>}
          {loading ? <div className="p-5"><Skeletons /></div> : (
            <div>
              {(data || []).map((msg, i) => (
                <div key={msg.id}
                  className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  style={{ borderBottom: i < data.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                >
                  <Avatar name={msg.applicant_name} id={msg.applicant} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{msg.applicant_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{msg.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-700/60 text-slate-400 border border-slate-700">{(msg.message_type || "").replace("_", " ")}</span>
                    <p className="text-[11px] text-slate-500 mt-1">{new Date(msg.sent).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                </div>
              ))}
              {!loading && !(data || []).length && <Empty icon={MessageSquare} text="No messages sent yet." />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ANALYTICS SECTION ────────────────────────────────────────────────────────
const Analytics = () => {
  const { data, loading, error, refetch } = useApi(API.analytics);

  const statCards = data ? [
    { icon: Briefcase, label: "Active Jobs",      value: data.total_jobs,             note: "+1 this week",             color: "from-violet-500 to-purple-600" },
    { icon: Users,     label: "Total Applicants", value: data.total_applicants,       note: `+${data.new_today} today`, color: "from-cyan-500 to-blue-600"    },
    { icon: Target,    label: "Shortlisted",      value: data.shortlisted,            note: "in pipeline",              color: "from-emerald-500 to-green-600" },
    { icon: Award,     label: "Interviews",       value: data.interviews_this_week,   note: "this week",                color: "from-pink-500 to-rose-600"    },
  ] : [];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Track your hiring funnel performance over time</p>
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {statCards.map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 border border-white/10 hover:-translate-y-0.5 hover:shadow-xl transition-all`}>
                <s.icon size={20} className="text-white/90 mb-3.5" />
                <p className="text-3xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-xs text-white/75 font-semibold mt-1">{s.label}</p>
                <div className="flex items-center gap-1 mt-2.5">
                  <TrendingUp size={10} className="text-white/70" />
                  <p className="text-[11px] text-white/70 font-semibold">{s.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-5">Applications Trend</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data?.weekly_data || []}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" stroke="transparent" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis stroke="transparent" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#8b5cf6" strokeWidth={2} fill="url(#vGrad)" dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-5">Views vs Applications</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.weekly_data || []} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" stroke="transparent" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis stroke="transparent" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="views" name="Views" fill="#06b6d4" radius={[4,4,0,0]} fillOpacity={0.8} />
                  <Bar dataKey="applications" name="Applications" fill="#8b5cf6" radius={[4,4,0,0]} fillOpacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function EmployerDashboard() {
  const [tab, setTab]             = useState("jobs");
  const [sidebarOpen, setSidebar] = useState(true);
  const { data: company }         = useApi(API.company);

  const nav = [
    { id: "jobs",       label: "Jobs",       icon: Briefcase     },
    { id: "applicants", label: "Applicants", icon: Users         },
    { id: "interviews", label: "Interviews", icon: Calendar      },
    { id: "messages",   label: "Messages",   icon: MessageSquare },
    { id: "analytics",  label: "Analytics",  icon: BarChart3     },
  ];

  const pages = {
    jobs: <Jobs />, applicants: <Applicants />,
    interviews: <Interviews />, messages: <Messages />, analytics: <Analytics />
  };

  const used  = company?.active_job_count || 0;
  const total = company?.job_slots        || 4;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-56" : "w-0"}`}>

        {/* Logo */}
        <div className="px-5 pt-7 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white leading-none tracking-tight">HireDesk</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Employer Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1">
          {nav.map(item => (
            <button key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold mb-0.5 transition-all text-left border ${
                tab === item.id
                  ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50"
              }`}>
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Company card */}
        <div className="p-3 pb-5">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                {(company?.name || "C")[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white leading-none truncate">{company?.name || "Your Company"}</p>
                <p className="text-[10px] text-cyan-400 capitalize mt-0.5">{company?.plan || "Free"} Plan</p>
              </div>
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Job Slots</p>
            <div className="flex gap-1 mb-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full border border-slate-700 transition-all ${i < used ? "bg-violet-500 border-violet-500" : "bg-slate-800"}`} />
              ))}
            </div>
            <p className="text-[11px] text-slate-500">{used} of {total} slots used</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-14 shrink-0 flex items-center justify-between px-7 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(o => !o)} className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors">
              <Menu size={15} />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <p className="text-xs text-slate-400 font-semibold capitalize">{nav.find(n => n.id === tab)?.label}</p>
          </div>
          <button className="relative p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {pages[tab]}
          </div>
        </main>
      </div>
    </div>
  );
}