import { useState, useEffect } from "react";
import API from "../api";

export default function Appointments({ user, startCall }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors]           = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [search, setSearch]             = useState("");
  const [selectedDoc, setSelectedDoc]   = useState(null);
  const [form, setForm]   = useState({ doctor_id: "", date: "", time: "", reason: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAppointments();
    if (user.role === "patient") fetchDoctors();
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(doctors); return; }
    const q = search.toLowerCase();
    setFiltered(doctors.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      (d.qualification || "").toLowerCase().includes(q)
    ));
  }, [search, doctors]);

  const fetchAppointments = async () => {
    const res = await fetch(`${API}/api/appointments?user_id=${user.id}&role=${user.role}`);
    setAppointments(await res.json());
  };

  const fetchDoctors = async () => {
    const res = await fetch(`${API}/api/doctors`);
    const data = await res.json();
    setDoctors(data);
    setFiltered(data);
  };

  const selectDoctor = (doc) => {
    setSelectedDoc(doc);
    setForm({ ...form, doctor_id: doc.id, time: "" });
  };

  const getTimeSlots = () => {
    if (!selectedDoc || !selectedDoc.timeslots) return [];
    return selectedDoc.timeslots.split(",").map(t => t.trim());
  };

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12  = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${h12}:${m} ${ampm}`;
  };

  const book = async () => {
    if (!form.doctor_id || !form.date || !form.time || !form.reason)
      return alert("Please fill all fields");
    await fetch(`${API}/api/appointments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, patient_id: user.id })
    });
    setForm({ doctor_id: "", date: "", time: "", reason: "" });
    setSelectedDoc(null);
    setShowForm(false);
    fetchAppointments();
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

  const getDoctorEmoji = (name) => {
    const femaleNames = ["priya","neha","sunita","anjali","meera","kavita","pooja","ritu","sneha","shalini",
                         "rekha","preethi","nisha","kavitha","seema","usha","anita","smita","radha","deepa",
                         "ananya","meena","asha","fatima","shalini","geeta"];
    const first = name.replace("Dr. ","").split(" ")[0].toLowerCase();
    return femaleNames.includes(first) ? "👩‍⚕️" : "👨‍⚕️";
  };

  const statusColor = {
    pending:   { bg: "#fef3c7", color: "#d97706" },
    confirmed: { bg: "#dcfce7", color: "#059669" },
    cancelled: { bg: "#fee2e2", color: "#dc2626" }
  };

  const specializations = [...new Set(doctors.map(d => d.specialization))];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📅 Appointments</h2>
        {user.role === "patient" &&
          <button className="btn-primary" style={{ width: "auto" }}
            onClick={() => { setShowForm(!showForm); setSelectedDoc(null); setSearch(""); }}>
            {showForm ? "✕ Cancel" : "+ Book Appointment"}
          </button>}
      </div>

      {/* ── Booking Form ── */}
      {showForm && user.role === "patient" && (
        <div className="form-card" style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>🗓️ Book New Appointment</h3>

          {/* Search Bar */}
          {!selectedDoc && (
            <>
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
                <input
                  placeholder="Search by name, specialization, qualification..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: "40px", marginBottom: "0" }}
                />
              </div>

              {/* Specialization Filter Pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                <button onClick={() => setSearch("")}
                  style={{ ...pillStyle, background: !search ? "#6366f1" : "#f1f5f9", color: !search ? "#fff" : "#374151" }}>
                  All
                </button>
                {specializations.slice(0, 8).map(s => (
                  <button key={s} onClick={() => setSearch(s)}
                    style={{ ...pillStyle, background: search === s ? "#6366f1" : "#f1f5f9", color: search === s ? "#fff" : "#374151" }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Doctor Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
                {filtered.length === 0 && (
                  <p style={{ color: "#94a3b8", gridColumn: "1/-1", textAlign: "center", padding: "20px" }}>
                    No doctors found
                  </p>
                )}
                {filtered.map(doc => (
                  <div key={doc.id} onClick={() => selectDoctor(doc)}
                    style={{
                      background: "#f8fafc", borderRadius: "12px", padding: "16px",
                      border: "2px solid #e2e8f0", cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#f0f4ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    {/* Doctor Avatar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px", flexShrink: 0
                      }}>
                        {getDoctorEmoji(doc.name)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>{doc.name}</p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6366f1", fontWeight: "600" }}>{doc.specialization}</p>
                      </div>
                    </div>

                    {doc.qualification && (
                      <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#64748b" }}>
                        🎓 {doc.qualification}
                      </p>
                    )}
                    {doc.experience && (
                      <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#64748b" }}>
                        ⏱️ {doc.experience} experience
                      </p>
                    )}

                    {/* Time slots preview */}
                    {doc.timeslots && (
                      <div style={{ marginTop: "8px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>AVAILABLE SLOTS</p>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {doc.timeslots.split(",").slice(0, 4).map(t => (
                            <span key={t} style={{
                              background: "#e0e7ff", color: "#4338ca",
                              padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600"
                            }}>
                              {formatTime(t.trim())}
                            </span>
                          ))}
                          {doc.timeslots.split(",").length > 4 && (
                            <span style={{ color: "#94a3b8", fontSize: "11px", padding: "2px 4px" }}>
                              +{doc.timeslots.split(",").length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#6366f1", fontWeight: "600", textAlign: "right" }}>
                      Select →
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Selected Doctor + Booking Details */}
          {selectedDoc && (
            <>
              {/* Selected Doctor Banner */}
              <div style={{
                background: "linear-gradient(135deg, #667eea15, #764ba215)",
                border: "2px solid #6366f1", borderRadius: "12px",
                padding: "14px 16px", marginBottom: "16px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "28px" }}>{getDoctorEmoji(selectedDoc.name)}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "700", color: "#1e293b" }}>{selectedDoc.name}</p>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#6366f1" }}>{selectedDoc.specialization}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedDoc(null); setForm({ ...form, doctor_id: "", time: "" }); }}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", color: "#64748b", fontWeight: "600" }}>
                  Change
                </button>
              </div>

              {/* Date */}
              <label style={labelStyle}>Select Date</label>
              <input type="date" value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm({ ...form, date: e.target.value })}
                style={{ marginBottom: "16px" }}
              />

              {/* Time Slots */}
              <label style={labelStyle}>Select Time Slot</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {getTimeSlots().map(t => (
                  <button key={t} onClick={() => setForm({ ...form, time: t })}
                    style={{
                      padding: "8px 16px", borderRadius: "8px", border: "2px solid",
                      borderColor: form.time === t ? "#6366f1" : "#e2e8f0",
                      background: form.time === t ? "#6366f1" : "#fff",
                      color: form.time === t ? "#fff" : "#374151",
                      cursor: "pointer", fontWeight: "600", fontSize: "13px"
                    }}>
                    {formatTime(t)}
                  </button>
                ))}
              </div>

              {/* Reason */}
              <label style={labelStyle}>Reason for Visit</label>
              <textarea placeholder="Describe your symptoms or reason for visit..."
                value={form.reason} rows={3}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                style={{ marginBottom: "16px" }}
              />

              <button className="btn-primary" onClick={book}>✓ Confirm Booking</button>
            </>
          )}
        </div>
      )}

      {/* ── Appointments List ── */}
      <div className="apt-list">
        {appointments.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            <p style={{ fontSize: "40px", margin: "0 0 10px 0" }}>📭</p>
            <p style={{ fontSize: "16px" }}>No appointments yet</p>
          </div>
        )}
        {appointments.map(a => (
          <div key={a.id} className="apt-card">
            <div className="apt-info">
              <strong>{user.role === "patient" ? a.doctor_name : a.patient_name}</strong>
              <span>📆 {a.date} at {formatTime(a.time)}</span>
              <span>💬 {a.reason}</span>
            </div>
            <div className="apt-actions">
              <span className="status-badge" style={{
                background: statusColor[a.status]?.bg,
                color: statusColor[a.status]?.color,
                padding: "4px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "12px"
              }}>
                {a.status}
              </span>
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

const pillStyle = {
  padding: "5px 12px", borderRadius: "20px", border: "none",
  cursor: "pointer", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap"
};

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: "600",
  color: "#374151", marginBottom: "8px"
};