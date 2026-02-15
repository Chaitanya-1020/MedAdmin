import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { StatusBadge, RouteLabel, Modal, SectionHeader, AlertBox } from "../components/UI";
import Icon from "../components/Icon";

export default function SchedulePage({ schedule, setSchedule, logs, setLogs, patients }) {
  const { user } = useAuth();
  const [filterWard, setFilterWard] = useState("All");
  const [showLogModal, setShowLogModal] = useState(false);
  const [selected, setSelected]        = useState(null);
  const [logForm, setLogForm]          = useState({ status:"Given", remarks:"" });

  const wards = ["All", "Ward A", "Ward B", "ICU"];

  const filtered = schedule
    .filter(s => filterWard === "All" || s.ward === filterWard)
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const counts = {
    total:   filtered.length,
    given:   filtered.filter(s => s.status === "Given").length,
    missed:  filtered.filter(s => s.status === "Missed").length,
    delayed: filtered.filter(s => s.status === "Delayed").length,
    pending: filtered.filter(s => s.status === "Pending").length,
  };

  const openLog = (item) => {
    if (user.role !== "nurse") return;
    setSelected(item);
    setLogForm({ status:"Given", remarks:"" });
    setShowLogModal(true);
  };

  const handleLog = () => {
    setSchedule(prev => prev.map(s => s.id === selected.id ? { ...s, status: logForm.status } : s));
    setLogs(prev => [...prev, {
      id:             `L${String(Date.now()).slice(-6)}`,
      prescriptionId: selected.prescriptionId,
      scheduleId:     selected.id,
      patientId:      selected.patientId,
      nurseId:        user.id,
      nurseName:      user.name,
      givenTime:      logForm.status === "Given" ? new Date().toTimeString().slice(0, 5) : null,
      scheduledTime:  selected.scheduledTime,
      date:           new Date().toISOString().slice(0, 10),
      status:         logForm.status,
      remarks:        logForm.remarks,
    }]);
    setShowLogModal(false);
  };

  const borderColor = (status) => {
    if (status === "Missed")  return "rgba(255,85,119,0.35)";
    if (status === "Given")   return "rgba(32,201,151,0.25)";
    if (status === "Delayed") return "rgba(167,139,250,0.3)";
    return "var(--border)";
  };

  const modalFooter = (
    <>
      <button className="btn" onClick={() => setShowLogModal(false)}>Cancel</button>
      <button
        className={`btn ${logForm.status === "Given" ? "accent" : logForm.status === "Missed" ? "danger" : "success"}`}
        onClick={handleLog}
      >
        <Icon name={logForm.status === "Given" ? "check" : "x"} size={13} />
        Confirm {logForm.status}
      </button>
    </>
  );

  return (
    <div>
      <SectionHeader
        title="Today's Medication Schedule"
        sub={`Feb 14, 2025 — ${counts.total} doses`}
      >
        {wards.map(w => (
          <button key={w} className={`btn sm ${filterWard === w ? "accent" : ""}`} onClick={() => setFilterWard(w)}>
            {w}
          </button>
        ))}
      </SectionHeader>

      {/* Mini stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
        {[
          { label:"Total",   val:counts.total,   color:"var(--accent)" },
          { label:"Given",   val:counts.given,   color:"var(--green)"  },
          { label:"Missed",  val:counts.missed,  color:"var(--red)"    },
          { label:"Pending", val:counts.pending, color:"var(--amber)"  },
        ].map(s => (
          <div key={s.label} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"13px 16px" }}>
            <div style={{ fontFamily:"var(--font-head)", fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11.5, color:"var(--text2)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom:18 }}>
        <div style={{ height:5, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${counts.total ? (counts.given/counts.total)*100 : 0}%`, background:"var(--green)", borderRadius:99, transition:"width 0.5s" }} />
        </div>
        <div style={{ fontSize:11, color:"var(--text3)", marginTop:5 }}>
          {counts.total ? Math.round((counts.given/counts.total)*100) : 0}% completion — {counts.given} of {counts.total} administered
        </div>
      </div>

      {counts.missed > 0 && (
        <AlertBox type="error" icon="alert">
          <strong>{counts.missed} missed dose{counts.missed > 1 ? "s" : ""}</strong> — Immediate attention required. Notify the attending physician.
        </AlertBox>
      )}

      {/* Schedule list */}
      <div className="schedule-grid">
        {filtered.map(item => {
          const patient = patients.find(p => p.id === item.patientId);
          const canLog  = user.role === "nurse" && item.status === "Pending";
          return (
            <div key={item.id} className="schedule-item" style={{ borderColor: borderColor(item.status) }}>
              <div className="schedule-time">{item.scheduledTime}</div>
              <div className="schedule-info">
                <div className="schedule-med">
                  {item.medicineName}
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text2)", marginLeft:8 }}>{item.dosage}</span>
                </div>
                <div className="schedule-detail">
                  {item.patientName} · <span style={{ fontFamily:"var(--font-mono)" }}>{item.bed}</span>
                  {" "}· {item.ward} · <RouteLabel route={item.route} />
                </div>
                {patient?.condition && (
                  <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{patient.condition}</div>
                )}
              </div>
              <StatusBadge status={item.status} />
              {canLog && (
                <button className="btn sm success" onClick={() => openLog(item)}>
                  <Icon name="check" size={12} />Administer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showLogModal && selected && (
        <Modal title="Record Administration" onClose={() => setShowLogModal(false)} footer={modalFooter}>
          <AlertBox type="info" icon="pill">
            <div>
              <strong>{selected.medicineName}</strong> {selected.dosage} for <strong>{selected.patientName}</strong>
              <div style={{ fontSize:11.5, marginTop:3 }}>
                Scheduled: {selected.scheduledTime} · Bed {selected.bed}
              </div>
            </div>
          </AlertBox>
          <div className="form-group">
            <label className="form-label">Administration Status</label>
            <select className="form-select" value={logForm.status} onChange={e => setLogForm(f => ({ ...f, status:e.target.value }))}>
              <option value="Given">Given</option>
              <option value="Missed">Missed</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Remarks (optional)</label>
            <textarea className="form-textarea" value={logForm.remarks}
              onChange={e => setLogForm(f => ({ ...f, remarks:e.target.value }))}
              placeholder="e.g. Patient refused, was in procedure, patient asleep..." />
          </div>
          <div style={{ fontSize:11.5, color:"var(--text3)", padding:"8px 0" }}>
            Recorded by: <strong style={{ color:"var(--text2)" }}>{user.name}</strong>
            {" "}· Time: <span style={{ fontFamily:"var(--font-mono)" }}>{new Date().toTimeString().slice(0, 5)}</span>
          </div>
        </Modal>
      )}
    </div>
  );
}
