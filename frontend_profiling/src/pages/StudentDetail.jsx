import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const card = {
  background: '#fff', border: '1px solid rgba(57,62,70,0.1)',
  borderRadius: '16px', padding: '1.8rem',
  boxShadow: '0 2px 12px rgba(34,40,49,0.06)', marginBottom: '1.5rem',
};
const inp = {
  width: '100%', padding: '0.55rem 0.9rem', borderRadius: '8px',
  border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.93em', boxSizing: 'border-box',
  color: '#222831', background: 'white',
};

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

function EditStudentModal({ student, onClose, onSaved }) {
  const [form, setForm] = useState({
    First_Name: student.First_Name || '', Middle_Name: student.Middle_Name || '',
    Last_Name: student.Last_Name || '', Date_of_Birth: student.Date_of_Birth || '',
    Gender: student.Gender || '', Civil_Status: student.Civil_Status || '',
    Nationality: student.Nationality || '', Religion: student.Religion || '',
    Email: student.Email_Address || student.Email || '',
    Mobile_Number: student.Mobile_Number || '',
    Street: student.Street || '', Barangay: student.Barangay || '',
    City: student.City || '', Province: student.Province || '', ZIP_Code: student.ZIP_Code || '',
    Year_Level: String(student.Year_Level || '1'),
    Degree_Program: student.Degree_Program || '',
    Section: student.Section || '', School_Year: student.School_Year || '',
    Enrollment_Status: student.Enrollment_Status || 'New',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    axios.put(`${API_URL}/students/${student.Student_ID}`, form)
      .then(() => { onSaved(); onClose(); })
      .catch(err => {
        const msg = err.response?.data?.message
          || Object.values(err.response?.data?.errors || {})[0]?.[0]
          || 'Update failed.';
        setError(msg);
        setSaving(false);
      });
  };

  const lbl = { display: 'block', fontSize: '0.78em', fontWeight: 600, color: '#393E46', marginBottom: '0.3rem' };
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(34,40,49,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '660px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(34,40,49,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1em', fontWeight: 800, color: '#222831' }}>Edit Student Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0.2rem', boxShadow: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            <div><label style={lbl}>First Name *</label><input name="First_Name" value={form.First_Name} onChange={handleChange} required style={inp}/></div>
            <div><label style={lbl}>Middle Name</label><input name="Middle_Name" value={form.Middle_Name} onChange={handleChange} style={inp}/></div>
            <div><label style={lbl}>Last Name *</label><input name="Last_Name" value={form.Last_Name} onChange={handleChange} required style={inp}/></div>
          </div>
          <div style={g2}>
            <div><label style={lbl}>Date of Birth</label><input name="Date_of_Birth" type="date" value={form.Date_of_Birth} onChange={handleChange} style={inp}/></div>
            <div><label style={lbl}>Gender</label>
              <select name="Gender" value={form.Gender} onChange={handleChange} style={inp}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div><label style={lbl}>Civil Status</label>
              <select name="Civil_Status" value={form.Civil_Status} onChange={handleChange} style={inp}>
                <option value="">Select</option><option>Single</option><option>Married</option><option>Widowed</option>
              </select>
            </div>
            <div><label style={lbl}>Nationality</label><input name="Nationality" value={form.Nationality} onChange={handleChange} style={inp}/></div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }}/>
          <div style={g2}>
            <div><label style={lbl}>Email *</label><input name="Email" type="email" value={form.Email} onChange={handleChange} required style={inp}/></div>
            <div><label style={lbl}>Mobile Number</label><input name="Mobile_Number" value={form.Mobile_Number} onChange={handleChange} placeholder="09XXXXXXXXX" style={inp}/></div>
            <div><label style={lbl}>City</label><input name="City" value={form.City} onChange={handleChange} style={inp}/></div>
            <div><label style={lbl}>Province</label><input name="Province" value={form.Province} onChange={handleChange} style={inp}/></div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }}/>
          <div style={g2}>
            <div><label style={lbl}>Year Level *</label>
              <select name="Year_Level" value={form.Year_Level} onChange={handleChange} required style={inp}>
                {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>Year {n}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Degree Program *</label>
              <select name="Degree_Program" value={form.Degree_Program} onChange={handleChange} required style={inp}>
                <option value="">Select</option>
                <option>BS Information Technology</option>
                <option>BS Computer Science</option>
              </select>
            </div>
            <div><label style={lbl}>Section</label>
              <select name="Section" value={form.Section} onChange={handleChange} style={inp}>
                <option value="">Select Section</option>
                {['A','B','C','D','E'].map(l => {
                  const prog = form.Degree_Program.includes('Information Technology') ? 'BSIT'
                    : form.Degree_Program.includes('Computer Science') ? 'BSCS'
                    : form.Degree_Program.includes('Information Systems') ? 'BSIS'
                    : 'BS';
                  const val = `${prog}-${form.Year_Level}${l}`;
                  return <option key={l} value={val}>{val}</option>;
                })}
              </select>
            </div>
            <div><label style={lbl}>School Year</label><input name="School_Year" value={form.School_Year} onChange={handleChange} placeholder="2024-2025" style={inp}/></div>
            <div><label style={lbl}>Enrollment Status</label>
              <select name="Enrollment_Status" value={form.Enrollment_Status} onChange={handleChange} style={inp}>
                <option>New</option><option>Transferee</option><option>Returning</option>
              </select>
            </div>
          </div>
          {error && <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', fontSize: '0.88em' }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.4rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'transparent', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.93em' }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '0.65rem 1.6rem' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('academic');
  const [showEdit, setShowEdit] = useState(false);  const [newAcademic, setNewAcademic] = useState({ Course_Code: '', Final_Grade: '', Term_Taken: '' });
  const [newSkill, setNewSkill] = useState({ category: '', skill: '', proficiency: '' });
  const [newActivity, setNewActivity] = useState({ type: '', name: '', date: '', contribution: '' });
  const [newDisciplinary, setNewDisciplinary] = useState({ Offense_Level: '', Date_Logged: '', Status: 'Pending' });
  const [newAffiliation, setNewAffiliation] = useState({ Org_Name: '', Role: '' });

  useEffect(() => { fetchStudent(); }, [id]);

  const fetchStudent = () => {
    setLoading(true);
    axios.get(`${API_URL}/students/${id}`)
      .then(res => { setStudent(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const deleteRecord = (url) => axios.delete(url).then(() => fetchStudent()).catch(console.error);

  const post = (url, data, reset) =>
    axios.post(url, data).then(() => { reset(); fetchStudent(); }).catch(console.error);

  const handleClearanceToggle = () =>
    axios.put(`${API_URL}/students/${id}/clearance`, { Med_Clearance: !(student.Med_Clearance || student.Medical_Clearance) })
      .then(fetchStudent).catch(console.error);

  const handleAddAcademic = e => { e.preventDefault(); post(`${API_URL}/students/${id}/academic`, newAcademic, () => setNewAcademic({ Course_Code: '', Final_Grade: '', Term_Taken: '' })); };
  const handleAddSkill = e => { e.preventDefault(); post(`${API_URL}/students/${id}/skills`, { Skill_Category: newSkill.category, Specific_Skill: newSkill.skill, Proficiency: newSkill.proficiency }, () => setNewSkill({ category: '', skill: '', proficiency: '' })); };
  const handleLogActivity = e => { e.preventDefault(); post(`${API_URL}/students/${id}/non-academic`, { Activity_Type: newActivity.type, Activity_Name: newActivity.name, Date_Logged: newActivity.date, Contribution: newActivity.contribution }, () => setNewActivity({ type: '', name: '', date: '', contribution: '' })); };
  const handleAddDisciplinary = e => { e.preventDefault(); post(`${API_URL}/students/${id}/disciplinary`, newDisciplinary, () => setNewDisciplinary({ Offense_Level: '', Date_Logged: '', Status: 'Pending' })); };
  const handleAddAffiliation = e => { e.preventDefault(); post(`${API_URL}/students/${id}/affiliations`, newAffiliation, () => setNewAffiliation({ Org_Name: '', Role: '' })); };
  const updateDisciplinaryStatus = (recId, status) => axios.put(`${API_URL}/disciplinary/${recId}/status`, { Status: status }).then(fetchStudent).catch(console.error);

  if (loading) return <div className="page-container"><p style={{ color: '#64748b', padding: '2rem' }}>Loading profile...</p></div>;
  if (!student) return <div className="page-container"><p style={{ color: '#ef4444', padding: '2rem' }}>Student not found.</p></div>;

  const cleared = student.Med_Clearance || student.Medical_Clearance;
  const tabs = [
    { key: 'academic', label: 'Academic History' },
    { key: 'skills', label: 'Skills' },
    { key: 'nonacademic', label: 'Non-Academic' },
    { key: 'disciplinary', label: 'Disciplinary' },
    { key: 'affiliations', label: 'Affiliations' },
  ];
  const statBadges = [
    { label: 'Academic', count: student.academic_histories?.length || 0, color: '#3b82f6' },
    { label: 'Skills', count: student.skill_repositories?.length || 0, color: '#10b981' },
    { label: 'Activities', count: student.non_academic_histories?.length || 0, color: '#F97316' },
    { label: 'Violations', count: student.disciplinary_records?.length || 0, color: '#ef4444' },
    { label: 'Affiliations', count: student.affiliations?.length || 0, color: '#8b5cf6' },
  ];

  return (
    <div className="page-container">
      {showEdit && <EditStudentModal student={student} onClose={() => setShowEdit(false)} onSaved={fetchStudent} />}

      <button onClick={() => navigate('/students')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid rgba(57,62,70,0.2)', borderRadius: '8px', padding: '0.45rem 1rem', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.85em', marginBottom: '1.4rem', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#222831'; e.currentTarget.style.color = '#EEEEEE'; e.currentTarget.style.borderColor = '#222831'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#393E46'; e.currentTarget.style.borderColor = 'rgba(57,62,70,0.2)'; }}>
        <IconArrow /> Back to Students
      </button>
      {/* Profile Header � expanded with all details inside */}
      <div style={{ background: 'linear-gradient(135deg, #222831 0%, #393E46 100%)', borderRadius: '16px', padding: '2rem', marginBottom: '1.2rem', boxShadow: '0 6px 24px rgba(34,40,49,0.18)' }}>

        {/* Top row � avatar + name + GWA + buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3em', color: 'white', flexShrink: 0 }}>
              {(student.First_Name?.[0] || '?').toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: '0 0 0.3rem 0', fontSize: '1.7em', fontWeight: 800, color: '#EEEEEE' }}>
                {student.First_Name} {student.Middle_Name ? student.Middle_Name + ' ' : ''}{student.Last_Name}
              </h1>
              <p style={{ margin: '0 0 0.15rem 0', color: 'rgba(238,238,238,0.6)', fontSize: '0.9em' }}>
                {student.Degree_Program} &mdash; Year {student.Year_Level}
              </p>
              <p style={{ margin: 0, color: 'rgba(238,238,238,0.4)', fontSize: '0.82em' }}>{student.Email_Address || student.Email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.8rem 1.4rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.8em', fontWeight: 800, color: '#F97316', lineHeight: 1 }}>{Number(student.calculated_gwa || 0).toFixed(2)}</div>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>GWA</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.8rem 1.4rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.8em', fontWeight: 800, color: cleared ? '#4ade80' : '#fbbf24', lineHeight: 1 }}>{cleared ? 'Cleared' : 'Pending'}</div>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Clearance</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => setShowEdit(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', color: '#F97316', borderRadius: '8px', padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.83em' }}>
                <IconEdit /> Edit Profile
              </button>
              <button onClick={handleClearanceToggle}
                style={{ background: cleared ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)', border: `1px solid ${cleared ? '#fbbf24' : '#4ade80'}`, color: cleared ? '#fbbf24' : '#4ade80', borderRadius: '8px', padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.83em' }}>
                {cleared ? 'Revoke Clearance' : 'Approve Clearance'}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }} />

        {/* Detail grid inside the dark card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem 1.5rem' }}>

          {/* Personal */}
          <div style={{ gridColumn: '1 / -1', fontSize: '0.7em', fontWeight: 700, color: 'rgba(238,238,238,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '-0.4rem' }}>
            Personal Information
          </div>
          {[
            ['First Name',   student.First_Name],
            ['Middle Name',  student.Middle_Name],
            ['Last Name',    student.Last_Name],
            ['Date of Birth',student.Date_of_Birth],
            ['Age',          student.Age],
            ['Gender',       student.Gender],
            ['Civil Status', student.Civil_Status],
            ['Nationality',  student.Nationality],
            ['Religion',     student.Religion],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{lbl}</div>
              <div style={{ fontSize: '0.88em', color: val ? '#EEEEEE' : 'rgba(238,238,238,0.2)', fontWeight: 500 }}>{val || '�'}</div>
            </div>
          ))}

          {/* Contact */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', fontSize: '0.7em', fontWeight: 700, color: 'rgba(238,238,238,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '-0.4rem' }}>
            Contact Information
          </div>
          {[
            ['Email',         student.Email_Address || student.Email],
            ['Mobile Number', student.Mobile_Number],
            ['Street',        student.Street],
            ['Barangay',      student.Barangay],
            ['City',          student.City],
            ['Province',      student.Province],
            ['ZIP Code',      student.ZIP_Code],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{lbl}</div>
              <div style={{ fontSize: '0.88em', color: val ? '#EEEEEE' : 'rgba(238,238,238,0.2)', fontWeight: 500 }}>{val || '�'}</div>
            </div>
          ))}

          {/* Academic */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', fontSize: '0.7em', fontWeight: 700, color: 'rgba(238,238,238,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '-0.4rem' }}>
            Academic Information
          </div>
          {[
            ['Student ID',        student.Student_ID],
            ['Year Level',        student.Year_Level ? `Year ${student.Year_Level}` : null],
            ['Degree Program',    student.Degree_Program],
            ['Section',           student.Section],
            ['School Year',       student.School_Year],
            ['Enrollment Status', student.Enrollment_Status],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{lbl}</div>
              <div style={{ fontSize: '0.88em', color: val ? '#EEEEEE' : 'rgba(238,238,238,0.2)', fontWeight: 500 }}>{val || '�'}</div>
            </div>
          ))}

          {/* Guardian */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', fontSize: '0.7em', fontWeight: 700, color: 'rgba(238,238,238,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '-0.4rem' }}>
            Parent / Guardian
          </div>
          {[
            ['Guardian Name',  student.Guardian_Name],
            ['Relationship',   student.Guardian_Relationship],
            ['Contact',        student.Guardian_Contact],
            ['Occupation',     student.Guardian_Occupation],
            ['Address',        student.Guardian_Address],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{lbl}</div>
              <div style={{ fontSize: '0.88em', color: val ? '#EEEEEE' : 'rgba(238,238,238,0.2)', fontWeight: 500 }}>{val || '�'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '0.7rem 1.2rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: activeTab === t.key ? 700 : 500, color: activeTab === t.key ? '#F97316' : '#64748b', borderBottom: activeTab === t.key ? '2px solid #F97316' : '2px solid transparent', marginBottom: '-2px', fontSize: '0.88em', transition: 'color 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'academic' && (
        <div style={card}>
          <h3 style={{ fontSize: '1.05em', fontWeight: 700, color: '#222831', margin: '0 0 1.2rem 0' }}>Academic History</h3>
          {student.academic_histories?.length > 0 ? (
            <table style={{ marginBottom: '1.5rem' }}>
              <thead><tr><th>Term</th><th>Course Code</th><th>Final Grade</th><th></th></tr></thead>
              <tbody>{student.academic_histories.map(ah => (
                <tr key={ah.Record_ID}><td>{ah.Term_Taken}</td><td>{ah.Course_Code}</td>
                  <td><span style={{ fontWeight: 700, color: Number(ah.Final_Grade) <= 3 ? '#16a34a' : '#ef4444' }}>{Number(ah.Final_Grade).toFixed(2)}</span></td>
                  <td><button onClick={() => deleteRecord(`${API_URL}/academic/${ah.Record_ID}`)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8em', fontWeight: 600 }}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          ) : <p style={{ color: '#94a3b8' }}>No academic records yet.</p>}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.8rem', fontSize: '0.88em' }}>Add Record</p>
            <form onSubmit={handleAddAcademic} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'end' }}>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Course Code</label><input style={inp} placeholder="CS101" value={newAcademic.Course_Code} onChange={e => setNewAcademic({ ...newAcademic, Course_Code: e.target.value })} required /></div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Final Grade</label><input style={inp} type="number" step="0.01" min="1" max="5" placeholder="1.75" value={newAcademic.Final_Grade} onChange={e => setNewAcademic({ ...newAcademic, Final_Grade: e.target.value })} required /></div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Term</label>
                <select style={inp} value={newAcademic.Term_Taken} onChange={e => setNewAcademic({ ...newAcademic, Term_Taken: e.target.value })} required>
                  <option value="">Select</option><option>1st Semester</option><option>2nd Semester</option><option>Summer</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem' }}>Add</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div style={card}>
          <h3 style={{ fontSize: '1.05em', fontWeight: 700, color: '#222831', margin: '0 0 1.2rem 0' }}>Skills Repository</h3>
          {student.skill_repositories?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {student.skill_repositories.map((sk, i) => (
                <span key={i} style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#065f46', borderRadius: '20px', padding: '0.4rem 1rem', fontSize: '0.88em', fontWeight: 600 }}>
                  {sk.Specific_Skill} &mdash; {sk.Skill_Category} &mdash; {sk.Proficiency}
                </span>
              ))}
            </div>
          ) : <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>No skills recorded yet.</p>}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.8rem', fontSize: '0.88em' }}>Add Skill</p>
            <form onSubmit={handleAddSkill} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'end' }}>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Category</label>
                <select style={inp} value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })} required>
                  <option value="">Select</option><option>Technical</option><option>Sports</option><option>Arts & Creative</option><option>Leadership</option><option>Communication</option><option>Academic</option><option>Other</option>
                </select>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Specific Skill</label><input style={inp} placeholder="e.g. Python" value={newSkill.skill} onChange={e => setNewSkill({ ...newSkill, skill: e.target.value })} required /></div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Proficiency</label>
                <select style={inp} value={newSkill.proficiency} onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })} required>
                  <option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem' }}>Add</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'nonacademic' && (
        <div style={card}>
          <h3 style={{ fontSize: '1.05em', fontWeight: 700, color: '#222831', margin: '0 0 1.2rem 0' }}>Non-Academic Activities</h3>
          {student.non_academic_histories?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {student.non_academic_histories.map(na => (
                <div key={na.Activity_ID} style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.12)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#222831' }}>{na.Activity_Name}</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ background: 'rgba(249,115,22,0.1)', color: '#ea580c', borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.78em', fontWeight: 600 }}>{na.Activity_Type}</span>
                      <button onClick={() => deleteRecord(`${API_URL}/non-academic/${na.Activity_ID}`)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8em', fontWeight: 600 }}>Delete</button>
                    </div>
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.83em', color: '#64748b' }}>{na.Date_Logged} &mdash; {na.Contribution}</p>
                </div>
              ))}
            </div>
          ) : <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>No activities logged yet.</p>}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.8rem', fontSize: '0.88em' }}>Log Activity</p>
            <form onSubmit={handleLogActivity} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'end' }}>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Activity Name</label><input style={inp} placeholder="e.g. Basketball Tournament" value={newActivity.name} onChange={e => setNewActivity({ ...newActivity, name: e.target.value })} required /></div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Type</label>
                <select style={inp} value={newActivity.type} onChange={e => setNewActivity({ ...newActivity, type: e.target.value })} required>
                  <option value="">Select</option><option>Sports</option><option>Cultural</option><option>Community Service</option><option>Leadership</option><option>Academic Competition</option><option>Other</option>
                </select>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Date</label><input style={inp} type="date" value={newActivity.date} onChange={e => setNewActivity({ ...newActivity, date: e.target.value })} required /></div>
              <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem' }}>Log</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'disciplinary' && (
        <div style={card}>
          <h3 style={{ fontSize: '1.05em', fontWeight: 700, color: '#222831', margin: '0 0 1.2rem 0' }}>Disciplinary Records</h3>
          {student.disciplinary_records?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {student.disciplinary_records.map(rec => (
                <div key={rec.Violation_ID} style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderLeft: '4px solid #ef4444', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <strong style={{ color: '#222831' }}>{rec.Offense_Level} Offense</strong>
                    <span style={{ background: rec.Status === 'Resolved' ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)', color: rec.Status === 'Resolved' ? '#16a34a' : '#ef4444', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '0.78em', fontWeight: 700 }}>{rec.Status}</span>
                  </div>
                  <p style={{ margin: '0.3rem 0 0.6rem 0', fontSize: '0.83em', color: '#64748b' }}>{rec.Date_Logged}</p>
                  {rec.Status !== 'Resolved' && (
                    <button onClick={() => updateDisciplinaryStatus(rec.Violation_ID, 'Resolved')} style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#16a34a', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.8em', fontWeight: 600 }}>Mark Resolved</button>
                  )}
                </div>
              ))}
            </div>
          ) : <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>No disciplinary records. Clean record.</p>}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.8rem', fontSize: '0.88em' }}>Add Disciplinary Record</p>
            <form onSubmit={handleAddDisciplinary} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'end' }}>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Offense Level</label>
                <select style={inp} value={newDisciplinary.Offense_Level} onChange={e => setNewDisciplinary({ ...newDisciplinary, Offense_Level: e.target.value })} required>
                  <option value="">Select</option><option>Minor</option><option>Major</option><option>Severe</option>
                </select>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Date</label><input style={inp} type="date" value={newDisciplinary.Date_Logged} onChange={e => setNewDisciplinary({ ...newDisciplinary, Date_Logged: e.target.value })} required /></div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Status</label>
                <select style={inp} value={newDisciplinary.Status} onChange={e => setNewDisciplinary({ ...newDisciplinary, Status: e.target.value })}>
                  <option>Pending</option><option>Under Investigation</option><option>Resolved</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem' }}>Add</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'affiliations' && (
        <div style={card}>
          <h3 style={{ fontSize: '1.05em', fontWeight: 700, color: '#222831', margin: '0 0 1.2rem 0' }}>Affiliations and Organizations</h3>
          {student.affiliations?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {student.affiliations.map(aff => (
                <div key={aff.Affiliation_ID} style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#222831' }}>{aff.Org_Name}</strong>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.83em', color: '#64748b' }}>Role: <span style={{ color: '#7c3aed', fontWeight: 600 }}>{aff.Role}</span></p>
                  </div>
                  <button onClick={() => deleteRecord(`${API_URL}/affiliations/${aff.Affiliation_ID}`)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8em', fontWeight: 600 }}>Delete</button>
                </div>
              ))}
            </div>
          ) : <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>No affiliations recorded yet.</p>}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.8rem', fontSize: '0.88em' }}>Add Affiliation</p>
            <form onSubmit={handleAddAffiliation} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.8rem', alignItems: 'end' }}>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Organization Name</label><input style={inp} placeholder="e.g. GDSC, Basketball Varsity" value={newAffiliation.Org_Name} onChange={e => setNewAffiliation({ ...newAffiliation, Org_Name: e.target.value })} required /></div>
              <div><label style={{ display: 'block', fontSize: '0.78em', color: '#64748b', marginBottom: '0.3rem' }}>Role</label>
                <select style={inp} value={newAffiliation.Role} onChange={e => setNewAffiliation({ ...newAffiliation, Role: e.target.value })}>
                  <option>Member</option><option>Officer</option><option>President</option><option>Vice President</option><option>Secretary</option><option>Treasurer</option><option>Captain</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem' }}>Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDetail;
