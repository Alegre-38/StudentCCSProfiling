import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TABS = ['Profile', 'Academic', 'Skills', 'Activities', 'Disciplinary', 'Affiliations'];

export default function StudentPortal() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Profile');

  useEffect(() => {
    if (!user?.student_id) { setLoading(false); return; }
    axios.get(`${API}/students/${user.student_id}`)
      .then(res => setStudent(res.data))
      .catch(() => setError('Failed to load your profile.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.loadingText}>Loading your profile...</div>
    </div>
  );

  if (error) return (
    <div style={styles.center}>
      <div style={styles.errorText}>{error}</div>
    </div>
  );

  if (!user?.student_id || !student) return (
    <div style={styles.center}>
      <div style={{textAlign:'center'}}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'1rem'}}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <p style={{color:'rgba(238,238,238,0.5)', fontSize:'0.95em'}}>No student profile linked to your account yet.</p>
        <p style={{color:'rgba(238,238,238,0.3)', fontSize:'0.82em'}}>Please contact your administrator.</p>
      </div>
    </div>
  );

  const cleared = student.Med_Clearance || student.Medical_Clearance;

  return (
    <div style={styles.page}>
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          {student.First_Name?.[0]}{student.Last_Name?.[0]}
        </div>
        <div>
          <h1 style={styles.name}>{student.First_Name} {student.Last_Name}</h1>
          <div style={styles.meta}>
            <span style={styles.badge}>{student.Degree_Program}</span>
            <span style={styles.badge}>Year {student.Year_Level}</span>
            <span style={{...styles.badge, background: cleared ? 'rgba(22,163,74,0.15)' : 'rgba(217,119,6,0.1)', color: cleared ? '#16a34a' : '#d97706', border: cleared ? '1px solid rgba(22,163,74,0.3)' : '1px solid rgba(217,119,6,0.3)'}}>
              {cleared ? 'Cleared' : 'Pending Clearance'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{...styles.tabBtn, ...(tab === t ? styles.tabActive : {})}}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.card}>
        {tab === 'Profile' && <ProfileTab student={student} />}
        {tab === 'Academic' && <ListTab items={student.academic_histories || student.academicHistories || []} fields={[
          {label:'Subject', key:'Subject_Name'}, {label:'Grade', key:'Grade'}, {label:'Semester', key:'Semester'}, {label:'School Year', key:'School_Year'}
        ]} empty="No academic records." />}
        {tab === 'Skills' && <ListTab items={student.skills || []} fields={[
          {label:'Skill', key:'Skill_Name'}, {label:'Proficiency', key:'Proficiency_Level'}
        ]} empty="No skills recorded." />}
        {tab === 'Activities' && <ListTab items={student.non_academic_histories || student.nonAcademicHistories || []} fields={[
          {label:'Activity', key:'Activity_Name'}, {label:'Type', key:'Activity_Type'}, {label:'Date', key:'Date'}
        ]} empty="No activities recorded." />}
        {tab === 'Disciplinary' && <ListTab items={student.disciplinary_records || student.disciplinaryRecords || []} fields={[
          {label:'Violation', key:'Violation_Type'}, {label:'Status', key:'Status'}, {label:'Date', key:'Date_Reported'}
        ]} empty="No disciplinary records." />}
        {tab === 'Affiliations' && <ListTab items={student.affiliations || []} fields={[
          {label:'Organization', key:'Organization_Name'}, {label:'Role', key:'Role'}, {label:'Date Joined', key:'Date_Joined'}
        ]} empty="No affiliations recorded." />}
      </div>
    </div>
  );
}

function ProfileTab({ student }) {
  const fields = [
    { label: 'Student ID', value: student.Student_ID },
    { label: 'Email', value: student.Email_Address || student.Email },
    { label: 'Degree Program', value: student.Degree_Program },
    { label: 'Year Level', value: `Year ${student.Year_Level}` },
    { label: 'Enrollment Status', value: student.Enrollment_Status },
    { label: 'Contact Number', value: student.Contact_Number || '—' },
    { label: 'Address', value: student.Address || '—' },
    { label: 'Date of Birth', value: student.Date_of_Birth || '—' },
    { label: 'Gender', value: student.Gender || '—' },
  ];
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.2rem'}}>
      {fields.map(f => (
        <div key={f.label}>
          <div style={{fontSize:'0.75em', color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.25rem'}}>{f.label}</div>
          <div style={{fontSize:'0.95em', color:'#222831', fontWeight:500}}>{f.value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

function ListTab({ items, fields, empty }) {
  if (!items.length) return <p style={{color:'#9ca3af', fontSize:'0.9em', margin:0}}>{empty}</p>;
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9em'}}>
        <thead>
          <tr>
            {fields.map(f => (
              <th key={f.key} style={{textAlign:'left', padding:'0.5rem 0.75rem', color:'#6b7280', fontWeight:600, fontSize:'0.8em', textTransform:'uppercase', borderBottom:'1px solid #f0f0f0'}}>{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{borderBottom:'1px solid #f9fafb'}}>
              {fields.map(f => (
                <td key={f.key} style={{padding:'0.6rem 0.75rem', color:'#393E46'}}>{item[f.key] || '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: { padding: '1.5rem', maxWidth: '900px', margin: '0 auto', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  center: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#F97316', fontWeight: 700 },
  errorText: { color: '#ef4444', fontWeight: 600 },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #d9620f)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4em', fontWeight: 800, flexShrink: 0 },
  name: { margin: '0 0 0.5rem', fontSize: '1.3em', fontWeight: 800, color: '#222831' },
  meta: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.78em', fontWeight: 600, background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' },
  tabBar: { display: 'flex', gap: '0.3rem', marginBottom: '1rem', flexWrap: 'wrap' },
  tabBtn: { padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, fontSize: '0.85em', cursor: 'pointer', transition: 'all 0.15s' },
  tabActive: { background: '#F97316', color: 'white', border: '1px solid #F97316' },
  card: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(34,40,49,0.07)' },
};
