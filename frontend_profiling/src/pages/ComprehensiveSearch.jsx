import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PROGRAMS = ['BS Information Technology', 'BS Computer Science'];

const COLORS = { 1: '#3b82f6', 2: '#8b5cf6', 3: '#F97316', 4: '#ef4444', 5: '#10b981', 6: '#6366f1' };

const NumBadge = ({ n, color }) => (
  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72em', color: 'white', flexShrink: 0 }}>{n}</div>
);

const SectionDivider = ({ num, title, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '1.2rem 0 0.8rem' }}>
    <NumBadge n={num} color={color} />
    <span style={{ fontWeight: 700, fontSize: '0.78em', color: '#222831', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
    <div style={{ flex: 1, height: '1px', background: `${color}25` }} />
  </div>
);

function ComprehensiveSearch() {
  const [filters, setFilters] = useState({
    search: '', degree_program: '', year_level: '', enrollment_status: '',
    skill: '', proficiency: '', activity_type: '', violation_status: '',
    organization: '', clearance: '',
  });
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [resultSearch, setResultSearch] = useState('');

  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResultSearch('');
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    axios.get(`${API_URL}/search/students`, { params })
      .then(res => { setResults(res.data); setSearched(true); })
      .catch(err => setError(`Search failed: ${err.message}`))
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setFilters({ search: '', degree_program: '', year_level: '', enrollment_status: '', skill: '', proficiency: '', activity_type: '', violation_status: '', organization: '', clearance: '' });
    setResults([]); setSearched(false); setResultSearch('');
  };

  // Filter results by the inline search bar
  const filtered = useMemo(() => {
    if (!resultSearch.trim()) return results;
    const q = resultSearch.toLowerCase();
    return results.filter(s =>
      s.First_Name?.toLowerCase().includes(q) ||
      s.Last_Name?.toLowerCase().includes(q) ||
      s.Student_ID?.toLowerCase().includes(q) ||
      (s.Email || s.Email_Address)?.toLowerCase().includes(q) ||
      s.Degree_Program?.toLowerCase().includes(q)
    );
  }, [results, resultSearch]);

  const inp = { padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', fontSize: '0.9em', width: '100%', color: '#222831', boxSizing: 'border-box' };
  const lbl = { display: 'block', marginBottom: '0.3rem', fontSize: '0.78em', fontWeight: 600, color: '#6b7280' };
  const g2  = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 className="page-title">Comprehensive Search</h1>
        <p className="page-subtitle">Query students by any of the 6 profile categories.</p>
      </div>

      {/* Filter Form */}
      <div className="modern-card" style={{ marginBottom: '1.4rem' }}>
        <form onSubmit={handleSearch}>
          <SectionDivider num={1} title="Personal Information" color={COLORS[1]} />
          <div style={{ ...g2, marginBottom: '0.5rem' }}>
            <div><label style={lbl}>Name / Student ID / Email</label>
              <input type="text" name="search" value={filters.search} onChange={handleChange} placeholder="Search by name, ID or email..." style={inp} />
            </div>
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
            <div><label style={lbl}>Skill / Category</label>
              <input type="text" name="skill" value={filters.skill} onChange={handleChange} placeholder="e.g. Basketball, Python" style={inp} />
            </div>
            <div><label style={lbl}>Proficiency Level</label>
              <select name="proficiency" value={filters.proficiency} onChange={handleChange} style={inp}>
                <option value="">Any Level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>

          <SectionDivider num={6} title="Affiliations / Organizations" color={COLORS[6]} />
          <div style={{ ...g2, marginBottom: '1rem' }}>
            <div><label style={lbl}>Organization Name</label>
              <input type="text" name="organization" value={filters.organization} onChange={handleChange} placeholder="e.g. JPIA, GDSC" style={inp} />
            </div>
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

      {/* Results */}
      {searched && (
        <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Results header */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95em', color: '#222831' }}>Search Results</span>
              <span style={{ background: 'rgba(249,115,22,0.12)', color: '#F97316', padding: '0.2rem 0.8rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.82em', border: '1px solid rgba(249,115,22,0.2)' }}>
                {results.length} student{results.length !== 1 ? 's' : ''} found
              </span>
              {resultSearch && filtered.length !== results.length && (
                <span style={{ fontSize: '0.8em', color: '#9ca3af' }}>
                  showing {filtered.length} of {results.length}
                </span>
              )}
            </div>

            {/* Inline search bar — only shown when there are results */}
            {results.length > 0 && (
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <svg style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Filter results by name, ID, email..."
                  value={resultSearch}
                  onChange={e => setResultSearch(e.target.value)}
                  style={{ ...inp, paddingLeft: '2.1rem', fontSize: '0.85em', border: '1px solid #e2e8f0' }}
                />
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              No students match the selected criteria.
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              No results match your filter.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '1.5rem' }}>Student No.</th>
                  <th>Name</th>
                  <th>Program & Year</th>
                  <th>Email</th>
                  <th>Skills</th>
                  <th>Violations</th>
                  <th>Clearance</th>
                  <th style={{ paddingRight: '1.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const cleared = s.Medical_Clearance;
                  const initials = ((s.First_Name?.[0] || '') + (s.Last_Name?.[0] || '')).toUpperCase();
                  return (
                    <tr key={s.Student_ID} style={{ animationDelay: `${i * 0.02}s` }}>
                      <td style={{ paddingLeft: '1.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85em', color: '#6b7280', background: '#f9fafb', padding: '2px 8px', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                          {s.Student_ID}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#d9620f)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72em', flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#222831', fontSize: '0.92em' }}>
                              {s.Last_Name}, {s.First_Name}
                            </div>
                            {s.Enrollment_Status && (
                              <div style={{ fontSize: '0.72em', color: '#9ca3af' }}>{s.Enrollment_Status}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85em', color: '#393E46', fontWeight: 500 }}>{s.Degree_Program || '—'}</div>
                        <div style={{ fontSize: '0.75em', color: '#9ca3af' }}>Year {s.Year_Level}</div>
                      </td>
                      <td style={{ fontSize: '0.83em', color: '#6b7280' }}>{s.Email || s.Email_Address || '—'}</td>
                      <td>
                        {s.skill_repositories?.length
                          ? <span style={{ fontSize: '0.8em', color: '#10b981', fontWeight: 600 }}>{s.skill_repositories.length} skill{s.skill_repositories.length > 1 ? 's' : ''}</span>
                          : <span style={{ fontSize: '0.8em', color: '#d1d5db' }}>—</span>}
                      </td>
                      <td>
                        {s.disciplinary_records?.length
                          ? <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px', padding: '2px 8px', fontSize: '0.78em', fontWeight: 600 }}>{s.disciplinary_records.length} record{s.disciplinary_records.length > 1 ? 's' : ''}</span>
                          : <span style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', borderRadius: '12px', padding: '2px 8px', fontSize: '0.78em', fontWeight: 600 }}>Clean</span>}
                      </td>
                      <td>
                        <span className="badge" style={{
                          color: cleared ? '#16a34a' : '#d97706',
                          background: cleared ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                          border: `1px solid ${cleared ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)'}`,
                        }}>
                          {cleared ? 'Cleared' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ paddingRight: '1.5rem' }}>
                        <Link to={`/students/${s.Student_ID}`}>
                          <button className="btn-primary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.82em' }}>
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default ComprehensiveSearch;
