import { useState } from "react";
import API from "../api";

export default function DoctorLogin({ onLogin, goBack }) {
  const [form, setForm]         = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async () => {
    setLoading(true); setError("");
    const res  = await fetch(`${API}/api/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      if (data.role !== "doctor") return setError("This portal is for doctors only. Please use Patient login.");
      onLogin(data);
    } else setError(data.error);
  };

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>

      {/* ── Left Panel ── */}
      <div style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 55%, #0c4a6e 100%)",
        padding:"60px 48px", display:"flex", alignItems:"center",
        position:"relative", overflow:"hidden"
      }}>
        <div style={{ position:"absolute", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.04)", bottom:"-100px", right:"-100px" }} />
        <div style={{ position:"absolute", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,255,255,0.03)", top:"-60px", left:"-60px" }} />
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ fontSize:"52px", marginBottom:"20px" }}>👨‍⚕️</div>
          <h1 style={{ color:"#fff", fontSize:"32px", fontWeight:"800", margin:"0 0 12px 0" }}>Doctor Portal</h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", lineHeight:"1.6", margin:"0 0 40px 0" }}>
            Manage your patients, appointments, and medical practice — all in one place.
          </p>
          {[
            { icon:"📅", text:"Manage appointments" },
            { icon:"📋", text:"Access patient records" },
            { icon:"📹", text:"Video consultations" },
            { icon:"🔍", text:"Search patients by ID" },
            { icon:"📞", text:"View call history" },
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
        background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #f0f9ff 100%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"40px", position:"relative", overflow:"hidden"
      }}>
        {/* Decorative bg */}
        <div style={{ position:"absolute", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", top:"-100px", right:"-100px" }} />
        <div style={{ position:"absolute", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)", bottom:"-80px", left:"-80px" }} />

        {/* Dots */}
        {[
          { top:"15%", left:"10%", size:"8px", color:"rgba(14,165,233,0.3)" },
          { top:"25%", right:"12%", size:"12px", color:"rgba(56,189,248,0.25)" },
          { bottom:"30%", left:"8%", size:"10px", color:"rgba(14,165,233,0.2)" },
          { bottom:"20%", right:"10%", size:"6px", color:"rgba(125,211,252,0.4)" },
          { top:"60%", left:"15%", size:"5px", color:"rgba(14,165,233,0.25)" },
        ].map((d, i) => (
          <div key={i} style={{ position:"absolute", width:d.size, height:d.size, borderRadius:"50%", background:d.color, top:d.top, left:d.left, right:d.right, bottom:d.bottom }} />
        ))}

        {/* Grid pattern */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(rgba(14,165,233,0.08) 1.5px, transparent 1.5px)",
          backgroundSize:"28px 28px"
        }} />

        {/* Card */}
        <div style={{
          background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)",
          borderRadius:"24px", padding:"40px 36px",
          width:"100%", maxWidth:"420px",
          boxShadow:"0 20px 60px rgba(14,165,233,0.12), 0 4px 20px rgba(0,0,0,0.06)",
          border:"1px solid rgba(14,165,233,0.15)",
          position:"relative", zIndex:2
        }}>
          <button onClick={goBack} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontWeight:"600", fontSize:"13px", marginBottom:"24px", padding:"0", display:"flex", alignItems:"center", gap:"4px" }}>← Back</button>

          <div style={{ marginBottom:"32px" }}>
            <h2 style={{ margin:"0 0 6px 0", fontSize:"26px", fontWeight:"800", color:"#0f172a" }}>Welcome back, Doctor 👋</h2>
            <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Sign in to your doctor account</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <label style={lbl}>Email Address</label>
          <input placeholder="your@clinic.com" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={inp} />

          <label style={lbl}>Password</label>
          <div style={{ position:"relative", marginBottom:"24px" }}>
            <input placeholder="Enter your password"
              type={showPass ? "text" : "password"} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ ...inp, marginBottom:"0", paddingRight:"44px" }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:"#94a3b8" }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={submit} disabled={loading} style={{
            width:"100%", padding:"14px",
            background:"linear-gradient(135deg, #0284c7, #0ea5e9)",
            color:"#fff", border:"none", borderRadius:"12px",
            fontSize:"15px", fontWeight:"700", cursor:"pointer", transition:"all 0.2s"
          }}>
            {loading ? "Signing in..." : "Sign In to Portal →"}
          </button>

          <div style={{ marginTop:"24px", padding:"16px", background:"rgba(14,165,233,0.06)", borderRadius:"12px", border:"1px solid rgba(14,165,233,0.15)" }}>
            <p style={{ margin:0, fontSize:"12px", color:"#64748b", lineHeight:"1.6" }}>
              🔒 <strong>Secure Access</strong> — This portal is exclusively for registered medical professionals. All sessions are encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const lbl = { display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px" };
const inp = { width:"100%", padding:"12px 16px", border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"14px", color:"#1e293b", background:"#f8fafc", boxSizing:"border-box", outline:"none", marginBottom:"16px", transition:"border-color 0.2s" };