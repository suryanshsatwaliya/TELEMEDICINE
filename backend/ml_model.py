SYMPTOMS = [
    "fever", "cough", "headache", "fatigue", "nausea", "vomiting",
    "diarrhea", "sore_throat", "runny_nose", "chest_pain", "shortness_of_breath",
    "body_ache", "rash", "itching", "sneezing", "chills", "sweating",
    "loss_of_appetite", "abdominal_pain", "back_pain", "dizziness",
    "joint_pain", "muscle_weakness", "blurred_vision", "frequent_urination",
    "weight_loss", "night_sweats", "swollen_lymph_nodes"
]

SYM_IDX = {s: i for i, s in enumerate(SYMPTOMS)}

DISEASE_PROFILES = {
    "Common Cold": {
        "runny_nose": 4, "sneezing": 4, "sore_throat": 3,
        "cough": 2, "headache": 1, "fever": 1, "fatigue": 1
    },
    "Influenza (Flu)": {
        "fever": 4, "chills": 4, "body_ache": 4, "fatigue": 3,
        "headache": 2, "cough": 2, "sweating": 2, "joint_pain": 2,
        "night_sweats": 1, "sore_throat": 1
    },
    "COVID-19": {
        "shortness_of_breath": 4, "fever": 3, "cough": 3,
        "fatigue": 2, "body_ache": 2, "headache": 2,
        "loss_of_appetite": 2, "chills": 1
    },
    "Typhoid": {
        "abdominal_pain": 4, "diarrhea": 4, "fever": 3,
        "nausea": 2, "vomiting": 2, "headache": 2,
        "loss_of_appetite": 2, "sweating": 2
    },
    "Malaria": {
        "chills": 4, "sweating": 4, "night_sweats": 3,
        "fever": 3, "headache": 2, "nausea": 2,
        "vomiting": 2, "body_ache": 2, "fatigue": 2
    },
    "Diabetes": {
        "frequent_urination": 5, "blurred_vision": 4, "weight_loss": 4,
        "fatigue": 3, "muscle_weakness": 2, "back_pain": 1
    },
    "Hypertension": {
        "headache": 4, "dizziness": 4, "chest_pain": 3,
        "blurred_vision": 2, "shortness_of_breath": 2, "fatigue": 1
    },
    "Anemia": {
        "fatigue": 4, "muscle_weakness": 4, "dizziness": 3,
        "weight_loss": 2, "joint_pain": 2, "loss_of_appetite": 2,
        "night_sweats": 1, "shortness_of_breath": 1
    },
    "Gastroenteritis": {
        "diarrhea": 5, "nausea": 4, "vomiting": 4,
        "abdominal_pain": 4, "fever": 2, "fatigue": 2,
        "loss_of_appetite": 2, "body_ache": 1
    },
    "Allergy / Dermatitis": {
        "rash": 5, "itching": 5, "sneezing": 3,
        "runny_nose": 2, "cough": 1
    },
    "Asthma": {
        "shortness_of_breath": 5, "cough": 4, "chest_pain": 3,
        "fatigue": 2, "muscle_weakness": 1
    },
    "Tuberculosis": {
        "night_sweats": 5, "weight_loss": 5, "swollen_lymph_nodes": 4,
        "cough": 3, "fatigue": 3, "fever": 2, "loss_of_appetite": 2
    },
    "Dengue": {
        "rash": 4, "joint_pain": 4, "body_ache": 3,
        "fever": 3, "headache": 3, "fatigue": 2,
        "nausea": 2, "vomiting": 2, "chills": 1
    },
    "Pneumonia": {
        "shortness_of_breath": 5, "chest_pain": 4, "cough": 4,
        "fever": 3, "chills": 2, "fatigue": 2, "sweating": 2
    },
    "Migraine": {
        "headache": 6, "nausea": 3, "blurred_vision": 3,
        "dizziness": 2, "vomiting": 2, "fatigue": 1
    },
    "Urinary Tract Infection (UTI)": {
        "frequent_urination": 5, "abdominal_pain": 3, "back_pain": 3,
        "fever": 2, "fatigue": 1, "nausea": 1
    },
}

PRECAUTIONS = {
    "Common Cold":           ["Rest well", "Stay hydrated", "Use steam inhalation", "Avoid cold exposure"],
    "Influenza (Flu)":       ["Rest at home", "Take antiviral if prescribed", "Stay hydrated", "Avoid contact with others"],
    "COVID-19":              ["Isolate immediately", "Monitor oxygen levels", "Consult a doctor", "Wear mask"],
    "Typhoid":               ["Drink boiled water only", "Take prescribed antibiotics", "Eat light food", "Rest"],
    "Malaria":               ["Take antimalarial drugs", "Use mosquito nets", "Avoid stagnant water", "Consult doctor immediately"],
    "Diabetes":              ["Monitor blood sugar daily", "Reduce sugar intake", "Exercise regularly", "Follow doctor's diet plan"],
    "Hypertension":          ["Reduce salt intake", "Exercise daily", "Avoid stress", "Monitor BP regularly"],
    "Anemia":                ["Eat iron-rich foods", "Take iron supplements", "Rest adequately", "Consult a doctor"],
    "Gastroenteritis":       ["Stay hydrated with ORS", "Avoid solid food initially", "Rest", "Consult doctor if severe"],
    "Allergy / Dermatitis":  ["Avoid allergen", "Apply prescribed cream", "Take antihistamines", "Keep skin moisturized"],
    "Asthma":                ["Use inhaler as prescribed", "Avoid triggers", "Keep home dust-free", "Consult doctor"],
    "Tuberculosis":          ["Take full TB medication course", "Isolate from others", "Improve ventilation", "Consult a specialist"],
    "Dengue":                ["Rest completely", "Stay hydrated", "Use mosquito repellent", "Monitor platelet count", "Avoid aspirin"],
    "Pneumonia":             ["Take prescribed antibiotics", "Rest and stay hydrated", "Use humidifier", "Seek emergency care if severe"],
    "Migraine":              ["Rest in dark quiet room", "Take pain reliever", "Apply cold compress", "Avoid known triggers"],
    "Urinary Tract Infection (UTI)": ["Drink plenty of water", "Take prescribed antibiotics", "Avoid caffeine", "Maintain hygiene"],
}


def predict_disease(symptom_list):
    if not symptom_list:
        return {"error": "No valid symptoms provided"}

    symptoms_set = set(s.lower().strip() for s in symptom_list)
    matched_symptoms = [s for s in symptoms_set if s in SYM_IDX]

    if not matched_symptoms:
        return {"error": "No recognizable symptoms selected."}

    scores = {}
    for disease, profile in DISEASE_PROFILES.items():
        raw_score = 0
        matched_count = 0
        for sym in symptoms_set:
            if sym in profile:
                raw_score += profile[sym]
                matched_count += 1
        if raw_score > 0:
            max_possible = sum(profile.values())
            coverage = raw_score / max_possible
            scores[disease] = raw_score * (0.5 + 0.5 * coverage)

    if not scores:
        return {
            "disease": "General Illness",
            "confidence": 30,
            "precautions": ["Rest and stay hydrated", "Consult a doctor for proper diagnosis"],
            "matched_symptoms": matched_symptoms,
            "alternatives": [],
            "disclaimer": "AI prediction only. Consult a licensed doctor."
        }

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_disease, top_score = ranked[0]
    total = sum(v for _, v in ranked)
    confidence = round(min(92, max(38, (top_score / total) * 100)), 1)

    alternatives = [
        {"disease": d, "confidence": round((v / total) * 100, 1)}
        for d, v in ranked[1:3] if v > 0
    ]

    return {
        "disease": top_disease,
        "confidence": confidence,
        "precautions": PRECAUTIONS.get(top_disease, ["Consult a doctor"]),
        "matched_symptoms": matched_symptoms,
        "alternatives": alternatives,
        "disclaimer": "This is an AI prediction only. Please consult a licensed doctor for proper diagnosis."
    }
