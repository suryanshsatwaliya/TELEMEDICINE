import { useState, useRef, useEffect } from "react";
import Settings from "./Settings";

export default function Navbar({ user, onLogout, activePage, setActivePage }) {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
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
        { id: "dashboard",  label: "🏠 Dashboard" },
        { id: "appointments", label: "📅 Appointments" },
        { id: "records",    label: "📋 Records" },
        { id: "video",      label: "📹 Video Call" },
        { id: "calls",      label: "📞 Call History" },
      ]
    : [
        { id: "dashboard",  label: "🏠 Dashboard" },
        { id: "appointments", label: "📅 Appointments" },
        { id: "symptoms",   label: "🤒 Symptoms" },
        { id: "records",    label: "📋 Records" },
        { id: "video",      label: "📹 Video Call" },
        { id: "calls",      label: "📞 Call History" },
      ];

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setActivePage("dashboard")} style={{ cursor: "pointer" }}>
          💊 TeleMed AI
        </div>

        <div className="nav-links">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side — user info + 3 dot menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
            👤 {user.name}
          </span>

          {/* 3 Dot Menu */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: menuOpen ? "#f1f5f9" : "none",
                border: "none", borderRadius: "8px",
                width: "36px", height: "36px",
                cursor: "pointer", fontSize: "20px",
                color: "#64748b", display: "flex",
                alignItems: "center", justifyContent: "center"
              }}
              title="Menu"
            >
              ⋮
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: "44px",
                background: "#fff", borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid #e2e8f0",
                minWidth: "180px", zIndex: 100, overflow: "hidden"
              }}>
                {/* User info in dropdown */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>{user.name}</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94a3b8", textTransform: "capitalize" }}>{user.role}</p>
                  {user.unique_id && (
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6366f1", fontWeight: "600" }}>
                      ID: {user.unique_id}
                    </p>
                  )}
                </div>

                {/* Settings */}
                <button
                  onClick={() => { setShowSettings(true); setMenuOpen(false); }}
                  style={dropdownBtn}
                >
                  ⚙️ Settings
                </button>

                {/* Logout */}
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  style={{ ...dropdownBtn, color: "#ef4444", borderTop: "1px solid #f1f5f9" }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <Settings
          user={user}
          onLogout={onLogout}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}

const dropdownBtn = {
  display: "block", width: "100%", padding: "12px 16px",
  background: "none", border: "none", textAlign: "left",
  cursor: "pointer", fontSize: "14px", color: "#374151",
  fontWeight: "500"
};