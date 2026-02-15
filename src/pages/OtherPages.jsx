import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_USERS } from "../data/mockData";
import { StatusBadge, Modal, SectionHeader, AlertBox, ProgressBar, DetailRow, EmptyState } from "../components/UI";
import Icon from "../components/Icon";

// ─── LOGS PAGE ────────────────────────────────────────────────────────────────
export function LogsPage({ logs, patients, prescriptions }) {
  const { user } = useAuth();
  const myLogs = user.role === "nurse" ? logs.filter(l => l.nurseId === user.id) : logs;

  const getPatient = pid => patients.find(p => p.id === pid)?.name || "—";
  const getMed     = rxid => prescriptions.find(r => r.id === rxid)?.medicineName || "—";

  return (
    <div>
      <SectionHeader
        title="Administration Logs"
        sub={`${myLogs.length} record${myLogs.length !== 1 ? "s" : ""} — immutable audit trail`}
      />
      <AlertBox type="info" icon="shield">
        <strong>Immutable Log:</strong> Administration records cannot be deleted. Amendments require documented justification.
      </AlertBox>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Log ID</th><th>Patient</th><th>Medicine</th><th>Nurse</th>
              <th>Scheduled</th><th>Administered</th><th>Date</th><th>Status</th><th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {myLogs.map(l => (
              <tr key={l.id}>
                <td><span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text3)" }}>{l.id}</span></td>
                <td style={{ fontWeight:500 }}>{getPatient(l.patientId)}</td>
                <td style={{ fontWeight:600 }}>{getMed(l.prescriptionId)}</td>
                <td style={{ fontSize:12, color:"var(--text2)" }}>{l.nurseName}</td>
                <td><span className="pill">{l.scheduledTime}</span></td>
                <td style={{ fontFamily:"var(--font-mono)", fontSize:12 }}>{l.givenTime || "—"}</td>
                <td style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--text2)" }}>{l.date}</td>
                <td><StatusBadge status={l.status} /></td>
                <td style={{ fontSize:12, color:"var(--text2)" }}>{l.remarks || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {myLogs.length === 0 && <EmptyState message="No administration logs yet" />}
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
export function ReportsPage({ patients, prescriptions, logs, schedule }) {
  const given    = schedule.filter(s => s.status === "Given").length;
  const missed   = schedule.filter(s => s.status === "Missed").length;
  const total    = schedule.length;
  const rate     = total ? Math.round((given / total) * 100) : 0;

  const perPatient = patients.map(p => ({
    ...p,
    total:  schedule.filter(s => s.patientId === p.id).length,
    given:  schedule.filter(s => s.patientId === p.id && s.status === "Given").length,
    missed: schedule.filter(s => s.patientId === p.id && s.status === "Missed").length,
  })).filter(p => p.total > 0);

  const nurses = MOCK_USERS.filter(u => u.role === "nurse").map(n => ({
    ...n,
    total:  logs.filter(l => l.nurseId === n.id).length,
    given:  logs.filter(l => l.nurseId === n.id && l.status === "Given").length,
    missed: logs.filter(l => l.nurseId === n.id && l.status === "Missed").length,
  }));

  return (
    <div>
      <SectionHeader title="Daily Report — Feb 14, 2025">
        <button className="btn"><Icon name="log" size={13} />Export PDF</button>
      </SectionHeader>

      {/* Summary stats */}
      <div className="stats-grid" style={{ marginBottom:22 }}>
        {[
          { icon:"pill",  number:total,  label:"Total Doses",   color:"blue" },
          { icon:"check", number:given,  label:"Administered",  color:"green" },
          { icon:"x",     number:missed, label:"Missed",        color:"red" },
          { icon:"chart", number:`${rate}%`, label:"Completion", color:"amber" },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><Icon name={s.icon} size={17} /></div>
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Per-patient */}
        <div className="card">
          <div className="card-title">Per-Patient Summary</div>
          {perPatient.map(p => (
            <div key={p.id} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>{p.bed}</div>
                </div>
                <div style={{ textAlign:"right", fontSize:12 }}>
                  <span style={{ color:"var(--green)" }}>{p.given} given</span>
                  {p.missed > 0 && <span style={{ color:"var(--red)", marginLeft:8 }}>{p.missed} missed</span>}
                </div>
              </div>
              <ProgressBar
                value={p.total ? (p.given / p.total) * 100 : 0}
                color={p.missed > 0 ? "var(--amber)" : "var(--green)"}
              />
            </div>
          ))}
        </div>

        {/* Nurse performance */}
        <div className="card">
          <div className="card-title">Nurse Performance</div>
          {nurses.map(n => (
            <div key={n.id} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{n.name}</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>{n.ward}</div>
                </div>
                <div style={{ fontSize:12 }}>
                  <span style={{ color:"var(--green)" }}>{n.given} given</span>
                  {n.missed > 0 && <span style={{ color:"var(--red)", marginLeft:8 }}>{n.missed} missed</span>}
                </div>
              </div>
              <ProgressBar value={n.total ? (n.given / n.total) * 100 : 0} color="var(--accent)" />
            </div>
          ))}
          {nurses.every(n => n.total === 0) && (
            <div style={{ fontSize:13, color:"var(--text3)", textAlign:"center", padding:16 }}>No activity yet</div>
          )}
        </div>
      </div>

      {/* Missed dose table */}
      <div className="card">
        <div className="card-title">Missed Dose Details</div>
        {logs.filter(l => l.status === "Missed").length === 0 ? (
          <div style={{ textAlign:"center", padding:"24px", color:"var(--green)", fontSize:13 }}>
            ✓ No missed doses recorded today
          </div>
        ) : (
          <table>
            <thead><tr><th>Patient</th><th>Medicine</th><th>Scheduled</th><th>Nurse</th><th>Reason</th></tr></thead>
            <tbody>
              {logs.filter(l => l.status === "Missed").map(l => (
                <tr key={l.id}>
                  <td>{patients.find(p => p.id === l.patientId)?.name || "—"}</td>
                  <td style={{ fontWeight:600 }}>{prescriptions.find(r => r.id === l.prescriptionId)?.medicineName || "—"}</td>
                  <td><span className="pill">{l.scheduledTime}</span></td>
                  <td style={{ fontSize:12, color:"var(--text2)" }}>{l.nurseName}</td>
                  <td style={{ fontSize:12, color:"var(--text2)" }}>{l.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── USERS PAGE ───────────────────────────────────────────────────────────────
export function UsersPage() {
  const { registeredUsers, setRegisteredUsers } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ role:"nurse", status:"active", ward:"Ward A", gender:"Male" });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.email) return;
    setRegisteredUsers(prev => [...prev, { ...form, id:`USR${Date.now()}`, password: form.password || "password123" }]);
    setShowModal(false);
    setForm({ role:"nurse", status:"active", ward:"Ward A", gender:"Male" });
  };

  const toggleStatus = (id) => {
    setRegisteredUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const modalFooter = (
    <>
      <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
      <button className="btn accent" onClick={handleSave}>Create User</button>
    </>
  );

  return (
    <div>
      <SectionHeader title="User Management" sub={`${registeredUsers.length} staff accounts`}>
        <button className="btn accent" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={13} />Add User
        </button>
      </SectionHeader>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Ward</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {registeredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight:600 }}>{u.name}</div>
                  <div style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--text3)" }}>{u.id}</div>
                </td>
                <td style={{ fontSize:12.5, color:"var(--text2)" }}>{u.email}</td>
                <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                <td style={{ fontSize:12.5, color:"var(--text2)" }}>{u.ward}</td>
                <td><span className={`badge ${u.status === "active" ? "admitted" : "inactive"}`}>{u.status}</span></td>
                <td>
                  <div className="action-btns">
                    <div className="icon-btn" title="Edit"><Icon name="edit" size={13} /></div>
                    <div className={`icon-btn ${u.status === "active" ? "danger" : "success"}`}
                      title={u.status === "active" ? "Deactivate" : "Activate"}
                      onClick={() => toggleStatus(u.id)}>
                      <Icon name={u.status === "active" ? "x" : "check"} size={13} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add New User" onClose={() => setShowModal(false)} footer={modalFooter}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name||""} onChange={e => set("name", e.target.value)} placeholder="e.g. Dr. Jane Smith" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email||""} onChange={e => set("email", e.target.value)} placeholder="user@hospital.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => set("role", e.target.value)}>
                <option value="doctor">Doctor</option><option value="nurse">Nurse</option><option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Ward</label>
              <select className="form-select" value={form.ward} onChange={e => set("ward", e.target.value)}>
                <option>Ward A</option><option>Ward B</option><option>ICU</option><option>Cardiology</option><option>Neurology</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Temporary Password</label>
            <input className="form-input" type="password" value={form.password||""} onChange={e => set("password", e.target.value)} placeholder="Min. 8 characters" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
export function SettingsPage() {
  return (
    <div>
      <SectionHeader title="System Settings" sub="Configure system behaviour and security" />
      <div className="two-col">
        <div className="card">
          <div className="card-title">Notification Thresholds</div>
          {[
            ["Missed Dose Alert", "60 min after scheduled"],
            ["Overdue Warning",   "30 min after scheduled"],
            ["End-of-Day Summary","10:00 PM daily"],
            ["Email Notifications","Enabled"],
            ["SMS Alerts",        "Disabled"],
          ].map(([k,v]) => <DetailRow key={k} label={k} value={v} />)}
        </div>
        <div className="card">
          <div className="card-title">Ward Configuration</div>
          {["Ward A","Ward B","ICU","Cardiology","Neurology"].map(w => (
            <DetailRow key={w} label={w} value={<span className="badge admitted">Active</span>} />
          ))}
        </div>
        <div className="card">
          <div className="card-title">Security</div>
          {[
            ["Session Timeout",  "30 minutes"],
            ["Password Policy",  "Min. 8 chars, uppercase & number"],
            ["Two-Factor Auth",  "Disabled"],
            ["Audit Trail",      "All actions logged"],
            ["Data Encryption",  "AES-256"],
            ["HTTPS",            "Required"],
          ].map(([k,v]) => <DetailRow key={k} label={k} value={v} />)}
        </div>
        <div className="card">
          <div className="card-title">System Information</div>
          {[
            ["Version",       "v2.4.1"],
            ["Database",      "PostgreSQL 15"],
            ["Last Backup",   "Feb 14, 2025 02:00 AM"],
            ["Uptime",        "99.8% (30 days)"],
            ["Active Users",  "5"],
            ["Data Retention","7 years"],
          ].map(([k,v]) => <DetailRow key={k} label={k} value={<span style={{ fontFamily:"var(--font-mono)", fontSize:12 }}>{v}</span>} />)}
        </div>
      </div>
    </div>
  );
}
