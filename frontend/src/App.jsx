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
  const [page, setPage]         = useState("login");
  const [user, setUser]         = useState(null);
  const [callRoom, setCallRoom] = useState(null);

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

  if (!user) return (
    page === "login"
      ? <LoginSelector onLogin={login} goRegister={() => setPage("register")} />
      : <Register onDone={() => setPage("login")} goLogin={() => setPage("login")} />
  );

  if (callRoom) return (
    <VideoCall room={callRoom} user={user} onLeave={() => setCallRoom(null)} />
  );

  return (
    <div className="app">
      <Navbar user={user} page={page} setPage={setPage} onLogout={logout} />
      <main className="main-content">
        {page === "dashboard" && user.role === "doctor"  && <DoctorDashboard  user={user} setPage={setPage} />}
        {page === "dashboard" && user.role === "patient" && <PatientDashboard user={user} setPage={setPage} />}
        {page === "appointments" && <Appointments   user={user} startCall={setCallRoom} />}
        {page === "symptoms"     && <SymptomChecker user={user} />}
        {page === "records"      && <MedicalRecords user={user} />}
        {page === "video"        && <VideoCall room={`room-${user.id}`} user={user} onLeave={() => setPage("dashboard")} />}
        {page === "calls"        && <CallHistory user={user} />}
      </main>
    </div>
  );
}