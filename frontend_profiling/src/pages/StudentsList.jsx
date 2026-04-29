import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PAGE_SIZE = 20;

const SPORT_OPTIONS = ['Basketball','Volleyball','Swimming','Badminton','Football','Table Tennis','All Sports'];
const ACTIVITY_OPTIONS = ['Sports','Cultural','Community Service','Leadership','Academic Competition'];
const SKILL_OPTIONS = ['Python','Java','Web Development','Database Management','Networking','Cybersecurity','Mobile Development','UI/UX Design'];

function ExportModal({ students, onClose }) {
  const [exportType, setExportType] = useState('all'); // all | sport | activity | skill | clearance
  const [sportFilter, setSportFilter] = useState('Basketball');
  const [activityFilter, setActivityFilter] = useState('Sports');
  const [skillFilter, setSkillFilter] = useState('');
  const [clearanceFilter, setClearanceFilter] = useState('cleared');
  const [loading, setLoading] = useState(false);

  const inp = { width:'100%', padding:'0.6rem 0.9rem', borderRadius:'8px', border:'1px solid #e5e7eb', fontSize:'0.88em', color:'#222831', outline:'none', background:'white', boxSizing:'border-box' };
  const lbl = { display:'block', marginBottom:'0.3rem', fontSize:'0.75em', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' };

  const handleExport = async () => {
    setLoading(true);
    try {
      let exportStudents = [...students];
      let filterLabel = 'All Students';

      if (exportType === 'clearance') {
        const cleared = clearanceFilter === 'cleared';
        exportStudents = students.filter(s => cleared ? (s.Med_Clearance || s.Medical_Clearance) : (!s.Med_Clearance && !s.Medical_Clearance));
        filterLabel = cleared ? 'Cleared Students' : 'Pending Clearance Students';
        generatePDF(exportStudents, filterLabel);
      } else if (exportType === 'all') {
        generatePDF(exportStudents, 'All Students');
      } else {
        // Fetch from search API
        let params = {};
        if (exportType === 'sport') {
          params.activity_type = 'Sports';
          params.search = sportFilter === 'All Sports' ? '' : sportFilter;
          filterLabel = sportFilter === 'All Sports' ? 'All Sports Players' : `${sportFilter} Players`;
        } else if (exportType === 'activity') {
          params.activity_type = activityFilter;
          filterLabel = `${activityFilter} Activities`;
        } else if (exportType === 'skill') {
          params.skill = skillFilter;
          filterLabel = `Skill: ${skillFilter}`;
        }
        const res = await axios.get(`${API_URL}/search/students`, { params });
        exportStudents = res.data;
        generatePDF(exportStudents, filterLabel);
      }
    } catch (e) {
      alert('Export failed: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const generatePDF = (data, filterLabel) => {
    if (data.length === 0) {
      alert(`No students found for: ${filterLabel}`);
      return;
    }
    const now = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
    const cleared = data.filter(s => s.Med_Clearance || s.Medical_Clearance).length;

    const rows = data.map((s, i) => `
      <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
        <td>${i+1}</td>
        <td style="font-family:monospace;font-size:11px;color:#6b7280">${s.Student_ID}</td>
        <td><strong>${s.Last_Name}, ${s.First_Name}</strong></td>
        <td>${s.Degree_Program || '—'}</td>
        <td>Year ${s.Year_Level}</td>
        <td>${s.Section || '—'}</td>
        <td>${s.Email || s.Email_Address || '—'}</td>
        <td>${s.Enrollment_Status || '—'}</td>
        <td style="color:${(s.Med_Clearance||s.Medical_Clearance)?'#16a34a':'#d97706'};font-weight:700">
          ${(s.Med_Clearance||s.Medical_Clearance)?'Cleared':'Pending'}
        </td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>${filterLabel} — Student Report</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#222831;padding:32px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #F97316}
      .school{font-size:13px;font-weight:800;color:#222831}
      .dept{font-size:11px;color:#6b7280}
      .report-title{font-size:18px;font-weight:800;color:#F97316;margin-top:4px}
      .meta{text-align:right;font-size:11px;color:#9ca3af}
      .stats{display:flex;gap:12px;margin-bottom:16px}
      .stat{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:8px 14px}
      .stat-val{font-size:18px;font-weight:800}
      .filter-tag{display:inline-block;background:#fff8f0;border:1px solid #fed7aa;border-radius:6px;padding:5px 12px;margin-bottom:14px;font-size:11px;color:#92400e;font-weight:600}
      table{width:100%;border-collapse:collapse;font-size:11px}
      thead tr{background:#222831;color:white}
      th{padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
      td{padding:7px 10px;border-bottom:1px solid #f0f0f0;vertical-align:middle}
      .footer{margin-top:20px;padding-top:10px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;text-align:center}
      @media print{body{padding:16px}}
    </style></head><body>
    <div class="header">
      <div>
        <div class="school">Pamantasan ng Cabuyao</div>
        <div class="dept">College of Computer Studies</div>
        <div class="report-title">${filterLabel}</div>
      </div>
      <div class="meta"><div>Generated: ${now}</div><div>Total: ${data.length} students</div></div>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-val" style="color:#F97316">${data.length}</div><div style="font-size:10px;color:#9ca3af;text-transform:uppercase">Total</div></div>
      <div class="stat"><div class="stat-val" style="color:#16a34a">${cleared}</div><div style="font-size:10px;color:#9ca3af;text-transform:uppercase">Cleared</div></div>
      <div class="stat"><div class="stat-val" style="color:#d97706">${data.length-cleared}</div><div style="font-size:10px;color:#9ca3af;text-transform:uppercase">Pending</div></div>
    </div>
    <div class="filter-tag">Export Filter: ${filterLabel}</div>
    <table>
      <thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Program</th><th>Year</th><th>Section</th><th>Email</th><th>Status</th><th>Clearance</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">CCS Student Profiling System · Pamantasan ng Cabuyao · Confidential · ${now}</div>
    <script>window.onload=function(){window.print();}<\/script>
    </body></html>`;

    // Use blob URL to avoid popup blocker
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (!win) {
      // Fallback: download as HTML file
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filterLabel.replace(/\s+/g,'-')}-${new Date().toISOString().slice(0,10)}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(34,40,49,0.6)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'16px',width:'100%',maxWidth:'480px',boxShadow:'0 24px 60px rgba(34,40,49,0.25)',overflow:'hidden'}}>
        <div style={{height:'3px',background:'linear-gradient(90deg,#F97316,#d9620f)'}}/>
        <div style={{padding:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.3rem'}}>
            <div>
              <div style={{fontWeight:800,fontSize:'1em',color:'#222831'}}>Export Students to PDF</div>
              <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>Choose what to include in the report</div>
            </div>
            <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',padding:'0.2rem',boxShadow:'none'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Export type selector */}
          <div style={{marginBottom:'1.2rem'}}>
            <label style={lbl}>Export Type</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
              {[
                {val:'all',      label:'All Students',    icon:'👥'},
                {val:'sport',    label:'By Sport',        icon:'🏀'},
                {val:'activity', label:'By Activity',     icon:'🎭'},
                {val:'skill',    label:'By Skill',        icon:'💡'},
                {val:'clearance',label:'By Clearance',    icon:'✅'},
              ].map(({val,label,icon}) => (
                <button key={val} type="button" onClick={() => setExportType(val)}
                  style={{padding:'0.6rem 0.8rem',borderRadius:'9px',border:`1.5px solid ${exportType===val?'#F97316':'#e5e7eb'}`,background:exportType===val?'rgba(249,115,22,0.06)':'white',color:exportType===val?'#F97316':'#6b7280',fontWeight:exportType===val?700:500,fontSize:'0.83em',cursor:'pointer',transition:'all 0.15s',textAlign:'left',display:'flex',alignItems:'center',gap:'0.4rem'}}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional filters */}
          {exportType === 'sport' && (
            <div style={{marginBottom:'1.2rem'}}>
              <label style={lbl}>Select Sport</label>
              <select value={sportFilter} onChange={e => setSportFilter(e.target.value)} style={inp}>
                {SPORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          {exportType === 'activity' && (
            <div style={{marginBottom:'1.2rem'}}>
              <label style={lbl}>Activity Type</label>
              <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} style={inp}>
                {ACTIVITY_OPTIONS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          )}
          {exportType === 'skill' && (
            <div style={{marginBottom:'1.2rem'}}>
              <label style={lbl}>Skill</label>
              <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={inp}>
                <option value="">Select a skill</option>
                {SKILL_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          {exportType === 'clearance' && (
            <div style={{marginBottom:'1.2rem'}}>
              <label style={lbl}>Clearance Status</label>
              <select value={clearanceFilter} onChange={e => setClearanceFilter(e.target.value)} style={inp}>
                <option value="cleared">Cleared Students</option>
                <option value="pending">Pending Clearance</option>
              </select>
            </div>
          )}

          <div style={{display:'flex',gap:'0.8rem',marginTop:'0.5rem'}}>
            <button onClick={onClose} style={{flex:1,padding:'0.7rem',border:'1px solid #e5e7eb',borderRadius:'9px',background:'white',color:'#393E46',fontWeight:600,fontSize:'0.88em',cursor:'pointer'}}>
              Cancel
            </button>
            <button onClick={handleExport} disabled={loading || (exportType==='skill' && !skillFilter)}
              style={{flex:2,padding:'0.7rem',borderRadius:'9px',background:loading?'rgba(249,115,22,0.5)':'linear-gradient(135deg,#F97316,#d9620f)',color:'white',border:'none',fontWeight:700,fontSize:'0.88em',cursor:loading?'not-allowed':'pointer',boxShadow:'0 3px 12px rgba(249,115,22,0.3)',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              {loading ? 'Preparing...' : 'Generate PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    }
  }
  // Insert ellipsis
  const withEllipsis = [];
  let prev = null;
  for (const p of pages) {
    if (prev && p - prev > 1) withEllipsis.push('...');
    withEllipsis.push(p);
    prev = p;
  }

  const btn = (content, active, disabled, onClick) => (
    <button key={content} onClick={onClick} disabled={disabled}
      style={{ minWidth: '34px', height: '34px', padding: '0 0.5rem', borderRadius: '8px', border: active ? 'none' : '1px solid #e5e7eb', background: active ? '#F97316' : disabled ? '#f9fafb' : 'white', color: active ? 'white' : disabled ? '#d1d5db' : '#393E46', fontWeight: active ? 700 : 500, fontSize: '0.85em', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', boxShadow: active ? '0 2px 8px rgba(249,115,22,0.3)' : 'none' }}>
      {content}
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.82em', color: '#9ca3af' }}>
        Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
      </span>
      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
        {btn('‹', false, page === 1, () => onChange(page - 1))}
        {withEllipsis.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} style={{ padding: '0 0.3rem', color: '#9ca3af', fontSize: '0.85em' }}>…</span>
            : btn(p, p === page, false, () => onChange(p))
        )}
        {btn('›', false, page === totalPages, () => onChange(page + 1))}
      </div>
    </div>
  );
}

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
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);

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
    setPage(1);
  }, [search, filterProgram, filterYear, filterClearance, students]);

  const handleDelete = () => {
    axios.delete(`${API_URL}/students/${deleteTarget.Student_ID}`)
      .then(() => { setDeleteTarget(null); fetchStudents(); })
      .catch(err => { setError(`Delete failed: ${err.message}`); setDeleteTarget(null); });
  };

  const VALID_PROGRAMS = ['BS Computer Science', 'BS Information Technology'];
  const programs = [...new Set(students.map(s => s.Degree_Program).filter(p => VALID_PROGRAMS.includes(p)))];
  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const exportPDF = () => {
    const now = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
    const cleared = filtered.filter(s => s.Med_Clearance || s.Medical_Clearance).length;
    const pending  = filtered.length - cleared;

    const rows = filtered.map((s, i) => `
      <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
        <td>${i+1}</td>
        <td style="font-family:monospace;font-size:11px;color:#6b7280">${s.Student_ID}</td>
        <td><strong>${s.Last_Name}, ${s.First_Name}</strong></td>
        <td>${s.Degree_Program || '—'}</td>
        <td>Year ${s.Year_Level}</td>
        <td>${s.Section || '—'}</td>
        <td>${s.Email || s.Email_Address || '—'}</td>
        <td>${s.Enrollment_Status || '—'}</td>
        <td style="color:${(s.Med_Clearance||s.Medical_Clearance)?'#16a34a':'#d97706'};font-weight:700">
          ${(s.Med_Clearance||s.Medical_Clearance)?'Cleared':'Pending'}
        </td>
      </tr>`).join('');

    const filterDesc = [
      filterProgram && `Program: ${filterProgram}`,
      filterYear    && `Year: ${filterYear}`,
      filterClearance && `Clearance: ${filterClearance}`,
      search        && `Search: "${search}"`,
    ].filter(Boolean).join(' · ') || 'All Students';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Student Information Report</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #222831; padding: 32px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #F97316; }
      .title { font-size: 22px; font-weight: 800; color: #222831; }
      .subtitle { font-size: 12px; color: #6b7280; margin-top: 4px; }
      .meta { text-align: right; font-size: 11px; color: #9ca3af; }
      .stats { display: flex; gap: 16px; margin-bottom: 20px; }
      .stat { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 16px; }
      .stat-val { font-size: 20px; font-weight: 800; }
      .stat-lbl { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
      .filter-bar { background: #fff8f0; border: 1px solid #fed7aa; border-radius: 6px; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; color: #92400e; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      thead tr { background: #222831; color: white; }
      th { padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
      td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
      .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; }
      @media print { body { padding: 16px; } }
    </style></head><body>
    <div class="header">
      <div>
        <div class="title">Profiling System</div>
        <div class="subtitle">Student Information Report</div>
      </div>
      <div class="meta">
        <div>Generated: ${now}</div>
        <div>Total Records: ${filtered.length}</div>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-val" style="color:#F97316">${filtered.length}</div><div class="stat-lbl">Total Students</div></div>
      <div class="stat"><div class="stat-val" style="color:#16a34a">${cleared}</div><div class="stat-lbl">Cleared</div></div>
      <div class="stat"><div class="stat-val" style="color:#d97706">${pending}</div><div class="stat-lbl">Pending</div></div>
    </div>
    <div class="filter-bar">Filter: ${filterDesc}</div>
    <table>
      <thead><tr>
        <th>#</th><th>Student ID</th><th>Name</th><th>Program</th>
        <th>Year</th><th>Section</th><th>Email</th><th>Status</th><th>Clearance</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">CCS Student Profiling System · Confidential · ${now}</div>
    </body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.print(); };
  };

  const inputBase = {
    padding:'0.55rem 0.9rem', borderRadius:'8px', border:'1px solid #e5e7eb',
    fontSize:'0.88em', color:'#222831', outline:'none', background:'white',
    transition:'border-color 0.2s',
  };

  return (
    <div className="page-container">
      {deleteTarget && <DeleteConfirm student={deleteTarget} 
      onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {showExportModal && <ExportModal students={filtered} onClose={() => setShowExportModal(false)} />}
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.8rem', flexWrap:'wrap', gap:'1rem'}}>
        <div>
          <h1 className="page-title">Student Information</h1>
          <p className="page-subtitle">Manage and view detailed profiles of all enrolled students.</p>
        </div>
        <button onClick={() => setShowExportModal(true)} disabled={filtered.length === 0}
          style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.65rem 1.3rem',borderRadius:'9px',border:'1px solid rgba(249,115,22,0.3)',background:'rgba(249,115,22,0.06)',color:'#F97316',fontWeight:700,fontSize:'0.85em',cursor:filtered.length===0?'not-allowed':'pointer',transition:'all 0.2s',opacity:filtered.length===0?0.5:1}}
          onMouseEnter={e=>{if(filtered.length>0){e.currentTarget.style.background='#F97316';e.currentTarget.style.color='white';}}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(249,115,22,0.06)';e.currentTarget.style.color='#F97316';}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          Export PDF ({filtered.length})
        </button>
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
            Showing <strong style={{color:'#222831'}}>{Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong style={{color:'#222831'}}>{filtered.length}</strong> students
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
                paginated.map((student, i) => {
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
        {!loading && filtered.length > 0 && (
          <Pagination total={filtered.length} page={page} perPage={PAGE_SIZE} onChange={setPage} />
        )}
      </div>
    </div>
  );
}

export default StudentsList;
