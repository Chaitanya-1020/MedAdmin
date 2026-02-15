import Icon from "./Icon";

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  return <span className={`badge ${(status || "").toLowerCase()}`}>{status}</span>;
}

// ─── Route Label ─────────────────────────────────────────────────────────────
export function RouteLabel({ route }) {
  const map = { Oral:"pill", IV:"drop", Injection:"inject" };
  return (
    <span className="route">
      <Icon name={map[route] || "pill"} size={12} />
      {route}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, footer, children, maxWidth = 560 }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <div className="icon-btn" onClick={onClose}><Icon name="x" size={13} /></div>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Alert Box ────────────────────────────────────────────────────────────────
export function AlertBox({ type = "info", icon, children }) {
  const iconMap = { info:"bell", warning:"alert", error:"alert", success:"check" };
  return (
    <div className={`alert ${type}`}>
      <Icon name={icon || iconMap[type]} size={14} />
      <div>{children}</div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = "var(--green)", label }) {
  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width:`${value}%`, background:color }} />
      </div>
      {label && <div style={{ fontSize:11, color:"var(--text3)", marginTop:4 }}>{label}</div>}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ icon, number, label, color = "blue" }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}><Icon name={icon} size={18} /></div>
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, sub, children }) {
  return (
    <div className="section-header">
      <div>
        <div className="section-title">{title}</div>
        {sub && <div className="section-sub">{sub}</div>}
      </div>
      {children && <div style={{ display:"flex", gap:8 }}>{children}</div>}
    </div>
  );
}

// ─── Table Search ─────────────────────────────────────────────────────────────
export function TableSearch({ value, onChange, placeholder }) {
  return (
    <div className="table-search">
      <Icon name="search" size={14} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search..."} />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ message = "No records found" }) {
  return <div className="empty"><div style={{ fontSize:32, marginBottom:10, opacity:.3 }}>📋</div>{message}</div>;
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
export function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <div className="detail-key">{label}</div>
      <div className="detail-val">{value}</div>
    </div>
  );
}
