import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_USERS } from "../data/mockData";
import { StatusBadge, RouteLabel, Modal, SectionHeader, TableSearch, EmptyState } from "../components/UI";
import Icon from "../components/Icon";

export default function PrescriptionsPage({ prescriptions, setPrescriptions, patients }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [form, setForm]           = useState({ route:"Oral", frequency:1, status:"Active", times:["08:00"] });

  const canAdd = user.role === "doctor";
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = prescriptions.filter(rx => {
    const p = patients.find(pt => pt.id === rx.patientId);
    return !search
      || (p && p.name.toLowerCase().includes(search.toLowerCase()))
      || rx.medicineName.toLowerCase().includes(search.toLowerCase())
      || rx.dosage.toLowerCase().includes(search.toLowerCase());
  });

  const getPatientName = pid => patients.find(p => p.id === pid)?.name || "—";
  const getDoctorName  = did => MOCK_USERS.find(u => u.id === did)?.name || "—";

  const handleSave = () => {
    const newRx = {
      ...form,
      id: `RX${String(Date.now()).slice(-5)}`,
      doctorId: user.id,
      frequency: Number(form.frequency),
    };
    setPrescriptions(prev => [...prev, newRx]);
    setShowModal(false);
    setForm({ route:"Oral", frequency:1, status:"Active", times:["08:00"] });
  };

  const modalFooter = (
    <>
      <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
      <button className="btn accent" onClick={handleSave}>Create Prescription</button>
    </>
  );

  return (
    <div>
      <SectionHeader
        title="Prescriptions"
        sub={`${filtered.length} prescription${filtered.length !== 1 ? "s" : ""}`}
      >
        {canAdd && (
          <button className="btn accent" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={13} />New Prescription
          </button>
        )}
      </SectionHeader>

      <div className="table-card">
        <TableSearch value={search} onChange={setSearch} placeholder="Search by patient or medicine name..." />
        <table>
          <thead>
            <tr>
              <th>Patient</th><th>Medicine</th><th>Dosage</th><th>Route</th>
              <th>Schedule</th><th>Prescribing Doctor</th><th>Period</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(rx => (
              <tr key={rx.id}>
                <td>
                  <div style={{ fontWeight:600 }}>{getPatientName(rx.patientId)}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>{rx.id}</div>
                </td>
                <td style={{ fontWeight:600 }}>{rx.medicineName}</td>
                <td><span className="pill">{rx.dosage}</span></td>
                <td><RouteLabel route={rx.route} /></td>
                <td>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:4 }}>
                    {rx.times.map((t, i) => (
                      <span key={i} style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"var(--amber)", background:"var(--amber-dim)", padding:"2px 6px", borderRadius:5 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>{rx.frequency}× daily</div>
                </td>
                <td style={{ fontSize:12, color:"var(--text2)" }}>{getDoctorName(rx.doctorId)}</td>
                <td style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--text3)", lineHeight:1.7 }}>
                  {rx.startDate}<br />→ {rx.endDate}
                </td>
                <td><StatusBadge status={rx.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="No prescriptions found" />}
      </div>

      {showModal && (
        <Modal title="New Prescription" onClose={() => setShowModal(false)} footer={modalFooter}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select className="form-select" value={form.patientId||""} onChange={e => set("patientId", e.target.value)}>
              <option value="">Select admitted patient...</option>
              {patients.filter(p => p.status === "Admitted").map(p => (
                <option key={p.id} value={p.id}>{p.name} — Bed {p.bed}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Medicine Name *</label>
              <input className="form-input" value={form.medicineName||""} onChange={e => set("medicineName", e.target.value)} placeholder="e.g. Amoxicillin" />
            </div>
            <div className="form-group">
              <label className="form-label">Dosage *</label>
              <input className="form-input" value={form.dosage||""} onChange={e => set("dosage", e.target.value)} placeholder="e.g. 500mg" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Route</label>
              <select className="form-select" value={form.route} onChange={e => set("route", e.target.value)}>
                <option>Oral</option><option>IV</option><option>Injection</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Frequency Per Day</label>
              <select className="form-select" value={form.frequency} onChange={e => set("frequency", Number(e.target.value))}>
                <option value={1}>1× — Once daily</option>
                <option value={2}>2× — Twice daily</option>
                <option value={3}>3× — Three times</option>
                <option value={4}>4× — Four times</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Administration Times</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {Array.from({ length: form.frequency }).map((_, i) => (
                <input
                  key={i} className="form-input" type="time"
                  style={{ width:"auto", minWidth:120 }}
                  value={(form.times || [])[i] || "08:00"}
                  onChange={e => {
                    const t = [...(form.times || [])];
                    t[i] = e.target.value;
                    set("times", t);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="form-input" type="date" value={form.startDate||""} onChange={e => set("startDate", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input className="form-input" type="date" value={form.endDate||""} onChange={e => set("endDate", e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Special Instructions</label>
            <textarea className="form-textarea" value={form.instructions||""} onChange={e => set("instructions", e.target.value)}
              placeholder="e.g. Take after meals, avoid dairy products, monitor blood pressure..." />
          </div>
        </Modal>
      )}
    </div>
  );
}
