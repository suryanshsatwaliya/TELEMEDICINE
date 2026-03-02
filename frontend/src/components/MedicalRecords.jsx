import { useState, useEffect } from "react";
import API from "../api";

export default function MedicalRecords({ user }) {
  const [records, setRecords]   = useState([]);
  const [form, setForm]         = useState({ patient_id: "", diagnosis: "", prescription: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    const pid = user.role === "patient" ? user.id : form.patient_id;
    if (!pid) return;
    const res = await fetch(`${API}/api/records/${pid}`);
    setRecords(await res.json());
  };

  const save = async () => {
    await fetch(`${API}/api/records`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, doctor_id: user.id, patient_id: form.patient_id || user.id })
    });
    setShowForm(false); fetchRecords();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📋 Medical Records</h2>
        {user.role === "doctor" &&
          <button className="btn-primary" style={{ width: "auto" }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ Add Record"}
          </button>}
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Add Medical Record</h3>
          <input placeholder="Patient ID" value={form.patient_id}
            onChange={e => setForm({ ...form, patient_id: e.target.value })} />
          <input placeholder="Diagnosis" value={form.diagnosis}
            onChange={e => setForm({ ...form, diagnosis: e.target.value })} />
          <textarea placeholder="Prescription" value={form.prescription}
            onChange={e => setForm({ ...form, prescription: e.target.value })} />
          <textarea placeholder="Notes" value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary" onClick={save}>Save Record</button>
        </div>
      )}

      <div className="records-list">
        {records.length === 0 && <p className="empty">No medical records found.</p>}
        {records.map(r => (
          <div key={r.id} className="record-card">
            <div className="record-header">
              <strong>📌 {r.diagnosis}</strong>
              <span className="record-date">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p><strong>Prescription:</strong> {r.prescription}</p>
            <p><strong>Notes:</strong> {r.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
