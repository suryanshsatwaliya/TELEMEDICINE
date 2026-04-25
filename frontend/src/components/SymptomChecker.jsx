import { useState } from "react";
import API from "../api";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .sc-root { font-family:'DM Sans',sans-serif; background:#f0f2f8; min-height:100vh; padding:0 0 60px; }

  .sc-hero {
    position:relative; overflow:hidden;
    background:linear-gradient(120deg,#0c4a6e 0%,#0369a1 30%,#0891b2 60%,#06b6d4 100%);
    padding:48px 48px 80px; margin-bottom:-48px;
  }
  .sc-hero-grid {
    position:absolute; inset:0;
    background-image:linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);
    background-size:40px 40px;
  }
  .sc-hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 500px 300px at 80% 50%,rgba(6,182,212,0.3) 0%,transparent 70%);
  }
  .sc-hero-shape { position:absolute; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); }
  .sc-hero-content { position:relative; z-index:2; }
  .sc-hero-label {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25);
    border-radius:100px; padding:5px 14px; font-size:12px; font-weight:600;
    color:rgba(255,255,255,0.9); letter-spacing:0.5px; text-transform:uppercase;
    margin-bottom:16px; backdrop-filter:blur(8px);
  }
  .sc-hero-title { font-family:'Sora',sans-serif; font-size:clamp(24px,3.5vw,38px); font-weight:800; color:#fff; margin:0 0 8px; letter-spacing:-0.5px; }
  .sc-hero-sub   { color:rgba(255,255,255,0.65); font-size:15px; margin:0; }

  .sc-content { padding:0 40px; }

  /* Selected count floating card */
  .sc-selected-bar {
    background:#fff; border-radius:20px; padding:16px 24px;
    box-shadow:0 4px 24px rgba(3,105,161,0.12); border:1px solid rgba(14,165,233,0.15);
    display:flex; justify-content:space-between; align-items:center;
    margin-bottom:24px; position:relative; z-index:3;
  }
  .sc-selected-count {
    font-family:'Sora',sans-serif; font-size:15px; font-weight:700; color:#0f172a;
    display:flex; align-items:center; gap:10px;
  }
  .sc-count-badge {
    background:linear-gradient(135deg,#0369a1,#0ea5e9);
    color:#fff; border-radius:100px; padding:2px 12px; font-size:13px;
  }
  .sc-bar-actions { display:flex; gap:10px; }
  .sc-clear-btn {
    padding:8px 18px; border-radius:10px; border:1.5px solid #e2e8f0;
    background:#f8fafc; color:#64748b; cursor:pointer; font-weight:600;
    font-size:13px; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .sc-clear-btn:hover { border-color:#dc2626; color:#dc2626; }
  .sc-analyze-btn {
    padding:8px 24px; border-radius:10px; border:none;
    background:linear-gradient(135deg,#0369a1,#0ea5e9);
    color:#fff; cursor:pointer; font-weight:700; font-size:13px;
    font-family:'DM Sans',sans-serif; transition:all 0.2s;
  }
  .sc-analyze-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(14,165,233,0.35); }
  .sc-analyze-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  /* Symptom Groups */
  .sc-groups { display:flex; flex-direction:column; gap:16px; margin-bottom:24px; }
  .sc-group {
    background:#fff; border-radius:20px; padding:22px 24px;
    box-shadow:0 2px 12px rgba(0,0,0,0.04); border:1px solid #f1f5f9;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .sc-group:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.08); }
  .sc-group-title {
    font-family:'Sora',sans-serif; font-size:14px; font-weight:700;
    color:#0f172a; margin:0 0 14px; display:flex; align-items:center; gap:8px;
  }
  .sc-group-count {
    font-size:11px; font-weight:600; background:#e0f2fe; color:#0284c7;
    border-radius:100px; padding:2px 8px;
  }
  .sc-symptom-row { display:flex; flex-wrap:wrap; gap:8px; }
  .sc-symptom-btn {
    padding:7px 16px; border-radius:100px; border:1.5px solid #e2e8f0;
    background:#f8fafc; color:#475569; cursor:pointer; font-size:13px;
    font-weight:500; font-family:'DM Sans',sans-serif;
    transition:all 0.15s;
  }
  .sc-symptom-btn:hover   { border-color:#0ea5e9; color:#0369a1; background:#f0f9ff; }
  .sc-symptom-btn.selected {
    border-color:#0ea5e9; background:linear-gradient(135deg,#0369a1,#0ea5e9);
    color:#fff; box-shadow:0 2px 8px rgba(14,165,233,0.3);
  }

  /* Result Card */
  .sc-result {
    background:#fff; border-radius:24px; padding:32px;
    box-shadow:0 8px 40px rgba(3,105,161,0.12); border:1px solid rgba(14,165,233,0.15);
    margin-bottom:24px; position:relative; overflow:hidden;
  }
  .sc-result::before {
    content:''; position:absolute; top:0; left:0; right:0; height:4px;
    background:linear-gradient(90deg,#0369a1,#0ea5e9,#06b6d4);
  }
  .sc-result-title { font-family:'Sora',sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0 0 24px; }
  .sc-disease-name { font-family:'Sora',sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0 0 8px; }
  .sc-confidence-row { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
  .sc-conf-label { font-size:13px; font-weight:600; color:#64748b; }
  .sc-conf-pct { font-size:20px; font-weight:800; }
  .sc-conf-bar { flex:1; height:8px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
  .sc-conf-fill { height:100%; border-radius:100px; transition:width 0.8s ease; }

  .sc-alts-title { font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#0f172a; margin:24px 0 12px; }
  .sc-alt-item {
    display:flex; justify-content:space-between; align-items:center;
    padding:10px 14px; background:#f8fafc; border-radius:10px; margin-bottom:8px;
    border:1px solid #f1f5f9;
  }
  .sc-alt-name { font-size:14px; font-weight:600; color:#374151; }
  .sc-alt-pct  { font-size:13px; font-weight:700; }

  .sc-matched-title { font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#0f172a; margin:24px 0 12px; }
  .sc-matched-tags  { display:flex; flex-wrap:wrap; gap:8px; }
  .sc-matched-tag   { background:#e0f2fe; color:#0284c7; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:600; }

  .sc-precautions-title { font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#0f172a; margin:24px 0 12px; }
  .sc-precautions { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
  .sc-precautions li {
    display:flex; align-items:flex-start; gap:10px;
    padding:10px 14px; background:#f0fdf4; border-radius:10px;
    font-size:13px; color:#166534; border:1px solid #bbf7d0;
  }
  .sc-disclaimer {
    margin-top:20px; padding:14px 18px; background:#fef3c7; border-radius:12px;
    font-size:12px; color:#92400e; border:1px solid #fde68a; line-height:1.5;
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .sc-anim   { animation:fadeUp 0.4s ease both; }
  .sc-anim-1 { animation-delay:0.05s; }
  .sc-anim-2 { animation-delay:0.10s; }
  .sc-anim-3 { animation-delay:0.15s; }
`;
document.head.appendChild(style);

const GROUPS = {
  "🌡️ General":      ["fever","chills","sweating","night_sweats","fatigue","weight_loss"],
  "🫁 Respiratory":  ["cough","sore_throat","runny_nose","sneezing","shortness_of_breath","chest_pain"],
  "🧠 Head & Neuro": ["headache","dizziness","blurred_vision","muscle_weakness"],
  "🤢 Digestive":    ["nausea","vomiting","diarrhea","abdominal_pain","loss_of_appetite"],
  "💪 Body":         ["body_ache","joint_pain","back_pain","swollen_lymph_nodes"],
  "🩹 Skin":         ["rash","itching"],
  "🚽 Urinary":      ["frequent_urination"],
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const toggle = (s) => setSelected(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
  const check  = async () => {
    if (!selected.length) return alert("Please select at least one symptom");
    setLoading(true); setResult(null);
    const res = await fetch(`${API}/api/predict`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({symptoms:selected})});
    setResult(await res.json()); setLoading(false);
  };
  const reset = () => { setSelected([]); setResult(null); };

  const confColor = (c) => c>=65 ? "#059669" : c>=45 ? "#d97706" : "#dc2626";
  const selectedInGroup = (syms) => syms.filter(s => selected.includes(s)).length;

  return (
    <div className="sc-root">
      {/* Hero */}
      <div className="sc-hero">
        <div className="sc-hero-grid" />
        <div className="sc-hero-shape" style={{width:200,height:200,right:-60,top:-60}} />
        <div className="sc-hero-shape" style={{width:100,height:100,right:200,bottom:-30}} />
        <div className="sc-hero-content">
          <div className="sc-hero-label">
            <span style={{width:6,height:6,borderRadius:"50%",background:"#67e8f9",display:"inline-block"}} />
            AI Powered
          </div>
          <h1 className="sc-hero-title">🩺 AI Symptom Checker</h1>
          <p className="sc-hero-sub">Select your symptoms — our AI will analyze and match across 16+ conditions</p>
        </div>
      </div>

      <div className="sc-content">
        {/* Action Bar */}
        <div className="sc-selected-bar sc-anim sc-anim-1">
          <div className="sc-selected-count">
            Symptoms selected
            <span className="sc-count-badge">{selected.length}</span>
          </div>
          <div className="sc-bar-actions">
            {selected.length>0 && <button className="sc-clear-btn" onClick={reset}>Clear All</button>}
            <button className="sc-analyze-btn" onClick={check} disabled={loading}>
              {loading ? "⏳ Analyzing..." : "🔍 Analyze Symptoms"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && !result.error && (
          <div className="sc-result sc-anim sc-anim-1">
            <p className="sc-result-title">🧬 Analysis Result</p>
            <p className="sc-disease-name">{result.disease}</p>
            <div className="sc-confidence-row">
              <span className="sc-conf-label">Confidence:</span>
              <span className="sc-conf-pct" style={{color:confColor(result.confidence)}}>{result.confidence}%</span>
            </div>
            <div className="sc-conf-bar">
              <div className="sc-conf-fill" style={{width:`${result.confidence}%`,background:confColor(result.confidence)}} />
            </div>

            {result.alternatives?.length>0 && (
              <>
                <p className="sc-alts-title">Also Consider:</p>
                {result.alternatives.map((a,i)=>(
                  <div key={i} className="sc-alt-item">
                    <span className="sc-alt-name">{a.disease}</span>
                    <span className="sc-alt-pct" style={{color:confColor(a.confidence)}}>{a.confidence}%</span>
                  </div>
                ))}
              </>
            )}

            <p className="sc-matched-title">Matched Symptoms ({result.matched_symptoms.length}):</p>
            <div className="sc-matched-tags">
              {result.matched_symptoms.map(s=>(
                <span key={s} className="sc-matched-tag">{s.replace(/_/g," ")}</span>
              ))}
            </div>

            <p className="sc-precautions-title">Recommended Precautions:</p>
            <ul className="sc-precautions">
              {result.precautions.map((p,i)=><li key={i}><span>✅</span>{p}</li>)}
            </ul>

            <div className="sc-disclaimer">⚠️ {result.disclaimer}</div>
          </div>
        )}
        {result?.error && <div style={{background:"#fee2e2",color:"#dc2626",padding:"14px 18px",borderRadius:"12px",marginBottom:"20px"}}>{result.error}</div>}

        {/* Symptom Groups */}
        <div className="sc-groups sc-anim sc-anim-2">
          {Object.entries(GROUPS).map(([group,syms])=>(
            <div key={group} className="sc-group">
              <p className="sc-group-title">
                {group}
                {selectedInGroup(syms)>0 && <span className="sc-group-count">{selectedInGroup(syms)} selected</span>}
              </p>
              <div className="sc-symptom-row">
                {syms.map(s=>(
                  <button key={s} className={`sc-symptom-btn ${selected.includes(s)?"selected":""}`} onClick={()=>toggle(s)}>
                    {s.replace(/_/g," ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}