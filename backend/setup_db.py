import sqlite3, hashlib, os

if not os.path.exists("database"):
    os.makedirs("database")
elif os.path.isfile("database"):
    os.remove("database")
    os.makedirs("database")
conn = sqlite3.connect("database/telemedicine.db")
c    = conn.cursor()

c.executescript("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'patient',
    specialization TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES users(id),
    doctor_id  INTEGER REFERENCES users(id),
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES users(id),
    doctor_id  INTEGER REFERENCES users(id),
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

def h(p): return hashlib.sha256(p.encode()).hexdigest()

doctors = [
    ("Dr. Priya Sharma", "priya@clinic.com",  h("doctor123"), "doctor", "General Physician"),
    ("Dr. Arjun Mehta",  "arjun@clinic.com",  h("doctor123"), "doctor", "Cardiologist"),
    ("Dr. Neha Gupta",   "neha@clinic.com",   h("doctor123"), "doctor", "Dermatologist"),
]
for d in doctors:
    try:
        c.execute("INSERT INTO users (name,email,password,role,specialization) VALUES (?,?,?,?,?)", d)
    except sqlite3.IntegrityError:
        pass

conn.commit()
conn.close()
print("✅ Database created at database/telemedicine.db")
print("   Doctors seeded (password: doctor123)")
