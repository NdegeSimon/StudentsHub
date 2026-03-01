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

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #020617;
    --surface:     #0f172a;
    --surface2:    #1e293b;
    --border:      rgba(255,255,255,0.06);
    --border2:     rgba(255,255,255,0.11);
    --violet:      #8b5cf6;
    --cyan:        #06b6d4;
    --grad:        linear-gradient(135deg, #8b5cf6, #06b6d4);
    --violet-dim:  rgba(139,92,246,0.15);
    --cyan-dim:    rgba(6,182,212,0.12);
    --violet-glow: rgba(139,92,246,0.45);
    --text:        #f1f5f9;
    --muted:       #64748b;
    --muted2:      #334155;
    --green:       #4ade80;
    --green-dim:   rgba(74,222,128,0.12);
    --red:         #f87171;
    --red-dim:     rgba(248,113,113,0.12);
    --amber:       #fbbf24;
  }

  body { background: var(--bg); font-family: 'Syne', sans-serif; color: var(--text); }
  .serif { font-family: 'DM Serif Display', serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--muted2); border-radius: 99px; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes pulseV  { 0%,100% { box-shadow:0 0 0 0 var(--violet-glow); } 50% { box-shadow:0 0 0 6px transparent; } }

  .fade-up  { animation: fadeUp 0.38s ease both; }
  .d1 { animation-delay:.06s; } .d2 { animation-delay:.12s; } .d3 { animation-delay:.18s; }

  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, #263046 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 12px;
  }

  /* Card */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover { border-color: var(--border2); }

  /* Grad card (for stat cards) */
  .card-grad {
    border-radius: 16px;
    padding: 20px;
    border: 1px solid var(--border);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card-grad:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }

  /* Nav */
  .nav-btn {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 14px; border-radius: 12px; width: 100%;
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 13px; font-weight: 600;
    font-family: 'Syne', sans-serif; letter-spacing: 0.02em;
    transition: all 0.18s; text-align: left;
  }
  .nav-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .nav-btn.active {
    color: var(--violet);
    background: var(--violet-dim);
    border: 1px solid rgba(139,92,246,0.25);
  }

  /* Gradient button */
  .btn-grad {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 12px;
    background: var(--grad); color: #fff;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.03em; border: none; cursor: pointer;
    transition: all 0.2s; box-shadow: 0 0 0 0 var(--violet-glow);
  }
  .btn-grad:hover { box-shadow: 0 4px 24px var(--violet-glow); filter: brightness(1.08); }
  .btn-grad:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Ghost button */
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 15px; border-radius: 12px;
    background: transparent; color: var(--muted);
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    border: 1px solid var(--border2); cursor: pointer; transition: all 0.18s;
  }
  .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

  /* Input */
  .field {
    width: 100%; padding: 11px 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text);
    font-family: 'Syne', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.2s; appearance: none;
  }
  .field::placeholder { color: var(--muted2); }
  .field:focus { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(139,92,246,0.12); }

  .label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

  /* Status badges */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; border: 1px solid; }
  .badge-active      { color: var(--green);   border-color: rgba(74,222,128,0.3);    background: var(--green-dim); }
  .badge-closed      { color: var(--muted);   border-color: var(--border2);           background: rgba(255,255,255,0.04); }
  .badge-new         { color: var(--cyan);    border-color: rgba(6,182,212,0.3);      background: var(--cyan-dim); }
  .badge-reviewed    { color: #60a5fa;        border-color: rgba(96,165,250,0.3);     background: rgba(96,165,250,0.1); }
  .badge-shortlisted { color: var(--violet);  border-color: rgba(139,92,246,0.3);     background: var(--violet-dim); }
  .badge-interviewed { color: var(--amber);   border-color: rgba(251,191,36,0.3);     background: rgba(251,191,36,0.1); }
  .badge-rejected    { color: var(--red);     border-color: rgba(248,113,113,0.3);    background: var(--red-dim); }
  .badge-hired       { color: var(--green);   border-color: rgba(74,222,128,0.3);     background: var(--green-dim); }
  .badge-draft       { color: var(--muted);   border-color: var(--border2);           background: transparent; }

  .tag { padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 600; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }

  /* Modal */
  .modal-overlay { position:fixed; inset:0; z-index:100; background:rgba(2,6,23,0.8); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:var(--surface); border:1px solid var(--border2); border-radius:20px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; animation:fadeUp 0.22s ease; }

  /* Misc */
  .spin { animation: spin 0.8s linear infinite; }
  .notif-dot { width:7px; height:7px; border-radius:50%; background:var(--violet); animation:pulseV 2s infinite; }

  /* Gradient text */
  .grad-text { background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
`;

const Styles = () => <style dangerouslySetInnerHTML={{ __html: CSS }} />;

// ─── API ───────────────────────────────────────────────────────────────────────
// Default to local backend used by server/app.py (port 5001)
const BASE = (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) || "http://localhost:5001/api";
const getToken = () => localStorage.getItem("token") || localStorage.getItem("access_token");

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...opts.headers },
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `HTTP ${res.status}`); }
  return res.status === 204 ? null : res.json();
}

const API = {
  // Get employer dashboard / company summary (server: /api/employer/dashboard)
  company: async () => {
    const res = await apiFetch("/employer/dashboard");
    // Map server shape into what the UI expects
    return {
      name: res.company?.name || res.company?.company_name || "Your Company",
      plan: res.company?.plan || "Free",
      active_job_count: res.stats?.active_jobs || 0,
      job_slots: res.company?.job_slots || 4,
      ...(res.company || {})
    };
  },

  // Employer's jobs. Server job routes are under /api/jobs; employer list: /api/jobs/employer/my-jobs
  jobs: async () => {
    const res = await apiFetch('/jobs/employer/my-jobs');
    const list = res.jobs || res || [];
    return (list || []).map(j => ({
      id: j.id,
      title: j.title,
      location: j.location || '',
      salary: j.salary_min && j.salary_max ? `${j.salary_min} - ${j.salary_max}` : (j.salary || ''),
      type: j.job_type || j.type || '',
      posted: j.created_at ? new Date(j.created_at).toLocaleDateString() : (j.posted || ''),
      applicants: j.applications_count || j.applicants_count || 0,
      status: j.is_active ? 'active' : 'closed'
    }));
  },

  // Create a job: POST /api/jobs
  createJob: (d) => {
    // Map frontend form fields to backend expected payload
    const payload = {
      title: d.title,
      description: d.description,
      location: d.location,
      job_type: d.job_type,
      experience_level: d.experience_level,
      requirements: d.required_skills || ''
    };
    // Attempt to parse salary into salary_min if provided
    if (d.salary) {
      const parts = String(d.salary).split(/[–-]/).map(s => s.replace(/[^0-9]/g, '')).filter(Boolean);
      if (parts.length === 1) payload.salary_min = Number(parts[0]);
      else if (parts.length >= 2) { payload.salary_min = Number(parts[0]); payload.salary_max = Number(parts[1]); }
    }
    return apiFetch('/jobs', { method: 'POST', body: JSON.stringify(payload) });
  },

  // Update job: PUT /api/jobs/:id
  updateJob: (id, d) => {
    const payload = {
      title: d.title,
      description: d.description,
      location: d.location,
      job_type: d.job_type,
      experience_level: d.experience_level,
      requirements: d.required_skills || ''
    };
    if (d.salary) {
      const parts = String(d.salary).split(/[–-]/).map(s => s.replace(/[^0-9]/g, '')).filter(Boolean);
      if (parts.length === 1) payload.salary_min = Number(parts[0]);
      else if (parts.length >= 2) { payload.salary_min = Number(parts[0]); payload.salary_max = Number(parts[1]); }
    }
    return apiFetch(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  // Delete job: DELETE /api/jobs/:id
  deleteJob: (id) => apiFetch(`/jobs/${id}`, { method: 'DELETE' }),

  // Close job by marking inactive: PUT /api/jobs/:id
  closeJob: (id) => apiFetch(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify({ is_active: false }) }),

  // Employer applicants: server route /api/employer/applications
  applicants: async () => {
    const res = await apiFetch('/employer/applications');
    return res.applications || [];
  },

  // Update application status: PUT /api/employer/applications/:id
  patchApplicant: (id, d) => apiFetch(`/employer/applications/${id}`, { method: 'PUT', body: JSON.stringify(d) }),

  // Interviews: use dashboard upcoming deadlines /api/dashboard/upcoming-deadlines
  interviews: async () => {
    const res = await apiFetch('/dashboard/upcoming-deadlines');
    return res || [];
  },

  // Messages: list conversations and send message via message routes (/api/messages/...)
  messages: () => apiFetch('/messages/conversations'),
  sendMessage: (d) => {
    // If conversation_id provided, send to that conversation
    if (d.conversation_id) return apiFetch(`/messages/conversations/${d.conversation_id}/messages`, { method: 'POST', body: JSON.stringify(d) });
    // Otherwise create a conversation (expects participant_ids) - caller may handle creating + sending
    return apiFetch('/messages/conversations', { method: 'POST', body: JSON.stringify(d) });
  },

  // Analytics via dashboard stats
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
const Spinner = ({ s = 18 }) => <Loader2 size={s} className="spin" style={{ color: "var(--violet)" }} />;

const Skeletons = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
    {[88,88,88].map((h,i) => <div key={i} className="skeleton" style={{ height:h, animationDelay:`${i*0.1}s` }} />)}
  </div>
);

const Err = ({ msg, retry }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:"var(--red-dim)", border:"1px solid rgba(248,113,113,0.2)", color:"var(--red)", fontSize:13, marginBottom:16 }}>
    <AlertCircle size={15} style={{ flexShrink:0 }} />
    <span style={{ flex:1 }}>{msg}</span>
    {retry && <button onClick={retry} className="btn-ghost" style={{ padding:"4px 10px", fontSize:11, borderRadius:8 }}><RefreshCw size={11} /> Retry</button>}
  </div>
);

const Empty = ({ icon: Icon, text }) => (
  <div style={{ textAlign:"center", padding:"60px 0", color:"var(--muted)" }}>
    <Icon size={28} style={{ margin:"0 auto 10px", opacity:0.2 }} />
    <p style={{ fontSize:13 }}>{text}</p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    <span style={{ width:5, height:5, borderRadius:"50%", background:"currentColor" }} />
    {status}
  </span>
);

// Avatar with violet→cyan gradient by default, varied by id
const AV_GRADS = [
  "linear-gradient(135deg,#8b5cf6,#06b6d4)",
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#06b6d4,#8b5cf6)",
  "linear-gradient(135deg,#a855f7,#06b6d4)",
];
const Avatar = ({ name="", id=0, size=42 }) => (
  <div style={{ width:size, height:size, borderRadius:10, flexShrink:0, background:AV_GRADS[id%AV_GRADS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.3, fontWeight:800, color:"#fff", letterSpacing:"0.04em" }}>
    {name.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase()}
  </div>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--surface2)", border:"1px solid var(--border2)", borderRadius:10, padding:"10px 14px", fontFamily:"Syne", fontSize:12 }}>
      <p style={{ color:"var(--muted)", fontSize:10, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color:p.color, fontWeight:700 }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

// ─── JOB MODAL ────────────────────────────────────────────────────────────────
const JobModal = ({ job = null, onClose, onSuccess }) => {
  const [form, setForm] = useState({ title:"", location:"", job_type:"full-time", salary:"", experience_level:"mid", description:"", required_skills:"" });
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState(null);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    // populate form when editing
    if (job) {
      setForm({
        title: job.title || '',
        location: job.location || '',
        job_type: job.type || job.job_type || 'full-time',
        salary: job.salary || '',
        experience_level: job.experience_level || 'mid',
        description: job.description || job.summary || '',
        required_skills: job.required_skills || job.requirements || ''
      });
    }
  }, [job]);

  const submit = async () => {
    if (!form.title || !form.description) return setErr("Title and description are required.");
    setBusy(true); setErr(null);
    try {
      if (job && job.id) {
        await API.updateJob(job.id, form);
      } else {
        await API.createJob(form);
      }
      onSuccess(); onClose();
    }
    catch (e) { setErr(e.message || String(e)); setBusy(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 28px", borderBottom:"1px solid var(--border)" }}>
          <div>
            <p className="serif grad-text" style={{ fontSize:"1.5rem" }}>Post a New Role</p>
            <p style={{ fontSize:12, color:"var(--muted)", marginTop:3 }}>Fill in the details to publish your listing</p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding:8, borderRadius:8 }}><X size={15} /></button>
        </div>
        <div style={{ padding:"22px 28px", display:"flex", flexDirection:"column", gap:16 }}>
          {err && <Err msg={err} />}
          <div><label className="label">Job Title *</label><input className="field" value={form.title} onChange={set("title")} placeholder="e.g. Senior Frontend Developer" /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label className="label">Location</label><input className="field" value={form.location} onChange={set("location")} placeholder="Remote / City" /></div>
            <div><label className="label">Salary Range</label><input className="field" value={form.salary} onChange={set("salary")} placeholder="$80k – $120k" /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label className="label">Job Type</label>
              <select className="field" value={form.job_type} onChange={set("job_type")}>
                <option value="full-time">Full-time</option><option value="part-time">Part-time</option>
                <option value="contract">Contract</option><option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="label">Experience</label>
              <select className="field" value={form.experience_level} onChange={set("experience_level")}>
                <option value="entry">Entry Level</option><option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option><option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>
          <div><label className="label">Description *</label><textarea className="field" rows={4} value={form.description} onChange={set("description")} placeholder="Describe the role…" style={{ resize:"vertical" }} /></div>
          <div><label className="label">Required Skills</label><input className="field" value={form.required_skills} onChange={set("required_skills")} placeholder="React, Python, Figma — comma separated" /></div>
        </div>
        <div style={{ display:"flex", gap:10, padding:"0 28px 24px" }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-grad" style={{ flex:1, justifyContent:"center" }}>
            {busy ? <Spinner /> : <Zap size={14} />} {busy ? "Publishing…" : "Publish Job"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MESSAGE MODAL ────────────────────────────────────────────────────────────
const MsgModal = ({ applicant, onClose }) => {
  const [form, setForm] = useState({ message_type:"general", subject:"", body:"" });
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
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"22px 28px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Avatar name={applicant.name} id={applicant.id} size={38} />
            <div>
              <p style={{ fontSize:14, fontWeight:700 }}>{applicant.name}</p>
              <p style={{ fontSize:12, color:"var(--muted)" }}>{applicant.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding:8, borderRadius:8 }}><X size={15} /></button>
        </div>
        <div style={{ padding:"22px 28px", display:"flex", flexDirection:"column", gap:15 }}>
          {sent && (
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 15px", borderRadius:10, background:"var(--green-dim)", border:"1px solid rgba(74,222,128,0.25)", color:"var(--green)", fontSize:13 }}>
              <CheckCircle size={15} /> Message delivered!
            </div>
          )}
          {err && <Err msg={err} />}
          <div>
            <label className="label">Message Type</label>
            <select className="field" value={form.message_type} onChange={set("message_type")}>
              <option value="interview_invite">Interview Invitation</option>
              <option value="acceptance">Acceptance Letter</option>
              <option value="rejection">Rejection Notice</option>
              <option value="general">General Message</option>
            </select>
          </div>
          <div><label className="label">Subject</label><input className="field" value={form.subject} onChange={set("subject")} placeholder="Subject line…" /></div>
          <div><label className="label">Message</label><textarea className="field" rows={5} value={form.body} onChange={set("body")} placeholder="Write your message…" style={{ resize:"vertical" }} /></div>
        </div>
        <div style={{ display:"flex", gap:10, padding:"0 28px 24px" }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
          <button onClick={submit} disabled={busy||sent} className="btn-grad" style={{ flex:1, justifyContent:"center" }}>
            {busy ? <Spinner /> : <Send size={14} />} {busy ? "Sending…" : "Send Message"}
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
  const [editing, setEditing] = useState(null);

  const closeJob = async id => {
    if (!window.confirm("Close this job posting?")) return;
    try { await API.closeJob(id); refetch(); } catch (e) { alert(e.message); }
  };

  const onEdit = (job) => {
    setEditing(job);
    setModal(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try { await API.deleteJob(id); refetch(); }
    catch (e) { alert(e.message || 'Failed to delete job'); }
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <h1 className="serif" style={{ fontSize:"2rem", lineHeight:1.05 }}>Job Postings</h1>
          <p style={{ color:"var(--muted)", fontSize:13, marginTop:5 }}>Manage your listings and track applications</p>
        </div>
        <button className="btn-grad" onClick={() => setModal(true)}><Plus size={15} /> Post New Role</button>
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {(data||[]).map((job,i) => (
            <div key={job.id} className={`card fade-up d${Math.min(i+1,3)}`} style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                {/* Icon box with gradient border */}
                <div style={{ width:46, height:46, borderRadius:12, background:"var(--violet-dim)", border:"1px solid rgba(139,92,246,0.25)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Briefcase size={19} style={{ color:"var(--violet)" }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <p style={{ fontSize:15, fontWeight:700 }}>{job.title}</p>
                    <StatusBadge status={job.status} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:5, flexWrap:"wrap" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--muted)" }}><MapPin size={11}/> {job.location}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--muted)" }}><DollarSign size={11}/> {job.salary}</span>
                    <span className="tag">{job.type}</span>
                    <span style={{ fontSize:12, color:"var(--muted2)" }}>{job.posted}</span>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
                  <div style={{ textAlign:"right" }}>
                    <p className="serif grad-text" style={{ fontSize:"1.6rem", lineHeight:1 }}>{job.applicants}</p>
                    <p style={{ fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>applicants</p>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {job.status === "active" && (
                      <button className="btn-ghost" style={{ fontSize:12, padding:"7px 14px" }} onClick={() => closeJob(job.id)}>Close</button>
                    )}
                    <button className="btn-ghost" style={{ fontSize:12, padding:"7px 14px" }} onClick={() => onEdit(job)}>Edit</button>
                    <button className="btn-ghost" style={{ fontSize:12, padding:"7px 14px", color:'var(--red)' }} onClick={() => onDelete(job.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && !(data||[]).length && <Empty icon={Briefcase} text="No jobs posted yet — create your first listing!" />}
        </div>
      )}
      {modal && <JobModal job={editing} onClose={() => { setModal(false); setEditing(null); }} onSuccess={() => { refetch(); setEditing(null); }} />}
    </div>
  );
};

// ─── APPLICANTS SECTION ───────────────────────────────────────────────────────
const Applicants = () => {
  const { data, setData, loading, error, refetch } = useApi(API.applicants);
  const [msgTarget, setMsgTarget] = useState(null);
  const [filter, setFilter]       = useState("all");

  const updateStatus = async (id, status) => {
    try { await API.patchApplicant(id, { status }); setData(prev => prev.map(a => a.id===id ? {...a,status} : a)); }
    catch (e) { alert(e.message); }
  };

  const filtered = (data||[]).filter(a => filter==="all" || a.status===filter);
  const stages   = ["all","new","reviewed","shortlisted","interviewed","rejected"];

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <h1 className="serif" style={{ fontSize:"2rem", lineHeight:1.05 }}>Applicants</h1>
          <p style={{ color:"var(--muted)", fontSize:13, marginTop:5 }}>Review and manage candidate applications</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-ghost"><Filter size={13} /> Filter</button>
          <button className="btn-ghost"><Download size={13} /> Export</button>
        </div>
      </div>

      {/* Stage filter pills */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {stages.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:"5px 14px", borderRadius:99, fontSize:12, fontWeight:700,
            fontFamily:"Syne", border:"1px solid", cursor:"pointer",
            textTransform:"capitalize", transition:"all 0.15s",
            ...(filter===s
              ? { background:"var(--grad)", color:"#fff", borderColor:"transparent", boxShadow:"0 2px 12px var(--violet-glow)" }
              : { background:"transparent", color:"var(--muted)", borderColor:"var(--border2)" })
          }}>
            {s==="all" ? `All (${(data||[]).length})` : s}
          </button>
        ))}
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map((a,i) => (
            <div key={a.id} className={`card fade-up d${Math.min(i+1,3)}`} style={{ padding:"18px 22px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <Avatar name={a.name} id={a.id} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <p style={{ fontSize:14, fontWeight:700 }}>{a.name}</p>
                    {a.rating > 0 && (
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"var(--amber)", fontWeight:700 }}>
                        <Star size={11} fill="currentColor" /> {a.rating}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{a.job_title} · {a.experience} · {a.location}</p>
                  <p style={{ fontSize:11, color:"var(--muted2)", marginTop:3, display:"flex", alignItems:"center", gap:4 }}>
                    <Clock size={10} /> Applied {a.applied}
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <select
                    value={a.status}
                    onChange={e => updateStatus(a.id, e.target.value)}
                    className={`badge badge-${a.status}`}
                    style={{ appearance:"none", fontFamily:"Syne", cursor:"pointer", outline:"none", background:"transparent" }}
                  >
                    {["new","reviewed","shortlisted","interviewed","rejected","hired"].map(s => (
                      <option key={s} value={s} style={{ background:"#0f172a", color:"#f1f5f9", textTransform:"capitalize" }}>{s}</option>
                    ))}
                  </select>
                  <button className="btn-grad" style={{ padding:"7px 15px", fontSize:12 }} onClick={() => setMsgTarget(a)}>
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
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <h1 className="serif" style={{ fontSize:"2rem", lineHeight:1.05 }}>Interview Schedule</h1>
          <p style={{ color:"var(--muted)", fontSize:13, marginTop:5 }}>Upcoming sessions across all open roles</p>
        </div>
        <button className="btn-grad"><Plus size={15} /> Schedule Interview</button>
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {(data||[]).map((iv,i) => (
            <div key={iv.id} className={`card fade-up d${Math.min(i+1,3)}`} style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ position:"relative" }}>
                  <Avatar name={iv.candidate} id={iv.id+5} />
                  <div style={{ position:"absolute", bottom:-3, right:-3, width:16, height:16, borderRadius:4, background:iv.interview_type==="video" ? "var(--cyan)" : "var(--violet)", border:"2px solid var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:"#fff" }}>
                    {iv.interview_type==="video" ? "V" : "P"}
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:700 }}>{iv.candidate}</p>
                  <p style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{iv.job_title}</p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:13, fontWeight:700 }}>{String(iv.date)}</p>
                    <p style={{ fontSize:12, color:"var(--muted)", marginTop:1 }}>{String(iv.time)}</p>
                  </div>
                  <span className="tag">{iv.type}</span>
                  <button className="btn-ghost" style={{ fontSize:12, padding:"7px 13px" }}>Reschedule</button>
                  <button className="btn-grad" style={{ fontSize:12, padding:"7px 14px" }}>Send Invite</button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !(data||[]).length && <Empty icon={Calendar} text="No interviews scheduled." />}
        </div>
      )}
    </div>
  );
};

// ─── MESSAGES SECTION ─────────────────────────────────────────────────────────
const Messages = () => {
  const { data, loading, error, refetch } = useApi(API.messages);

  return (
    <div className="fade-up">
      <div style={{ marginBottom:28 }}>
        <h1 className="serif" style={{ fontSize:"2rem", lineHeight:1.05 }}>Messages</h1>
        <p style={{ color:"var(--muted)", fontSize:13, marginTop:5 }}>All outbound candidate communications</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", gap:14 }}>
        {/* Quick compose */}
        <div className="card" style={{ padding:16, height:"fit-content" }}>
          <p className="label" style={{ marginBottom:12 }}>Quick Actions</p>
          {["Interview Invitation","Acceptance Letter","Rejection Notice"].map(l => (
            <button key={l} className="btn-ghost" style={{ width:"100%", justifyContent:"flex-start", marginBottom:6, fontSize:12, borderRadius:10 }}>
              <ChevronRight size={11} /> {l}
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)" }}>
            <p style={{ fontSize:13, fontWeight:700 }}>Recent Messages</p>
          </div>
          {error && <div style={{ padding:16 }}><Err msg={error} retry={refetch} /></div>}
          {loading ? <div style={{ padding:20 }}><Skeletons /></div> : (
            <div>
              {(data||[]).map((msg,i) => (
                <div key={msg.id}
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderBottom:i<data.length-1?"1px solid var(--border)":"none", cursor:"pointer", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <Avatar name={msg.applicant_name} id={msg.applicant} size={36} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700 }}>{msg.applicant_name}</p>
                    <p style={{ fontSize:12, color:"var(--muted)", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{msg.subject}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <span className="tag" style={{ fontSize:10 }}>{(msg.message_type||"").replace("_"," ")}</span>
                    <p style={{ fontSize:11, color:"var(--muted2)", marginTop:4 }}>
                      {new Date(msg.sent).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                    </p>
                  </div>
                </div>
              ))}
              {!loading && !(data||[]).length && <Empty icon={MessageSquare} text="No messages sent yet." />}
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
    { icon:Briefcase, label:"Active Jobs",      value:data.total_jobs,           note:"+1 this week",          bg:"linear-gradient(135deg,#8b5cf6,#6d28d9)" },
    { icon:Users,     label:"Total Applicants", value:data.total_applicants,     note:`+${data.new_today} today`, bg:"linear-gradient(135deg,#06b6d4,#0284c7)" },
    { icon:Target,    label:"Shortlisted",      value:data.shortlisted,          note:"in pipeline",           bg:"linear-gradient(135deg,#10b981,#059669)" },
    { icon:Award,     label:"Interviews",       value:data.interviews_this_week, note:"this week",             bg:"linear-gradient(135deg,#f59e0b,#d97706)" },
  ] : [];

  return (
    <div className="fade-up">
      <div style={{ marginBottom:28 }}>
        <h1 className="serif" style={{ fontSize:"2rem", lineHeight:1.05 }}>Analytics</h1>
        <p style={{ color:"var(--muted)", fontSize:13, marginTop:5 }}>Track your hiring funnel performance over time</p>
      </div>

      {error && <Err msg={error} retry={refetch} />}
      {loading ? <Skeletons /> : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
            {statCards.map((s,i) => (
              <div key={i} className={`card-grad fade-up d${i+1}`} style={{ background:s.bg }}>
                <s.icon size={20} style={{ color:"rgba(255,255,255,0.9)", marginBottom:14 }} />
                <p className="serif" style={{ fontSize:"2.4rem", lineHeight:1, color:"#fff" }}>{s.value}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:4, fontFamily:"Syne", fontWeight:600 }}>{s.label}</p>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:10 }}>
                  <TrendingUp size={11} style={{ color:"rgba(255,255,255,0.7)" }} />
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{s.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div className="card" style={{ padding:"20px 24px" }}>
              <p className="label" style={{ marginBottom:18 }}>Applications Trend</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data?.weekly_data||[]}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" stroke="transparent" tick={{ fill:"var(--muted)", fontSize:11, fontFamily:"Syne" }} />
                  <YAxis stroke="transparent" tick={{ fill:"var(--muted)", fontSize:11, fontFamily:"Syne" }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#8b5cf6" strokeWidth={2} fill="url(#vGrad)" dot={{ fill:"#8b5cf6", r:4, strokeWidth:0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ padding:"20px 24px" }}>
              <p className="label" style={{ marginBottom:18 }}>Views vs Applications</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.weekly_data||[]} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" stroke="transparent" tick={{ fill:"var(--muted)", fontSize:11, fontFamily:"Syne" }} />
                  <YAxis stroke="transparent" tick={{ fill:"var(--muted)", fontSize:11, fontFamily:"Syne" }} />
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
    { id:"jobs",       label:"Jobs",        icon:Briefcase     },
    { id:"applicants", label:"Applicants",  icon:Users         },
    { id:"interviews", label:"Interviews",  icon:Calendar      },
    { id:"messages",   label:"Messages",    icon:MessageSquare },
    { id:"analytics",  label:"Analytics",   icon:BarChart3     },
  ];

  const pages = {
    jobs:<Jobs/>, applicants:<Applicants/>,
    interviews:<Interviews/>, messages:<Messages/>, analytics:<Analytics/>
  };

  const used  = company?.active_job_count || 0;
  const total = company?.job_slots        || 4;

  return (
    <>
      <Styles />
      <div style={{ display:"flex", height:"100vh", background:"var(--bg)", overflow:"hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:sidebarOpen?220:0, flexShrink:0, overflow:"hidden", background:"var(--surface)", borderRight:"1px solid var(--border)", transition:"width 0.28s cubic-bezier(.4,0,.2,1)", display:"flex", flexDirection:"column" }}>

          {/* Logo */}
          <div style={{ padding:"26px 18px 20px", borderBottom:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"var(--grad)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Zap size={16} style={{ color:"#fff" }} fill="white" />
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, lineHeight:1, letterSpacing:"0.02em" }}>HireDesk</p>
                <p style={{ fontSize:10, color:"var(--muted)", marginTop:1 }}>Employer Portal</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding:"12px 10px", flex:1 }}>
            {nav.map(item => (
              <button key={item.id} className={`nav-btn ${tab===item.id?"active":""}`} onClick={() => setTab(item.id)}>
                <item.icon size={15} /> {item.label}
              </button>
            ))}
          </nav>

          {/* Company card */}
          <div style={{ padding:"12px 12px 18px" }}>
            <div style={{ padding:"14px", borderRadius:14, background:"var(--surface2)", border:"1px solid var(--border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:"var(--grad)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", flexShrink:0 }}>
                  {(company?.name||"C")[0]}
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:700, lineHeight:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {company?.name||"Your Company"}
                  </p>
                  <p style={{ fontSize:10, color:"var(--cyan)", textTransform:"capitalize", marginTop:2 }}>
                    {company?.plan||"Free"} Plan
                  </p>
                </div>
              </div>
              <p className="label" style={{ marginBottom:7 }}>Job Slots</p>
              <div style={{ display:"flex", gap:4, marginBottom:5 }}>
                {Array.from({length:total}).map((_,i) => (
                  <div key={i} style={{ flex:1, height:4, borderRadius:2, background:i<used?"var(--violet)":"var(--surface)", border:"1px solid var(--border2)", transition:"background 0.3s" }} />
                ))}
              </div>
              <p style={{ fontSize:11, color:"var(--muted2)" }}>{used} of {total} slots used</p>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Header */}
          <header style={{ height:58, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", background:"var(--surface)", borderBottom:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={() => setSidebar(o=>!o)} className="btn-ghost" style={{ padding:7, borderRadius:8 }}><Menu size={15}/></button>
              <div style={{ width:1, height:16, background:"var(--border)" }} />
              <p style={{ fontSize:12, color:"var(--muted)", fontWeight:600, textTransform:"capitalize" }}>
                {nav.find(n=>n.id===tab)?.label}
              </p>
            </div>
            <button className="btn-ghost" style={{ padding:"7px 10px", position:"relative" }}>
              <Bell size={14}/>
              <span className="notif-dot" style={{ position:"absolute", top:7, right:7 }} />
            </button>
          </header>

          {/* Content */}
          <main style={{ flex:1, overflowY:"auto", padding:"34px 36px" }}>
            <div style={{ maxWidth:900, margin:"0 auto" }}>
              {pages[tab]}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}