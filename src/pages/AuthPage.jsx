import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import "../styles/auth.css";

// ─── Password strength helper ─────────────────────────────────────────────────
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;
  return score; // 0–4
}
function StrengthBar({ password }) {
  const s = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "var(--red)", "var(--amber)", "var(--accent)", "var(--green)"];
  if (!password) return null;
  return (
    <div className="pw-strength">
      <div className="pw-strength-bar">
        {[1,2,3,4].map(i => (
          <div key={i} className={`pw-seg ${i <= s ? (s <= 1 ? "weak" : s === 2 ? "medium" : "strong") : ""}`} />
        ))}
      </div>
      <div className="pw-label" style={{ color: colors[s] || "var(--text3)" }}>
        {labels[s] || ""}
      </div>
    </div>
  );
}

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  { value:"doctor", label:"Doctor",     icon:"🩺", desc:"Prescriptions & patients" },
  { value:"nurse",  label:"Nurse",      icon:"💊", desc:"Medication administration" },
  { value:"admin",  label:"Admin",      icon:"🔐", desc:"System management" },
];

// ─── SIGN IN ──────────────────────────────────────────────────────────────────
function SignIn({ onSwitch }) {
  const { login } = useAuth();
  const [role, setRole]         = useState("doctor");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [msg, setMsg]           = useState(null);
  const [loading, setLoading]   = useState(false);

  // Demo auto-fill
  const demoMap = {
    doctor:{ email:"priya@hospital.com",  password:"doctor123" },
    nurse: { email:"anjali@hospital.com", password:"nurse123"  },
    admin: { email:"admin@hospital.com",  password:"admin123"  },
  };
  const fillDemo = (r) => {
    setRole(r);
    setEmail(demoMap[r].email);
    setPassword(demoMap[r].password);
    setMsg(null);
  };

  const handleSubmit = () => {
    setMsg(null);
    if (!email || !password) { setMsg({ type:"error", text:"Please fill in all fields." }); return; }
    setLoading(true);
    setTimeout(() => {
      const res = login(email.trim().toLowerCase(), password, role);
      if (!res.success) setMsg({ type:"error", text: res.message });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to your MedAdmin account</div>
      </div>

      {/* Role selector */}
      <div style={{ marginBottom:22 }}>
        <div className="form-label" style={{ marginBottom:9 }}>Select your role</div>
        <div className="role-grid">
          {ROLES.map(r => (
            <div key={r.value} className={`role-card ${role === r.value ? "active" : ""}`} onClick={() => fillDemo(r.value)}>
              <span className="role-card-icon">{r.icon}</span>
              {r.label}
            </div>
          ))}
        </div>
      </div>

      {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email address</label>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>
            <Icon name="mail" size={14} />
          </div>
          <input
            className="form-input" type="email" placeholder="you@hospital.com"
            style={{ paddingLeft:36 }} value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>
            <Icon name="lock" size={14} />
          </div>
          <input
            className="form-input" type={showPw ? "text" : "password"} placeholder="••••••••"
            style={{ paddingLeft:36, paddingRight:40 }} value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <div
            style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", cursor:"pointer" }}
            onClick={() => setShowPw(!showPw)}
          >
            <Icon name={showPw ? "eyeoff" : "eye"} size={14} />
          </div>
        </div>
      </div>

      <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="auth-divider">or</div>
      <div style={{ fontSize:12, color:"var(--text3)", textAlign:"center", padding:"10px", background:"var(--surface2)", borderRadius:9, border:"1px solid var(--border)" }}>
        <strong style={{ color:"var(--text2)" }}>Demo:</strong> Click a role above to auto-fill credentials
      </div>

      <div className="auth-switch">
        Don't have an account?{" "}
        <button onClick={onSwitch}>Create account</button>
      </div>
    </div>
  );
}

// ─── SIGN UP ──────────────────────────────────────────────────────────────────
function SignUp({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ role:"nurse", ward:"Ward A", gender:"Male" });
  const [showPw, setShowPw]   = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [msg, setMsg]         = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    setMsg(null);
    const { name, email, password, confirm, role, ward, phone } = form;
    if (!name || !email || !password || !confirm)     { setMsg({ type:"error", text:"Please fill in all required fields." }); return; }
    if (password !== confirm)                         { setMsg({ type:"error", text:"Passwords do not match." }); return; }
    if (password.length < 8)                         { setMsg({ type:"error", text:"Password must be at least 8 characters." }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  { setMsg({ type:"error", text:"Enter a valid email address." }); return; }

    setLoading(true);
    setTimeout(() => {
      const res = signup({ name, email:email.trim().toLowerCase(), password, role, ward, phone: phone||"" });
      if (!res.success) { setMsg({ type:"error", text:res.message }); }
      else { setMsg({ type:"success", text:"Account created! Signing you in..." }); }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Join MedAdmin — secure hospital medication system</div>
      </div>

      {/* Role */}
      <div style={{ marginBottom:20 }}>
        <div className="form-label" style={{ marginBottom:9 }}>Account type</div>
        <div className="role-grid">
          {ROLES.map(r => (
            <div key={r.value} className={`role-card ${form.role === r.value ? "active" : ""}`} onClick={() => set("role", r.value)}>
              <span className="role-card-icon">{r.icon}</span>
              {r.label}
              <span style={{ fontSize:10, color:"var(--text3)", textAlign:"center" }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

      {/* Name + Phone */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="Dr. Jane Smith" value={form.name||""} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" placeholder="9876543210" value={form.phone||""} onChange={e => set("phone", e.target.value)} />
        </div>
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>
            <Icon name="mail" size={14} />
          </div>
          <input className="form-input" type="email" placeholder="you@hospital.com"
            style={{ paddingLeft:36 }} value={form.email||""}
            onChange={e => set("email", e.target.value)} />
        </div>
      </div>

      {/* Ward + Gender */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Assigned Ward</label>
          <select className="form-select" value={form.ward} onChange={e => set("ward", e.target.value)}>
            <option>Ward A</option><option>Ward B</option>
            <option>ICU</option><option>Cardiology</option><option>Neurology</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select className="form-select" value={form.gender} onChange={e => set("gender", e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Password *</label>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>
            <Icon name="lock" size={14} />
          </div>
          <input className="form-input" type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
            style={{ paddingLeft:36, paddingRight:40 }} value={form.password||""}
            onChange={e => set("password", e.target.value)} />
          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", cursor:"pointer" }}
            onClick={() => setShowPw(!showPw)}>
            <Icon name={showPw ? "eyeoff" : "eye"} size={14} />
          </div>
        </div>
        <StrengthBar password={form.password || ""} />
      </div>

      {/* Confirm */}
      <div className="form-group">
        <label className="form-label">Confirm Password *</label>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>
            <Icon name="key" size={14} />
          </div>
          <input className="form-input" type={showPw2 ? "text" : "password"} placeholder="Re-enter password"
            style={{ paddingLeft:36, paddingRight:40 }} value={form.confirm||""}
            onChange={e => set("confirm", e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", cursor:"pointer" }}
            onClick={() => setShowPw2(!showPw2)}>
            <Icon name={showPw2 ? "eyeoff" : "eye"} size={14} />
          </div>
        </div>
        {form.confirm && form.password && form.confirm !== form.password && (
          <div style={{ fontSize:11, color:"var(--red)", marginTop:5 }}>Passwords do not match</div>
        )}
      </div>

      <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <div className="auth-switch">
        Already have an account?{" "}
        <button onClick={onSwitch}>Sign in</button>
      </div>
    </div>
  );
}

// ─── AUTH PAGE (orchestrator) ─────────────────────────────────────────────────
export default function AuthPage() {
  const [view, setView] = useState("signin"); // "signin" | "signup"

  const FEATURES = [
    "Role-based access for Doctors, Nurses & Admins",
    "Real-time medication schedule tracking",
    "Immutable administration audit logs",
    "Missed dose alerts & notifications",
    "Daily reports with PDF export",
    "HIPAA-compliant data security",
  ];

  return (
    <div className="auth-wrap">
      {/* ── Left branding panel ── */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="brand-mark"><Icon name="pill" size={20} /></div>
            <div className="brand-name">Med<span>Admin</span></div>
          </div>
          <div className="auth-tagline">
            Hospital medication,<br /><em>managed precisely.</em>
          </div>
          <div className="auth-desc">
            A secure, role-based medication administration system that ensures no dose goes untracked. Built for modern hospitals.
          </div>
        </div>

        <div className="auth-features">
          {FEATURES.map(f => (
            <div key={f} className="auth-feature-item">
              <div className="feature-dot" />
              <div className="feature-text">{f}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        {/* Tab switch */}
        <div style={{ width:"100%", maxWidth:420, marginBottom:0 }}>
          <div className="auth-tabs" style={{ marginBottom:28 }}>
            <button className={`auth-tab ${view === "signin" ? "active" : ""}`} onClick={() => setView("signin")}>Sign In</button>
            <button className={`auth-tab ${view === "signup" ? "active" : ""}`} onClick={() => setView("signup")}>Create Account</button>
          </div>
        </div>

        {view === "signin"
          ? <SignIn onSwitch={() => setView("signup")} />
          : <SignUp onSwitch={() => setView("signin")} />
        }
      </div>
    </div>
  );
}
