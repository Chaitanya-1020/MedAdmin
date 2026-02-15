# 🏥 MedAdmin — Hospital Medication Administration System

A secure, role-based web application for managing hospital medication administration, patient records, prescriptions, and nursing logs.

---

## 📁 Project Structure

```
hospital-app/
├── index.html                        ← HTML entry point
├── package.json                      ← Dependencies & scripts
├── vite.config.js                    ← Vite bundler config
└── src/
    ├── index.jsx                     ← React root mount
    ├── App.jsx                       ← App shell + auth gate
    │
    ├── context/
    │   └── AuthContext.jsx           ← Auth state (login, signup, logout)
    │
    ├── data/
    │   └── mockData.js               ← Demo patients, prescriptions, logs
    │
    ├── components/
    │   ├── Icon.jsx                  ← Inline SVG icon library
    │   ├── UI.jsx                    ← Shared UI: Badge, Modal, Alert, etc.
    │   ├── Sidebar.jsx               ← Navigation sidebar
    │   └── NotificationPanel.jsx     ← Slide-in notification panel
    │
    ├── pages/
    │   ├── AuthPage.jsx              ← Sign In + Sign Up pages
    │   ├── DashboardPage.jsx         ← Role-specific dashboard
    │   ├── PatientsPage.jsx          ← Patient management (CRUD)
    │   ├── PrescriptionsPage.jsx     ← Prescription management
    │   ├── SchedulePage.jsx          ← Today's medication schedule
    │   └── OtherPages.jsx            ← Logs, Reports, Users, Settings
    │
    └── styles/
        ├── global.css                ← Design tokens, layout, tables
        ├── sidebar.css               ← Sidebar-specific styles
        └── auth.css                  ← Sign In / Sign Up styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Navigate into the project
cd hospital-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview   # Preview production build locally
```

---

## 🔐 Demo Login Credentials

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Doctor | priya@hospital.com     | doctor123   |
| Nurse  | anjali@hospital.com    | nurse123    |
| Admin  | admin@hospital.com     | admin123    |

> 💡 **Shortcut:** On the Sign In page, click a role card to auto-fill the credentials.

---

## 👥 User Roles

### 🩺 Doctor
- Admit & manage patients
- Create / view prescriptions
- Set medication times, routes, dosages
- View missed dose alerts
- View daily reports

### 💊 Nurse
- View assigned ward patients
- See today's medication schedule
- Mark doses as **Given / Missed / Delayed**
- All actions are timestamped and logged

### 🔐 Admin
- Manage all user accounts
- Activate / deactivate staff
- View system-wide reports
- Configure system settings

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Sign In / Sign Up** | Full auth flow with role selection, password strength meter, show/hide password |
| **Role-Based Access** | Different navigation and permissions per role |
| **Patient Management** | Add, edit, discharge patients with search |
| **Prescriptions** | Create prescriptions with multiple daily times, routes |
| **Medication Schedule** | Color-coded daily schedule, ward filter |
| **Administration Log** | Nurse marks doses; immutable audit trail |
| **Notifications** | Bell icon with missed/pending dose alerts |
| **Reports** | Per-patient and per-nurse completion graphs |
| **User Management** | Admin can add/toggle staff accounts |
| **Settings** | System configuration display |

---

## 🎨 Design

- **Theme:** Dark clinical — deep navy background, electric blue accent
- **Fonts:** Syne (headings) + Instrument Sans (body) + DM Mono (data)
- **Colors:** Semantic — green=given, red=missed, amber=pending, purple=delayed

---

## 🔧 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Framework  | React 18            |
| Bundler    | Vite 5              |
| Styling    | Pure CSS (no UI lib)|
| Icons      | Inline SVG          |
| State      | React useState      |
| Auth       | React Context       |
| Storage    | sessionStorage (demo)|

---

## 📝 Next Steps (Production)

To make this production-ready:

1. **Backend:** Node.js + Express or Django REST
2. **Database:** PostgreSQL with the schema from your project spec
3. **Auth:** JWT tokens, bcrypt password hashing
4. **Real-time:** Socket.io for live medication alerts
5. **Deployment:** Docker + AWS/Render/DigitalOcean
6. **HTTPS:** SSL certificate (Let's Encrypt)
7. **Email/SMS:** Nodemailer + Twilio for notifications

---

*Built with React + Vite | MedAdmin v1.0.0*
