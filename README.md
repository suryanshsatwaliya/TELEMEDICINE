# 🏥 Telemedicine Platform

A full-stack telemedicine web application that connects patients with doctors for virtual consultations.
It features real-time video calls, appointment scheduling, AI-powered symptom checking, and medical records management.

## ✨ Features

- **Patient & Doctor Portals** — Separate dashboards with role-based access for patients and doctors
- **Appointment Booking** — Book, manage, and track appointments with available doctors
- **Real-Time Video Calls** — Peer-to-peer video consultations powered by WebRTC and Socket.IO
- **AI Symptom Checker** — ML-based disease prediction from selected symptoms (covers 10+ conditions)
- **Medical Records** — Doctors can create and patients can view diagnosis and prescription records
- **Call History** — Log of all past video consultations with duration tracking
- **User Profiles** — Manage personal health info (weight, height, blood group, age, phone)
- **Email OTP Verification** — Secure registration with Gmail SMTP-based OTP
- **Forgot Password** — OTP-based password reset via email
- **Unique Patient IDs** — Each user gets an auto-generated unique identifier

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Socket.IO Client | Real-time communication |
| WebRTC | Peer-to-peer video calls |
| CSS (custom) | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Flask | REST API server |
| Flask-SocketIO | WebSocket/real-time events |
| Flask-Mail | Email OTP via Gmail SMTP |
| Flask-CORS | Cross-origin resource sharing |
| SQLite | Database |
| Gunicorn + Eventlet | Production WSGI server |

## 📁 Project Structure

```
TELEMEDICINE-main/
├── backend/
│   ├── app.py              # Main Flask application & API routes
│   ├── ml_model.py         # Symptom-to-disease prediction model
│   ├── setup_db.py         # Database initialization script
│   ├── migrate_db.py       # Database migration script
│   ├── requirements.txt    # Python dependencies
│   ├── render.yaml         # Render.com deployment config
│   └── database/
│       └── telemedicine.db # SQLite database
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── App.css
        ├── api.js
        └── components/
            ├── LoginSelector.jsx
            ├── Register.jsx
            ├── PatientLogin.jsx
            ├── DoctorLogin.jsx
            ├── PatientDashboard.jsx
            ├── DoctorDashboard.jsx
            ├── Appointments.jsx
            ├── VideoCall.jsx
            ├── SymptomChecker.jsx
            ├── MedicalRecords.jsx
            ├── CallHistory.jsx
            ├── Settings.jsx
            └── Navbar.jsx
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- A Gmail account (for email OTP)


### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**

   Create a `.env` file or export the following:
   ```env
   SECRET_KEY=your_secret_key_here
   MAIL_USERNAME=your_gmail@gmail.com
   MAIL_PASSWORD=your_gmail_app_password
   FRONTEND_URL=http://localhost:5173
   ```

   > **Note:** Use a Gmail [App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password.

5. **Initialize the database:**
   ```bash
   python setup_db.py
   ```

6. **Run the development server:**
   ```bash
   python app.py
   ```

   The backend will start at `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/send-otp` | Send OTP to email |
| POST | `/api/verify-otp` | Verify registration OTP |
| POST | `/api/resend-otp` | Resend OTP |
| POST | `/api/forgot-password` | Send password reset OTP |
| POST | `/api/reset-password` | Reset password with OTP |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| GET | `/api/profile/:id` | Get user profile |
| PUT | `/api/profile/:id` | Update user profile |
| DELETE | `/api/profile/:id` | Delete account |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/:id` | Update appointment status |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| POST | `/api/predict` | Predict disease from symptoms |
| GET | `/api/records/:patientId` | Get medical records |
| POST | `/api/records` | Add medical record |
| POST | `/api/calls/start` | Log start of video call |
| POST | `/api/calls/end` | Log end of video call |
| GET | `/api/calls/:userId` | Get call history |
| DELETE | `/api/calls/clear/:userId` | Clear all call history |


## 🤖 Symptom Checker (ML Model)

The built-in symptom checker uses a weighted cosine-similarity approach to match a patient's reported symptoms against disease profiles. Supported conditions include:

- Common Cold, Influenza (Flu), COVID-19
- Typhoid, Malaria, Gastroenteritis
- Diabetes, Hypertension, Anemia
- Allergy / Dermatitis, Asthma

The model returns the top matching diagnoses along with confidence scores.

## 🗄️ Database Schema

The SQLite database contains four main tables:

- **users** — Stores both patients and doctors (distinguished by `role`)
- **appointments** — Appointment records linking patients and doctors
- **medical_records** — Diagnoses and prescriptions added by doctors
- **video_calls** — Video call session logs with duration tracking


## 📄 License

This project is open-source. Feel free to use, modify, and distribute it.
