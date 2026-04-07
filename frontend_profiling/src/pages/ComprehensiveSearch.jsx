import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PROGRAMS = ['BS Information Technology', 'BS Computer Science', 'BS Information Systems', 'BS Mathematics'];

const NumBadge = ({ n, color }) => (
  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75em', color: 'white', flexShrink: 0 }}>{n}</div>
);

const SectionDivider = ({ num, title, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '1.2rem 0 0.8rem' }}>
    <NumBadge n={num} color={color} />
    <span style={{ fontWeight: 700, fontSize: '0.78em', color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
    <div style={{ flex: 1, height: '1px', background: `${color}25` }} />
  </div>
);

const COLORS = { 1: '#3b82f6', 2: '#8b5cf6', 3: '#F97316', 4: '#ef4444', 5: '#10b981', 6: '#6366f1' };

const Tag = ({ children, color = '#393E46' }) => (
  <span style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: '12px', padding: '2px 9px', fontSize: '0.75em', fontWeight: 600, display: 'inline-block' }}>
    {children}
  </span>
);

function StudentCard({ s }) {
  const cleared = s.Medical_Clearance;
  const initials = ((s.First_Name?.[0] || '') + (s.Last_Name?.[0] || '')).toUpperCase();

  return (
    <div style={{ background: 'white', border: '1px solid rgba(57,62,70,0.1)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(34,40,49,0.06)', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(34,40,49,0.13)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(34,40,49,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>

      {/* Card Header */}
      <div style={{ background: 'linear-gradient(135deg, #222831, #393E46)', padding: '1.1rem 1.3rem', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1em', color: 'white', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: '#EEEEEE', fontSize: '0.97em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {s.Last_Name}, {s.First_Name}
          </div>
          <div style={{ fontSize: '0.75em', color: 'rgba(238,238,238,0.5)', marginTop: '1px' }}>{s.Student_ID}</div>
        </div>
        <span style={{ color: cleared ? '#4ade80' : '#fbbf24', background: cleared ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)', border: `1px solid ${cleared ? '#4ade8040' : '#fbbf2440'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.72em', fontWeight: 700, flexShrink: 0 }}>
          {cleared ? 'Cleared' : 'Pending'}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem 1.3rem' }}>

        {/* 1. Personal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <NumBadge n={1} color={COLORS[1]} />
          <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Personal</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', marginBottom: '0.9rem', paddingLeft: '0.2rem' }}>
          <div style={{ fontSize: '0.82em', color: '#393E46' }}>{s.Degree_Program || '—'}</div>
          <div style={{ fontSize: '0.82em', color: '#6b7280' }}>Year {s.Year_Level}</div>
          <div style={{ fontSize: '0.78em', color: '#9ca3af', gridColumn: '1/-1' }}>{s.Email || s.Email_Address}</div>
        </div>

        <div style={{ height: '1px', background: '#f0f0f0', margin: '0.7rem 0' }} />

        {/* 2. Academic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <NumBadge n={2} color={COLORS[2]} />
          <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Academic</span>
        </div>
        <div style={{ paddingLeft: '0.2rem', marginBottom: '0.9rem', fontSize: '0.82em', color: '#393E46' }}>
          {s.academic_histories?.length
            ? <span>{s.academic_histories.length} record{s.academic_histories.length > 1 ? 's' : ''} &mdash; GWA: <strong style={{ color: '#F97316' }}>{s.calculated_gwa ? Number(s.calculated_gwa).toFixed(2) : '—'}</strong></span>
            : <span style={{ color: '#d1d5db' }}>No academic records</span>}
        </div>

        <div style={{ height: '1px', background: '#f0f0f0', margin: '0.7rem 0' }} />

        {/* 3. Non-Academic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <NumBadge n={3} color={COLORS[3]} />
          <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Non-Academic</span>
        </div>
        <div style={{ paddingLeft: '0.2rem', marginBottom: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {s.non_academic_histories?.length
            ? s.non_academic_histories.slice(0, 3).map((a, i) => <Tag key={i} color="#F97316">{a.Activity_Type || a.Activity_Name}</Tag>)
            : <span style={{ fontSize: '0.8em', color: '#d1d5db' }}>No activities</span>}
          {(s.non_academic_histories?.length || 0) > 3 && <span style={{ fontSize: '0.75em', color: '#9ca3af' }}>+{s.non_academic_histories.length - 3} more</span>}
        </div>

        <div style={{ height: '1px', background: '#f0f0f0', margin: '0.7rem 0' }} />

        {/* 4. Violations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <NumBadge n={4} color={COLORS[4]} />
          <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Violations</span>
        </div>
        <div style={{ paddingLeft: '0.2rem', marginBottom: '0.9rem' }}>
          {s.disciplinary_records?.length
            ? <Tag color="#ef4444">{s.disciplinary_records.length} record{s.disciplinary_records.length > 1 ? 's' : ''}</Tag>
            : <Tag color="#16a34a">Clean Record</Tag>}
        </div>

        <div style={{ height: '1px', background: '#f0f0f0', margin: '0.7rem 0' }} />

        {/* 5. Skills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <NumBadge n={5} color={COLORS[5]} />
          <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Skills</span>
        </div>
        <div style={{ paddingLeft: '0.2rem', marginBottom: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {s.skill_repositories?.length
            ? s.skill_repositories.slice(0, 4).map((sk, i) => <Tag key={i} color="#10b981">{sk.Specific_Skill}</Tag>)
            : <span style={{ fontSize: '0.8em', color: '#d1d5db' }}>No skills recorded</span>}
          {(s.skill_repositories?.length || 0) > 4 && <span style={{ fontSize: '0.75em', color: '#9ca3af' }}>+{s.skill_repositories.length - 4} more</span>}
        </div>

        <div style={{ height: '1px', background: '#f0f0f0', margin: '0.7rem 0' }} />

        {/* 6. Affiliations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <NumBadge n={6} color={COLORS[6]} />
          <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Affiliations</span>
        </div>
        <div style={{ paddingLeft: '0.2rem', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {s.affiliations?.length
            ? s.affiliations.slice(0, 3).map((a, i) => <Tag key={i} color="#6366f1">{a.Org_Name}</Tag>)
            : <span style={{ fontSize: '0.8em', color: '#d1d5db' }}>No affiliations</span>}
        </div>

        <Link to={`/students/${s.Student_ID}`} style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.88em' }}>
            View Full Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

function ComprehensiveSearch() {
  const [filters, setFilters] = useState({
    search: '', degree_program: '', year_level: '', enrollment_status: '',
    skill: '', proficiency: '', activity_type: '', violation_status: '',
    organization: '', clearance: '',
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    axios.get(`${API_URL}/search/students`, { params })
      .then(res => { setResults(res.data); setSearched(true); setLoading(false); })
      .catch(err => { setError(`Search failed: ${err.message}`); setLoading(false); });
  };

  const handleReset = () => {
    setFilters({ search: '', degree_program: '', year_level: '', enrollment_status: '', skill: '', proficiency: '', activity_type: '', violation_status: '', organization: '', clearance: '' });
    setResults([]);
    setSearched(false);
  };

  const inp = { padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', fontSize: '0.9em', width: '100%', color: '#222831', boxSizing: 'border-box' };
  const lbl = { display: 'block', marginBottom: '0.3rem', fontSize: '0.78em', fontWeight: 600, color: '#6b7280' };
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' };

  const PRESETS = [
    { label: '1. Personal — Year 1', preset: { year_level: '1' } },
    { label: '2. Academic — BSIT',   preset: { degree_program: 'BS Information Technology' } },
    { label: '3. Non-Academic — Sports', preset: { activity_type: 'Sports' } },
    { label: '4. Violations — Pending',  preset: { violation_status: 'Pending' } },
    { label: '5. Skills — Basketball',   preset: { skill: 'Basketball' } },
    { label: '6. Affiliations — JPIA',   preset: { organization: 'JPIA' } },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 className="page-title">Comprehensive Search</h1>
        <p className="page-subtitle">Query students by any of the 6 profile categories.</p>
      </div>

      {/* Quick Presets */}
      <div className="modern-card" style={{ marginBottom: '1.2rem', background: 'rgba(249,115,22,0.03)', border: '1px solid rgba(249,115,22,0.18)', padding: '1.1rem 1.4rem' }}>
        <p style={{ margin: '0 0 0.7rem 0', fontWeight: 700, color: '#F97316', fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Demo Presets</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map(({ label, preset }) => (
            <button key={label} type="button"
              onClick={() => setFilters(f => ({ ...f, ...preset }))}
              style={{ padding: '0.38rem 1rem', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.35)', background: 'rgba(249,115,22,0.08)', color: '#F97316', cursor: 'pointer', fontSize: '0.82em', fontWeight: 600 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Form */}
      <div className="modern-card" style={{ marginBottom: '1.4rem' }}>
        <form onSubmit={handleSearch}>
          <SectionDivider num={1} title="Personal Information" color={COLORS[1]} />
          <div style={{ ...g2, marginBottom: '0.5rem' }}>
            <div><label style={lbl}>Name / Student ID / Email</label><input type="text" name="search" value={filters.search} onChange={handleChange} placeholder="Search..." style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div><label style={lbl}>Year Level</label>
                <select name="year_level" value={filters.year_level} onChange={handleChange} style={inp}>
                  <option value="">All Years</option>
                  {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Enrollment Status</label>
                <select name="enrollment_status" value={filters.enrollment_status} onChange={handleChange} style={inp}>
                  <option value="">Any</option><option>New</option><option>Transferee</option><option>Returning</option>
                </select>
              </div>
            </div>
          </div>

          <SectionDivider num={2} title="Academic History" color={COLORS[2]} />
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={lbl}>Degree Program</label>
            <select name="degree_program" value={filters.degree_program} onChange={handleChange} style={{ ...inp, maxWidth: '360px' }}>
              <option value="">All Programs</option>
              {PROGRAMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <SectionDivider num={3} title="Non-Academic Activities" color={COLORS[3]} />
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={lbl}>Activity Type</label>
            <select name="activity_type" value={filters.activity_type} onChange={handleChange} style={{ ...inp, maxWidth: '360px' }}>
              <option value="">Any Activity</option>
              <option>Sports</option><option>Cultural</option><option>Community Service</option>
              <option>Leadership</option><option>Academic Competition</option>
            </select>
          </div>

          <SectionDivider num={4} title="Violations / Disciplinary Records" color={COLORS[4]} />
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={lbl}>Disciplinary Status</label>
            <select name="violation_status" value={filters.violation_status} onChange={handleChange} style={{ ...inp, maxWidth: '360px' }}>
              <option value="">Any</option>
              <option value="none">No Records (Clean)</option>
              <option value="Pending">Has Pending Violation</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Has Resolved Violation</option>
            </select>
          </div>

          <SectionDivider num={5} title="Skills" color={COLORS[5]} />
          <div style={{ ...g2, marginBottom: '0.5rem' }}>
            <div><label style={lbl}>Skill / Category</label><input type="text" name="skill" value={filters.skill} onChange={handleChange} placeholder="e.g. Basketball, Python" style={inp} /></div>
            <div><label style={lbl}>Proficiency Level</label>
              <select name="proficiency" value={filters.proficiency} onChange={handleChange} style={inp}>
                <option value="">Any Level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>

          <SectionDivider num={6} title="Affiliations (Orgs, Sports Teams)" color={COLORS[6]} />
          <div style={{ ...g2, marginBottom: '1rem' }}>
            <div><label style={lbl}>Organization Name</label><input type="text" name="organization" value={filters.organization} onChange={handleChange} placeholder="e.g. JPIA, GDSC" style={inp} /></div>
            <div><label style={lbl}>Medical Clearance</label>
              <select name="clearance" value={filters.clearance} onChange={handleChange} style={inp}>
                <option value="">Any</option><option value="cleared">Cleared</option><option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0' }}>
            <button type="button" onClick={handleReset} style={{ padding: '0.65rem 1.4rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'transparent', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.93em' }}>Reset</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.65rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              {loading ? 'Searching...' : 'Search Students'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.9rem 1rem', background: 'rgba(239,68,68,0.06)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.9em' }}>{error}</div>
      )}

      {searched && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.05em', fontWeight: 700, color: '#222831' }}>
              Search Results
            </h2>
            <span style={{ background: 'rgba(249,115,22,0.12)', color: '#F97316', padding: '0.3rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85em' }}>
              {results.length} student{results.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {results.length === 0 ? (
            <div className="modern-card" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              No students match the selected criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
              {results.map(s => <StudentCard key={s.Student_ID} s={s} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ComprehensiveSearch;
