import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientContext";
import { StatusBadge, Modal, SectionHeader, TableSearch, EmptyState } from "../components/UI";
import Icon from "../components/Icon";

export default function PatientsPage() {
  const { user } = useAuth();
  
  // 1. Pull all 4 required actions from context
  const { patients, addPatient, updatePatient, deletePatient } = usePatients(); 
  
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const canEdit = user.role === "doctor" || user.role === "admin";

  const filtered = patients.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.uniqueCode || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.bed || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.condition || "").toLowerCase().includes(search.toLowerCase())
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditTarget(null);
    setForm({ status: "Admitted", gender: "Male", ward: "Ward A" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({ ...p });
    setShowModal(true);
  };

  // 2. Updated Save handles both NEW patients and UPDATES to existing ones
  const handleSave = async () => {
    if (!form.name || !form.bed) {
      alert("Please fill in Name and Bed Number");
      return;
    }

    setLoading(true); 
    try {
      if (editTarget) {
        // CALL UPDATE: Sends a PUT request to the server
        const res = await updatePatient(editTarget.id, form);
        if (res.success) setShowModal(false);
      } else {
        // CALL ADD: Sends a POST request to the server
        const res = await addPatient({
          ...form,
          doctorId: user.id
        }); 
        if (res.success) {
          setShowModal(false);
          setForm({}); 
        }
      }
    } catch (err) {
      alert("Action failed. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Delete logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient permanently?")) {
      try {
        const res = await deletePatient(id);
        if (!res.success) alert("Failed to delete patient.");
      } catch (err) {
        alert("Delete error. Check server.");
      }
    }
  };

  const modalFooter = (
    <>
      <button className="btn" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
      <button className="btn accent" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : editTarget ? "Save Changes" : "Admit Patient"}
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
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text2)" }}>{p.age}y · {p.gender}</div>
                </td>
                <td><span className="pill">{p.uniqueCode}</span></td>
                <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--amber)" }}>{p.bed}</span></td>
                <td style={{ color: "var(--text2)", fontSize: 12.5 }}>{p.ward}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text2)" }}>{p.admittedDate || p.admissionDate}</td>
                <td style={{ fontSize: 12.5 }}>{p.condition}</td>
                <td><StatusBadge status={p.status} /></td>
                {canEdit && (
                  <td>
                    <div className="action-btns">
                      <div className="icon-btn" onClick={() => openEdit(p)} title="Edit patient">
                        <Icon name="edit" size={13} />
                      </div>
                      {/* 4. Connected the Delete function to the trash icon */}
                      <div className="icon-btn danger" title="Delete patient" onClick={() => handleDelete(p.id)}>
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
              <input className="form-input" value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="Patient full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input className="form-input" type="number" value={form.age || ""} onChange={e => set("age", e.target.value)} placeholder="Years" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={form.gender || "Male"} onChange={e => set("gender", e.target.value)}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bed Number *</label>
              <input className="form-input" value={form.bed || ""} onChange={e => set("bed", e.target.value)} placeholder="e.g. A-101" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ward</label>
              <select className="form-select" value={form.ward || "Ward A"} onChange={e => set("ward", e.target.value)}>
                <option>Ward A</option><option>Ward B</option><option>ICU</option><option>Cardiology</option><option>Neurology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Condition / Diagnosis</label>
              <input className="form-input" value={form.condition || ""} onChange={e => set("condition", e.target.value)} placeholder="Primary diagnosis" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status || "Admitted"} onChange={e => set("status", e.target.value)}>
                <option>Admitted</option><option>Discharged</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}