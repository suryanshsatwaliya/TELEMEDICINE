import sqlite3
import hashlib
import os
import random
import string

DB = "database/telemedicine.db"
os.makedirs("database", exist_ok=True)

conn = sqlite3.connect(DB)
c = conn.cursor()

# Add new columns if not exist
for col in [
    ("qualification", "TEXT DEFAULT ''"),
    ("experience",    "TEXT DEFAULT ''"),
    ("timeslots",     "TEXT DEFAULT ''"),
    ("unique_id",     "TEXT DEFAULT ''"),
    ("weight",        "TEXT DEFAULT ''"),
    ("height",        "TEXT DEFAULT ''"),
    ("blood_group",   "TEXT DEFAULT ''"),
    ("phone",         "TEXT DEFAULT ''"),
    ("age",           "TEXT DEFAULT ''"),
]:
    try:
        c.execute(f"ALTER TABLE users ADD COLUMN {col[0]} {col[1]}")
        print(f"✅ Column '{col[0]}' added!")
    except sqlite3.OperationalError:
        print(f"⚠️  Column '{col[0]}' already exists")

# Create tables if not exist
c.executescript("""
CREATE TABLE IF NOT EXISTS users (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    email          TEXT UNIQUE NOT NULL,
    password       TEXT NOT NULL,
    role           TEXT DEFAULT 'patient',
    specialization TEXT,
    qualification  TEXT DEFAULT '',
    experience     TEXT DEFAULT '',
    timeslots      TEXT DEFAULT '',
    unique_id      TEXT DEFAULT '',
    weight         TEXT DEFAULT '',
    height         TEXT DEFAULT '',
    blood_group    TEXT DEFAULT '',
    phone          TEXT DEFAULT '',
    age            TEXT DEFAULT '',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS appointments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES users(id),
    doctor_id  INTEGER REFERENCES users(id),
    date       TEXT NOT NULL,
    time       TEXT NOT NULL,
    reason     TEXT,
    status     TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS medical_records (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id   INTEGER REFERENCES users(id),
    doctor_id    INTEGER REFERENCES users(id),
    diagnosis    TEXT,
    prescription TEXT,
    notes        TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS video_calls (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    room       TEXT NOT NULL,
    patient_id INTEGER REFERENCES users(id),
    doctor_id  INTEGER REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at   TIMESTAMP,
    duration   TEXT DEFAULT ''
);
""")

hashed_password = hashlib.sha256("doctor123".encode()).hexdigest()

# name, email, specialization, qualification, experience, timeslots
doctors = [

    # ── General Physician ─────────────────────────────
    ("Dr. Priya Sharma",     "priya@clinic.com",      "General Physician", "MBBS, MD (General Medicine)",         "12 years", "09:00,09:30,10:00,10:30,11:00,11:30"),
    ("Dr. Rakesh Tiwari",    "rakesh@clinic.com",     "General Physician", "MBBS, MD (Internal Medicine)",        "9 years",  "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Sneha Agarwal",    "sneha@clinic.com",      "General Physician", "MBBS, DNB (Family Medicine)",         "7 years",  "16:00,16:30,17:00,17:30,18:00,18:30"),
    ("Dr. Manoj Tiwari",     "manoj@clinic.com",      "General Physician", "MBBS, MD (General Medicine)",         "14 years", "08:00,08:30,09:00,09:30,10:00,10:30"),

    # ── Cardiologist ──────────────────────────────────
    ("Dr. Arjun Mehta",      "arjun@clinic.com",      "Cardiologist",      "MBBS, MD, DM (Cardiology)",           "15 years", "10:00,10:30,11:00,11:30,12:00,12:30"),
    ("Dr. Rajesh Kumar",     "rajesh@clinic.com",     "Cardiologist",      "MBBS, MD, DM (Cardiology), FACC",     "18 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Sunita Bose",      "sunita.b@clinic.com",   "Cardiologist",      "MBBS, DNB (Cardiology)",              "11 years", "17:00,17:30,18:00,18:30,19:00,19:30"),
    ("Dr. Kiran Patel",      "kiran@clinic.com",      "Cardiologist",      "MBBS, MD, DM (Interventional Card.)", "20 years", "08:00,08:30,09:00,09:30,10:00,10:30"),

    # ── Dermatologist ─────────────────────────────────
    ("Dr. Neha Gupta",       "neha@clinic.com",       "Dermatologist",     "MBBS, MD (Dermatology)",              "8 years",  "09:00,09:30,10:00,10:30,11:00,11:30"),
    ("Dr. Amit Shah",        "amit@clinic.com",       "Dermatologist",     "MBBS, MD, DVD (Dermatology)",         "13 years", "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Sunita Verma",     "sunita.v@clinic.com",   "Dermatologist",     "MBBS, DNB (Dermatology)",             "6 years",  "16:00,16:30,17:00,17:30,18:00,18:30"),
    ("Dr. Pooja Iyer",       "pooja@clinic.com",      "Dermatologist",     "MBBS, MD (Dermatology & Cosmetology)","10 years", "11:00,11:30,12:00,12:30,13:00,13:30"),

    # ── Neurologist ───────────────────────────────────
    ("Dr. Rohit Verma",      "rohit@clinic.com",      "Neurologist",       "MBBS, MD, DM (Neurology)",            "18 years", "09:00,09:30,10:00,10:30,11:00,11:30"),
    ("Dr. Deepa Nair",       "deepa@clinic.com",      "Neurologist",       "MBBS, MD, DM (Neurology)",            "14 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Suresh Pillai",    "suresh@clinic.com",     "Neurologist",       "MBBS, DNB (Neurology)",               "10 years", "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── Pediatrician ──────────────────────────────────
    ("Dr. Sunita Rao",       "sunita.r@clinic.com",   "Pediatrician",      "MBBS, MD (Pediatrics)",               "10 years", "08:00,08:30,09:00,09:30,10:00,10:30"),
    ("Dr. Ananya Mishra",    "ananya@clinic.com",     "Pediatrician",      "MBBS, DCH, MD (Pediatrics)",          "8 years",  "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Ravi Shankar",     "ravi@clinic.com",       "Pediatrician",      "MBBS, MD (Pediatrics & Neonatology)", "12 years", "16:00,16:30,17:00,17:30,18:00,18:30"),
    ("Dr. Meena Joshi",      "meena@clinic.com",      "Pediatrician",      "MBBS, DNB (Pediatrics)",              "7 years",  "10:00,10:30,11:00,11:30,12:00,12:30"),

    # ── Orthopedic Surgeon ────────────────────────────
    ("Dr. Vikram Singh",     "vikram@clinic.com",     "Orthopedic Surgeon","MBBS, MS (Orthopedics)",              "14 years", "09:00,09:30,10:00,10:30,11:00,11:30"),
    ("Dr. Anil Kapoor",      "anil@clinic.com",       "Orthopedic Surgeon","MBBS, MS, MCh (Orthopedics)",         "17 years", "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Shalini Dubey",    "shalini@clinic.com",    "Orthopedic Surgeon","MBBS, DNB (Orthopedics)",             "9 years",  "16:00,16:30,17:00,17:30,18:00,18:30"),

    # ── Gynecologist ──────────────────────────────────
    ("Dr. Anjali Krishnan",  "anjali@clinic.com",     "Gynecologist",      "MBBS, MS (Obstetrics & Gynecology)",  "11 years", "09:00,09:30,10:00,10:30,11:00,11:30"),
    ("Dr. Rekha Sharma",     "rekha@clinic.com",      "Gynecologist",      "MBBS, MD (Obstetrics & Gynecology)",  "15 years", "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Preethi Nair",     "preethi@clinic.com",    "Gynecologist",      "MBBS, DNB (Gynecology)",              "8 years",  "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── Psychiatrist ──────────────────────────────────
    ("Dr. Ramesh Iyer",      "ramesh@clinic.com",     "Psychiatrist",      "MBBS, MD (Psychiatry)",               "16 years", "10:00,10:30,11:00,11:30,12:00,12:30"),
    ("Dr. Nisha Kulkarni",   "nisha@clinic.com",      "Psychiatrist",      "MBBS, MD (Psychiatry), DPM",          "12 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Arun Menon",       "arun@clinic.com",       "Psychiatrist",      "MBBS, DNB (Psychiatry)",              "9 years",  "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── ENT Specialist ────────────────────────────────
    ("Dr. Meera Pillai",     "meera@clinic.com",      "ENT Specialist",    "MBBS, MS (ENT)",                      "9 years",  "09:00,09:30,10:00,10:30,11:00,11:30"),
    ("Dr. Sanjay Jain",      "sanjay@clinic.com",     "ENT Specialist",    "MBBS, MS (Otorhinolaryngology)",       "13 years", "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Kavitha Reddy",    "kavitha@clinic.com",    "ENT Specialist",    "MBBS, DNB (ENT)",                     "7 years",  "16:00,16:30,17:00,17:30,18:00,18:30"),

    # ── Pulmonologist ─────────────────────────────────
    ("Dr. Aakash Joshi",     "aakash@clinic.com",     "Pulmonologist",     "MBBS, MD, DM (Pulmonology)",          "13 years", "10:00,10:30,11:00,11:30,12:00,12:30"),
    ("Dr. Seema Chandra",    "seema@clinic.com",      "Pulmonologist",     "MBBS, MD (Respiratory Medicine)",     "10 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Vivek Saxena",     "vivek@clinic.com",      "Pulmonologist",     "MBBS, DNB (Pulmonology)",             "8 years",  "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── Endocrinologist ───────────────────────────────
    ("Dr. Kavita Nair",      "kavita@clinic.com",     "Endocrinologist",   "MBBS, MD, DM (Endocrinology)",        "12 years", "09:30,10:00,10:30,11:00,11:30,12:00"),
    ("Dr. Prakash Reddy",    "prakash@clinic.com",    "Endocrinologist",   "MBBS, MD (Endocrinology & Diabetes)", "15 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Usha Menon",       "usha@clinic.com",       "Endocrinologist",   "MBBS, DNB (Endocrinology)",           "9 years",  "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── Gastroenterologist ────────────────────────────
    ("Dr. Suresh Patel",     "suresh.p@clinic.com",   "Gastroenterologist","MBBS, MD, DM (Gastroenterology)",     "17 years", "10:00,10:30,11:00,11:30,12:00,12:30"),
    ("Dr. Anita Bose",       "anita@clinic.com",      "Gastroenterologist","MBBS, MD (Gastro & Hepatology)",      "11 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Hemant Joshi",     "hemant@clinic.com",     "Gastroenterologist","MBBS, DNB (Gastroenterology)",        "8 years",  "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── Ophthalmologist ───────────────────────────────
    ("Dr. Pooja Malhotra",   "pooja.m@clinic.com",    "Ophthalmologist",   "MBBS, MS (Ophthalmology)",            "10 years", "08:30,09:00,09:30,10:00,10:30,11:00"),
    ("Dr. Rahul Gupta",      "rahul@clinic.com",      "Ophthalmologist",   "MBBS, DO, DNB (Ophthalmology)",       "14 years", "13:00,13:30,14:00,14:30,15:00,15:30"),
    ("Dr. Smita Kulkarni",   "smita@clinic.com",      "Ophthalmologist",   "MBBS, MS (Ophthalmology & Retina)",   "9 years",  "16:00,16:30,17:00,17:30,18:00,18:30"),

    # ── Nephrologist ──────────────────────────────────
    ("Dr. Anand Kulkarni",   "anand@clinic.com",      "Nephrologist",      "MBBS, MD, DM (Nephrology)",           "15 years", "10:00,10:30,11:00,11:30,12:00,12:30"),
    ("Dr. Radha Krishna",    "radha@clinic.com",      "Nephrologist",      "MBBS, MD (Nephrology)",               "11 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Sunil Batra",      "sunil@clinic.com",      "Nephrologist",      "MBBS, DNB (Nephrology)",              "8 years",  "17:00,17:30,18:00,18:30,19:00,19:30"),

    # ── Oncologist ────────────────────────────────────
    ("Dr. Ritu Agarwal",     "ritu@clinic.com",       "Oncologist",        "MBBS, MD, DM (Oncology)",             "13 years", "10:00,10:30,11:00,11:30,12:00,12:30"),
    ("Dr. Girish Nair",      "girish@clinic.com",     "Oncologist",        "MBBS, MD (Medical Oncology)",         "16 years", "14:00,14:30,15:00,15:30,16:00,16:30"),
    ("Dr. Priya Menon",      "priya.m@clinic.com",    "Oncologist",        "MBBS, DNB (Oncology)",                "10 years", "17:00,17:30,18:00,18:30,19:00,19:30"),

]

# Insert or update doctors
for doc in doctors:
    name, email, spec, qual, exp, slots = doc
    existing = c.execute("SELECT id FROM users WHERE email=?", (email,)).fetchone()
    if existing:
        c.execute("""UPDATE users SET name=?, specialization=?, qualification=?, experience=?, timeslots=?
                     WHERE email=?""", (name, spec, qual, exp, slots, email))
        print(f"✅ Updated: {name} ({spec})")
    else:
        # Generate unique_id
        while True:
            uid = ''.join(random.choices(string.digits, k=5))
            if not c.execute("SELECT id FROM users WHERE unique_id=?", (uid,)).fetchone():
                break
        c.execute("""INSERT INTO users (name, email, password, role, specialization, qualification, experience, timeslots, unique_id)
                     VALUES (?,?,?,?,?,?,?,?,?)""",
                  (name, email, hashed_password, "doctor", spec, qual, exp, slots, uid))
        print(f"✅ Added: {name} ({spec})")

conn.commit()
conn.close()

print("\n✅ All doctors added successfully!")
print(f"Total doctors added: {len(doctors)}")
print("Password for all doctors: doctor123")