import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { StatusBadge, Modal, SectionHeader, TableSearch, EmptyState } from "../components/UI";
import Icon from "../components/Icon";

export default function PatientsPage({ patients, setPatients }) {
  const { user } = useAuth();
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]         = useState({});

  const canEdit = user.role === "doctor" || user.role === "admin";

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.uniqueCode.toLowerCase().includes(search.toLowerCase()) ||
    p.bed.toLowerCase().includes(search.toLowerCase()) ||
    (p.condition || "").toLowerCase().includes(search.toLowerCase())
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditTarget(null);
    setForm({ status:"Admitted", gender:"Male", ward:"Ward A" });
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditTarget(p);
    setForm({ ...p });
    setShowModal(true);
  };
  const handleSave = () => {
    if (editTarget) {
      setPatients(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...form } : p));
    } else {
      const newP = {
        ...form,
        id: `P${String(Date.now()).slice(-4)}`,
        uniqueCode: `MR-2025-${String(patients.length + 1).padStart(3, "0")}`,
        admissionDate: new Date().toISOString().slice(0, 10),
        doctorId: user.id,
        dischargeDate: null,
      };
      setPatients(prev => [...prev, newP]);
    }
    setShowModal(false);
  };

  const modalFooter = (
    <>
      <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
      <button className="btn accent" onClick={handleSave}>
        {editTarget ? "Save Changes" : "Admit Patient"}
      </button>
    </>
  );

  return (
    <div>
      <SectionHeader
        title="Patients"
        sub={`${filtered.length} patient${filtered.length !== 1 ? "s" : ""} found`}
      >
        {canEdit && (
          <button className="btn accent" onClick={openAdd}>
            <Icon name="plus" size={13} />Admit Patient
          </button>
        )}
      </SectionHeader>

      <div className="table-card">
        <TableSearch value={search} onChange={setSearch} placeholder="Search by name, MRN, bed, or condition..." />
        <table>
          <thead>
            <tr>
              <th>Patient</th><th>MRN</th><th>Bed</th><th>Ward</th>
              <th>Admitted</th><th>Condition</th><th>Status</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight:600 }}>{p.name}</div>
                  <div style={{ fontSize:11.5, color:"var(--text2)" }}>{p.age}y · {p.gender}</div>
                </td>
                <td><span className="pill">{p.uniqueCode}</span></td>
                <td><span style={{ fontFamily:"var(--font-mono)", fontSize:12.5, color:"var(--amber)" }}>{p.bed}</span></td>
                <td style={{ color:"var(--text2)", fontSize:12.5 }}>{p.ward}</td>
                <td style={{ fontFamily:"var(--font-mono)", fontSize:11.5, color:"var(--text2)" }}>{p.admissionDate}</td>
                <td style={{ fontSize:12.5 }}>{p.condition}</td>
                <td><StatusBadge status={p.status} /></td>
                {canEdit && (
                  <td>
                    <div className="action-btns">
                      <div className="icon-btn" onClick={() => openEdit(p)} title="Edit patient">
                        <Icon name="edit" size={13} />
                      </div>
                      <div className="icon-btn danger" title="Discharge patient"
                        onClick={() => setPatients(prev => prev.map(pt => pt.id === p.id ? { ...pt, status:"Discharged", dischargeDate:new Date().toISOString().slice(0,10) } : pt))}>
                        <Icon name="trash" size={13} />
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="No patients match your search" />}
      </div>

      {showModal && (
        <Modal title={editTarget ? "Edit Patient Record" : "Admit New Patient"} onClose={() => setShowModal(false)} footer={modalFooter}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name||""} onChange={e => set("name", e.target.value)} placeholder="Patient full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input className="form-input" type="number" value={form.age||""} onChange={e => set("age", e.target.value)} placeholder="Years" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={form.gender||"Male"} onChange={e => set("gender", e.target.value)}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bed Number *</label>
              <input className="form-input" value={form.bed||""} onChange={e => set("bed", e.target.value)} placeholder="e.g. A-101" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ward</label>
              <select className="form-select" value={form.ward||"Ward A"} onChange={e => set("ward", e.target.value)}>
                <option>Ward A</option><option>Ward B</option><option>ICU</option><option>Cardiology</option><option>Neurology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Condition / Diagnosis</label>
              <input className="form-input" value={form.condition||""} onChange={e => set("condition", e.target.value)} placeholder="Primary diagnosis" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input className="form-input" value={form.contact||""} onChange={e => set("contact", e.target.value)} placeholder="Patient contact" />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input className="form-input" value={form.emergencyContact||""} onChange={e => set("emergencyContact", e.target.value)} placeholder="Emergency contact" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status||"Admitted"} onChange={e => set("status", e.target.value)}>
                <option>Admitted</option><option>Discharged</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Discharge Date</label>
              <input className="form-input" type="date" value={form.dischargeDate||""} onChange={e => set("dischargeDate", e.target.value)} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
