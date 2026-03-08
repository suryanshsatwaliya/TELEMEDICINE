import { useState, useEffect } from "react";
import API from "../api";

export default function DoctorDashboard({ user, setPage }) {
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, total: 0, today: 0 });
  const [recentApts, setRecentApts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/appointments?user_id=${user.id}&role=doctor`)
      .then(r => r.json())
      .then(data => {
        const today = new Date().toISOString().split("T")[0];
        setStats({
          pending:   data.filter(a => a.status === "pending").length,
          confirmed: data.filter(a => a.status === "confirmed").length,
          total:     data.length,
          today:     data.filter(a => a.date === today).length,
        });
        setRecentApts(data.slice(0, 5));
      })
      .catch(() => {});
  }, [user.id]);

  const statusColor = {
    pending:   { bg: "#fef3c7", color: "#d97706" },
    confirmed: { bg: "#dcfce7", color: "#059669" },
    cancelled: { bg: "#fee2e2", color: "#dc2626" }
  };

  const cards = [
    { icon: "📅", title: "Appointments",      desc: "View & manage patient bookings",     page: "appointments", color: "#0ea5e9", light: "#e0f2fe" },
    { icon: "📋", title: "Medical Records",   desc: "Add & view patient health records",  page: "records",      color: "#6366f1", light: "#e0e7ff" },
    { icon: "📹", title: "Video Consult",     desc: "Start video call with a patient",    page: "video",        color: "#059669", light: "#dcfce7" },
    { icon: "🔍", title: "Find Patient",      desc: "Search patient by unique ID",        page: "records",      color: "#dc2626", light: "#fee2e2" },
    { icon: "📞", title: "Call History",      desc: "View past video consultations",      page: "calls",        color: "#7c3aed", light: "#ede9fe" },
    { icon: "📊", title: "Patient Analytics", desc: "Overview of your patient activity",  page: "appointments", color: "#0891b2", light: "#cffafe" },
  ];

  return (
    <div className="doctor-dashboard">

      {/* Header Banner */}
      <div className="doctor-welcome-banner">
        <div className="doctor-welcome-left">
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
            Doctor Portal
          </p>
          <h1 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "800" }}>
            Welcome, {user.name} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "15px" }}>
            Here's your practice overview for today
          </p>
        </div>
        <div style={{ fontSize: "64px", opacity: 0.3 }}>🏥</div>
        <div className="doctor-banner-deco" />
      </div>

      {/* Stats Row */}
      <div className="doctor-stats-grid">
        {[
          { label: "Today's Appointments", value: stats.today,     icon: "📆", color: "#0ea5e9" },
          { label: "Pending Approval",      value: stats.pending,   icon: "⏳", color: "#d97706" },
          { label: "Confirmed",             value: stats.confirmed, icon: "✅", color: "#059669" },
          { label: "Total Appointments",    value: stats.total,     icon: "📊", color: "#6366f1" },
        ].map(s => (
          <div key={s.label} className="doctor-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {s.label}
                </p>
                <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#0f172a" }}>{s.value}</p>
              </div>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: s.color + "20", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "22px"
              }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

        {/* Quick Actions */}
        <div>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {cards.map(c => (
              <div key={c.title} onClick={() => setPage(c.page)}
                style={{
                  background: "#fff", borderRadius: "14px", padding: "18px",
                  border: "1.5px solid #e2e8f0", cursor: "pointer",
                  transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: c.light, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "20px", marginBottom: "10px"
                }}>
                  {c.icon}
                </div>
                <p style={{ margin: "0 0 4px 0", fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>{c.title}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>Recent Appointments</h3>
          <div style={{ background: "#fff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
            {recentApts.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>📭</p>
                <p style={{ margin: 0 }}>No appointments yet</p>
              </div>
            ) : recentApts.map((a, i) => (
              <div key={a.id} style={{
                padding: "14px 16px",
                borderBottom: i < recentApts.length - 1 ? "1px solid #f1f5f9" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "700", fontSize: "14px"
                  }}>
                    {a.patient_name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>{a.patient_name}</p>
                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>{a.date} • {a.time}</p>
                  </div>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                  background: statusColor[a.status]?.bg,
                  color: statusColor[a.status]?.color
                }}>
                  {a.status}
                </span>
              </div>
            ))}
            {recentApts.length > 0 && (
              <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                <button onClick={() => setPage("appointments")} className="link-btn" style={{ fontSize: "13px" }}>
                  View all appointments →
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Info */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        borderRadius: "16px", padding: "20px 24px",
        display: "flex", alignItems: "center", gap: "16px"
      }}>
        <span style={{ fontSize: "32px" }}>🔒</span>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "700", color: "#fff", fontSize: "14px" }}>HIPAA Compliant & Secure</p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
            All patient data is encrypted. Video calls are peer-to-peer via WebRTC — no server recording.
          </p>
        </div>
      </div>

    </div>
  );
}