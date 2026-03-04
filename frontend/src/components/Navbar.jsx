import { useState, useRef, useEffect } from "react";
import Settings from "./Settings";

export default function Navbar({ user, onLogout, page, setPage }) {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = user.role === "doctor"
    ? [
        { id: "dashboard",    label: "🏠 Dashboard" },
        { id: "appointments", label: "📅 Appointments" },
        { id: "records",      label: "📋 Records" },
        { id: "video",        label: "📹 Video Call" },
        { id: "calls",        label: "📞 Call History" },
      ]
    : [
        { id: "dashboard",    label: "🏠 Dashboard" },
        { id: "appointments", label: "📅 Appointments" },
        { id: "symptoms",     label: "🤒 Symptoms" },
        { id: "records",      label: "📋 Records" },
        { id: "video",        label: "📹 Video Call" },
        { id: "calls",        label: "📞 Call History" },
      ];

  return (
    <>
      <nav className="navbar">

        {/* Brand */}
        <div className="nav-brand" onClick={() => setPage("dashboard")} style={{ cursor: "pointer" }}>
          💊 TeleMed AI
        </div>

        {/* Nav Links — same as before */}
        <div className="nav-links">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side — user name + 3 dot menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
          <span className="nav-user">👤 {user.name}</span>

          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-link"
              style={{ fontSize: "20px", padding: "4px 10px", fontWeight: "700" }}
              title="Menu"
            >
              ⋮
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: "44px",
                background: "#fff", borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                border: "1px solid #e2e8f0",
                minWidth: "190px", zIndex: 999, overflow: "hidden"
              }}>
                {/* User info */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>{user.name}</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94a3b8", textTransform: "capitalize" }}>{user.role}</p>
                  {user.unique_id && (
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6366f1", fontWeight: "600" }}>
                      ID: {user.unique_id}
                    </p>
                  )}
                </div>

                <button onClick={() => { setShowSettings(true); setMenuOpen(false); }} style={dropdownBtn}>
                  ⚙️ Settings
                </button>

                <button onClick={() => { onLogout(); setMenuOpen(false); }}
                  style={{ ...dropdownBtn, color: "#ef4444", borderTop: "1px solid #f1f5f9" }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </nav>

      {showSettings && (
        <Settings user={user} onLogout={onLogout} onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}

const dropdownBtn = {
  display: "block", width: "100%", padding: "12px 16px",
  background: "none", border: "none", textAlign: "left",
  cursor: "pointer", fontSize: "14px", color: "#374151", fontWeight: "500"
};