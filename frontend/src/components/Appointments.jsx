import { useState, useEffect } from "react";
import API from "../api";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .apt-root { font-family:'DM Sans',sans-serif; background:#f0f2f8; min-height:100vh; padding:0 0 60px; }

  /* Hero */
  .apt-hero {
    position:relative; overflow:hidden;
    background:linear-gradient(120deg,#0c4a6e 0%,#0369a1 40%,#0ea5e9 80%,#38bdf8 100%);
    padding:48px 48px 80px; margin-bottom:-48px;
  }
  .apt-hero-grid {
    position:absolute; inset:0;
    background-image:linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);
    background-size:40px 40px;
  }
  .apt-hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 500px 300px at 80% 50%,rgba(56,189,248,0.3) 0%,transparent 70%);
  }
  .apt-hero-shape { position:absolute; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); }
  .apt-hero-content { position:relative; z-index:2; display:flex; justify-content:space-between; align-items:flex-end; }
  .apt-hero-label {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25);
    border-radius:100px; padding:5px 14px;
    font-size:12px; font-weight:600; color:rgba(255,255,255,0.9);
    letter-spacing:0.5px; text-transform:uppercase; margin-bottom:16px; backdrop-filter:blur(8px);
    width:fit-content;
  }
  .apt-hero-title { font-family:'Sora',sans-serif; font-size:clamp(24px,3.5vw,38px); font-weight:800; color:#fff; margin:0 0 8px; letter-spacing:-0.5px; }
  .apt-hero-sub   { color:rgba(255,255,255,0.65); font-size:15px; margin:0; }
  .apt-book-btn {
    background:#fff; color:#0369a1; border:none; border-radius:14px;
    padding:12px 24px; font-weight:700; font-size:14px; cursor:pointer;
    transition:all 0.2s; white-space:nowrap; flex-shrink:0;
    box-shadow:0 4px 16px rgba(0,0,0,0.15);
  }
  .apt-book-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.2); }
  .apt-book-btn.cancel { background:rgba(255,255,255,0.15); color:#fff; border:1px solid rgba(255,255,255,0.3); box-shadow:none; }

  /* Content */
  .apt-content { padding:0 40px; }

  /* Booking Panel */
  .apt-booking-panel {
    background:#fff; border-radius:24px; padding:32px;
    box-shadow:0 8px 40px rgba(3,105,161,0.12), 0 2px 8px rgba(0,0,0,0.04);
    border:1px solid rgba(14,165,233,0.15); margin-bottom:28px;
    position:relative; z-index:3;
  }
  .apt-panel-title { font-family:'Sora',sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin:0 0 24px; }

  /* Search */
  .apt-search-wrap { position:relative; margin-bottom:16px; }
  .apt-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; }
  .apt-search-input {
    width:100%; padding:12px 16px 12px 42px; border:1.5px solid #e2e8f0;
    border-radius:12px; font-size:14px; font-family:'DM Sans',sans-serif;
    background:#f8fafc; outline:none; box-sizing:border-box;
    transition:border-color 0.2s;
  }
  .apt-search-input:focus { border-color:#0ea5e9; background:#fff; }

  /* Pills */
  .apt-pills { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
  .apt-pill {
    padding:5px 14px; border-radius:100px; border:1.5px solid #e2e8f0;
    cursor:pointer; font-size:12px; font-weight:600; white-space:nowrap;
    background:#f8fafc; color:#64748b; transition:all 0.15s; font-family:'DM Sans',sans-serif;
  }
  .apt-pill:hover { border-color:#0ea5e9; color:#0ea5e9; }
  .apt-pill.active { background:#0ea5e9; border-color:#0ea5e9; color:#fff; }

  /* Doctor Cards Grid */
  .apt-doc-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
    gap:14px; max-height:440px; overflow-y:auto;
    padding-right:4px;
  }
  .apt-doc-grid::-webkit-scrollbar { width:4px; }
  .apt-doc-grid::-webkit-scrollbar-track { background:transparent; }
  .apt-doc-grid::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }

  .apt-doc-card {
    background:#f8fafc; border-radius:16px; padding:18px;
    border:2px solid #e2e8f0; cursor:pointer;
    transition:all 0.2s; position:relative; overflow:hidden;
  }
  .apt-doc-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#0ea5e9,#38bdf8);
    opacity:0; transition:opacity 0.2s;
  }
  .apt-doc-card:hover { border-color:#0ea5e9; background:#f0f9ff; transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,165,233,0.15); }
  .apt-doc-card:hover::before { opacity:1; }

  .apt-doc-avatar {
    width:44px; height:44px; border-radius:12px;
    background:linear-gradient(135deg,#0369a1,#0ea5e9);
    display:flex; align-items:center; justify-content:center;
    font-size:22px; flex-shrink:0;
  }
  .apt-doc-name { font-weight:700; font-size:14px; color:#0f172a; margin:0; }
  .apt-doc-spec { font-size:12px; color:#0ea5e9; font-weight:600; margin:2px 0 0; }
  .apt-doc-meta { font-size:12px; color:#64748b; margin:4px 0 0; }
  .apt-slot-preview { display:flex; gap:4px; flex-wrap:wrap; margin-top:10px; }
  .apt-slot-chip { background:#e0f2fe; color:#0284c7; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:600; }
  .apt-doc-select { font-size:12px; color:#0ea5e9; font-weight:700; text-align:right; margin:10px 0 0; }

  /* Selected Doctor Banner */
  .apt-selected-banner {
    background:linear-gradient(135deg,rgba(14,165,233,0.08),rgba(56,189,248,0.08));
    border:2px solid #0ea5e9; border-radius:14px;
    padding:14px 18px; margin-bottom:20px;
    display:flex; justify-content:space-between; align-items:center;
  }
  .apt-change-btn {
    background:#f1f5f9; border:none; border-radius:8px; padding:6px 14px;
    cursor:pointer; color:#64748b; font-weight:600; font-size:13px;
    font-family:'DM Sans',sans-serif;
  }

  /* Date & Slots */
  .apt-label { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:8px; }
  .apt-date-input {
    width:100%; padding:12px 16px; border:1.5px solid #e2e8f0; border-radius:12px;
    font-size:14px; font-family:'DM Sans',sans-serif; background:#f8fafc;
    outline:none; box-sizing:border-box; margin-bottom:20px; transition:border-color 0.2s;
  }
  .apt-date-input:focus { border-color:#0ea5e9; }

  .apt-time-slots { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
  .apt-time-btn {
    padding:8px 18px; border-radius:10px; border:2px solid #e2e8f0;
    background:#fff; color:#374151; cursor:pointer; font-weight:600;
    font-size:13px; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .apt-time-btn:hover  { border-color:#0ea5e9; color:#0ea5e9; }
  .apt-time-btn.active { border-color:#0ea5e9; background:#0ea5e9; color:#fff; }

  .apt-reason-input {
    width:100%; padding:12px 16px; border:1.5px solid #e2e8f0; border-radius:12px;
    font-size:14px; font-family:'DM Sans',sans-serif; background:#f8fafc;
    outline:none; box-sizing:border-box; resize:vertical; margin-bottom:20px;
    transition:border-color 0.2s;
  }
  .apt-reason-input:focus { border-color:#0ea5e9; }

  .apt-confirm-btn {
    width:100%; padding:14px; background:linear-gradient(135deg,#0369a1,#0ea5e9);
    color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:700;
    cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif;
  }
  .apt-confirm-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,165,233,0.35); }

  /* Appointments List */
  .apt-list-section { position:relative; z-index:3; }
  .apt-section-title { font-family:'Sora',sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0 0 16px; }

  .apt-item {
    background:#fff; border-radius:20px; padding:20px 24px;
    border:1px solid #f1f5f9; margin-bottom:12px;
    box-shadow:0 2px 12px rgba(0,0,0,0.04);
    display:flex; justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:16px;
    transition:transform 0.2s, box-shadow 0.2s;
    position:relative; overflow:hidden;
  }
  .apt-item::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
    border-radius:4px 0 0 4px;
  }
  .apt-item.pending   { border-left:4px solid #f59e0b; }
  .apt-item.confirmed { border-left:4px solid #10b981; }
  .apt-item.cancelled { border-left:4px solid #ef4444; opacity:0.7; }
  .apt-item:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.08); }

  .apt-item-avatar {
    width:48px; height:48px; border-radius:14px;
    background:linear-gradient(135deg,#0369a1,#0ea5e9);
    display:flex; align-items:center; justify-content:center;
    font-size:22px; flex-shrink:0;
  }
  .apt-item-name { font-weight:700; font-size:15px; color:#0f172a; margin:0; }
  .apt-item-meta { font-size:13px; color:#64748b; margin:3px 0 0; }
  .apt-item-reason { font-size:12px; color:#94a3b8; margin:3px 0 0; font-style:italic; }

  .apt-status-badge { padding:4px 12px; border-radius:100px; font-size:12px; font-weight:700; }
  .apt-status-badge.pending   { background:#fef3c7; color:#d97706; }
  .apt-status-badge.confirmed { background:#dcfce7; color:#059669; }
  .apt-status-badge.cancelled { background:#fee2e2; color:#dc2626; }

  .apt-action-btn {
    padding:7px 14px; border-radius:10px; border:none; cursor:pointer;
    font-weight:600; font-size:12px; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .apt-action-btn.green { background:#dcfce7; color:#059669; }
  .apt-action-btn.green:hover { background:#059669; color:#fff; }
  .apt-action-btn.red   { background:#fee2e2; color:#dc2626; }
  .apt-action-btn.red:hover   { background:#dc2626; color:#fff; }
  .apt-action-btn.blue  { background:#dbeafe; color:#2563eb; }
  .apt-action-btn.blue:hover  { background:#2563eb; color:#fff; }

  .apt-empty {
    text-align:center; padding:60px 20px; background:#fff;
    border-radius:20px; border:2px dashed #e2e8f0;
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .apt-anim { animation:fadeUp 0.4s ease both; }
  .apt-anim-1 { animation-delay:0.05s; }
  .apt-anim-2 { animation-delay:0.10s; }
  .apt-anim-3 { animation-delay:0.15s; }
`;
document.head.appendChild(style);

export default function Appointments({ user, startCall }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors,   setDoctors]   = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [specFilter,setSpecFilter]= useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form, setForm]   = useState({ doctor_id:"", date:"", time:"", reason:"" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAppointments();
    if (user.role === "patient") fetchDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (specFilter) result = result.filter(d => d.specialization === specFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        (d.qualification||"").toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, specFilter, doctors]);

  const fetchAppointments = async () => {
    const res = await fetch(`${API}/api/appointments?user_id=${user.id}&role=${user.role}`);
    setAppointments(await res.json());
  };
  const fetchDoctors = async () => {
    const res = await fetch(`${API}/api/doctors`);
    const data = await res.json();
    setDoctors(data); setFiltered(data);
  };
  const selectDoctor = (doc) => { setSelectedDoc(doc); setForm({...form,doctor_id:doc.id,time:""}); };
  const getTimeSlots = () => !selectedDoc?.timeslots ? [] : selectedDoc.timeslots.split(",").map(t=>t.trim());
  const fmtTime = (t) => { const [h,m]=t.split(":"); const hr=parseInt(h); return `${hr>12?hr-12:hr||12}:${m} ${hr>=12?"PM":"AM"}`; };

  const book = async () => {
    if (!form.doctor_id||!form.date||!form.time||!form.reason) return alert("Please fill all fields");
    await fetch(`${API}/api/appointments`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({...form,patient_id:user.id})
    });
    setForm({doctor_id:"",date:"",time:"",reason:""}); setSelectedDoc(null); setShowForm(false);
    fetchAppointments();
  };
  const updateStatus = async (id,status) => {
    await fetch(`${API}/api/appointments/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    fetchAppointments();
  };
  const deleteApt = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await fetch(`${API}/api/appointments/${id}`,{method:"DELETE"}); fetchAppointments();
  };

  const getDoctorEmoji=(name)=>{const f=["priya","neha","sunita","anjali","meera","kavita","pooja","ritu","sneha","shalini","rekha","preethi","nisha","kavitha","seema","usha","anita","smita","radha","deepa","ananya","meena","asha","fatima","geeta"];const n=name.replace("Dr.","").trim().split(" ")[0].toLowerCase();return f.includes(n)?"👩‍⚕️":"👨‍⚕️";};
  const specializations = [...new Set(doctors.map(d=>d.specialization))];

  return (
    <div className="apt-root">
      {/* Hero */}
      <div className="apt-hero">
        <div className="apt-hero-grid" />
        <div className="apt-hero-shape" style={{width:200,height:200,right:-60,top:-60}} />
        <div className="apt-hero-shape" style={{width:100,height:100,right:200,bottom:-30}} />
        <div className="apt-hero-content">
          <div>
            <div className="apt-hero-label">
              <span style={{width:6,height:6,borderRadius:"50%",background:"#7dd3fc",display:"inline-block"}} />
              {user.role === "patient" ? "Patient Portal" : "Doctor Portal"}
            </div>
            <h1 className="apt-hero-title">📅 Appointments</h1>
            <p className="apt-hero-sub">
              {user.role==="patient" ? "Browse specialists and book your consultation" : "Manage patient appointments"}
            </p>
          </div>
          {user.role==="patient" && (
            <button className={`apt-book-btn ${showForm?"cancel":""}`}
              onClick={()=>{setShowForm(!showForm);setSelectedDoc(null);setSearch("");setSpecFilter("");}}>
              {showForm ? "✕ Cancel" : "+ Book Appointment"}
            </button>
          )}
        </div>
      </div>

      <div className="apt-content">
        {/* Booking Panel */}
        {showForm && user.role==="patient" && (
          <div className="apt-booking-panel apt-anim apt-anim-1">
            <p className="apt-panel-title">🗓️ Book New Appointment</p>

            {!selectedDoc ? (
              <>
                <div className="apt-search-wrap">
                  <span className="apt-search-icon">🔍</span>
                  <input className="apt-search-input" placeholder="Search by name, specialization, qualification..."
                    value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <div className="apt-pills">
                  <button className={`apt-pill ${!specFilter?"active":""}`} onClick={()=>setSpecFilter("")}>All</button>
                  {specializations.slice(0,10).map(s=>(
                    <button key={s} className={`apt-pill ${specFilter===s?"active":""}`} onClick={()=>setSpecFilter(s)}>{s}</button>
                  ))}
                </div>
                <div className="apt-doc-grid">
                  {filtered.length===0 && <p style={{color:"#94a3b8",gridColumn:"1/-1",textAlign:"center",padding:"20px"}}>No doctors found</p>}
                  {filtered.map(doc=>(
                    <div key={doc.id} className="apt-doc-card" onClick={()=>selectDoctor(doc)}>
                      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
                        <div className="apt-doc-avatar">{getDoctorEmoji(doc.name)}</div>
                        <div><p className="apt-doc-name">{doc.name}</p><p className="apt-doc-spec">{doc.specialization}</p></div>
                      </div>
                      {doc.qualification && <p className="apt-doc-meta">🎓 {doc.qualification}</p>}
                      {doc.experience    && <p className="apt-doc-meta">⏱️ {doc.experience} experience</p>}
                      {doc.timeslots && (
                        <div className="apt-slot-preview">
                          {doc.timeslots.split(",").slice(0,3).map(t=>(
                            <span key={t} className="apt-slot-chip">{fmtTime(t.trim())}</span>
                          ))}
                          {doc.timeslots.split(",").length>3 && <span style={{fontSize:"11px",color:"#94a3b8"}}>+{doc.timeslots.split(",").length-3} more</span>}
                        </div>
                      )}
                      <p className="apt-doc-select">Select →</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="apt-selected-banner">
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <span style={{fontSize:"28px"}}>{getDoctorEmoji(selectedDoc.name)}</span>
                    <div>
                      <p style={{margin:0,fontWeight:"700",color:"#0f172a"}}>{selectedDoc.name}</p>
                      <p style={{margin:"2px 0 0",fontSize:"13px",color:"#0ea5e9"}}>{selectedDoc.specialization}</p>
                    </div>
                  </div>
                  <button className="apt-change-btn" onClick={()=>{setSelectedDoc(null);setForm({...form,doctor_id:"",time:""});}}>Change</button>
                </div>

                <label className="apt-label">Select Date</label>
                <input type="date" className="apt-date-input" value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e=>setForm({...form,date:e.target.value})} />

                <label className="apt-label">Select Time Slot</label>
                <div className="apt-time-slots">
                  {getTimeSlots().map(t=>(
                    <button key={t} className={`apt-time-btn ${form.time===t?"active":""}`}
                      onClick={()=>setForm({...form,time:t})}>{fmtTime(t)}</button>
                  ))}
                </div>

                <label className="apt-label">Reason for Visit</label>
                <textarea className="apt-reason-input" rows={3}
                  placeholder="Describe your symptoms or reason for visit..."
                  value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} />

                <button className="apt-confirm-btn" onClick={book}>✓ Confirm Booking</button>
              </>
            )}
          </div>
        )}

        {/* List */}
        <div className="apt-list-section apt-anim apt-anim-2">
          <p className="apt-section-title">
            {user.role==="doctor" ? "Patient Appointments" : "My Appointments"}
            <span style={{fontSize:"14px",fontWeight:"500",color:"#64748b",marginLeft:"10px"}}>({appointments.length})</span>
          </p>

          {appointments.length===0 ? (
            <div className="apt-empty">
              <p style={{fontSize:"48px",margin:"0 0 12px"}}>📭</p>
              <p style={{fontSize:"16px",color:"#64748b",margin:"0 0 4px"}}>No appointments yet</p>
              <p style={{fontSize:"13px",color:"#94a3b8",margin:0}}>
                {user.role==="patient" ? "Book your first consultation above" : "Patient bookings will appear here"}
              </p>
            </div>
          ) : appointments.map((a,i)=>(
            <div key={a.id} className={`apt-item ${a.status} apt-anim`} style={{animationDelay:`${i*0.05+0.1}s`}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                <div className="apt-item-avatar">
                  {user.role==="patient" ? "👨‍⚕️" : "🧑‍💼"}
                </div>
                <div>
                  <p className="apt-item-name">
                    {user.role==="patient" ? a.doctor_name : a.patient_name}
                  </p>
                  <p className="apt-item-meta">📆 {a.date} &nbsp;•&nbsp; 🕐 {fmtTime(a.time)}</p>
                  <p className="apt-item-reason">"{a.reason}"</p>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                <span className={`apt-status-badge ${a.status}`}>{a.status}</span>
                {user.role==="doctor" && a.status==="pending" && (
                  <>
                    <button className="apt-action-btn green" onClick={()=>updateStatus(a.id,"confirmed")}>✓ Confirm</button>
                    <button className="apt-action-btn red"   onClick={()=>updateStatus(a.id,"cancelled")}>✕ Cancel</button>
                  </>
                )}
                {a.status==="confirmed" && (
                  <button className="apt-action-btn blue" onClick={()=>startCall(`room_${a.id}`,a)}>📹 Start Call</button>
                )}
                {user.role==="patient" && (
                  <button className="apt-action-btn red" onClick={()=>deleteApt(a.id)}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}