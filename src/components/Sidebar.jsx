import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

const NAV_ITEMS = {
  doctor: [
    { view:"dashboard",    icon:"dashboard", label:"Dashboard" },
    { view:"patients",     icon:"bed",       label:"Patients" },
    { view:"prescriptions",icon:"pill",      label:"Prescriptions" },
    { view:"schedule",     icon:"clock",     label:"Med Schedule" },
    { view:"logs",         icon:"log",       label:"Admin Logs" },
    { view:"reports",      icon:"chart",     label:"Reports" },
  ],
  nurse: [
    { view:"dashboard",icon:"dashboard", label:"Dashboard" },
    { view:"schedule", icon:"clock",     label:"Med Schedule" },
    { view:"patients", icon:"bed",       label:"Patients" },
    { view:"logs",     icon:"log",       label:"My Logs" },
  ],
  admin: [
    { view:"dashboard",icon:"dashboard", label:"Dashboard" },
    { view:"users",    icon:"users",     label:"User Management" },
    { view:"patients", icon:"bed",       label:"All Patients" },
    { view:"reports",  icon:"chart",     label:"Reports" },
    { view:"settings", icon:"settings",  label:"Settings" },
  ],
};

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS[user?.role] || [];
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "??";

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-mark"><Icon name="pill" size={16} /></div>
        <div className="sidebar-logo">Med<span>Admin</span></div>
      </div>

      {/* User Card */}
      <div className="user-card">
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div className="avatar" style={{ width:32, height:32, fontSize:12 }}>{initials}</div>
          <div>
            <div className="user-card-name">{user?.name}</div>
            <div className="user-card-role">{user?.role} · {user?.ward}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-section">Navigation</div>
      {items.map(item => (
        <div
          key={item.view}
          className={`nav-item ${activeView === item.view ? "active" : ""}`}
          onClick={() => setActiveView(item.view)}
        >
          <Icon name={item.icon} size={15} />
          {item.label}
        </div>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <Icon name="logout" size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
