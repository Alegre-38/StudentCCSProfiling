import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const pct = (n, total) => total === 0 ? 0 : Math.round((n / total) * 100);

const Bar = ({ value, color }) => (
  <div style={{ height: '6px', borderRadius: '99px', background: '#f0f0f0', overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '99px', transition: 'width 1s ease' }} />
  </div>
);

export default function Dashboard() {
  const [s, setS]             = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = () => {
    axios.get(`${API_URL}/dashboard/stats`)
      .then(res => { setS(res.data); setLastUpdated(new Date()); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading || !s) return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Live summary of the Student Profiling System.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.2rem' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ height: '100px', borderRadius: '16px', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    </div>
  );

  const clearedPct = pct(s.cleared, s.total_students);
  const pendingPct = pct(s.pending_clearance, s.total_students);
  const malePct    = pct(s.male, s.total_students);
  const femalePct  = pct(s.female, s.total_students);

  const programEntries = Object.entries(s.program_breakdown || {});
  const yearEntries    = Object.entries(s.year_breakdown || {});
  const enrollEntries  = Object.entries(s.enrollment_breakdown || {});
  const ftypeEntries   = Object.entries(s.faculty_type || {});

  const PROG_COLORS = ['#F97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

  const topStats = [
    { label: 'Total Students',     value: s.total_students,       color: '#F97316', sub: `${s.male}M · ${s.female}F`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: 'Total Faculty',      value: s.total_faculty,        color: '#6366f1', sub: `${s.total_roles} roles assigned`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
    { label: 'Cleared',            value: s.cleared,              color: '#16a34a', sub: `${clearedPct}% of students`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { label: 'Pending Clearance',  value: s.pending_clearance,    color: '#d97706', sub: `${pendingPct}% of students`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Disciplinary Cases', value: s.disciplinary_total,   color: '#ef4444', sub: `${s.disciplinary_pending} pending`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label: 'Skills Recorded',    value: s.total_skills,         color: '#10b981', sub: `${s.total_affiliations} affiliations`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Live summary of the Student Profiling System.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem', borderRadius: '20px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.75em', fontWeight: 600, color: '#16a34a' }}>
            Live · {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}` : 'Loading...'}
          </span>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {topStats.map(({ label, value, color, sub, icon }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '1.4rem 1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,40,49,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(34,40,49,0.07)'; }}>
            <div>
              <div style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ fontSize: '2em', fontWeight: 800, color, lineHeight: 1, marginBottom: '0.25rem' }}>{value}</div>
              <div style={{ fontSize: '0.75em', color: '#9ca3af' }}>{sub}</div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}12`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 — Gender + Clearance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
        {/* Gender */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Gender Distribution</div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
            {[['Male', s.male, '#3b82f6', malePct], ['Female', s.female, '#ec4899', femalePct]].map(([lbl, val, col, p]) => (
              <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '1rem', background: `${col}08`, borderRadius: '12px', border: `1px solid ${col}20` }}>
                <div style={{ fontSize: '1.8em', fontWeight: 800, color: col }}>{p}%</div>
                <div style={{ fontSize: '0.75em', color: '#9ca3af', marginTop: '2px' }}>{lbl} · {val}</div>
              </div>
            ))}
          </div>
          {[['Male', s.male, '#3b82f6', malePct], ['Female', s.female, '#ec4899', femalePct]].map(([lbl, val, col, p]) => (
            <div key={lbl} style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.82em', fontWeight: 600, color: col }}>{lbl}</span>
                <span style={{ fontSize: '0.82em', color: '#6b7280' }}>{val} <span style={{ color: '#d1d5db' }}>({p}%)</span></span>
              </div>
              <Bar value={p} color={col} />
            </div>
          ))}
        </div>

        {/* Clearance */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Medical Clearance</div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
            {[['Cleared', s.cleared, '#16a34a', clearedPct], ['Pending', s.pending_clearance, '#d97706', pendingPct]].map(([lbl, val, col, p]) => (
              <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '1rem', background: `${col}08`, borderRadius: '12px', border: `1px solid ${col}20` }}>
                <div style={{ fontSize: '1.8em', fontWeight: 800, color: col }}>{p}%</div>
                <div style={{ fontSize: '0.75em', color: '#9ca3af', marginTop: '2px' }}>{lbl} · {val}</div>
              </div>
            ))}
          </div>
          {[['Cleared', s.cleared, '#16a34a', clearedPct], ['Pending', s.pending_clearance, '#d97706', pendingPct]].map(([lbl, val, col, p]) => (
            <div key={lbl} style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.82em', fontWeight: 600, color: col }}>{lbl}</span>
                <span style={{ fontSize: '0.82em', color: '#6b7280' }}>{val} <span style={{ color: '#d1d5db' }}>({p}%)</span></span>
              </div>
              <Bar value={p} color={col} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 — Program + Year */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Students by Program</div>
          {programEntries.length === 0
            ? <p style={{ color: '#9ca3af', fontSize: '0.88em' }}>No data yet.</p>
            : programEntries.map(([prog, count], i) => {
              const col = PROG_COLORS[i % PROG_COLORS.length];
              return (
                <div key={prog} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82em', fontWeight: 600, color: '#393E46', maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog}</span>
                    <span style={{ fontSize: '0.82em', fontWeight: 700, color: col }}>{count} <span style={{ color: '#d1d5db', fontWeight: 400 }}>({pct(count, s.total_students)}%)</span></span>
                  </div>
                  <Bar value={pct(count, s.total_students)} color={col} />
                </div>
              );
            })}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Year Level Breakdown</div>
          {yearEntries.map(([yr, count]) => (
            <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82em', color: '#F97316', flexShrink: 0 }}>{yr}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.78em', color: '#6b7280' }}>Year {yr}</span>
                  <span style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831' }}>{count}</span>
                </div>
                <Bar value={pct(count, s.total_students)} color="#F97316" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4 — Enrollment + Faculty + Records */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
        {/* Enrollment */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Enrollment Status</div>
          {enrollEntries.map(([status, count]) => {
            const col = status === 'New' ? '#3b82f6' : status === 'Returning' ? '#10b981' : status === 'Transferee' ? '#8b5cf6' : '#9ca3af';
            return (
              <div key={status} style={{ marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.82em', fontWeight: 600, color: col }}>{status}</span>
                  <span style={{ fontSize: '0.82em', color: '#6b7280' }}>{count} ({pct(count, s.total_students)}%)</span>
                </div>
                <Bar value={pct(count, s.total_students)} color={col} />
              </div>
            );
          })}
        </div>

        {/* Faculty */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Faculty Employment</div>
          {ftypeEntries.map(([type, count]) => {
            const col = type === 'Full-Time' ? '#16a34a' : type === 'Part-Time' ? '#d97706' : '#6366f1';
            return (
              <div key={type} style={{ marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.82em', fontWeight: 600, color: col }}>{type}</span>
                  <span style={{ fontSize: '0.82em', color: '#6b7280' }}>{count} ({pct(count, s.total_faculty)}%)</span>
                </div>
                <Bar value={pct(count, s.total_faculty)} color={col} />
              </div>
            );
          })}
          <div style={{ marginTop: '0.8rem', padding: '0.65rem 0.9rem', background: 'rgba(57,62,70,0.05)', borderRadius: '8px', fontSize: '0.8em', color: '#6b7280' }}>
            <strong style={{ color: '#222831' }}>{s.total_roles}</strong> advisory role{s.total_roles !== 1 ? 's' : ''} assigned
          </div>
        </div>

        {/* Records */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.78em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F97316', display: 'inline-block' }}>Records Summary</div>
          {[
            { label: 'Academic Records',       value: s.total_academic,        color: '#8b5cf6' },
            { label: 'Skills Recorded',        value: s.total_skills,          color: '#10b981' },
            { label: 'Non-Academic Activities',value: s.total_activities,      color: '#F97316' },
            { label: 'Affiliations',           value: s.total_affiliations,    color: '#6366f1' },
            { label: 'Disciplinary (Pending)', value: s.disciplinary_pending,  color: '#ef4444' },
            { label: 'Disciplinary (Resolved)',value: s.disciplinary_resolved, color: '#16a34a' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '0.8em', color: '#6b7280' }}>{label}</span>
              <span style={{ fontWeight: 800, fontSize: '0.92em', color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
