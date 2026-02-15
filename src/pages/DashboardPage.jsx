import { useAuth } from "../context/AuthContext";
import { MOCK_USERS } from "../data/mockData";
import { StatCard, AlertBox, StatusBadge, ProgressBar } from "../components/UI";

export default function DashboardPage({ patients, prescriptions, schedule, logs }) {
  const { user } = useAuth();

  const admitted    = patients.filter(p => p.status === "Admitted").length;
  const missedToday = schedule.filter(s => s.status === "Missed").length;
  const givenToday  = schedule.filter(s => s.status === "Given").length;
  const pendingNow  = schedule.filter(s => s.status === "Pending").length;
  const totalDoses  = schedule.length;

  const patientsWithMissed = [...new Set(schedule.filter(s => s.status === "Missed").map(s => s.patientId))]
    .map(pid => patients.find(p => p.id === pid)).filter(Boolean);

  const recentLogs = [...logs].reverse().slice(0, 6);

  return (
    <div>
      {/* ── Doctor stats ── */}
      {user.role === "doctor" && (
        <>
          <div className="stats-grid">
            <StatCard icon="bed"   number={admitted}   label="Admitted Patients"   color="blue" />
            <StatCard icon="check" number={givenToday} label="Doses Given Today"   color="green" />
            <StatCard icon="alert" number={missedToday} label="Missed Doses"       color="red" />
            <StatCard icon="pill"  number={prescriptions.filter(r => r.status === "Active").length} label="Active Prescriptions" color="amber" />
          </div>
          {patientsWithMissed.length > 0 && (
            <AlertBox type="error" icon="alert">
              <strong>Missed Dose Alert:</strong>{" "}
              {patientsWithMissed.map(p => p.name).join(", ")} — review prescriptions and update care plan.
            </AlertBox>
          )}
        </>
      )}

      {/* ── Nurse stats ── */}
      {user.role === "nurse" && (
        <>
          <div className="stats-grid">
            <StatCard icon="clock" number={pendingNow}  label="Medications Due"   color="amber" />
            <StatCard icon="alert" number={missedToday} label="Overdue"           color="red" />
            <StatCard icon="check" number={givenToday}  label="Completed Today"   color="green" />
            <StatCard icon="bed"   number={admitted}    label="Ward Patients"     color="blue" />
          </div>
          {pendingNow > 0 && (
            <AlertBox type="warning" icon="bell">
              <strong>{pendingNow} pending medication{pendingNow > 1 ? "s" : ""}</strong> — Please administer as soon as possible.
            </AlertBox>
          )}
        </>
      )}

      {/* ── Admin stats ── */}
      {user.role === "admin" && (
        <div className="stats-grid">
          <StatCard icon="users" number={MOCK_USERS.length} label="Total Users"    color="purple" />
          <StatCard icon="bed"   number={admitted}          label="Admitted Patients" color="blue" />
          <StatCard icon="alert" number={missedToday}       label="Missed Today"   color="red" />
          <StatCard icon="chart" number="99.8%"             label="System Uptime"  color="green" />
        </div>
      )}

      {/* ── Today's progress ── */}
      <div style={{ marginBottom:22 }}>
        <ProgressBar
          value={totalDoses ? (givenToday / totalDoses) * 100 : 0}
          label={`${totalDoses ? Math.round((givenToday / totalDoses) * 100) : 0}% completion today — ${givenToday} of ${totalDoses} doses administered`}
        />
      </div>

      {/* ── Two-col lower ── */}
      <div className="two-col">
        {/* Upcoming doses */}
        <div>
          <div className="section-header" style={{ marginBottom:12 }}>
            <div className="section-title">Upcoming Doses</div>
          </div>
          <div className="schedule-grid">
            {schedule.filter(s => s.status === "Pending").slice(0, 5).map(s => (
              <div key={s.id} className="schedule-item">
                <div className="schedule-time">{s.scheduledTime}</div>
                <div className="schedule-info">
                  <div className="schedule-med">{s.medicineName}</div>
                  <div className="schedule-detail">
                    {s.patientName} · <span style={{ fontFamily:"var(--font-mono)" }}>{s.bed}</span>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
            {schedule.filter(s => s.status === "Pending").length === 0 && (
              <div style={{ textAlign:"center", padding:"28px", color:"var(--text3)", fontSize:13 }}>
                ✓ All caught up! No pending doses.
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div className="section-header" style={{ marginBottom:12 }}>
            <div className="section-title">Recent Activity</div>
          </div>
          <div className="table-card">
            {recentLogs.map(l => {
              const patient = patients.find(p => p.id === l.patientId);
              const rx      = prescriptions.find(r => r.id === l.prescriptionId);
              return (
                <div key={l.id} style={{ padding:"11px 15px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
                    background: l.status === "Given" ? "var(--green)" : l.status === "Missed" ? "var(--red)" : "var(--purple)" }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {patient?.name} — {rx?.medicineName}
                    </div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:1, fontFamily:"var(--font-mono)" }}>
                      {l.nurseName?.split(" ").slice(-1)} · {l.date} {l.givenTime || l.scheduledTime}
                    </div>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              );
            })}
            {logs.length === 0 && (
              <div style={{ padding:24, textAlign:"center", color:"var(--text3)", fontSize:13 }}>No activity yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
