import { useState } from "react";
import API from "../api";

export default function Register({ onDone, goLogin }) {
  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState({ name: "", email: "", password: "", role: "patient" });
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState("");
  const [error, setError]       = useState("");
  const [timer, setTimer]       = useState(0);
  const [showPass, setShowPass] = useState(false);

  const startTimer = () => {
    setTimer(60);
    const iv = setInterval(() => setTimer(p => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; }), 1000);
  };

  const sendOtp = async () => {
    if (!form.name || !form.email || !form.password) return setError("All fields are required");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/send-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setMsg(`Code sent to ${form.email}`); setStep(2); startTimer(); }
    else setError(data.error);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return setError("Enter the 6-digit code");
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, code: otp })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setMsg("✅ Registration successful! Redirecting..."); setTimeout(onDone, 2000); }
    else setError(data.error);
  };

  const resendOtp = async () => {
    setLoading(true); setError(""); setMsg("");
    const res  = await fetch(`${API}/api/resend-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setMsg("New code sent!"); startTimer(); } else setError(data.error);
  };

  const EyeBtn = ({ show, toggle }) => (
    <button onClick={toggle} style={{
      position: "absolute", right: "12px", top: "50%",
      transform: "translateY(-50%)", background: "none",
      border: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8"
    }}>
      {show ? "🙈" : "👁️"}
    </button>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>💊 TeleMed AI</h2>
        <h3>{step === 1 ? "Create Account" : "Verify Email"}</h3>

        <div className="otp-steps">
          <div className={`otp-step ${step >= 1 ? "active" : ""}`}>1. Details</div>
          <div className="otp-step-line" />
          <div className={`otp-step ${step >= 2 ? "active" : ""}`}>2. Verify</div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {msg   && <div className="success-msg">{msg}</div>}

        {step === 1 && (
          <>
            <input placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email Address" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <input
                placeholder="Password (min 6 characters)"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ marginBottom: "0", paddingRight: "44px" }}
              />
              <EyeBtn show={showPass} toggle={() => setShowPass(!showPass)} />
            </div>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            <button className="btn-primary" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending code..." : "Send Verification Code →"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
              Enter the 6-digit code sent to <strong>{form.email}</strong>
            </p>
            <input placeholder="Enter 6-digit code" value={otp} maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && verifyOtp()}
              style={{ fontSize: "24px", letterSpacing: "8px", textAlign: "center" }} />
            <button className="btn-primary" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "✓ Verify & Register"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "14px" }}>
              <button className="link-btn" onClick={() => { setStep(1); setError(""); setMsg(""); }}>
                ← Change details
              </button>
              <button className="link-btn" onClick={resendOtp} disabled={timer > 0 || loading}
                style={{ color: timer > 0 ? "#94a3b8" : "#6366f1" }}>
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </div>
          </>
        )}

        <p style={{ marginTop: "16px" }}>
          Already have an account?{" "}
          <button className="link-btn" onClick={goLogin}>Sign In</button>
        </p>
      </div>
    </div>
  );
}
