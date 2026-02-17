import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import "../styles/auth.css";

// ─── Password strength helper ─────────────────────────────────────────────────
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function StrengthBar({ password }) {
  const s = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "var(--red)", "var(--amber)", "var(--accent)", "var(--green)"];
  if (!password) return null;
  return (
    <div className="pw-strength">
      <div className="pw-strength-bar">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`pw-seg ${i <= s ? (s <= 1 ? "weak" : s === 2 ? "medium" : "strong") : ""}`} />
        ))}
      </div>
      <div className="pw-label" style={{ color: colors[s] || "var(--text3)" }}>
        {labels[s] || ""}
      </div>
    </div>
  );
}

const ROLES = [
  { value: "doctor", label: "Doctor", icon: "🩺", desc: "Prescriptions & patients" },
  { value: "nurse", label: "Nurse", icon: "💊", desc: "Medication administration" },
  { value: "admin", label: "Admin", icon: "🔐", desc: "System management" },
];

// ─── SIGN IN ──────────────────────────────────────────────────────────────────
function SignIn({ onSwitch }) {
  const { login } = useAuth();
  const [role, setRole] = useState("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setMsg(null);
    if (!email || !password) { 
        setMsg({ type: "error", text: "Please fill in all fields." }); 
        return; 
    }
    setLoading(true);
    try {
      // Calls the backend to verify the hashed password in users.json
      const res = await login(email.trim().toLowerCase(), password, role);
      if (!res.success) setMsg({ type: "error", text: res.message });
    } catch (err) {
      setMsg({ type: "error", text: "Server connection failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to your MedAdmin account</div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div className="form-label" style={{ marginBottom: 9 }}>Select your role</div>
        <div className="role-grid">
          {ROLES.map(r => (
            <div key={r.value} className={`role-card ${role === r.value ? "active" : ""}`} onClick={() => setRole(r.value)}>
              <span className="role-card-icon">{r.icon}</span>
              {r.label}
            </div>
          ))}
        </div>
      </div>

      {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

      <div className="form-group">
        <label className="form-label">Email address</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
            <Icon name="mail" size={14} />
          </div>
          <input
            className="form-input" type="email" placeholder="you@hospital.com"
            style={{ paddingLeft: 36 }} value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
            <Icon name="lock" size={14} />
          </div>
          <input
            className="form-input" type={showPw ? "text" : "password"} placeholder="••••••••"
            style={{ paddingLeft: 36, paddingRight: 40 }} value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", cursor: "pointer" }}
            onClick={() => setShowPw(!showPw)}
          >
            <Icon name={showPw ? "eyeoff" : "eye"} size={14} />
          </div>
        </div>
      </div>

      <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

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
  const [form, setForm] = useState({ role: "nurse", ward: "Ward A", gender: "Male" });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setMsg(null);
    const { name, email, password, confirm, role } = form;

    if (!name || !email || !password || !confirm) { 
        setMsg({ type: "error", text: "Please fill in all required fields." }); 
        return; 
    }
    if (password !== confirm) { 
        setMsg({ type: "error", text: "Passwords do not match." }); 
        return; 
    }

    setLoading(true);
    try {
      // Sends data to the Node.js backend to be written to users.json
      const res = await signup({ 
        name, 
        email: email.trim().toLowerCase(), 
        password, 
        role,
        ward: form.ward,
        phone: form.phone
      });

      setMsg({ type: "success", text: "Account saved! Switching to Login..." });
      setTimeout(() => onSwitch(), 2000); 
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Join MedAdmin — Hospital System</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="form-label" style={{ marginBottom: 9 }}>Account type</div>
        <div className="role-grid">
          {ROLES.map(r => (
            <div key={r.value} className={`role-card ${form.role === r.value ? "active" : ""}`} onClick={() => set("role", r.value)}>
              <span className="role-card-icon">{r.icon}</span>
              {r.label}
            </div>
          ))}
        </div>
      </div>

      {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="Name" value={form.name || ""} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" placeholder="Phone" value={form.phone || ""} onChange={e => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
            <Icon name="mail" size={14} />
          </div>
          <input className="form-input" type="email" placeholder="you@hospital.com"
            style={{ paddingLeft: 36 }} value={form.email || ""}
            onChange={e => set("email", e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Password *</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
            <Icon name="lock" size={14} />
          </div>
          <input className="form-input" type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
            style={{ paddingLeft: 36, paddingRight: 40 }} value={form.password || ""}
            onChange={e => set("password", e.target.value)} />
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", cursor: "pointer" }}
            onClick={() => setShowPw(!showPw)}>
            <Icon name={showPw ? "eyeoff" : "eye"} size={14} />
          </div>
        </div>
        <StrengthBar password={form.password || ""} />
      </div>

      <div className="form-group">
        <label className="form-label">Confirm Password *</label>
        <input className="form-input" type={showPw2 ? "text" : "password"} value={form.confirm || ""} onChange={e => set("confirm", e.target.value)} />
      </div>

      <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      <div className="auth-switch">
        Already have an account? <button onClick={onSwitch}>Sign in</button>
      </div>
    </div>
  );
}

// ─── AUTH PAGE (Orchestrator) ─────────────────────────────────────────────────
export default function AuthPage() {
  const [view, setView] = useState("signin");

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-name">Med<span>Admin</span></div>
          <div className="auth-tagline">Hospital medication managed precisely.</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-tabs">
          <button className={`auth-tab ${view === "signin" ? "active" : ""}`} onClick={() => setView("signin")}>Sign In</button>
          <button className={`auth-tab ${view === "signup" ? "active" : ""}`} onClick={() => setView("signup")}>Create Account</button>
        </div>
        {view === "signin" ? <SignIn onSwitch={() => setView("signup")} /> : <SignUp onSwitch={() => setView("signin")} />}
      </div>
    </div>
  );
}