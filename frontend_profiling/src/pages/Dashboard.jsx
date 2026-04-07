import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const pct = (n, total) => total === 0 ? 0 : Math.round((n / total) * 100);

const ProgressBar = ({ value, color, bg = '#f0f0f0' }) => (
  <div style={{ height: '8px', borderRadius: '99px', background: bg, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '99px', transition: 'width 0.8s ease' }} />
  </div>
);

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="stat-card">
    <div className="stat-info">
      <h3>{label}</h3>
      <p className="stat-value">{value}</p>
      {sub && <p style={{ margin: '0.2rem 0 0', fontSize: '0.78em', color: '#9ca3af' }}>{sub}</p>}
    </div>
    <div className="stat-icon" style={{ color, background: `${color}18` }}>{icon}</div>
  </div>
);

const SectionCard = ({ title, children, style = {} }) => (
  <div className="modern-card" style={{ ...style }}>
    <h2 style={{ margin: '0 0 1.2rem', fontSize: '0.95em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #F97316', paddingBottom: '0.5rem', display: 'inline-block' }}>
      {title}
    </h2>
    {children}
  </div>
);

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/stats`)
      .then(res => { setS(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !s) return (
    <div className="page-container">
      <div style={{ color: '#9ca3af', padding: '3rem', textAlign: 'center' }}>Loading dashboard...</div>
    </div>
  );

  const malePct    = pct(s.male, s.total_students);
  const femalePct  = pct(s.female, s.total_students);
  const clearedPct = pct(s.cleared, s.total_students);
  const pendingPct = pct(s.pending_clearance, s.total_students);

  const programEntries = Object.entries(s.program_breakdown || {});
  const yearEntries    = Object.entries(s.year_breakdown || {});
  const enrollEntries  = Object.entries(s.enrollment_breakdown || {});
  const ftypeEntries   = Object.entries(s.faculty_type || {});

  const PROGRAM_COLORS = ['#F97316','#3b82f6','#10b981','#8b5cf6','#ef4444'];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Live summary of the Student Profiling System.</p>
      </div>

      {/* Top stat cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard label="Total Students" value={s.total_students} color="#F97316"
          sub={`${s.male}M / ${s.female}F`}
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        <StatCard label="Total Faculty" value={s.total_faculty} color="#393E46"
          sub={`${s.total_roles} role${s.total_roles !== 1 ? 's' : ''} assigned`}
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} />
        <StatCard label="Cleared" value={s.cleared} color="#16a34a"
          sub={`${clearedPct}% of students`}
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Pending Clearance" value={s.pending_clearance} color="#d97706"
          sub={`${pendingPct}% of students`}
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Disciplinary Cases" value={s.disciplinary_total} color="#ef4444"
          sub={`${s.disciplinary_pending} pending`}
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        <StatCard label="Skills Recorded" value={s.total_skills} color="#10b981"
          sub={`${s.total_affiliations} affiliations`}
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} />
      </div>

      {/* Row 2 — Gender + Clearance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>

        <SectionCard title="Gender Distribution">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85em', fontWeight: 600, color: '#3b82f6' }}>Male</span>
                <span style={{ fontSize: '0.85em', fontWeight: 700, color: '#222831' }}>{s.male} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({malePct}%)</span></span>
              </div>
              <ProgressBar value={malePct} color="#3b82f6" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85em', fontWeight: 600, color: '#ec4899' }}>Female</span>
                <span style={{ fontSize: '0.85em', fontWeight: 700, color: '#222831' }}>{s.female} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({femalePct}%)</span></span>
              </div>
              <ProgressBar value={femalePct} color="#ec4899" />
            </div>
            {s.other_gender > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 600, color: '#8b5cf6' }}>Other</span>
                  <span style={{ fontSize: '0.85em', fontWeight: 700, color: '#222831' }}>{s.other_gender} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct(s.other_gender, s.total_students)}%)</span></span>
                </div>
                <ProgressBar value={pct(s.other_gender, s.total_students)} color="#8b5cf6" />
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.3rem' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.7rem', background: 'rgba(59,130,246,0.07)', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 800, color: '#3b82f6' }}>{malePct}%</div>
                <div style={{ fontSize: '0.72em', color: '#9ca3af', marginTop: '2px' }}>Male</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.7rem', background: 'rgba(236,72,153,0.07)', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 800, color: '#ec4899' }}>{femalePct}%</div>
                <div style={{ fontSize: '0.72em', color: '#9ca3af', marginTop: '2px' }}>Female</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Medical Clearance">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85em', fontWeight: 600, color: '#16a34a' }}>Cleared</span>
                <span style={{ fontSize: '0.85em', fontWeight: 700, color: '#222831' }}>{s.cleared} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({clearedPct}%)</span></span>
              </div>
              <ProgressBar value={clearedPct} color="#16a34a" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85em', fontWeight: 600, color: '#d97706' }}>Pending</span>
                <span style={{ fontSize: '0.85em', fontWeight: 700, color: '#222831' }}>{s.pending_clearance} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pendingPct}%)</span></span>
              </div>
              <ProgressBar value={pendingPct} color="#d97706" />
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.3rem' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.7rem', background: 'rgba(22,163,74,0.07)', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 800, color: '#16a34a' }}>{clearedPct}%</div>
                <div style={{ fontSize: '0.72em', color: '#9ca3af', marginTop: '2px' }}>Cleared</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.7rem', background: 'rgba(217,119,6,0.07)', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 800, color: '#d97706' }}>{pendingPct}%</div>
                <div style={{ fontSize: '0.72em', color: '#9ca3af', marginTop: '2px' }}>Pending</div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Row 3 — Program + Year Level */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>

        <SectionCard title="Students by Program">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {programEntries.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '0.88em' }}>No data yet.</p>
              : programEntries.map(([prog, count], i) => (
                <div key={prog}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82em', fontWeight: 600, color: '#393E46', maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog}</span>
                    <span style={{ fontSize: '0.82em', fontWeight: 700, color: PROGRAM_COLORS[i % PROGRAM_COLORS.length] }}>{count} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct(count, s.total_students)}%)</span></span>
                  </div>
                  <ProgressBar value={pct(count, s.total_students)} color={PROGRAM_COLORS[i % PROGRAM_COLORS.length]} />
                </div>
              ))}
          </div>
        </SectionCard>

        <SectionCard title="Year Level Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {yearEntries.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '0.88em' }}>No data yet.</p>
              : yearEntries.map(([yr, count]) => (
                <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85em', color: '#F97316', flexShrink: 0 }}>
                    {yr}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Year {yr}</span>
                      <span style={{ fontSize: '0.8em', fontWeight: 700, color: '#222831' }}>{count}</span>
                    </div>
                    <ProgressBar value={pct(count, s.total_students)} color="#F97316" />
                  </div>
                </div>
              ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 4 — Enrollment + Faculty + Records */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>

        <SectionCard title="Enrollment Status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {enrollEntries.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '0.88em' }}>No data.</p>
              : enrollEntries.map(([status, count]) => {
                const color = status === 'New' ? '#3b82f6' : status === 'Returning' ? '#10b981' : '#8b5cf6';
                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.82em', fontWeight: 600, color }}>{status}</span>
                      <span style={{ fontSize: '0.82em', fontWeight: 700, color: '#222831' }}>{count} ({pct(count, s.total_students)}%)</span>
                    </div>
                    <ProgressBar value={pct(count, s.total_students)} color={color} />
                  </div>
                );
              })}
          </div>
        </SectionCard>

        <SectionCard title="Faculty Employment">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {ftypeEntries.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '0.88em' }}>No data.</p>
              : ftypeEntries.map(([type, count]) => {
                const color = type === 'Full-Time' ? '#16a34a' : type === 'Part-Time' ? '#d97706' : '#6366f1';
                return (
                  <div key={type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.82em', fontWeight: 600, color }}>{type}</span>
                      <span style={{ fontSize: '0.82em', fontWeight: 700, color: '#222831' }}>{count} ({pct(count, s.total_faculty)}%)</span>
                    </div>
                    <ProgressBar value={pct(count, s.total_faculty)} color={color} />
                  </div>
                );
              })}
            <div style={{ marginTop: '0.5rem', padding: '0.7rem', background: 'rgba(57,62,70,0.05)', borderRadius: '8px', fontSize: '0.82em', color: '#393E46' }}>
              <strong>{s.total_roles}</strong> advisory role{s.total_roles !== 1 ? 's' : ''} assigned
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Records Summary">
          {[
            { label: 'Academic Records',    value: s.total_academic,     color: '#8b5cf6' },
            { label: 'Skills Recorded',     value: s.total_skills,       color: '#10b981' },
            { label: 'Non-Academic Activities', value: s.total_activities, color: '#F97316' },
            { label: 'Affiliations',        value: s.total_affiliations, color: '#6366f1' },
            { label: 'Disciplinary (Pending)', value: s.disciplinary_pending, color: '#ef4444' },
            { label: 'Disciplinary (Resolved)', value: s.disciplinary_resolved, color: '#16a34a' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '0.82em', color: '#6b7280' }}>{label}</span>
              <span style={{ fontWeight: 700, fontSize: '0.95em', color }}>{value}</span>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Row 5 — Quick Access */}
      <SectionCard title="Quick Access">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.9rem' }}>
          {[
            { to: '/students/register', label: 'Register New Student', color: '#F97316' },
            { to: '/faculties/register', label: 'Add Faculty Member',  color: '#393E46' },
            { to: '/search',             label: 'Comprehensive Search', color: '#3b82f6' },
            { to: '/students',           label: 'View All Students',   color: '#16a34a' },
            { to: '/faculties',          label: 'View All Faculty',    color: '#8b5cf6' },
          ].map(({ to, label, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '1rem', borderRadius: '10px', border: `1px solid ${color}30`, background: `${color}08`, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.7rem' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: '#222831', fontSize: '0.9em' }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
