import { useState, useEffect } from "react";
import API from "../api";

export default function Appointments({ user, startCall }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors]           = useState([]);
  const [form, setForm]     = useState({ doctor_id: "", date: "", time: "", reason: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAppointments(); if (user.role === "patient") fetchDoctors(); }, []);

  const fetchAppointments = async () => {
    const res = await fetch(`${API}/api/appointments?user_id=${user.id}&role=${user.role}`);
    setAppointments(await res.json());
  };

  const fetchDoctors = async () => {
    const res = await fetch(`${API}/api/doctors`);
    setDoctors(await res.json());
  };

  const book = async () => {
    if (!form.doctor_id || !form.date || !form.time || !form.reason)
      return alert("Please fill all fields");
    await fetch(`${API}/api/appointments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, patient_id: user.id })
    });
    setForm({ doctor_id: "", date: "", time: "", reason: "" });
    setShowForm(false); fetchAppointments();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/appointments/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await fetch(`${API}/api/appointments/${id}`, { method: "DELETE" });
    fetchAppointments();
  };

  const statusColor = { pending: "#d97706", confirmed: "#059669", cancelled: "#dc2626" };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📅 Appointments</h2>
        {user.role === "patient" &&
          <button className="btn-primary" style={{ width: "auto" }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ Book Appointment"}
          </button>}
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Book New Appointment</h3>
          <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })}>
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
          </select>
          <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
            onChange={e => setForm({ ...form, date: e.target.value })} />
          <input type="time" value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })} />
          <textarea placeholder="Reason for visit" value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })} />
          <button className="btn-primary" onClick={book}>Confirm Booking</button>
        </div>
      )}

      <div className="apt-list">
        {appointments.length === 0 && <p className="empty">No appointments yet.</p>}
        {appointments.map(a => (
          <div key={a.id} className="apt-card">
            <div className="apt-info">
              <strong>{user.role === "patient" ? `Dr. ${a.doctor_name}` : a.patient_name}</strong>
              <span>📆 {a.date} at {a.time}</span>
              <span>💬 {a.reason}</span>
            </div>
            <div className="apt-actions">
              <span className="status-badge" style={{ background: statusColor[a.status] }}>{a.status}</span>
              {user.role === "doctor" && a.status === "pending" && (
                <>
                  <button className="btn-sm green" onClick={() => updateStatus(a.id, "confirmed")}>✓ Confirm</button>
                  <button className="btn-sm red"   onClick={() => updateStatus(a.id, "cancelled")}>✕ Cancel</button>
                </>
              )}
              {a.status === "confirmed" && (
                <button className="btn-sm blue" onClick={() => startCall(`room_${a.id}`)}>📹 Start Call</button>
              )}
              {user.role === "patient" && (
                <button className="btn-sm red" onClick={() => deleteAppointment(a.id)}>🗑️ Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
