import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MOCK_PATIENTS, MOCK_PRESCRIPTIONS, TODAY_SCHEDULE, MOCK_LOGS } from "./data/mockData";

// Pages
import AuthPage         from "./pages/AuthPage";
import DashboardPage    from "./pages/DashboardPage";
import PatientsPage     from "./pages/PatientsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import SchedulePage     from "./pages/SchedulePage";
import { LogsPage, ReportsPage, UsersPage, SettingsPage } from "./pages/OtherPages";

// Components
import Sidebar              from "./components/Sidebar";
import NotificationPanel    from "./components/NotificationPanel";
import Icon                 from "./components/Icon";

// Styles
import "./styles/global.css";
import "./styles/auth.css";

// ─── Topbar titles ────────────────────────────────────────────────────────────
const TITLES = {
  dashboard:     ["Dashboard",           "Good afternoon — here's today's overview"],
  patients:      ["Patients",            "Manage admitted patients and medical records"],
  prescriptions: ["Prescriptions",       "Doctor-issued medication orders"],
  schedule:      ["Medication Schedule", "Today's administration timeline"],
  logs:          ["Administration Logs", "Immutable medication audit trail"],
  reports:       ["Reports",             "Daily medication & performance reports"],
  users:         ["User Management",     "Manage staff accounts & permissions"],
  settings:      ["Settings",            "System configuration & security"],
};

// ─── Authenticated shell ──────────────────────────────────────────────────────
function AppShell() {
  const { user } = useAuth();

  // Shared state (in real app this would be in a backend / context)
  const [patients,      setPatients]      = useState(MOCK_PATIENTS);
  const [prescriptions, setPrescriptions] = useState(MOCK_PRESCRIPTIONS);
  const [schedule,      setSchedule]      = useState(TODAY_SCHEDULE);
  const [logs,          setLogs]          = useState(MOCK_LOGS);

  const [activeView,  setActiveView]  = useState("dashboard");
  const [showNotif,   setShowNotif]   = useState(false);

  const missedCount  = schedule.filter(s => s.status === "Missed").length;
  const pendingCount = schedule.filter(s => s.status === "Pending").length;
  const alertCount   = missedCount + (pendingCount > 0 ? 1 : 0);

  const [title, subtitle] = TITLES[activeView] || ["", ""];
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "??";

  const sharedProps = { patients, setPatients, prescriptions, setPrescriptions, schedule, setSchedule, logs, setLogs };

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={(v) => { setActiveView(v); setShowNotif(false); }} />

      <div className="main" onClick={() => setShowNotif(false)}>
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            <div className="topbar-sub">{subtitle}</div>
          </div>
          <div className="topbar-right">
            {/* Notification bell */}
            <div className="notif-btn" onClick={e => { e.stopPropagation(); setShowNotif(v => !v); }}>
              <Icon name="bell" size={15} />
              {alertCount > 0 && <div className="notif-badge">{alertCount > 9 ? "9+" : alertCount}</div>}
            </div>
            {/* Avatar */}
            <div className="avatar">{initials}</div>
          </div>
        </div>

        {/* Main content */}
        <div className="content">
          {activeView === "dashboard"     && <DashboardPage     {...sharedProps} />}
          {activeView === "patients"      && <PatientsPage      {...sharedProps} />}
          {activeView === "prescriptions" && <PrescriptionsPage {...sharedProps} />}
          {activeView === "schedule"      && <SchedulePage       {...sharedProps} />}
          {activeView === "logs"          && <LogsPage           {...sharedProps} />}
          {activeView === "reports"       && <ReportsPage        {...sharedProps} />}
          {activeView === "users"         && <UsersPage />}
          {activeView === "settings"      && <SettingsPage />}
        </div>
      </div>

      {/* Notification panel */}
      {showNotif && (
        <NotificationPanel
          onClose={() => setShowNotif(false)}
          schedule={schedule}
          patients={patients}
        />
      )}
    </div>
  );
}

// ─── Root: auth gate ──────────────────────────────────────────────────────────
function Root() {
  const { user } = useAuth();
  return user ? <AppShell /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
