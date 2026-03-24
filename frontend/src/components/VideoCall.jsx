import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ]
};

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  .vc-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0a0a1a;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
  }
  .vc-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 800px 600px at 20% 30%, rgba(99,102,241,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 600px 500px at 80% 70%, rgba(14,165,233,0.1) 0%, transparent 70%);
  }
  .vc-header {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 32px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
  }
  .vc-brand { font-family:'Sora',sans-serif; font-size:18px; font-weight:700; color:#fff; display:flex; align-items:center; gap:10px; }
  .vc-room-badge {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px; padding: 5px 16px;
    font-size: 12px; color: rgba(255,255,255,0.6); font-family: monospace;
  }
  .vc-status {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 100px;
    font-size: 13px; font-weight: 600;
    transition: all 0.3s;
  }
  .vc-status.waiting  { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
  .vc-status.connected { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
  .vc-status-dot { width:8px; height:8px; border-radius:50%; }
  .vc-status.waiting  .vc-status-dot { background:#fbbf24; animation: vcPulse 1.5s infinite; }
  .vc-status.connected .vc-status-dot { background:#34d399; }
  @keyframes vcPulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .vc-videos {
    position: relative; z-index: 5;
    flex: 1; display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; padding: 24px 32px; align-items: center;
  }
  .vc-video-box {
    position: relative; border-radius: 20px; overflow: hidden;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    aspect-ratio: 16/9;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }
  .vc-video-box video {
    width: 100%; height: 100%; object-fit: cover; border-radius: 20px;
  }
  .vc-video-label {
    position: absolute; bottom: 14px; left: 14px;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
    border-radius: 100px; padding: 4px 14px;
    font-size: 12px; font-weight: 600; color: #fff;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .vc-video-waiting {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
  }
  .vc-waiting-spinner {
    width: 48px; height: 48px; border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: #6366f1;
    animation: vcSpin 1s linear infinite;
  }
  @keyframes vcSpin { to { transform: rotate(360deg); } }

  .vc-controls {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: center; gap: 16px;
    padding: 24px 32px 32px;
  }
  .vc-btn {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px; padding: 14px 20px; cursor: pointer;
    transition: all 0.2s; color: #fff; min-width: 72px;
    backdrop-filter: blur(8px);
  }
  .vc-btn:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }
  .vc-btn.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); }
  .vc-btn.danger { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #f87171; }
  .vc-btn.danger:hover { background: rgba(239,68,68,0.25); }
  .vc-btn-icon { font-size: 22px; }
  .vc-btn-label { font-size: 10px; font-weight: 600; opacity: 0.7; letter-spacing: 0.3px; }

  .vc-timer {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px; padding: 10px 24px;
    font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700;
    color: #fff; letter-spacing: 2px;
  }
  .vc-note {
    position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
    font-size: 11px; color: rgba(255,255,255,0.25); white-space: nowrap;
  }
`;
document.head.appendChild(style);

export default function VideoCall({ room, user, onLeave, appointmentData }) {
  const localRef  = useRef(null);
  const remoteRef = useRef(null);
  const pcRef     = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const startTimeRef = useRef(null);
  const callIdRef    = useRef(null);
  const timerRef     = useRef(null);

  const [connected, setConnected] = useState(false);
  const [muted,     setMuted]     = useState(false);
  const [videoOff,  setVideoOff]  = useState(false);
  const [elapsed,   setElapsed]   = useState(0);

  // Start call on backend — save to video_calls table
  const startCallRecord = async () => {
    try {
      const res = await fetch(`${API}/api/calls/start`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room,
          patient_id: appointmentData?.patient_id || (user.role === "patient" ? user.id : null),
          doctor_id:  appointmentData?.doctor_id  || (user.role === "doctor"  ? user.id : null),
        })
      });
      const data = await res.json();
      callIdRef.current = data.call_id;
      startTimeRef.current = Date.now();
      // start timer
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (e) { console.error("Call start error:", e); }
  };

  // End call on backend
  const endCallRecord = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const durationSecs = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
    const mins = Math.floor(durationSecs / 60);
    const secs = durationSecs % 60;
    const durationStr = `${mins}m ${secs}s`;
    try {
      await fetch(`${API}/api/calls/end`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, duration: durationStr })
      });
    } catch (e) { console.error("Call end error:", e); }
  };

  useEffect(() => {
    startCallRecord();
    initCall();
    return () => cleanup();
  }, []);

  const initCall = async () => {
    const socket = io(API);
    socketRef.current = socket;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    localRef.current.srcObject = stream;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
      setConnected(true);
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate", { room, candidate: e.candidate });
    };

    socket.emit("join-room", { room, userId: user.id });

    socket.on("user-joined", async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { room, offer });
    });
    socket.on("offer", async ({ offer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { room, answer });
    });
    socket.on("answer", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
    socket.on("ice-candidate", async ({ candidate }) => {
      try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
    });
    socket.on("user-left", () => {
      setConnected(false);
      if (remoteRef.current) remoteRef.current.srcObject = null;
    });
  };

  const cleanup = async () => {
    await endCallRecord();
    if (socketRef.current) { socketRef.current.emit("leave-room", { room }); socketRef.current.disconnect(); }
    if (pcRef.current) pcRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const leave = async () => { await cleanup(); onLeave(); };

  const toggleMute  = () => { streamRef.current.getAudioTracks().forEach(t => t.enabled = muted);    setMuted(!muted); };
  const toggleVideo = () => { streamRef.current.getVideoTracks().forEach(t => t.enabled = videoOff); setVideoOff(!videoOff); };

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="vc-root">
      <div className="vc-bg" />

      {/* Header */}
      <div className="vc-header">
        <div className="vc-brand">📹 TeleMed AI <span style={{color:"rgba(255,255,255,0.3)"}}>|</span> Video Consult</div>
        <span className="vc-room-badge">Room: {room}</span>
        <div className={`vc-status ${connected ? "connected" : "waiting"}`}>
          <div className="vc-status-dot" />
          {connected ? "Connected" : "Waiting for participant..."}
        </div>
      </div>

      {/* Videos */}
      <div className="vc-videos">
        <div className="vc-video-box">
          <video ref={localRef} autoPlay muted playsInline />
          <div className="vc-video-label">You — {user.name}</div>
        </div>
        <div className="vc-video-box">
          <video ref={remoteRef} autoPlay playsInline />
          {!connected && (
            <div className="vc-video-waiting">
              <div className="vc-waiting-spinner" />
              <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", margin:0}}>Waiting for other participant...</p>
            </div>
          )}
          {connected && <div className="vc-video-label">Remote Participant</div>}
        </div>
      </div>

      {/* Controls */}
      <div className="vc-controls">
        <button className={`vc-btn ${muted ? "active" : ""}`} onClick={toggleMute}>
          <span className="vc-btn-icon">{muted ? "🔇" : "🎙️"}</span>
          <span className="vc-btn-label">{muted ? "Unmute" : "Mute"}</span>
        </button>
        <button className={`vc-btn ${videoOff ? "active" : ""}`} onClick={toggleVideo}>
          <span className="vc-btn-icon">{videoOff ? "📷" : "📸"}</span>
          <span className="vc-btn-label">{videoOff ? "Start Cam" : "Stop Cam"}</span>
        </button>

        {connected && (
          <div className="vc-timer">{fmt(elapsed)}</div>
        )}

        <button className="vc-btn danger" onClick={leave}>
          <span className="vc-btn-icon">📵</span>
          <span className="vc-btn-label">End Call</span>
        </button>
      </div>

      <p className="vc-note">🔒 Peer-to-peer via WebRTC — No recording, no server storage</p>
    </div>
  );
}