import { useState, useEffect } from "react";
import "./App.css";
import LoginSelector    from "./components/LoginSelector";
import Register         from "./components/Register";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard  from "./components/DoctorDashboard";
import SymptomChecker   from "./components/SymptomChecker";
import Appointments     from "./components/Appointments";
import VideoCall        from "./components/VideoCall";
import MedicalRecords   from "./components/MedicalRecords";
import Navbar           from "./components/Navbar";
import CallHistory      from "./components/CallHistory";

export default function App() {
  const [page,        setPage]        = useState("login");
  const [user,        setUser]        = useState(null);
  const [callRoom,    setCallRoom]    = useState(null);
  const [callAptData, setCallAptData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tm_user");
    if (saved) { setUser(JSON.parse(saved)); setPage("dashboard"); }
  }, []);

  const login = (u) => {
    setUser(u);
    localStorage.setItem("tm_user", JSON.stringify(u));
    setPage("dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tm_user");
    setPage("login");
  };

  // Called from Appointments — passes room string + appointment row
  const startCall = (room, aptData = null) => {
    setCallRoom(room);
    setCallAptData(aptData);
  };

  // Full-screen VideoCall (no navbar)
  if (user && callRoom) return (
    <VideoCall
      room={callRoom}
      user={user}
      appointmentData={callAptData}
      onLeave={() => { setCallRoom(null); setCallAptData(null); }}
    />
  );

  if (!user) return (
    page === "login"
      ? <LoginSelector onLogin={login} goRegister={() => setPage("register")} />
      : <Register onDone={() => setPage("login")} goLogin={() => setPage("login")} />
  );

  return (
    <div className="app">
      <Navbar user={user} page={page} setPage={setPage} onLogout={logout} />
      <main className="main-content">
        {page === "dashboard"    && user.role === "doctor"  && <DoctorDashboard  user={user} setPage={setPage} />}
        {page === "dashboard"    && user.role === "patient" && <PatientDashboard user={user} setPage={setPage} />}
        {page === "appointments" && <Appointments   user={user} startCall={startCall} />}
        {page === "symptoms"     && <SymptomChecker user={user} />}
        {page === "records"      && <MedicalRecords user={user} />}
        {page === "calls"        && <CallHistory    user={user} />}
        {page === "video"        && (
          <VideoCall
            room={`room-${user.id}`}
            user={user}
            appointmentData={null}
            onLeave={() => setPage("dashboard")}
          />
        )}
      </main>
    </div>
  );
}