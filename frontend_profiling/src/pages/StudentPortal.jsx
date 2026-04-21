import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const IcoUser     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoBook     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoStar     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoActivity = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoAlert    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoLink     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IcoEdit     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoPlus     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoMenu     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoLogout   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const IcoDash     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

const SECTIONS = [
  { key:'dashboard',    label:'Dashboard',     Icon:IcoDash     },
  { key:'profile',      label:'My Profile',   Icon:IcoUser     },
  { key:'academic',     label:'Academic',      Icon:IcoBook     },
  { key:'skills',       label:'Skills',        Icon:IcoStar     },
  { key:'activities',   label:'Activities',    Icon:IcoActivity },
  { key:'affiliations', label:'Affiliations',  Icon:IcoLink     },
  { key:'disciplinary', label:'Disciplinary',  Icon:IcoAlert    },
];

const inp = { width:'100%', padding:'0.65rem 0.9rem', borderRadius:'8px', border:'1px solid #e5e7eb', fontSize:'0.88em', outline:'none', boxSizing:'border-box', background:'white', transition:'border-color 0.2s', color:'#222831' };
const fo = e => e.target.style.borderColor='#F97316';
const bl = e => e.target.style.borderColor='#e5e7eb';

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(34,40,49,0.6)',backdropFilter:'blur(4px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',overflowY:'auto'}}>
      <div style={{background:'white',borderRadius:'16px',width:'100%',maxWidth: wide ? '640px' : '480px',boxShadow:'0 24px 60px rgba(0,0,0,0.25)',overflow:'hidden',margin:'auto'}}>
        <div style={{padding:'1.2rem 1.5rem',borderBottom:'1px solid #f0f0f0',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fafafa'}}>
          <span style={{fontWeight:700,fontSize:'1em',color:'#222831'}}>{title}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:'1.4em',lineHeight:1,padding:'0 0.2rem'}}>×</button>
        </div>
        <div style={{padding:'1.5rem',maxHeight:'80vh',overflowY:'auto'}}>{children}</div>
      </div>
    </div>
  );
}

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = () => {
    if (!user?.student_id) { setLoading(false); return; }
    axios.get(`${API}/students/${user.student_id}`)
      .then(r => setStudent(r.data))
      .catch(() => setError('Failed to load your profile.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [user]);

  if (loading) return <div style={S.center}><div style={{textAlign:'center'}}><div style={{width:'40px',height:'40px',border:'3px solid #f0f0f0',borderTop:'3px solid #F97316',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 1rem'}}></div><span style={{color:'#9ca3af',fontSize:'0.9em'}}>Loading your profile…</span></div></div>;
  if (error)   return <div style={S.center}><span style={{color:'#ef4444'}}>{error}</span></div>;
  if (!student) return (
    <div style={S.center}>
      <div style={{textAlign:'center',padding:'2rem'}}>
        <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'rgba(249,115,22,0.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}><IcoUser /></div>
        <p style={{color:'#6b7280',fontWeight:600}}>No student profile linked yet.</p>
        <p style={{color:'#9ca3af',fontSize:'0.85em'}}>Please contact your administrator.</p>
      </div>
    </div>
  );

  const cleared  = student.Med_Clearance || student.Medical_Clearance;
  const initials = ((student.First_Name?.[0]||'') + (student.Last_Name?.[0]||'')).toUpperCase();
  const fullName = `${student.First_Name || ''} ${student.Middle_Name ? student.Middle_Name + ' ' : ''}${student.Last_Name || ''}`.trim();

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f0f2f5',fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:99}}/>}

      {/* ── Sidebar ── */}
      <aside style={{...S.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}}>
        <div style={{padding:'1.5rem 1.2rem',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{color:'#F97316',fontWeight:800,fontSize:'1.2em',letterSpacing:'-0.5px',marginBottom:'1.2rem'}}>ProfileSys</div>
          <div style={{display:'flex',alignItems:'center',gap:'0.8rem'}}>
            <div style={S.avatarSm}>{initials}</div>
            <div style={{minWidth:0}}>
              <div style={{color:'#EEEEEE',fontWeight:700,fontSize:'0.85em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{fullName}</div>
              <div style={{color:'rgba(238,238,238,0.35)',fontSize:'0.7em',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:'1px'}}>Student</div>
            </div>
          </div>
        </div>

        <nav style={{padding:'0.75rem 0.6rem',flex:1,overflowY:'auto'}}>
          <div style={{fontSize:'0.65em',color:'rgba(238,238,238,0.25)',fontWeight:700,letterSpacing:'0.1em',padding:'0 0.6rem',marginBottom:'0.5rem'}}>MY PORTAL</div>
          {SECTIONS.map(({key,label,Icon})=>(
            <button key={key} onClick={()=>{setSection(key);setSidebarOpen(false);}}
              style={{...S.navBtn,...(section===key?S.navActive:{})}}>
              <span style={{opacity: section===key?1:0.6}}><Icon/></span>
              <span>{label}</span>
              {section===key && <span style={{marginLeft:'auto',width:'6px',height:'6px',borderRadius:'50%',background:'#F97316'}}/>}
            </button>
          ))}
        </nav>

        <div style={{padding:'1rem 1.2rem',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <button onClick={logout} style={{display:'flex',alignItems:'center',gap:'0.65rem',width:'100%',padding:'0.75rem 1rem',borderRadius:'10px',border:'1.5px solid rgba(239,68,68,0.35)',background:'rgba(239,68,68,0.1)',color:'#f87171',fontWeight:700,fontSize:'0.88em',cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.2)';e.currentTarget.style.borderColor='rgba(239,68,68,0.6)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(239,68,68,0.1)';e.currentTarget.style.borderColor='rgba(239,68,68,0.35)';}}>
            <IcoLogout/> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <header style={S.topbar}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={S.menuBtn}><IcoMenu/></button>
          <span style={{color:'#F97316',fontWeight:800,fontSize:'1em',letterSpacing:'-0.3px'}}>ProfileSys</span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <span style={{fontSize:'0.8em',color:'rgba(238,238,238,0.5)'}}>{user.username}</span>
            <div style={S.avatarSm}>{initials}</div>
          </div>
        </header>

        <main style={{flex:1,padding:'1.5rem',maxWidth:'960px',width:'100%',margin:'0 auto',boxSizing:'border-box',animation:'fadeIn 0.3s ease'}}>
          {/* Hero card */}
          <div style={{background:'linear-gradient(135deg,#222831 0%,#393E46 100%)',borderRadius:'20px',padding:'1.8rem 2rem',marginBottom:'1.5rem',boxShadow:'0 8px 32px rgba(34,40,49,0.2)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-40px',right:'-40px',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(249,115,22,0.08)',pointerEvents:'none'}}/>
            <div style={{display:'flex',alignItems:'center',gap:'1.5rem',flexWrap:'wrap'}}>
              <div style={{...S.avatarLg,boxShadow:'0 4px 16px rgba(249,115,22,0.4)'}}>{initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <h1 style={{margin:'0 0 0.4rem',fontSize:'1.6em',fontWeight:800,color:'#EEEEEE',letterSpacing:'-0.3px'}}>{fullName}</h1>
                <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.6rem'}}>
                  <span style={S.badge}>{student.Degree_Program || 'No Program'}</span>
                  <span style={S.badge}>Year {student.Year_Level || '—'}</span>
                  {student.Section && <span style={S.badge}>Section {student.Section}</span>}
                  <span style={{...S.badge, background:cleared?'rgba(22,163,74,0.2)':'rgba(217,119,6,0.2)', color:cleared?'#4ade80':'#fbbf24', border:cleared?'1px solid rgba(74,222,128,0.3)':'1px solid rgba(251,191,36,0.3)'}}>
                    {cleared ? '✓ Cleared' : '⏳ Pending Clearance'}
                  </span>
                </div>
                <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                  {[
                    {label:'Student ID', value:student.Student_ID},
                    {label:'Email', value:student.Email||student.Email_Address},
                    {label:'Status', value:student.Enrollment_Status},
                  ].map(f=>(
                    <div key={f.label}>
                      <div style={{fontSize:'0.65em',color:'rgba(238,238,238,0.3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{f.label}</div>
                      <div style={{fontSize:'0.82em',color:'rgba(238,238,238,0.7)',fontWeight:500}}>{f.value||'—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {section==='dashboard'    && <StudentDashboard    student={student}/>}
          {section==='profile'      && <ProfileSection      student={student} reload={load}/>}
          {section==='academic'     && <AcademicSection     student={student} reload={load}/>}
          {section==='skills'       && <SkillsSection       student={student} reload={load}/>}
          {section==='activities'   && <ActivitiesSection   student={student} reload={load}/>}
          {section==='affiliations' && <AffiliationsSection student={student} reload={load}/>}
          {section==='disciplinary' && <DisciplinarySection student={student}/>}
        </main>
      </div>
    </div>
  );
}

// ── Student Dashboard ──────────────────────────────────────────────────────
function StudentDashboard({ student }) {
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/students/${student.Student_ID}/classmates`)
      .then(r => setClassmates(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [student.Student_ID]);

  const cleared = student.Med_Clearance || student.Medical_Clearance;

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      {/* Welcome card */}
      <div style={{background:'linear-gradient(135deg,#222831,#393E46)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1.2rem',boxShadow:'0 4px 20px rgba(34,40,49,0.15)'}}>
        <div style={{fontSize:'0.75em',color:'rgba(238,238,238,0.4)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.3rem'}}>Welcome back</div>
        <div style={{fontSize:'1.4em',fontWeight:800,color:'#EEEEEE',marginBottom:'0.8rem'}}>{student.First_Name} {student.Last_Name}</div>
        <div style={{display:'flex',gap:'0.6rem',flexWrap:'wrap'}}>
          {[
            {label:student.Degree_Program||'No Program', color:'#F97316'},
            {label:`Year ${student.Year_Level}`, color:'#3b82f6'},
            {label:student.Section ? `Section ${student.Section}` : 'No Section', color:'#8b5cf6'},
            {label:cleared?'Cleared':'Pending Clearance', color:cleared?'#16a34a':'#d97706'},
          ].map(b=>(
            <span key={b.label} style={{padding:'0.25rem 0.75rem',borderRadius:'20px',fontSize:'0.75em',fontWeight:600,background:`${b.color}20`,color:b.color,border:`1px solid ${b.color}40`}}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'0.8rem',marginBottom:'1.2rem'}}>
        {[
          {label:'Academic Records', value: (student.academic_histories||[]).length, color:'#3b82f6'},
          {label:'Skills', value: (student.skill_repositories||[]).length, color:'#10b981'},
          {label:'Activities', value: (student.non_academic_histories||[]).length, color:'#F97316'},
          {label:'Affiliations', value: (student.affiliations||[]).length, color:'#8b5cf6'},
          {label:'Classmates', value: classmates.length, color:'#ec4899'},
        ].map(s=>(
          <div key={s.label} style={{background:'white',borderRadius:'12px',padding:'1rem',boxShadow:'0 2px 8px rgba(34,40,49,0.06)',border:'1px solid rgba(0,0,0,0.04)'}}>
            <div style={{fontSize:'1.8em',fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:'0.75em',color:'#9ca3af',marginTop:'0.3rem',fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Classmates */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div>
            <div style={S.cardTitle}>My Classmates</div>
            <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>
              {student.Section ? `Section ${student.Section} · ` : ''}{student.Degree_Program} · Year {student.Year_Level}
            </div>
          </div>
          <span style={{fontSize:'0.8em',color:'#9ca3af',fontWeight:600}}>{classmates.length} student{classmates.length!==1?'s':''}</span>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'2rem',color:'#9ca3af',fontSize:'0.9em'}}>Loading classmates…</div>
        ) : classmates.length === 0 ? (
          <div style={{textAlign:'center',padding:'2rem'}}>
            <div style={{fontSize:'2em',marginBottom:'0.5rem'}}>👥</div>
            <div style={{color:'#6b7280',fontWeight:600,fontSize:'0.9em'}}>No classmates found</div>
            <div style={{color:'#9ca3af',fontSize:'0.8em',marginTop:'0.3rem'}}>
              {student.Section ? 'No other students in your section yet.' : 'Ask your admin to assign you a section.'}
            </div>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0.75rem'}}>
            {classmates.map(c => {
              const ini = ((c.First_Name?.[0]||'')+(c.Last_Name?.[0]||'')).toUpperCase();
              const colors = ['#F97316','#3b82f6','#10b981','#8b5cf6','#ec4899','#f59e0b'];
              const color = colors[(c.First_Name?.charCodeAt(0)||0) % colors.length];
              return (
                <div key={c.Student_ID} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem',background:'#f9fafb',borderRadius:'10px',border:'1px solid #f0f0f0'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:`${color}20`,color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'0.8em',flexShrink:0,border:`1px solid ${color}30`}}>{ini}</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:600,color:'#222831',fontSize:'0.88em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.First_Name} {c.Last_Name}</div>
                    <div style={{fontSize:'0.72em',color:'#9ca3af'}}>{c.Degree_Program} · Yr {c.Year_Level}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile sub-components (defined outside to prevent re-render focus loss) ──
function ProfileSectionBlock({title, children}) {
  return (
    <div style={{marginBottom:'1.5rem'}}>
      <div style={{fontSize:'0.7em',fontWeight:700,color:'#F97316',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.8rem',paddingBottom:'0.4rem',borderBottom:'2px solid rgba(249,115,22,0.15)'}}>{title}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'}}>{children}</div>
    </div>
  );
}

function ProfileField({label, value, onChange, editing, type='text', opts}) {
  return (
    <div>
      <label style={S.fieldLabel}>{label}</label>
      {editing ? (
        opts
          ? <select value={value} onChange={e=>onChange(e.target.value)} style={inp} onFocus={fo} onBlur={bl}>
              <option value="">Select</option>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          : <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={inp} onFocus={fo} onBlur={bl}/>
      ) : (
        <div style={S.fieldValue}>{value||<span style={{color:'#d1d5db'}}>Not set</span>}</div>
      )}
    </div>
  );
}

// ── Profile Section ────────────────────────────────────────────────────────
function ProfileSection({ student, reload }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [form, setForm]       = useState({
    First_Name: student.First_Name||'', Middle_Name: student.Middle_Name||'',
    Last_Name: student.Last_Name||'', Date_of_Birth: student.Date_of_Birth||'',
    Age: student.Age||'', Gender: student.Gender||'', Civil_Status: student.Civil_Status||'',
    Nationality: student.Nationality||'Philippines', Religion: student.Religion||'',
    Email: student.Email||student.Email_Address||'', Mobile_Number: student.Mobile_Number||student.Contact_Number||'',
    Street: student.Street||'', Barangay: student.Barangay||'',
    City: student.City||'', Province: student.Province||'', ZIP_Code: student.ZIP_Code||'',
    Guardian_Name: student.Guardian_Name||'', Guardian_Relationship: student.Guardian_Relationship||'',
    Guardian_Contact: student.Guardian_Contact||'', Guardian_Occupation: student.Guardian_Occupation||'',
    Guardian_Address: student.Guardian_Address||'',
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await axios.put(`${API}/students/${student.Student_ID}`, form);
      setMsg('success'); setEditing(false); reload();
    } catch { setMsg('error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      {msg==='success' && <div style={{...S.alert, background:'rgba(22,163,74,0.08)',border:'1px solid rgba(22,163,74,0.2)',color:'#16a34a'}}>✓ Profile updated successfully!</div>}
      {msg==='error'   && <div style={{...S.alert, background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',color:'#ef4444'}}>Failed to save. Please try again.</div>}

      <div style={S.card}>
        <div style={S.cardHeader}>
          <div>
            <div style={S.cardTitle}>Personal Information</div>
            <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>Update your personal details</div>
          </div>
          {!editing
            ? <button onClick={()=>setEditing(true)} style={S.btnEdit}><IcoEdit/> Edit Profile</button>
            : <div style={{display:'flex',gap:'0.5rem'}}>
                <button onClick={save} disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Save'}</button>
                <button onClick={()=>{setEditing(false);setMsg('');}} style={S.btnSecondary}>Cancel</button>
              </div>
          }
        </div>

        <ProfileSectionBlock title="Basic Information">
          <ProfileField label="First Name"   value={form.First_Name}    onChange={v=>set('First_Name',v)}    editing={editing}/>
          <ProfileField label="Middle Name"  value={form.Middle_Name}   onChange={v=>set('Middle_Name',v)}   editing={editing}/>
          <ProfileField label="Last Name"    value={form.Last_Name}     onChange={v=>set('Last_Name',v)}     editing={editing}/>
          <ProfileField label="Date of Birth" value={form.Date_of_Birth} onChange={v=>set('Date_of_Birth',v)} editing={editing} type="date"/>
          <ProfileField label="Age"          value={form.Age}           onChange={v=>set('Age',v)}           editing={editing} type="number"/>
          <ProfileField label="Gender"       value={form.Gender}        onChange={v=>set('Gender',v)}        editing={editing} opts={['Male','Female','Other']}/>
          <ProfileField label="Civil Status" value={form.Civil_Status}  onChange={v=>set('Civil_Status',v)}  editing={editing} opts={['Single','Married','Widowed','Separated']}/>
          <ProfileField label="Nationality"  value={form.Nationality}   onChange={v=>set('Nationality',v)}   editing={editing}/>
          <ProfileField label="Religion"     value={form.Religion}      onChange={v=>set('Religion',v)}      editing={editing}/>
        </ProfileSectionBlock>

        <ProfileSectionBlock title="Contact Information">
          <ProfileField label="Email Address"       value={form.Email}         onChange={v=>set('Email',v)}         editing={editing} type="email"/>
          <ProfileField label="Mobile Number"       value={form.Mobile_Number} onChange={v=>set('Mobile_Number',v)} editing={editing}/>
          <ProfileField label="Street"              value={form.Street}        onChange={v=>set('Street',v)}        editing={editing}/>
          <ProfileField label="Barangay"            value={form.Barangay}      onChange={v=>set('Barangay',v)}      editing={editing}/>
          <ProfileField label="City / Municipality" value={form.City}          onChange={v=>set('City',v)}          editing={editing}/>
          <ProfileField label="Province"            value={form.Province}      onChange={v=>set('Province',v)}      editing={editing}/>
          <ProfileField label="ZIP Code"            value={form.ZIP_Code}      onChange={v=>set('ZIP_Code',v)}      editing={editing}/>
        </ProfileSectionBlock>

        <ProfileSectionBlock title="Academic Information">
          {[
            {label:'Student ID',        value:student.Student_ID},
            {label:'Degree Program',    value:student.Degree_Program},
            {label:'Year Level',        value:`Year ${student.Year_Level}`},
            {label:'Section',           value:student.Section},
            {label:'School Year',       value:student.School_Year},
            {label:'Enrollment Status', value:student.Enrollment_Status},
          ].map(f=>(
            <div key={f.label}>
              <label style={S.fieldLabel}>{f.label}</label>
              <div style={{...S.fieldValue,color:'#6b7280'}}>{f.value||'—'}</div>
            </div>
          ))}
        </ProfileSectionBlock>

        <ProfileSectionBlock title="Parent / Guardian">
          <ProfileField label="Guardian Name"   value={form.Guardian_Name}         onChange={v=>set('Guardian_Name',v)}         editing={editing}/>
          <ProfileField label="Relationship"    value={form.Guardian_Relationship} onChange={v=>set('Guardian_Relationship',v)} editing={editing} opts={['Father','Mother','Sibling','Grandparent','Relative','Guardian']}/>
          <ProfileField label="Contact Number"  value={form.Guardian_Contact}      onChange={v=>set('Guardian_Contact',v)}      editing={editing}/>
          <ProfileField label="Occupation"      value={form.Guardian_Occupation}   onChange={v=>set('Guardian_Occupation',v)}   editing={editing}/>
          <div style={{gridColumn:'1/-1'}}>
            <label style={S.fieldLabel}>Guardian Address</label>
            {editing
              ? <input value={form.Guardian_Address} onChange={e=>set('Guardian_Address',e.target.value)} style={inp} onFocus={fo} onBlur={bl}/>
              : <div style={S.fieldValue}>{form.Guardian_Address||<span style={{color:'#d1d5db'}}>Not set</span>}</div>
            }
          </div>
        </ProfileSectionBlock>
      </div>
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
    try { await axios.post(`${API}/students/${student.Student_ID}/academic`, form); setShowModal(false); reload(); setForm({Course_Code:'',Final_Grade:'',Term_Taken:''}); }
    catch { alert('Failed to add.'); }
    finally { setSaving(false); }
  };

  const gwaColor = gwa => gwa <= 1.5 ? '#16a34a' : gwa <= 2.5 ? '#F97316' : '#ef4444';

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Academic History</div>
          <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>{items.length} record{items.length!==1?'s':''}</div>
        </div>
        <button onClick={()=>setShowModal(true)} style={S.btnPrimary}><IcoPlus/> Add Record</button>
      </div>

      {items.length === 0
        ? <EmptyState icon={<IcoBook/>} text="No academic records yet." sub="Add your course grades to track your academic progress."/>
        : <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.88em'}}>
              <thead><tr style={{background:'#f9fafb'}}>
                {['Term','Course Code','Final Grade'].map(h=><th key={h} style={{textAlign:'left',padding:'0.7rem 1rem',color:'#6b7280',fontWeight:600,fontSize:'0.78em',textTransform:'uppercase',letterSpacing:'0.04em'}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {items.map((r,i)=>(
                  <tr key={i} style={{borderBottom:'1px solid #f5f5f5'}}>
                    <td style={{padding:'0.75rem 1rem',color:'#6b7280',fontSize:'0.88em'}}>{r.Term_Taken||'—'}</td>
                    <td style={{padding:'0.75rem 1rem',fontWeight:600,color:'#222831'}}>{r.Course_Code||'—'}</td>
                    <td style={{padding:'0.75rem 1rem'}}>
                      <span style={{fontWeight:700,color:gwaColor(Number(r.Final_Grade)),background:`${gwaColor(Number(r.Final_Grade))}15`,padding:'0.2rem 0.6rem',borderRadius:'6px',fontSize:'0.9em'}}>
                        {Number(r.Final_Grade).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }

      {showModal && (
        <Modal title="Add Academic Record" onClose={()=>setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div><label style={S.fieldLabel}>Course Code</label><input required placeholder="e.g. CS101" value={form.Course_Code} onChange={e=>setForm({...form,Course_Code:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div><label style={S.fieldLabel}>Final Grade (1.0 – 5.0)</label><input required type="number" step="0.25" min="1" max="5" placeholder="1.75" value={form.Final_Grade} onChange={e=>setForm({...form,Final_Grade:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div><label style={S.fieldLabel}>Term Taken</label>
              <select required value={form.Term_Taken} onChange={e=>setForm({...form,Term_Taken:e.target.value})} style={inp} onFocus={fo} onBlur={bl}>
                <option value="">Select term</option>
                <option>1st Semester</option><option>2nd Semester</option><option>Summer</option>
              </select>
            </div>
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add Record'}</button>
              <button type="button" onClick={()=>setShowModal(false)} style={S.btnSecondary}>Cancel</button>
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

  const profColor = p => p==='Expert'?'#8b5cf6':p==='Advanced'?'#F97316':p==='Intermediate'?'#3b82f6':'#6b7280';

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/students/${student.Student_ID}/skills`, form); setShowModal(false); reload(); setForm({Skill_Category:'Technical',Specific_Skill:'',Proficiency:'Beginner'}); }
    catch { alert('Failed to add.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Skills</div>
          <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>{items.length} skill{items.length!==1?'s':''} recorded</div>
        </div>
        <button onClick={()=>setShowModal(true)} style={S.btnPrimary}><IcoPlus/> Add Skill</button>
      </div>

      {items.length === 0
        ? <EmptyState icon={<IcoStar/>} text="No skills recorded yet." sub="Add your skills to showcase your abilities."/>
        : <div style={{display:'flex',flexWrap:'wrap',gap:'0.6rem'}}>
            {items.map((sk,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'0.5rem 0.9rem'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:'0.88em',color:'#222831'}}>{sk.Specific_Skill}</div>
                  <div style={{fontSize:'0.72em',color:'#9ca3af'}}>{sk.Skill_Category}</div>
                </div>
                <span style={{fontSize:'0.72em',fontWeight:700,color:profColor(sk.Proficiency),background:`${profColor(sk.Proficiency)}15`,padding:'0.15rem 0.5rem',borderRadius:'20px',marginLeft:'0.3rem'}}>{sk.Proficiency}</span>
              </div>
            ))}
          </div>
      }

      {showModal && (
        <Modal title="Add Skill" onClose={()=>setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div><label style={S.fieldLabel}>Category</label>
              <select value={form.Skill_Category} onChange={e=>setForm({...form,Skill_Category:e.target.value})} style={inp}>
                {['Technical','Communication','Leadership','Creative','Sports','Academic','Other'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={S.fieldLabel}>Specific Skill</label><input required placeholder="e.g. Python, Basketball, Public Speaking" value={form.Specific_Skill} onChange={e=>setForm({...form,Specific_Skill:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div><label style={S.fieldLabel}>Proficiency Level</label>
              <select value={form.Proficiency} onChange={e=>setForm({...form,Proficiency:e.target.value})} style={inp}>
                {['Beginner','Intermediate','Advanced','Expert'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add Skill'}</button>
              <button type="button" onClick={()=>setShowModal(false)} style={S.btnSecondary}>Cancel</button>
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

  const typeColor = t => ({Sports:'#3b82f6',Arts:'#8b5cf6','Community Service':'#16a34a',Leadership:'#F97316'})[t]||'#6b7280';

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/students/${student.Student_ID}/non-academic`, form); setShowModal(false); reload(); setForm({Activity_Name:'',Activity_Type:'Sports',Date_Logged:'',Contribution:''}); }
    catch { alert('Failed to add.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Non-Academic Activities</div>
          <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>{items.length} activit{items.length!==1?'ies':'y'}</div>
        </div>
        <button onClick={()=>setShowModal(true)} style={S.btnPrimary}><IcoPlus/> Add Activity</button>
      </div>

      {items.length === 0
        ? <EmptyState icon={<IcoActivity/>} text="No activities recorded yet." sub="Add your extracurricular activities and achievements."/>
        : <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            {items.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1rem',background:'#f9fafb',borderRadius:'12px',border:'1px solid #f0f0f0'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`${typeColor(a.Activity_Type)}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <IcoActivity/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,color:'#222831',fontSize:'0.92em'}}>{a.Activity_Name}</div>
                  <div style={{display:'flex',gap:'0.5rem',marginTop:'0.3rem',flexWrap:'wrap'}}>
                    <span style={{fontSize:'0.72em',fontWeight:600,color:typeColor(a.Activity_Type),background:`${typeColor(a.Activity_Type)}15`,padding:'0.15rem 0.5rem',borderRadius:'20px'}}>{a.Activity_Type}</span>
                    {a.Date_Logged && <span style={{fontSize:'0.72em',color:'#9ca3af'}}>{a.Date_Logged}</span>}
                    {a.Contribution && <span style={{fontSize:'0.72em',color:'#6b7280'}}>• {a.Contribution}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
      }

      {showModal && (
        <Modal title="Add Activity" onClose={()=>setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div><label style={S.fieldLabel}>Activity Name</label><input required placeholder="e.g. Basketball Tournament" value={form.Activity_Name} onChange={e=>setForm({...form,Activity_Name:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div><label style={S.fieldLabel}>Type</label>
              <select value={form.Activity_Type} onChange={e=>setForm({...form,Activity_Type:e.target.value})} style={inp}>
                {['Sports','Arts','Community Service','Leadership','Academic Competition','Cultural','Religious','Other'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={S.fieldLabel}>Date</label><input type="date" value={form.Date_Logged} onChange={e=>setForm({...form,Date_Logged:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div><label style={S.fieldLabel}>Contribution / Award</label><input placeholder="e.g. Champion, Participant, Organizer" value={form.Contribution} onChange={e=>setForm({...form,Contribution:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add Activity'}</button>
              <button type="button" onClick={()=>setShowModal(false)} style={S.btnSecondary}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Affiliations Section ───────────────────────────────────────────────────
function AffiliationsSection({ student, reload }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ Org_Name:'', Role:'Member' });
  const [saving, setSaving] = useState(false);
  const items = student.affiliations || [];

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/students/${student.Student_ID}/affiliations`, form); setShowModal(false); reload(); setForm({Org_Name:'',Role:'Member'}); }
    catch { alert('Failed to add.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Affiliations</div>
          <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>{items.length} organization{items.length!==1?'s':''}</div>
        </div>
        <button onClick={()=>setShowModal(true)} style={S.btnPrimary}><IcoPlus/> Add</button>
      </div>

      {items.length === 0
        ? <EmptyState icon={<IcoLink/>} text="No affiliations recorded yet." sub="Add your organization memberships and roles."/>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'0.75rem'}}>
            {items.map((a,i)=>(
              <div key={i} style={{padding:'1rem',background:'#f9fafb',borderRadius:'12px',border:'1px solid #f0f0f0'}}>
                <div style={{fontWeight:700,color:'#222831',fontSize:'0.9em',marginBottom:'0.3rem'}}>{a.Org_Name}</div>
                <span style={{fontSize:'0.75em',fontWeight:600,color:'#8b5cf6',background:'rgba(139,92,246,0.1)',padding:'0.2rem 0.6rem',borderRadius:'20px'}}>{a.Role}</span>
              </div>
            ))}
          </div>
      }

      {showModal && (
        <Modal title="Add Affiliation" onClose={()=>setShowModal(false)}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div><label style={S.fieldLabel}>Organization Name</label><input required placeholder="e.g. GDSC, Basketball Varsity" value={form.Org_Name} onChange={e=>setForm({...form,Org_Name:e.target.value})} style={inp} onFocus={fo} onBlur={bl}/></div>
            <div><label style={S.fieldLabel}>Role</label>
              <select value={form.Role} onChange={e=>setForm({...form,Role:e.target.value})} style={inp}>
                {['Member','Officer','President','Vice President','Secretary','Treasurer','Captain','Representative','Volunteer'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
              <button type="submit" disabled={saving} style={S.btnPrimary}>{saving?'Saving…':'Add'}</button>
              <button type="button" onClick={()=>setShowModal(false)} style={S.btnSecondary}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Disciplinary (read-only) ───────────────────────────────────────────────
function DisciplinarySection({ student }) {
  const items = student.disciplinary_records || student.disciplinaryRecords || [];
  const statusColor = s => s==='Resolved'?'#16a34a':s==='Under Investigation'?'#d97706':'#ef4444';

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Disciplinary Records</div>
          <div style={{fontSize:'0.78em',color:'#9ca3af',marginTop:'2px'}}>Managed by administrator</div>
        </div>
      </div>
      {items.length === 0
        ? <EmptyState icon={<IcoAlert/>} text="No disciplinary records." sub="You have a clean record." positive/>
        : <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            {items.map((r,i)=>(
              <div key={i} style={{padding:'1rem',background:'rgba(239,68,68,0.03)',border:'1px solid rgba(239,68,68,0.12)',borderLeft:`4px solid ${statusColor(r.Status)}`,borderRadius:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'0.5rem'}}>
                  <span style={{fontWeight:700,color:'#222831',fontSize:'0.9em'}}>{r.Offense_Level} Offense</span>
                  <span style={{fontSize:'0.75em',fontWeight:700,color:statusColor(r.Status),background:`${statusColor(r.Status)}15`,padding:'0.2rem 0.7rem',borderRadius:'20px'}}>{r.Status}</span>
                </div>
                {r.Date_Logged && <div style={{fontSize:'0.8em',color:'#9ca3af',marginTop:'0.3rem'}}>{r.Date_Logged}</div>}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ icon, text, sub, positive }) {
  return (
    <div style={{textAlign:'center',padding:'2.5rem 1rem'}}>
      <div style={{width:'52px',height:'52px',borderRadius:'50%',background: positive?'rgba(22,163,74,0.08)':'rgba(249,115,22,0.08)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.8rem',color: positive?'#16a34a':'#F97316'}}>{icon}</div>
      <div style={{fontWeight:600,color:'#374151',fontSize:'0.9em'}}>{text}</div>
      {sub && <div style={{color:'#9ca3af',fontSize:'0.8em',marginTop:'0.3rem'}}>{sub}</div>}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const S = {
  center:      { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f2f5' },
  sidebar:     { width:'220px', background:'linear-gradient(180deg,#1a1f27 0%,#1e242d 100%)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100, transition:'transform 0.25s ease', borderRight:'1px solid rgba(255,255,255,0.05)' },
  topbar:      { background:'#1a1f27', height:'54px', display:'flex', alignItems:'center', padding:'0 1.2rem', gap:'0.75rem', boxShadow:'0 2px 12px rgba(0,0,0,0.2)', position:'sticky', top:0, zIndex:50 },
  menuBtn:     { background:'none', border:'none', color:'#EEEEEE', cursor:'pointer', display:'flex', alignItems:'center', padding:'0.3rem', borderRadius:'6px' },
  navBtn:      { display:'flex', alignItems:'center', gap:'0.65rem', width:'100%', padding:'0.65rem 0.75rem', borderRadius:'10px', border:'none', background:'none', color:'rgba(238,238,238,0.45)', fontWeight:600, fontSize:'0.84em', cursor:'pointer', textAlign:'left', transition:'all 0.15s', marginBottom:'2px' },
  navActive:   { background:'rgba(249,115,22,0.15)', color:'#F97316', boxShadow:'inset 0 0 0 1px rgba(249,115,22,0.2)' },
  avatarSm:    { width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,#F97316,#d9620f)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.75em', flexShrink:0 },
  avatarLg:    { width:'68px', height:'68px', borderRadius:'50%', background:'linear-gradient(135deg,#F97316,#d9620f)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.5em', flexShrink:0 },
  badge:       { padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75em', fontWeight:600, background:'rgba(255,255,255,0.1)', color:'rgba(238,238,238,0.8)', border:'1px solid rgba(255,255,255,0.15)' },
  card:        { background:'white', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 2px 16px rgba(34,40,49,0.06)', marginBottom:'1.2rem', border:'1px solid rgba(0,0,0,0.04)' },
  cardHeader:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.4rem' },
  cardTitle:   { fontWeight:700, fontSize:'0.95em', color:'#222831', textTransform:'uppercase', letterSpacing:'0.05em' },
  fieldLabel:  { fontSize:'0.7em', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.3rem', display:'block' },
  fieldValue:  { fontSize:'0.9em', color:'#222831', fontWeight:500, minHeight:'1.4em' },
  alert:       { padding:'0.75rem 1rem', borderRadius:'10px', fontSize:'0.85em', fontWeight:500, marginBottom:'1rem' },
  btnPrimary:  { display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.55rem 1.1rem', borderRadius:'8px', background:'linear-gradient(135deg,#F97316,#d9620f)', color:'white', border:'none', fontWeight:700, fontSize:'0.84em', cursor:'pointer', boxShadow:'0 2px 8px rgba(249,115,22,0.3)', transition:'opacity 0.15s' },
  btnSecondary:{ padding:'0.55rem 1.1rem', borderRadius:'8px', border:'1px solid #e5e7eb', background:'white', color:'#393E46', fontWeight:600, fontSize:'0.84em', cursor:'pointer' },
  btnEdit:     { display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.45rem 1rem', borderRadius:'8px', border:'1px solid #e5e7eb', background:'white', color:'#393E46', fontWeight:600, fontSize:'0.82em', cursor:'pointer', transition:'all 0.15s' },
};
