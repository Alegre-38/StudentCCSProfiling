import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function DeleteConfirm({ faculty, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(34,40,49,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '14px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(34,40,49,0.25)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', textAlign: 'center', color: '#222831', fontSize: '1.05em', fontWeight: 800 }}>Delete Faculty?</h3>
        <p style={{ margin: '0 0 1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.88em', lineHeight: 1.5 }}>
          This will permanently delete <strong style={{ color: '#222831' }}>{faculty.First_Name} {faculty.Last_Name}</strong> and all their records. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'transparent', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.93em' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.65rem', border: 'none', borderRadius: '8px', background: '#ef4444', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '0.93em' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function FacultyList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [faculties, setFaculties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = () => {
    axios.get(`${API_URL}/faculties`)
      .then(res => { setFaculties(res.data); setFiltered(res.data); })
      .catch(err => setError(`Failed to load faculty: ${err.message}`))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    axios.delete(`${API_URL}/faculties/${deleteTarget.Faculty_ID}`)
      .then(() => { setDeleteTarget(null); fetchFaculties(); })
      .catch(err => { setError(`Delete failed: ${err.message}`); setDeleteTarget(null); });
  };

  useEffect(() => {
    let result = faculties;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.First_Name?.toLowerCase().includes(q) ||
        f.Last_Name?.toLowerCase().includes(q) ||
        f.Faculty_ID?.toLowerCase().includes(q) ||
        f.Email?.toLowerCase().includes(q) ||
        f.Department?.toLowerCase().includes(q)
      );
    }
    if (filterDept) result = result.filter(f => f.Department === filterDept);
    if (filterType) result = result.filter(f => f.Employment_Type === filterType);
    setFiltered(result);
  }, [search, filterDept, filterType, faculties]);

  const departments = [...new Set(faculties.map(f => f.Department).filter(Boolean))];

  const inputBase = {
    padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid #e5e7eb',
    fontSize: '0.88em', color: '#222831', outline: 'none', background: 'white',
    transition: 'border-color 0.2s',
  };

  const fullTime = faculties.filter(f => f.Employment_Type === 'Full-Time').length;
  const partTime = faculties.length - fullTime;

  return (
    <div className="page-container">
      {deleteTarget && <DeleteConfirm faculty={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Faculty Registry</h1>
          <p className="page-subtitle">Manage and view detailed profiles of all faculty members.</p>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="modern-card" style={{ marginBottom: '1.2rem', padding: '1.2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.8rem', alignItems: 'end' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text" placeholder="Search by name, ID, email, or department..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputBase, width: '100%', paddingLeft: '2.2rem', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#F97316'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          {/* Department filter */}
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={inputBase}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {/* Employment type filter */}
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={inputBase}>
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractual">Contractual</option>
          </select>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82em', color: '#6b7280' }}>
            Showing <strong style={{ color: '#222831' }}>{filtered.length}</strong> of <strong style={{ color: '#222831' }}>{faculties.length}</strong> faculty
          </span>
          {(search || filterDept || filterType) && (
            <button onClick={() => { setSearch(''); setFilterDept(''); setFilterType(''); }}
              style={{ fontSize: '0.82em', color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600, boxShadow: 'none' }}>
              Clear filters
            </button>
          )}
          <span style={{ fontSize: '0.82em', color: '#6b7280', marginLeft: 'auto' }}>
            Full-Time: <strong style={{ color: '#16a34a' }}>{fullTime}</strong>
            {' '}&nbsp;|&nbsp;{' '}
            Part-Time / Contractual: <strong style={{ color: '#d97706' }}>{partTime}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
        {error && <p style={{ color: '#dc2626', padding: '1rem 1.5rem', margin: 0, fontSize: '0.9em' }}>{error}</p>}

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.95em' }}>Loading faculty...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Employment</th>
                <th>Specialization</th>
                <th style={{ paddingRight: '1.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    {faculties.length === 0 ? 'No faculty registered yet.' : 'No faculty match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((f, i) => {
                  const isFullTime = f.Employment_Type === 'Full-Time';
                  return (
                    <tr key={f.Faculty_ID} style={{ animationDelay: `${i * 0.03}s` }}>
                      <td style={{ paddingLeft: '1.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.88em', color: '#6b7280', background: '#f9fafb', padding: '2px 8px', borderRadius: '4px' }}>
                          {f.Faculty_ID}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#222831', fontSize: '0.95em' }}>
                          {f.Last_Name}, {f.First_Name}
                        </div>
                        {f.Email && (
                          <div style={{ fontSize: '0.75em', color: '#9ca3af', marginTop: '1px' }}>{f.Email}</div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.88em', color: '#393E46' }}>{f.Department || '-'}</td>
                      <td style={{ fontSize: '0.88em', color: '#393E46' }}>{f.Position || '-'}</td>
                      <td>
                        <span className="badge" style={{
                          color: isFullTime ? '#16a34a' : '#d97706',
                          background: isFullTime ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                          border: `1px solid ${isFullTime ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)'}`,
                        }}>
                          {f.Employment_Type || 'N/A'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85em', color: '#6b7280' }}>{f.Specialization || '-'}</td>
                      <td style={{ paddingRight: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link to={`/faculties/${f.Faculty_ID}`}>
                            <button className="btn-primary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.83em' }}>
                              View Profile
                            </button>
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteTarget(f)}
                              style={{ padding: '0.35rem 0.7rem', fontSize: '0.83em', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FacultyList;
