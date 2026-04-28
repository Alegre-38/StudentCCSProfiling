import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function DeleteConfirm({ student, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(34,40,49,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '14px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(34,40,49,0.25)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', textAlign: 'center', color: '#222831', fontSize: '1.05em', fontWeight: 800 }}>Delete Student?</h3>
        <p style={{ margin: '0 0 1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.88em', lineHeight: 1.5 }}>
          This will permanently delete <strong style={{ color: '#222831' }}>{student.First_Name} {student.Last_Name}</strong> and all their records. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'transparent', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.93em' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.65rem', border: 'none', borderRadius: '8px', background: '#ef4444', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '0.93em' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterClearance, setFilterClearance] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStudents = () => {
    axios.get(`${API_URL}/students`)
      .then(res => { setStudents(res.data); setFiltered(res.data); })
      .catch(err => setError(`Failed to load students: ${err.message}`))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    let result = students;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.First_Name?.toLowerCase().includes(q) ||
        s.Last_Name?.toLowerCase().includes(q) ||
        s.Student_ID?.toLowerCase().includes(q) ||
        (s.Email_Address || s.Email)?.toLowerCase().includes(q)
      );
    }
    if (filterProgram) result = result.filter(s => s.Degree_Program === filterProgram);
    if (filterYear)    result = result.filter(s => String(s.Year_Level) === filterYear);
    if (filterClearance === 'cleared')  result = result.filter(s => s.Med_Clearance || s.Medical_Clearance);
    if (filterClearance === 'pending')  result = result.filter(s => !s.Med_Clearance && !s.Medical_Clearance);
    setFiltered(result);
  }, [search, filterProgram, filterYear, filterClearance, students]);

  const handleDelete = () => {
    axios.delete(`${API_URL}/students/${deleteTarget.Student_ID}`)
      .then(() => { setDeleteTarget(null); fetchStudents(); })
      .catch(err => { setError(`Delete failed: ${err.message}`); setDeleteTarget(null); });
  };

  const programs = [...new Set(students.map(s => s.Degree_Program).filter(Boolean))];

  const inputBase = {
    padding:'0.55rem 0.9rem', borderRadius:'8px', border:'1px solid #e5e7eb',
    fontSize:'0.88em', color:'#222831', outline:'none', background:'white',
    transition:'border-color 0.2s',
  };

  return (
    <div className="page-container">
      {deleteTarget && <DeleteConfirm student={deleteTarget} 
      onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.8rem', flexWrap:'wrap', gap:'1rem'}}>
        <div>
          <h1 className="page-title">Student Information</h1>
          <p className="page-subtitle">Manage and view detailed profiles of all enrolled students.</p>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="modern-card" style={{marginBottom:'1.2rem', padding:'1.2rem 1.5rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'0.8rem', alignItems:'end'}}>
          {/* Search */}
          <div style={{position:'relative'}}>
            <svg style={{position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none'}}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text" placeholder="Search by name, ID, or email..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{...inputBase, width:'100%', paddingLeft:'2.2rem', boxSizing:'border-box'}}
              onFocus={e => e.target.style.borderColor='#F97316'}
              onBlur={e => e.target.style.borderColor='#e5e7eb'}
            />
          </div>
          {/* Program filter */}
          <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} style={inputBase}>
            <option value="">All Programs</option>
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {/* Year filter */}
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={inputBase}>
            <option value="">All Years</option>
            {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
          {/* Clearance filter */}
          <select value={filterClearance} onChange={e => setFilterClearance(e.target.value)} style={inputBase}>
            <option value="">All Clearance</option>
            <option value="cleared">Cleared</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Stats row */}
        <div style={{display:'flex', gap:'1.5rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #f0f0f0', flexWrap:'wrap'}}>
          <span style={{fontSize:'0.82em', color:'#6b7280'}}>
            Showing <strong style={{color:'#222831'}}>{filtered.length}</strong> of <strong style={{color:'#222831'}}>{students.length}</strong> students
          </span>
          {(search || filterProgram || filterYear || filterClearance) && (
            <button onClick={() => { setSearch(''); setFilterProgram(''); setFilterYear(''); setFilterClearance(''); }}
              style={{fontSize:'0.82em', color:'#F97316', background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:600, boxShadow:'none'}}>
              Clear filters
            </button>
          )}
          <span style={{fontSize:'0.82em', color:'#6b7280', marginLeft:'auto'}}>
            Cleared: <strong style={{color:'#16a34a'}}>{students.filter(s => s.Med_Clearance || s.Medical_Clearance).length}</strong>
            {' '}&nbsp;|&nbsp;{' '}
            Pending: <strong style={{color:'#d97706'}}>{students.filter(s => !s.Med_Clearance && !s.Medical_Clearance).length}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="modern-card" style={{padding:0, overflow:'hidden'}}>
        {error && <p style={{color:'#dc2626', padding:'1rem 1.5rem', margin:0, fontSize:'0.9em'}}>{error}</p>}

        {loading ? (
          <div style={{padding:'3rem', textAlign:'center', color:'#9ca3af', fontSize:'0.95em'}}>Loading students...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{paddingLeft:'1.5rem'}}>ID</th>
                <th>Name</th>
                <th>Program &amp; Year</th>
                <th>Email</th>
                <th>Clearance</th>
                <th style={{paddingRight:'1.5rem'}}>Action</th>
              </tr>            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign:'center', padding:'3rem', color:'#9ca3af'}}>                    {students.length === 0 ? 'No students registered yet.' : 'No students match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((student, i) => {
                  const cleared = student.Med_Clearance || student.Medical_Clearance;
                  return (
                    <tr key={student.Student_ID} style={{animationDelay:`${i*0.03}s`}}>
                      <td style={{paddingLeft:'1.5rem'}}>
                        <span style={{fontFamily:'monospace', fontSize:'0.88em', color:'#6b7280', background:'#f9fafb', padding:'2px 8px', borderRadius:'4px'}}>
                          {student.Student_ID}
                        </span>
                      </td>
                      <td>
                        <div style={{fontWeight:600, color:'#222831', fontSize:'0.95em'}}>
                          {student.Last_Name}, {student.First_Name}
                        </div>
                        {student.Enrollment_Status && (
                          <div style={{fontSize:'0.75em', color:'#9ca3af', marginTop:'1px'}}>{student.Enrollment_Status}</div>
                        )}
                      </td>
                      <td>
                        <div style={{fontSize:'0.88em', color:'#393E46'}}>{student.Degree_Program}</div>
                        <div style={{fontSize:'0.78em', color:'#9ca3af'}}>Year {student.Year_Level}</div>
                      </td>
                      <td style={{fontSize:'0.88em', color:'#6b7280'}}>{student.Email_Address || student.Email}</td>
                      <td>
                        <span className="badge" style={{
                          color: cleared ? '#16a34a' : '#d97706',
                          background: cleared ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                          border: `1px solid ${cleared ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)'}`,
                        }}>
                          {cleared ? 'Cleared' : 'Pending'}
                        </span>
                      </td>
                      <td style={{paddingRight:'1.5rem'}}>
                        <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                          <Link to={`/students/${student.Student_ID}`}>
                            <button className="btn-primary" style={{padding:'0.35rem 0.9rem', fontSize:'0.83em'}}>
                              View
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(student)}
                            style={{padding:'0.35rem 0.7rem', fontSize:'0.83em', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', background:'rgba(239,68,68,0.06)', color:'#ef4444', cursor:'pointer', fontWeight:600, transition:'all 0.2s'}}
                            onMouseEnter={e => { e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.06)'; e.currentTarget.style.color='#ef4444'; }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                            </svg>
                          </button>
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

export default StudentsList;
