import { useState } from "react";
import API from "../api";

export default function Login({ onLogin, goRegister }) {
  const [view, setView]       = useState("login");
  const [form, setForm]       = useState({ email: "", password: "" });
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode]   = useState("");
  const [fpPass, setFpPass]   = useState("");
  const [error, setError]     = useState("");
  const [msg, setMsg]         = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer]     = useState(0);

  const startTimer = () => {
    setTimer(60);
    const iv = setInterval(() => setTimer(p => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; }), 1000);
  };

  const submit = async () => {
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) onLogin(data); else setError(data.error);
  };

  const sendResetCode = async () => {
    if (!fpEmail) return setError("Please enter your email");
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/forgot-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setMsg(`Reset code sent to ${fpEmail}`); setView("reset"); startTimer(); }
    else setError(data.error);
  };

  const resetPassword = async () => {
    if (!fpCode || !fpPass) return setError("All fields are required");
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/reset-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail, code: fpCode, new_password: fpPass })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg("✅ Password reset! Redirecting...");
      setTimeout(() => { setView("login"); setMsg(""); setFpEmail(""); setFpCode(""); setFpPass(""); }, 2000);
    } else setError(data.error);
  };

  const resendCode = async () => {
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/forgot-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setMsg("New code sent!"); startTimer(); } else setError(data.error);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>💊 TeleMed AI</h2>

        {view === "login" && (
          <>
            <p className="subtitle">AI-Powered Telemedicine Platform</p>
            <h3>Sign In</h3>
            {error && <div className="error-msg">{error}</div>}
            {msg   && <div className="success-msg">{msg}</div>}
            <input placeholder="Email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && submit()} />
            <div style={{ textAlign: "right", marginBottom: "14px", marginTop: "-8px" }}>
              <button className="link-btn" onClick={() => { setView("forgot"); setError(""); setMsg(""); }}>
                Forgot Password?
              </button>
            </div>
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p style={{ marginTop: "16px" }}>
              Don't have an account?{" "}
              <button className="link-btn" onClick={goRegister}>Register</button>
            </p>
          </>
        )}

        {view === "forgot" && (
          <>
            <h3>Forgot Password</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Enter your registered email — we'll send a reset code.
            </p>
            {error && <div className="error-msg">{error}</div>}
            {msg   && <div className="success-msg">{msg}</div>}
            <input placeholder="Your registered email" type="email" value={fpEmail}
              onChange={e => setFpEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendResetCode()} />
            <button className="btn-primary" onClick={sendResetCode} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code →"}
            </button>
            <p style={{ marginTop: "16px" }}>
              <button className="link-btn" onClick={() => { setView("login"); setError(""); setMsg(""); }}>
                ← Back to Login
              </button>
            </p>
          </>
        )}

        {view === "reset" && (
          <>
            <h3>Reset Password</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Code sent to <strong>{fpEmail}</strong>
            </p>
            {error && <div className="error-msg">{error}</div>}
            {msg   && <div className="success-msg">{msg}</div>}
            <input placeholder="Enter 6-digit code" value={fpCode} maxLength={6}
              onChange={e => setFpCode(e.target.value.replace(/\D/g, ""))}
              style={{ fontSize: "22px", letterSpacing: "8px", textAlign: "center" }} />
            <input placeholder="New Password (min 6 characters)" type="password" value={fpPass}
              onChange={e => setFpPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && resetPassword()} />
            <button className="btn-primary" onClick={resetPassword} disabled={loading}>
              {loading ? "Resetting..." : "✓ Reset Password"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "14px" }}>
              <button className="link-btn" onClick={() => { setView("forgot"); setError(""); setMsg(""); }}>
                ← Change email
              </button>
              <button className="link-btn" onClick={resendCode} disabled={timer > 0 || loading}
                style={{ color: timer > 0 ? "#94a3b8" : "#6366f1" }}>
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
