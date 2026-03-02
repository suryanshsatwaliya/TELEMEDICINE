export default function Navbar({ user, page, setPage, onLogout }) {
  const tabs = [
    { id: "dashboard",    label: "🏠 Home" },
    { id: "appointments", label: "📅 Appointments" },
    { id: "symptoms",     label: "🩺 Symptom Checker" },
    { id: "records",      label: "📋 Medical Records" },
  ];
  return (
    <nav className="navbar">
      <div className="nav-brand">💊 TeleMed AI</div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`nav-btn ${page === t.id ? "active" : ""}`}
            onClick={() => setPage(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="nav-user">
        <span>👤 {user.name}</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
