import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ── Icons ──────────────────────────────────────────────────────────────────
const IcoUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoBook    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoStar    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoActivity= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoAlert   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoLink    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IcoEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoPlus    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoMenu    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;

const SECTIONS = [
  { key: 'profile',      label: 'My Profile',    Icon: IcoUser     },
  { key: 'academic',     label: 'Academic',       Icon: IcoBook     },
  { key: 'skills',       label: 'Skills',         Icon: IcoStar     },
  { key: 'activities',   label: 'Activities',     Icon: IcoActivity },
  { key: 'disciplinary', label: 'Disciplinary',   Icon: IcoAlert    },
  { key: 'affiliations', label: 'Affiliations',   Icon: IcoLink     },
];

const inp = {
  width:'100%', padding:'0.6rem 0.9rem', borderRadius:'8px',
  border:'1px solid #e5e7eb', fontSize:'0.9em', outline:'none',
  boxSizing:'border-box', transition:'border-color 0.2s',
};
const focus = e => e.target.style.borderColor = '#F97316';
const blur  = e => e.target.style.borderColor = '#e5e7eb';

// ── Modal wrapper ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(34,40,49,0.55)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'16px',width:'100%',maxWidth:'480px',boxShadow:'0 20px 60px rgba(0,0,0,0.2)',overflow:'hidden'}}>
        <div style={{padding:'1.2rem 1.5rem',borderBottom:'1px solid #f0f0f0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontWeight:700,fontSize:'1em',color:'#222831'}}>{title}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:'1.2em',lineHeight:1}}>×</button>
        </div>
        <div style={{padding:'1.5rem'}}>{children}</div>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function StudentPortal() {
  const { user, logout } = useAuth();
  const [student, setStudent]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [section, setSection]   = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = () => {
    if (!user?.student_id) { setLoading(false); return; }
    axios.get(`${API}/students/${user.student_id}`)
      .then(r => setStudent(r.data))
      .catch(() => setError('Failed to load your profile.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [user]);

  if (loading) return <div style={S.center}><span style={{color:'#F97316',fontWeight:700}}>Loading…</span></div>;
  if (error)   return <div style={S.center}><span style={{color:'#ef4444'}}>{error}</span></div>;
  if (!student) return (
    <div style={S.center}>
      <div style={{textAlign:'center'}}>
        <IcoUser /><br/><br/>
        <p style={{color:'#6b7280'}}>No student profile linked yet.</p>
        <p style={{color:'#9ca3af',fontSize:'0.85em'}}>Contact your administrator.</p>
      </div>
    </div>
  );

  const cleared = student.Med_Clearance || student.Medical_Clearance;
  const initials = (student.First_Name?.[0] || '') + (student.Last_Name?.[0] || '');

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f5f6fa',fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:99}} />}

      {/* Sidebar */}
      <aside style={{...S.sidebar, transform: sidebarOpen ? 'translateX(0)' : undefined}}>
        <div style={{padding:'1.5rem 1.2rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <div style={{color:'#F97316',fontWeight:800,fontSize:'1.15em',marginBottom:'1rem'}}>ProfileSys</div>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <div style={S.avatarSm}>{initials.toUpperCase()}</div>
            <div>
              <div style={{color:'#EEEEEE',fontWeight:700,fontSize:'0.88em'}}>{student.First_Name} {student.Last_Name}</div>
              <div style={{color:'rgba(238,238,238,0.4)',fontSize:'0.72em',textTransform:'uppercase',letterSpacing:'0.05em'}}>Student</div>
            </div>
          </div>
        </div>
        <div style={{padding:'0.75rem 0.5rem',flex:1}}>
          <div style={{fontSize:'0.68em',color:'rgba(238,238,238,0.3)',fontWeight:700,letterSpacing:'0.08em',padding:'0 0.75rem',marginBottom:'0.4rem'}}>MY PORTAL</div>
          {SECTIONS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => { setSection(key); setSidebarOpen(false); }}
              style={{...S.navBtn, ...(section === key ? S.navActive : {})}}>
              <Icon /> {label}
            </button>
          ))}
        </div>
        <div style={{padding:'1rem 1.2rem',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
          <button onClick={logout} style={{...S.navBtn,color:'rgba(238,238,238,0.5)',width:'100%'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {/* Top bar */}
        <header style={S.topbar}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={S.menuBtn}><IcoMenu /></button>
          <span style={{color:'#F97316',fontWeight:800,fontSize:'1em'}}>ProfileSys</span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'0.6rem'}}>
            <span style={{fontSize:'0.82em',color:'rgba(238,238,238,0.5)',display:'none'}}>{user.username}</span>
            <div style={S.avatarSm}>{initials.toUpperCase()}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,padding:'1.5rem',maxWidth:'900px',width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
          {/* Profile header card */}
          <div style={S.profileCard}>
            <div style={S.avatarLg}>{initials.toUpperCase()}</div>
            <div style={{flex:1}}>
              <h1 style={{margin:'0 0 0.4rem',fontSize:'1.3em',fontWeight:800,color:'#222831'}}>{student.First_Name} {student.Last_Name}</h1>
              <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                <span style={S.badge}>{student.Degree_Program}</span>
                <span style={S.badge}>Year {student.Year_Level}</span>
                <span style={{...S.badge, background: cleared?'rgba(22,163,74,0.12)':'rgba(217,119,6,0.1)', color: cleared?'#16a34a':'#d97706', border: cleared?'1px solid rgba(22,163,74,0.25)':'1px solid rgba(217,119,6,0.25)'}}>
                  {cleared ? 'Cleared' : 'Pending Clearance'}
                </span>
              </div>
            </div>
          </div>

          {/* Section content */}
          {section === 'profile'      && <ProfileSection      student={student} reload={load} />}
          {section === 'academic'     && <AcademicSection     student={student} reload={load} />}
          {section === 'skills'       && <SkillsSection       student={student} reload={load} />}
          {section === 'activities'   && <ActivitiesSection   student={student} reload={load} />}
          {section === 'disciplinary' && <DisciplinarySection student={student} />}
          {section === 'affiliations' && <AffiliationsSection student={student} />}        </main>
      </div>
    </div>
  );
}

// ── Profile Section ────────────────────────────────────────────────────────
function ProfileSection({ student, reload }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    First_Name: student.First_Name || '', Last_Name: student.Last_Name || '',
    Email: student.Email || student.Email_Address || '',
    Contact_Number: student.Contact_Number || '', Address: student.Address || '',
    Date_of_Birth: student.Date_of_Birth || '', Gender: student.Gender || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await axios.put(`${API}/students/${student.Student_ID}`, form);
      setMsg('Profile updated!'); setEditing(false); reload();
    } catch { setMsg('Failed to save.'); }
    finally { setSaving(false); }
  };

  const fields = [
    { label:'First Name',      key:'First_Name'     },
    { label:'Last Name',       key:'Last_Name'       },
    { label:'Email',           key:'Email'           },
    { label:'Contact Number',  key:'Contact_Number'  },
    { label:'Address',         key:'Address'         },
    { label:'Date of Birth',   key:'Date_of_Birth', type:'date' },
    { label:'Gender',          key:'Gender', type:'select', opts:['Male','Female','Other'] },
  ];

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardTitle}>Personal Information</span>
        {!editing && <button onClick={() => setEditing(true)} style={S.btnEdit}><IcoEdit /> Edit</button>}
      </div>
      {msg && <div style={{marginBottom:'1rem',padding:'0.6rem 1rem',borderRadius:'8px',background: msg.includes('!') ? 'rgba(22,163,74,0.1)':'rgba(239,68,68,0.1)',color: msg.includes('!') ? '#16a34a':'#ef4444',fontSize:'0.85em'}}>{msg}</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1.2rem'}}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={S.fieldLabel}>{f.label}</div>
            {editing ? (
              f.type === 'select'
                ? <select value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} style={inp} onFocus={focus} onBlur={blur}>
                    <option value="">Select</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                : <input type={f.type||'text'} value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} style={inp} onFocus={focus} onBlur={blur} />            ) : (
              <div style={S.fieldValue}>{form[f.key] || '—'}</div>
            )}
          </div>
        ))}
      </div>
      {/* Read-only fields */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1.2rem',marginTop:'1.2rem',paddingTop:'1.2rem',borderTop:'1px solid #f0f0f0'}}>
        {[{label:'Student ID',value:student.Student_ID},{label:'Degree Program',value:student.Degree_Program},{label:'Year Level',value:`Year ${student.Year_Level}`},{label:'Enrollment Status',value:student.Enrollment_Status}].map(f=>(
          <div key={f.label}><div style={S.fieldLabel}>{f.label}</div><div style={S.fieldValue}>{f.value||'—'}</div></div>
        ))}
      </div>
      {editing && (
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem'}}>
          <button onClick={save} disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Save Changes'}</button>
          <button onClick={() => setEditing(false)} style={S.btnSecondary}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ── Academic Section ───────────────────────────────────────────────────────
function AcademicSection({ student, reload }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ Course_Code:'', Final_Grade:'', Term_Taken:'' });
  const [saving, setSaving] = useState(false);
  const items = student.academic_histories || student.academicHistories || [];

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/students/${student.Student_ID}/academic`, form); setShowModal(false); reload(); setForm({ Course_Code:'', Final_Grade:'', Term_Taken:'' }); }
    catch { alert('Failed to add record.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardTitle}>Academic History</span>
        <button onClick={() => setShowModal(true)} style={S.btnPrimary}><IcoPlus /> Add Record</button>
      </div>
      <RecordTable items={items} fields={[{label:'Course Code',key:'Course_Code'},{label:'Final Grade',key:'Final_Grade'},{label:'Term Taken',key:'Term_Taken'}]} empty="No academic records yet." />
      {showModal && (
        <Modal title="Add Academic Record" onClose={() => setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
            {[['Course Code','Course_Code','text'],['Final Grade (1.0-5.0)','Final_Grade','number'],['Term Taken (e.g. 1st Sem 2024-2025)','Term_Taken','text']].map(([l,k,t])=>(
              <div key={k}><label style={S.fieldLabel}>{l}</label><input type={t} required value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inp} onFocus={focus} onBlur={blur}/></div>
            ))}
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add Record'}</button>
              <button type="button" onClick={() => setShowModal(false)} style={S.btnSecondary}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Skills Section ─────────────────────────────────────────────────────────
function SkillsSection({ student, reload }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ Skill_Category:'Technical', Specific_Skill:'', Proficiency:'Beginner' });
  const [saving, setSaving] = useState(false);
  const items = student.skill_repositories || student.skills || [];

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/students/${student.Student_ID}/skills`, form); setShowModal(false); reload(); setForm({ Skill_Category:'Technical', Specific_Skill:'', Proficiency:'Beginner' }); }
    catch { alert('Failed to add skill.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardTitle}>Skills</span>
        <button onClick={() => setShowModal(true)} style={S.btnPrimary}><IcoPlus /> Add Skill</button>
      </div>
      <RecordTable items={items} fields={[{label:'Category',key:'Skill_Category'},{label:'Skill',key:'Specific_Skill'},{label:'Proficiency',key:'Proficiency'}]} empty="No skills recorded yet." />
      {showModal && (
        <Modal title="Add Skill" onClose={() => setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
            <div><label style={S.fieldLabel}>Skill Category</label>
              <select value={form.Skill_Category} onChange={e=>setForm({...form,Skill_Category:e.target.value})} style={inp}>
                <option>Technical</option><option>Communication</option><option>Leadership</option><option>Creative</option><option>Other</option>
              </select>
            </div>
            <div><label style={S.fieldLabel}>Specific Skill</label><input required value={form.Specific_Skill} onChange={e=>setForm({...form,Specific_Skill:e.target.value})} style={inp} onFocus={focus} onBlur={blur}/></div>
            <div><label style={S.fieldLabel}>Proficiency Level</label>
              <select value={form.Proficiency} onChange={e=>setForm({...form,Proficiency:e.target.value})} style={inp}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
              </select>
            </div>
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add Skill'}</button>
              <button type="button" onClick={() => setShowModal(false)} style={S.btnSecondary}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Activities Section ─────────────────────────────────────────────────────
function ActivitiesSection({ student, reload }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ Activity_Name:'', Activity_Type:'Sports', Date_Logged:'', Contribution:'' });
  const [saving, setSaving] = useState(false);
  const items = student.non_academic_histories || student.nonAcademicHistories || [];

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/students/${student.Student_ID}/non-academic`, form); setShowModal(false); reload(); setForm({ Activity_Name:'', Activity_Type:'Sports', Date_Logged:'', Contribution:'' }); }
    catch { alert('Failed to add activity.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardTitle}>Non-Academic Activities</span>
        <button onClick={() => setShowModal(true)} style={S.btnPrimary}><IcoPlus /> Add Activity</button>
      </div>
      <RecordTable items={items} fields={[{label:'Activity',key:'Activity_Name'},{label:'Type',key:'Activity_Type'},{label:'Date',key:'Date_Logged'},{label:'Contribution',key:'Contribution'}]} empty="No activities recorded yet." />
      {showModal && (
        <Modal title="Add Activity" onClose={() => setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
            <div><label style={S.fieldLabel}>Activity Name</label><input required value={form.Activity_Name} onChange={e=>setForm({...form,Activity_Name:e.target.value})} style={inp} onFocus={focus} onBlur={blur}/></div>
            <div><label style={S.fieldLabel}>Type</label>
              <select value={form.Activity_Type} onChange={e=>setForm({...form,Activity_Type:e.target.value})} style={inp}>
                <option>Sports</option><option>Arts</option><option>Community Service</option><option>Leadership</option><option>Other</option>
              </select>
            </div>
            <div><label style={S.fieldLabel}>Date</label><input type="date" value={form.Date_Logged} onChange={e=>setForm({...form,Date_Logged:e.target.value})} style={inp} onFocus={focus} onBlur={blur}/></div>
            <div><label style={S.fieldLabel}>Contribution</label><input value={form.Contribution} onChange={e=>setForm({...form,Contribution:e.target.value})} style={inp} onFocus={focus} onBlur={blur}/></div>
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add Activity'}</button>
              <button type="button" onClick={() => setShowModal(false)} style={S.btnSecondary}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Read-only sections ─────────────────────────────────────────────────────
function DisciplinarySection({ student }) {
  const items = student.disciplinary_records || student.disciplinaryRecords || [];
  return (
    <div style={S.card}>
      <div style={S.cardHeader}><span style={S.cardTitle}>Disciplinary Records</span></div>
      <RecordTable items={items} fields={[{label:'Offense Level',key:'Offense_Level'},{label:'Status',key:'Status'},{label:'Date',key:'Date_Logged'}]} empty="No disciplinary records." />
    </div>
  );
}

function AffiliationsSection({ student }) {
  const items = student.affiliations || [];
  return (
    <div style={S.card}>
      <div style={S.cardHeader}><span style={S.cardTitle}>Affiliations</span></div>
      <RecordTable items={items} fields={[{label:'Organization',key:'Org_Name'},{label:'Role',key:'Role'}]} empty="No affiliations recorded." />
    </div>
  );
}

// ── Shared table ───────────────────────────────────────────────────────────
function RecordTable({ items, fields, empty }) {
  if (!items.length) return <p style={{color:'#9ca3af',fontSize:'0.9em',margin:'0.5rem 0'}}>{empty}</p>;
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.88em'}}>
        <thead>
          <tr>{fields.map(f=><th key={f.key} style={{textAlign:'left',padding:'0.5rem 0.75rem',color:'#9ca3af',fontWeight:600,fontSize:'0.78em',textTransform:'uppercase',borderBottom:'1px solid #f0f0f0'}}>{f.label}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((item,i)=>(
            <tr key={i} style={{borderBottom:'1px solid #f9fafb'}}>
              {fields.map(f=><td key={f.key} style={{padding:'0.65rem 0.75rem',color:'#393E46'}}>{item[f.key]||'—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const S = {
  center:      { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' },
  sidebar:     { width:'220px', background:'#222831', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100, transition:'transform 0.25s', '@media(max-width:768px)':{ transform:'translateX(-100%)' } },
  topbar:      { background:'#222831', height:'52px', display:'flex', alignItems:'center', padding:'0 1rem', gap:'0.75rem', boxShadow:'0 2px 8px rgba(0,0,0,0.15)', position:'sticky', top:0, zIndex:50 },
  menuBtn:     { background:'none', border:'none', color:'#EEEEEE', cursor:'pointer', display:'flex', alignItems:'center', padding:'0.25rem' },
  navBtn:      { display:'flex', alignItems:'center', gap:'0.6rem', width:'100%', padding:'0.6rem 0.75rem', borderRadius:'8px', border:'none', background:'none', color:'rgba(238,238,238,0.6)', fontWeight:600, fontSize:'0.85em', cursor:'pointer', textAlign:'left', transition:'all 0.15s' },
  navActive:   { background:'rgba(249,115,22,0.15)', color:'#F97316' },
  avatarSm:    { width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#F97316,#d9620f)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.75em', flexShrink:0 },
  avatarLg:    { width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg,#F97316,#d9620f)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.3em', flexShrink:0 },
  profileCard: { display:'flex', alignItems:'center', gap:'1.2rem', background:'white', borderRadius:'16px', padding:'1.25rem 1.5rem', marginBottom:'1.2rem', boxShadow:'0 2px 12px rgba(34,40,49,0.07)' },
  badge:       { padding:'0.2rem 0.7rem', borderRadius:'20px', fontSize:'0.75em', fontWeight:600, background:'rgba(249,115,22,0.1)', color:'#F97316', border:'1px solid rgba(249,115,22,0.2)' },
  card:        { background:'white', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(34,40,49,0.07)', marginBottom:'1.2rem' },
  cardHeader:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' },
  cardTitle:   { fontWeight:700, fontSize:'0.95em', color:'#222831', textTransform:'uppercase', letterSpacing:'0.05em' },
  fieldLabel:  { fontSize:'0.72em', color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.25rem', display:'block' },
  fieldValue:  { fontSize:'0.93em', color:'#222831', fontWeight:500 },
  btnPrimary:  { display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.55rem 1.1rem', borderRadius:'8px', background:'linear-gradient(135deg,#F97316,#d9620f)', color:'white', border:'none', fontWeight:700, fontSize:'0.85em', cursor:'pointer' },
  btnSecondary:{ padding:'0.55rem 1.1rem', borderRadius:'8px', border:'1px solid #e5e7eb', background:'white', color:'#393E46', fontWeight:600, fontSize:'0.85em', cursor:'pointer' },
  btnEdit:     { display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.4rem 0.9rem', borderRadius:'8px', border:'1px solid #e5e7eb', background:'white', color:'#393E46', fontWeight:600, fontSize:'0.82em', cursor:'pointer' },
};
