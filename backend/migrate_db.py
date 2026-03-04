import sqlite3
import random
import string

DB = "database/telemedicine.db"

conn = sqlite3.connect(DB)
c = conn.cursor()

# Add new columns to users table
new_columns = [
    ("weight",      "TEXT DEFAULT ''"),
    ("height",      "TEXT DEFAULT ''"),
    ("blood_group", "TEXT DEFAULT ''"),
    ("phone",       "TEXT DEFAULT ''"),
    ("age",         "TEXT DEFAULT ''"),
    ("unique_id",   "TEXT DEFAULT ''"),
]
for col_name, col_def in new_columns:
    try:
        c.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
        print(f"✅ Column '{col_name}' added!")
    except sqlite3.OperationalError:
        print(f"⚠️  Column '{col_name}' already exists")

# Create video_calls table
c.executescript("""
CREATE TABLE IF NOT EXISTS video_calls (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    room        TEXT NOT NULL,
    patient_id  INTEGER REFERENCES users(id),
    doctor_id   INTEGER REFERENCES users(id),
    started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at    TIMESTAMP,
    duration    TEXT DEFAULT ''
);
""")
print("✅ video_calls table ready!")

# Assign unique 5-digit IDs to existing users who don't have one
users = c.execute("SELECT id, unique_id FROM users").fetchall()
for user in users:
    if not user[1]:
        while True:
            uid = ''.join(random.choices(string.digits, k=5))
            existing = c.execute("SELECT id FROM users WHERE unique_id=?", (uid,)).fetchone()
            if not existing:
                c.execute("UPDATE users SET unique_id=? WHERE id=?", (uid, user[0]))
                break

conn.commit()
conn.close()
print("✅ Migration complete!")