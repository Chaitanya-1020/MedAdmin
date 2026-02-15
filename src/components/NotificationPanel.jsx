import Icon from "./Icon";
import { StatusBadge } from "./UI";

export default function NotificationPanel({ onClose, schedule, patients }) {
  const missed  = schedule.filter(s => s.status === "Missed");
  const pending = schedule.filter(s => s.status === "Pending");
  const total   = missed.length + pending.length;

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <div style={{ fontFamily:"var(--font-head)", fontSize:15, fontWeight:700 }}>
          Notifications {total > 0 && <span className="badge red" style={{ fontSize:10, marginLeft:6 }}>{total}</span>}
        </div>
        <div className="icon-btn" onClick={onClose}><Icon name="x" size={13} /></div>
      </div>

      {/* Missed doses */}
      {missed.map(s => (
        <div key={s.id} className="notif-item">
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div className="notif-badge-dot" style={{ background:"var(--red)", marginTop:5 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:3 }}>
                ⚠ Missed: {s.medicineName}
              </div>
              <div style={{ fontSize:12, color:"var(--text2)", marginBottom:3 }}>
                {s.patientName} · <span style={{ fontFamily:"var(--font-mono)" }}>{s.bed}</span>
              </div>
              <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>
                Scheduled {s.scheduledTime} · Overdue
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pending doses */}
      {pending.slice(0, 4).map(s => (
        <div key={s.id} className="notif-item">
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div className="notif-badge-dot" style={{ background:"var(--amber)", marginTop:5 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:3 }}>
                Due: {s.medicineName}
              </div>
              <div style={{ fontSize:12, color:"var(--text2)", marginBottom:3 }}>
                {s.patientName} · <span style={{ fontFamily:"var(--font-mono)" }}>{s.bed}</span>
              </div>
              <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>
                Scheduled {s.scheduledTime}
              </div>
            </div>
          </div>
        </div>
      ))}

      {total === 0 && (
        <div style={{ padding:40, textAlign:"center", color:"var(--text3)" }}>
          <div style={{ fontSize:30, marginBottom:10 }}>✓</div>
          <div style={{ fontSize:13 }}>All caught up!</div>
          <div style={{ fontSize:12, marginTop:4 }}>No pending alerts</div>
        </div>
      )}

      {/* End-of-day summary */}
      <div style={{ padding:"16px 18px", borderTop:"1px solid var(--border)", background:"var(--surface2)", margin:"8px 0 0" }}>
        <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10, fontWeight:700 }}>Today's Summary</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[
            { label:"Given",   val:schedule.filter(s=>s.status==="Given").length,   color:"var(--green)" },
            { label:"Missed",  val:schedule.filter(s=>s.status==="Missed").length,   color:"var(--red)" },
            { label:"Pending", val:schedule.filter(s=>s.status==="Pending").length,  color:"var(--amber)" },
          ].map(s => (
            <div key={s.label} style={{ textAlign:"center", padding:"10px 6px", background:"var(--surface)", borderRadius:9, border:"1px solid var(--border)" }}>
              <div style={{ fontFamily:"var(--font-head)", fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
