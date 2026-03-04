import { useState, useEffect } from "react";
import API from "../api";

export default function Settings({ user, onLogout, onClose }) {
  const [profile, setProfile] = useState({
    name: "", email: "", weight: "", height: "",
    blood_group: "", phone: "", age: "", unique_id: "", role: ""
  });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState("");
  const [error, setError]         = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    fetch(`${API}/api/profile/${user.id}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { setProfile(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user.id]);

  const save = async () => {
    setSaving(true); setMsg(""); setError("");
    const res  = await fetch(`${API}/api/profile/${user.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify(profile)
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) setMsg("✅ Profile saved successfully!");
    else setError(data.error);
  };

  const deleteAccount = async () => {
    if (deleteInput !== "DELETE") return setError("Please type DELETE exactly to confirm");
    const res = await fetch(`${API}/api/profile/${user.id}`, {
      method: "DELETE", credentials: "include"
    });
    if (res.ok) onLogout();
    else setError("Failed to delete account. Try again.");
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading) return (
    <div className="settings-overlay">
      <div className="settings-card">
        <p style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="settings-overlay" onClick={e => e.target.className === "settings-overlay" && onClose()}>
      <div className="settings-card">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#1e293b", fontWeight: "700" }}>⚙️ Settings</h2>
          <button onClick={onClose} style={{
            background: "#f1f5f9", border: "none", borderRadius: "8px",
            width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: "#64748b"
          }}>✕</button>
        </div>

        {msg   && <div className="success-msg">{msg}</div>}
        {error && <div className="error-msg">{error}</div>}

        {/* Unique ID Badge */}
        <div style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          borderRadius: "14px", padding: "20px", marginBottom: "24px", textAlign: "center"
        }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
            Your Unique Patient ID
          </p>
          <p style={{ color: "#fff", fontSize: "32px", fontWeight: "800", letterSpacing: "10px", margin: "0 0 6px 0" }}>
            {profile.unique_id || "—"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>
            Share this ID with your doctor to get medical records
          </p>
        </div>

        {/* Account Info (read only) */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={sectionHead}>Account Info</h3>
          <div style={infoBox}>
            <p style={infoLabel}>Email</p>
            <p style={infoValue}>{profile.email}</p>
          </div>
          <div style={{ ...infoBox, marginTop: "8px" }}>
            <p style={infoLabel}>Role</p>
            <p style={{ ...infoValue, textTransform: "capitalize" }}>{profile.role}</p>
          </div>
          {profile.role === "doctor" && (
            <div style={{ ...infoBox, marginTop: "8px" }}>
              <p style={infoLabel}>Specialization</p>
              <p style={infoValue}>{profile.specialization || "Not set"}</p>
            </div>
          )}
        </div>

        {/* Personal Info */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={sectionHead}>Personal Info</h3>

          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} value={profile.name || ""}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            placeholder="Full Name" />

          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} value={profile.phone || ""}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX" />

          <label style={labelStyle}>Age</label>
          <input style={inputStyle} value={profile.age || ""}
            onChange={e => setProfile({ ...profile, age: e.target.value })}
            placeholder="e.g. 25" type="number" />
        </div>

        {/* Medical Info */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={sectionHead}>Medical Info</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input style={inputStyle} value={profile.weight || ""}
                onChange={e => setProfile({ ...profile, weight: e.target.value })}
                placeholder="e.g. 70" type="number" />
            </div>
            <div>
              <label style={labelStyle}>Height (cm)</label>
              <input style={inputStyle} value={profile.height || ""}
                onChange={e => setProfile({ ...profile, height: e.target.value })}
                placeholder="e.g. 175" type="number" />
            </div>
          </div>

          <label style={labelStyle}>Blood Group</label>
          <select style={inputStyle} value={profile.blood_group || ""}
            onChange={e => setProfile({ ...profile, blood_group: e.target.value })}>
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>

        {/* Save Button */}
        <button className="btn-primary" onClick={save} disabled={saving} style={{ marginBottom: "24px" }}>
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>

        {/* Danger Zone */}
        <div style={{ borderTop: "2px solid #fee2e2", paddingTop: "20px" }}>
          <h3 style={{ ...sectionHead, color: "#ef4444" }}>Danger Zone</h3>
          {!showDelete ? (
            <button onClick={() => { setShowDelete(true); setError(""); }} style={{
              width: "100%", padding: "12px", background: "none",
              border: "2px solid #fecaca", borderRadius: "10px",
              color: "#ef4444", fontWeight: "600", cursor: "pointer", fontSize: "14px"
            }}>
              🗑️ Delete Account Permanently
            </button>
          ) : (
            <div style={{ background: "#fff5f5", borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: "#ef4444", fontWeight: "700", margin: "0 0 6px 0" }}>⚠️ This cannot be undone!</p>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 12px 0" }}>
                All your appointments, medical records, and account data will be permanently deleted.
                Type <strong>DELETE</strong> to confirm.
              </p>
              <input
                style={{ ...inputStyle, borderColor: "#fca5a5", marginBottom: "10px" }}
                placeholder="Type DELETE to confirm"
                value={deleteInput}
                onChange={e => { setDeleteInput(e.target.value); setError(""); }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setShowDelete(false); setDeleteInput(""); setError(""); }}
                  style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#64748b" }}>
                  Cancel
                </button>
                <button onClick={deleteAccount}
                  style={{ flex: 1, padding: "10px", background: "#ef4444", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "700" }}>
                  Delete Forever
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const sectionHead = {
  fontSize: "11px", color: "#94a3b8", textTransform: "uppercase",
  letterSpacing: "1px", marginBottom: "10px", marginTop: "0", fontWeight: "700"
};
const infoBox   = { background: "#f8fafc", borderRadius: "10px", padding: "12px 14px" };
const infoLabel = { margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" };
const infoValue = { margin: "2px 0 0 0", fontSize: "15px", color: "#1e293b", fontWeight: "500" };
const labelStyle = {
  display: "block", fontSize: "12px", color: "#64748b",
  fontWeight: "600", marginBottom: "4px", marginTop: "10px"
};
const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0",
  borderRadius: "8px", fontSize: "14px", color: "#1e293b",
  background: "#fff", boxSizing: "border-box", outline: "none", marginBottom: "2px"
};