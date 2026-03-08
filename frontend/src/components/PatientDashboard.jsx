export default function PatientDashboard({ user, setPage }) {
  const cards = [
    { icon: "📅", title: "Appointments",       desc: "Book or manage your consultations",    page: "appointments", color: "#6366f1" },
    { icon: "🩺", title: "AI Symptom Checker", desc: "Check symptoms with our AI model",     page: "symptoms",     color: "#0891b2" },
    { icon: "📋", title: "Medical Records",    desc: "View your health history",             page: "records",      color: "#059669" },
    { icon: "📹", title: "Video Consult",      desc: "Start a video call with your doctor",  page: "appointments", color: "#dc2626" },
    { icon: "📞", title: "Call History",       desc: "View your past consultations",         page: "calls",        color: "#7c3aed" },
  ];

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Role: <span className="badge">{user.role}</span> | Your health, our priority</p>
      </div>
      <div className="cards-grid">
        {cards.map(c => (
          <div key={c.title} className="dash-card" onClick={() => setPage(c.page)}
            style={{ "--card-color": c.color }}>
            <span className="card-icon">{c.icon}</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="info-box">
        <h3>🔒 Privacy First</h3>
        <p>All your data is encrypted and stored securely. Video calls are peer-to-peer via WebRTC — no server recording.</p>
      </div>
    </div>
  );
}