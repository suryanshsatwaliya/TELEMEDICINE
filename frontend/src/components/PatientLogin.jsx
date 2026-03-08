import { useState } from "react";
import API from "../api";

export default function PatientLogin({ onLogin, goRegister, goBack }) {
  const [view, setView]         = useState("login");
  const [form, setForm]         = useState({ email: "", password: "" });
  const [fpEmail, setFpEmail]   = useState("");
  const [fpCode, setFpCode]     = useState("");
  const [fpPass, setFpPass]     = useState("");
  const [error, setError]       = useState("");
  const [msg, setMsg]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [timer, setTimer]       = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

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
    if (res.ok) {
      if (data.role === "doctor") return setError("Please use Doctor login instead!");
      onLogin(data);
    } else setError(data.error);
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

  const EyeBtn = ({ show, toggle }) => (
    <button onClick={toggle} style={{
      position: "absolute", right: "12px", top: "50%",
      transform: "translateY(-50%)", background: "none",
      border: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8"
    }}>{show ? "🙈" : "👁️"}</button>
  );

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>

      {/* ── Left Panel ── */}
      <div style={{
        background: "linear-gradient(145deg, #3730a3 0%, #6366f1 60%, #818cf8 100%)",
        padding: "60px 48px", display:"flex", alignItems:"center",
        position:"relative", overflow:"hidden"
      }}>
        <div style={{ position:"absolute", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.06)", bottom:"-100px", right:"-100px" }} />
        <div style={{ position:"absolute", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,255,255,0.05)", top:"-60px", left:"-60px" }} />
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ fontSize:"52px", marginBottom:"20px" }}>🧑‍💼</div>
          <h1 style={{ color:"#fff", fontSize:"32px", fontWeight:"800", margin:"0 0 12px 0" }}>Patient Portal</h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", lineHeight:"1.6", margin:"0 0 40px 0" }}>
            Your health, our priority. Access world-class doctors from the comfort of your home.
          </p>
          {[
            { icon:"📅", text:"Book doctor appointments" },
            { icon:"🩺", text:"AI-powered symptom checker" },
            { icon:"📋", text:"View medical records" },
            { icon:"📹", text:"Video consultations" },
            { icon:"💊", text:"Personalized health insights" },
          ].map(f => (
            <div key={f.text} style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
              <span style={{ fontSize:"20px" }}>{f.icon}</span>
              <span style={{ color:"rgba(255,255,255,0.85)", fontSize:"14px" }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"40px", position:"relative", overflow:"hidden"
      }}>
        {/* Decorative background elements */}
        <div style={{ position:"absolute", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", top:"-100px", right:"-100px" }} />
        <div style={{ position:"absolute", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)", bottom:"-80px", left:"-80px" }} />

        {/* Floating decorative dots */}
        {[
          { top:"15%", left:"10%", size:"8px", color:"rgba(99,102,241,0.3)" },
          { top:"25%", right:"12%", size:"12px", color:"rgba(129,140,248,0.25)" },
          { bottom:"30%", left:"8%", size:"10px", color:"rgba(99,102,241,0.2)" },
          { bottom:"20%", right:"10%", size:"6px", color:"rgba(165,180,252,0.4)" },
          { top:"60%", left:"15%", size:"5px", color:"rgba(99,102,241,0.25)" },
        ].map((d, i) => (
          <div key={i} style={{ position:"absolute", width:d.size, height:d.size, borderRadius:"50%", background:d.color, top:d.top, left:d.left, right:d.right, bottom:d.bottom }} />
        ))}

        {/* Decorative pattern */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(rgba(99,102,241,0.08) 1.5px, transparent 1.5px)",
          backgroundSize:"28px 28px"
        }} />

        {/* Login Card */}
        <div style={{
          background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)",
          borderRadius:"24px", padding:"40px 36px",
          width:"100%", maxWidth:"420px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.06)",
          border:"1px solid rgba(99,102,241,0.15)",
          position:"relative", zIndex:2
        }}>
          <button onClick={goBack} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontWeight:"600", fontSize:"13px", marginBottom:"24px", padding:"0", display:"flex", alignItems:"center", gap:"4px" }}>← Back</button>

          {view === "login" && (
            <>
              <div style={{ marginBottom:"28px" }}>
                <h2 style={{ margin:"0 0 6px 0", fontSize:"26px", fontWeight:"800", color:"#0f172a" }}>Welcome back 👋</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Sign in to your patient account</p>
              </div>
              {error && <div className="error-msg">{error}</div>}
              {msg   && <div className="success-msg">{msg}</div>}
              <label style={lbl}>Email Address</label>
              <input placeholder="your@email.com" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inp} />
              <label style={lbl}>Password</label>
              <div style={{ position:"relative", marginBottom:"8px" }}>
                <input placeholder="Enter your password"
                  type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  style={{ ...inp, marginBottom:"0", paddingRight:"44px" }} />
                <EyeBtn show={showPass} toggle={() => setShowPass(!showPass)} />
              </div>
              <div style={{ textAlign:"right", marginBottom:"20px" }}>
                <button className="link-btn" onClick={() => { setView("forgot"); setError(""); setMsg(""); }}>Forgot Password?</button>
              </div>
              <button onClick={submit} disabled={loading} style={signInBtn("#6366f1","#4338ca")}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
              <p style={{ textAlign:"center", marginTop:"20px", color:"#64748b", fontSize:"14px" }}>
                Don't have an account?{" "}
                <button className="link-btn" onClick={goRegister}>Register here</button>
              </p>
            </>
          )}

          {view === "forgot" && (
            <>
              <div style={{ marginBottom:"24px" }}>
                <h2 style={{ margin:"0 0 6px 0", fontSize:"24px", fontWeight:"800", color:"#0f172a" }}>Forgot Password?</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Enter your email — we'll send a reset code.</p>
              </div>
              {error && <div className="error-msg">{error}</div>}
              {msg   && <div className="success-msg">{msg}</div>}
              <label style={lbl}>Email Address</label>
              <input placeholder="your@email.com" type="email" value={fpEmail}
                onChange={e => setFpEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendResetCode()} style={inp} />
              <button onClick={sendResetCode} disabled={loading} style={signInBtn("#6366f1","#4338ca")}>
                {loading ? "Sending..." : "Send Reset Code →"}
              </button>
              <p style={{ textAlign:"center", marginTop:"16px" }}>
                <button className="link-btn" onClick={() => { setView("login"); setError(""); setMsg(""); }}>← Back to Login</button>
              </p>
            </>
          )}

          {view === "reset" && (
            <>
              <div style={{ marginBottom:"24px" }}>
                <h2 style={{ margin:"0 0 6px 0", fontSize:"24px", fontWeight:"800", color:"#0f172a" }}>Reset Password</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Code sent to <strong>{fpEmail}</strong></p>
              </div>
              {error && <div className="error-msg">{error}</div>}
              {msg   && <div className="success-msg">{msg}</div>}
              <label style={lbl}>Verification Code</label>
              <input placeholder="Enter 6-digit code" value={fpCode} maxLength={6}
                onChange={e => setFpCode(e.target.value.replace(/\D/g, ""))}
                style={{ ...inp, fontSize:"22px", letterSpacing:"8px", textAlign:"center" }} />
              <label style={lbl}>New Password</label>
              <div style={{ position:"relative", marginBottom:"20px" }}>
                <input placeholder="New Password (min 6 characters)"
                  type={showNewPass ? "text" : "password"} value={fpPass}
                  onChange={e => setFpPass(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && resetPassword()}
                  style={{ ...inp, marginBottom:"0", paddingRight:"44px" }} />
                <EyeBtn show={showNewPass} toggle={() => setShowNewPass(!showNewPass)} />
              </div>
              <button onClick={resetPassword} disabled={loading} style={signInBtn("#6366f1","#4338ca")}>
                {loading ? "Resetting..." : "✓ Reset Password"}
              </button>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"14px", fontSize:"13px" }}>
                <button className="link-btn" onClick={() => { setView("forgot"); setError(""); setMsg(""); }}>← Change email</button>
                <button className="link-btn" onClick={resendCode} disabled={timer > 0 || loading}
                  style={{ color: timer > 0 ? "#94a3b8" : "#6366f1" }}>
                  {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const lbl = { display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px" };
const inp = { width:"100%", padding:"12px 16px", border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"14px", color:"#1e293b", background:"#f8fafc", boxSizing:"border-box", outline:"none", marginBottom:"16px", transition:"border-color 0.2s" };
const signInBtn = (c1, c2) => ({
  width:"100%", padding:"14px",
  background:`linear-gradient(135deg, ${c1}, ${c2})`,
  color:"#fff", border:"none", borderRadius:"12px",
  fontSize:"15px", fontWeight:"700", cursor:"pointer", transition:"all 0.2s"
});