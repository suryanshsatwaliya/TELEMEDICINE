import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ]
};

export default function VideoCall({ room, user, onLeave }) {
  const localRef  = useRef(null);
  const remoteRef = useRef(null);
  const pcRef     = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted]         = useState(false);
  const [videoOff, setVideoOff]   = useState(false);

  useEffect(() => { initCall(); return () => cleanup(); }, []);

  const initCall = async () => {
    const socket = io(API);
    socketRef.current = socket;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    localRef.current.srcObject = stream;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));

    pc.ontrack = (e) => { remoteRef.current.srcObject = e.streams[0]; setConnected(true); };
    pc.onicecandidate = (e) => { if (e.candidate) socket.emit("ice-candidate", { room, candidate: e.candidate }); };

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
    socket.on("user-left", () => { setConnected(false); if (remoteRef.current) remoteRef.current.srcObject = null; });
  };

  const cleanup = () => {
    if (socketRef.current) { socketRef.current.emit("leave-room", { room }); socketRef.current.disconnect(); }
    if (pcRef.current) pcRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const toggleMute  = () => { streamRef.current.getAudioTracks().forEach(t => t.enabled = muted); setMuted(!muted); };
  const toggleVideo = () => { streamRef.current.getVideoTracks().forEach(t => t.enabled = videoOff); setVideoOff(!videoOff); };
  const leave = () => { cleanup(); onLeave(); };

  return (
    <div className="video-call-page">
      <div className="call-header">
        <h2>📹 Video Consultation — Room: {room}</h2>
        <span className={`call-status ${connected ? "online" : "waiting"}`}>
          {connected ? "🟢 Connected" : "🟡 Waiting for other participant..."}
        </span>
      </div>
      <div className="videos-grid">
        <div className="video-box">
          <video ref={localRef}  autoPlay muted playsInline />
          <label>You ({user.name})</label>
        </div>
        <div className="video-box">
          <video ref={remoteRef} autoPlay playsInline />
          <label>{connected ? "Remote Participant" : "Waiting..."}</label>
        </div>
      </div>
      <div className="call-controls">
        <button className={`ctrl-btn ${muted ? "active" : ""}`} onClick={toggleMute}>
          {muted ? "🔇 Unmute" : "🎙️ Mute"}
        </button>
        <button className={`ctrl-btn ${videoOff ? "active" : ""}`} onClick={toggleVideo}>
          {videoOff ? "📷 Start Video" : "📷 Stop Video"}
        </button>
        <button className="ctrl-btn danger" onClick={leave}>📵 End Call</button>
      </div>
      <p className="webrtc-note">🔒 Peer-to-peer via WebRTC. No recording.</p>
    </div>
  );
}
