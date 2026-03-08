import { useState } from "react";
import PatientLogin from "./PatientLogin";
import DoctorLogin  from "./DoctorLogin";

export default function LoginSelector({ onLogin, goRegister }) {
  const [role, setRole]       = useState(null);
  const [hovered, setHovered] = useState(null);

  if (role === "patient") return <PatientLogin onLogin={onLogin} goRegister={goRegister} goBack={() => setRole(null)} />;
  if (role === "doctor")  return <DoctorLogin  onLogin={onLogin} goBack={() => setRole(null)} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e1b4b 0%, #1e3a5f 50%, #1e293b 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      overflow: "hidden",
      position: "relative"
    }}>

      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Glow blobs — lighter */}
      <div style={{ position:"absolute", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)", top:"-150px", left:"-150px", zIndex:0 }} />
      <div style={{ position:"absolute", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)", bottom:"-150px", right:"-150px", zIndex:0 }} />

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"52px", position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"44px", marginBottom:"12px" }}>💊</div>
        <h1 style={{ color:"#fff", fontSize:"36px", fontWeight:"900", margin:"0 0 8px 0", letterSpacing:"-1px" }}>
          TeleMed <span style={{ color:"#a5b4fc" }}>AI</span>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", margin:0, letterSpacing:"3px", textTransform:"uppercase" }}>
          AI-Powered Telemedicine Platform
        </p>
      </div>

      {/* Cards */}
      <div style={{ display:"flex", gap:"32px", position:"relative", zIndex:2, flexWrap:"wrap", justifyContent:"center" }}>

        {/* Patient Card */}
        <div
          onClick={() => setRole("patient")}
          onMouseEnter={() => setHovered("patient")}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: "300px",
            background: "linear-gradient(145deg, rgba(129,140,248,0.3), rgba(99,102,241,0.2))",
            border: "1px solid rgba(165,180,252,0.45)",
            borderRadius: "24px",
            padding: "40px 32px",
            cursor: "pointer",
            backdropFilter: "blur(24px)",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
            transform: hovered === "patient"
              ? "perspective(800px) rotateY(5deg) rotateX(-2deg) scale(1.02) translateZ(20px)"
              : hovered === "doctor"
              ? "perspective(800px) rotateY(2deg) scale(0.97) translateZ(-10px)"
              : "perspective(800px) rotateY(0deg) scale(1)",
            boxShadow: hovered === "patient"
              ? "-20px 30px 80px rgba(129,140,248,0.4), 0 0 0 1px rgba(165,180,252,0.5)"
              : "0 8px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ position:"absolute", top:"-50%", left:"-50%", width:"200%", height:"200%", background:"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:"2px", background:"linear-gradient(90deg, transparent, #a5b4fc, transparent)", borderRadius:"2px" }} />

          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ width:"70px", height:"70px", borderRadius:"20px", background:"linear-gradient(135deg, #6366f1, #a5b4fc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"34px", marginBottom:"20px", boxShadow:"0 8px 24px rgba(99,102,241,0.45)" }}>🧑‍💼</div>
            <h2 style={{ color:"#fff", fontSize:"22px", fontWeight:"800", margin:"0 0 8px 0" }}>Patient Portal</h2>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", margin:"0 0 28px 0", lineHeight:"1.6" }}>Your personal health dashboard</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"32px" }}>
              {["Book appointments","AI symptom checker","Medical records","Video consult"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#a5b4fc", flexShrink:0 }} />
                  <span style={{ color:"rgba(255,255,255,0.8)", fontSize:"13px" }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{
              width:"100%", padding:"13px",
              background: hovered === "patient" ? "linear-gradient(135deg,#6366f1,#a5b4fc)" : "rgba(129,140,248,0.25)",
              border:"1px solid rgba(165,180,252,0.55)", borderRadius:"12px", color:"#fff",
              fontWeight:"700", fontSize:"14px", cursor:"pointer", transition:"all 0.3s"
            }}>
              {hovered === "patient" ? "Enter Patient Portal →" : "Patient Login →"}
            </button>
          </div>
        </div>

        {/* Center OR */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <div style={{ width:"1px", height:"80px", background:"linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)" }} />
          <span style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", fontWeight:"700", letterSpacing:"2px" }}>OR</span>
          <div style={{ width:"1px", height:"80px", background:"linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)" }} />
        </div>

        {/* Doctor Card */}
        <div
          onClick={() => setRole("doctor")}
          onMouseEnter={() => setHovered("doctor")}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: "300px",
            background: "linear-gradient(145deg, rgba(56,189,248,0.25), rgba(14,165,233,0.15))",
            border: "1px solid rgba(125,211,252,0.4)",
            borderRadius: "24px",
            padding: "40px 32px",
            cursor: "pointer",
            backdropFilter: "blur(24px)",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
            transform: hovered === "doctor"
              ? "perspective(800px) rotateY(-5deg) rotateX(-2deg) scale(1.02) translateZ(20px)"
              : hovered === "patient"
              ? "perspective(800px) rotateY(-2deg) scale(0.97) translateZ(-10px)"
              : "perspective(800px) rotateY(0deg) scale(1)",
            boxShadow: hovered === "doctor"
              ? "20px 30px 80px rgba(56,189,248,0.35), 0 0 0 1px rgba(125,211,252,0.45)"
              : "0 8px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ position:"absolute", top:"-50%", left:"-50%", width:"200%", height:"200%", background:"radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:"2px", background:"linear-gradient(90deg, transparent, #7dd3fc, transparent)", borderRadius:"2px" }} />

          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ width:"70px", height:"70px", borderRadius:"20px", background:"linear-gradient(135deg, #0284c7, #38bdf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"34px", marginBottom:"20px", boxShadow:"0 8px 24px rgba(14,165,233,0.4)" }}>👨‍⚕️</div>
            <h2 style={{ color:"#fff", fontSize:"22px", fontWeight:"800", margin:"0 0 8px 0" }}>Doctor Portal</h2>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"13px", margin:"0 0 28px 0", lineHeight:"1.6" }}>Your professional medical dashboard</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"32px" }}>
              {["Manage appointments","Patient records","Video consultations","Search by patient ID"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#7dd3fc", flexShrink:0 }} />
                  <span style={{ color:"rgba(255,255,255,0.8)", fontSize:"13px" }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{
              width:"100%", padding:"13px",
              background: hovered === "doctor" ? "linear-gradient(135deg,#0284c7,#38bdf8)" : "rgba(56,189,248,0.2)",
              border:"1px solid rgba(125,211,252,0.5)", borderRadius:"12px", color:"#fff",
              fontWeight:"700", fontSize:"14px", cursor:"pointer", transition:"all 0.3s"
            }}>
              {hovered === "doctor" ? "Enter Doctor Portal →" : "Doctor Login →"}
            </button>
          </div>
        </div>

      </div>

      {/* Footer — bigger */}
      <div style={{ position:"relative", zIndex:2, marginTop:"48px", textAlign:"center" }}>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"15px", margin:"0 0 8px 0" }}>
          New to TeleMed AI?
        </p>
        <button
          onClick={goRegister}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700",
            padding: "12px 32px",
            cursor: "pointer",
            letterSpacing: "0.3px",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)";  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
        >
          Create Account →
        </button>
      </div>

    </div>
  );
}