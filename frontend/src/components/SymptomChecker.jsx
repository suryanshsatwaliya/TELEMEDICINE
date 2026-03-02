import { useState } from "react";
import API from "../api";

const GROUPS = {
  "🌡️ General":     ["fever","chills","sweating","night_sweats","fatigue","weight_loss"],
  "🫁 Respiratory": ["cough","sore_throat","runny_nose","sneezing","shortness_of_breath","chest_pain"],
  "🧠 Head & Neuro":["headache","dizziness","blurred_vision","muscle_weakness"],
  "🤢 Digestive":   ["nausea","vomiting","diarrhea","abdominal_pain","loss_of_appetite"],
  "💪 Body":        ["body_ache","joint_pain","back_pain","swollen_lymph_nodes"],
  "🩹 Skin":        ["rash","itching"],
  "🚽 Urinary":     ["frequent_urination"],
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const toggle = (s) => setSelected(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const check = async () => {
    if (!selected.length) return alert("Please select at least one symptom");
    setLoading(true); setResult(null);
    const res = await fetch(`${API}/api/predict`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selected })
    });
    setResult(await res.json());
    setLoading(false);
  };

  const reset = () => { setSelected([]); setResult(null); };
  const conf_color = (c) => c >= 65 ? "#059669" : c >= 45 ? "#d97706" : "#dc2626";

  return (
    <div className="page-container">
      <h2>🩺 AI Symptom Checker</h2>
      <p className="subtitle">Select all your symptoms — AI will match them across 16 conditions.</p>

      {Object.entries(GROUPS).map(([group, syms]) => (
        <div key={group} className="symptom-group">
          <div className="group-label">{group}</div>
          <div className="symptom-row">
            {syms.map(s => (
              <button key={s} className={`symptom-btn ${selected.includes(s) ? "selected" : ""}`}
                onClick={() => toggle(s)}>
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="checker-footer">
        <span className="selected-count">{selected.length} symptom(s) selected</span>
        <div style={{ display: "flex", gap: "10px" }}>
          {selected.length > 0 && <button className="btn-outline" onClick={reset}>Clear All</button>}
          <button className="btn-primary" style={{ width: "auto" }} onClick={check} disabled={loading}>
            {loading ? "Analyzing..." : "🔍 Analyze Symptoms"}
          </button>
        </div>
      </div>

      {result && !result.error && (
        <div className="result-card">
          <div className="result-header">
            <h3>🧬 Analysis Result</h3>
          </div>

          <div className="primary-result">
            <div className="disease-name">{result.disease}</div>
            <div className="confidence-label" style={{ color: conf_color(result.confidence) }}>
              Confidence: {result.confidence}%
            </div>
            <div className="confidence-bar">
              <div style={{ width: `${result.confidence}%`, backgroundColor: conf_color(result.confidence) }} />
            </div>
          </div>

          {result.alternatives?.length > 0 && (
            <div className="alternatives">
              <h4>Also consider:</h4>
              {result.alternatives.map((a, i) => (
                <div key={i} className="alt-item">
                  <span>{a.disease}</span>
                  <span style={{ color: conf_color(a.confidence), fontWeight: 600 }}>{a.confidence}%</span>
                </div>
              ))}
            </div>
          )}

          <div className="matched-symptoms">
            <h4>Matched Symptoms ({result.matched_symptoms.length}):</h4>
            <div className="matched-tags">
              {result.matched_symptoms.map(s => (
                <span key={s} className="matched-tag">{s.replace(/_/g, " ")}</span>
              ))}
            </div>
          </div>

          <h4>Recommended Precautions:</h4>
          <ul className="precautions-list">
            {result.precautions.map((p, i) => <li key={i}>{p}</li>)}
          </ul>

          <div className="disclaimer">⚠️ {result.disclaimer}</div>
        </div>
      )}

      {result?.error && <div className="error-msg" style={{ marginTop: "16px" }}>{result.error}</div>}
    </div>
  );
}
