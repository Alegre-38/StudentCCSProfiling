import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function AdminRegister() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: '', password: '', password_confirmation: '', role: 'Student',
    first_name: '', last_name: '', email: '',
    degree_program: 'BS Information Technology', year_level: 1, section: '',
  });
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [createdCreds, setCreatedCreds] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState('');

  if (!user || user.role !== 'Admin') {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',flexDirection:'column',gap:'1rem'}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <h2 style={{color:'#F97316',margin:0}}>Access Denied</h2>
        <Link to="/" style={{color:'#F97316',fontWeight:600}}>Go back to Dashboard</Link>
      </div>
    );
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setCreatedCreds(null);
    if (form.role !== 'Student' && form.password !== form.password_confirmation) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/admin-register`, form);
      if (form.role === 'Student') {
        setCreatedCreds({ username: res.data.user.username, password: res.data.temp_password, email: form.email });
      } else {
        setSuccess(`Account created: ${res.data.user.username} (${res.data.user.role})`);
      }
      setForm({ username: '', password: '', password_confirmation: '', role: form.role,
        first_name: '', last_name: '', email: '',
        degree_program: 'BS Information Technology', year_level: 1, section: '' });
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors || {})[0]?.[0]
        || 'Failed to create account.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const inp = {
    width:'100%', padding:'0.7rem 1rem', borderRadius:'10px',
    border:'1.5px solid #e5e7eb', background:'white',
    color:'#222831', fontSize:'0.92em', outline:'none',
    transition:'border-color 0.2s, box-shadow 0.2s', boxSizing:'border-box',
  };
  const lbl = { display:'block', marginBottom:'0.35rem', fontSize:'0.75em', fontWeight:700, color:'#6b7280', letterSpacing:'0.06em', textTransform:'uppercase' };
  const fo  = e => { e.target.style.borderColor='#F97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)'; };
  const bl  = e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; };

  const roleColors = { Faculty:'#3b82f6', Admin:'#8b5cf6', Student:'#F97316' };
  const rc = roleColors[form.role];

  const progCode = form.degree_program.includes('Technology') ? 'BSIT' : 'BSCS';

  return (
    <div className="page-container">
      <div style={{maxWidth: form.role === 'Student' ? '720px' : '480px', margin:'0 auto'}}>

        {/* Header */}
        <div style={{marginBottom:'2rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.4rem'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(249,115,22,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h1 className="page-title" style={{margin:0,fontSize:'1.5em'}}>Manage Accounts</h1>
              <p style={{margin:0,fontSize:'0.83em',color:'#9ca3af'}}>Create Faculty, Admin, or Student accounts</p>
            </div>
          </div>
        </div>

        {/* Account type tabs */}
        <div style={{background:'white',borderRadius:'16px',padding:'1.5rem',boxShadow:'0 2px 12px rgba(34,40,49,0.07)',border:'1px solid rgba(0,0,0,0.04)',marginBottom:'1.2rem'}}>
          <div style={{fontSize:'0.72em',fontWeight:700,color:'#9ca3af',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Account Type</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.6rem'}}>
            {['Student','Faculty','Admin'].map(r => (
              <button key={r} type="button" onClick={() => { setForm({...form, role:r}); setError(''); setSuccess(''); setCreatedCreds(null); }}
                style={{padding:'0.75rem',borderRadius:'10px',border:`2px solid ${form.role===r ? roleColors[r] : '#e5e7eb'}`,
                  background: form.role===r ? `${roleColors[r]}10` : 'white',
                  color: form.role===r ? roleColors[r] : '#9ca3af',
                  fontWeight: form.role===r ? 700 : 500, fontSize:'0.88em', cursor:'pointer', transition:'all 0.2s',
                  display:'flex',flexDirection:'column',alignItems:'center',gap:'0.4rem'}}>
                {r === 'Student' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                {r === 'Faculty' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                {r === 'Admin'   && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div style={{background:'white',borderRadius:'16px',padding:'1.8rem',boxShadow:'0 2px 12px rgba(34,40,49,0.07)',border:`1px solid ${rc}25`}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1px solid #f0f0f0'}}>
            <div style={{width:'4px',height:'20px',borderRadius:'2px',background:rc}}/>
            <span style={{fontWeight:700,fontSize:'0.95em',color:'#222831'}}>
              {form.role === 'Student' ? 'New Student Account' : form.role === 'Faculty' ? 'New Faculty Account' : 'New Admin Account'}
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.1rem'}}>

            {/* Student form — wider 2-col layout */}
            {form.role === 'Student' && (
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label style={lbl}>First Name <span style={{color:'#ef4444'}}>*</span></label>
                    <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="e.g. Maria" required style={inp} onFocus={fo} onBlur={bl} />
                  </div>
                  <div>
                    <label style={lbl}>Last Name <span style={{color:'#ef4444'}}>*</span></label>
                    <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="e.g. Santos" required style={inp} onFocus={fo} onBlur={bl} />
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label style={lbl}>Username <span style={{color:'#ef4444'}}>*</span></label>
                    <input name="username" value={form.username} onChange={handleChange} placeholder="e.g. maria.santos" required style={inp} onFocus={fo} onBlur={bl} />
                  </div>
                  <div>
                    <label style={lbl}>Email (Gmail) <span style={{color:'#ef4444'}}>*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@gmail.com" required style={inp} onFocus={fo} onBlur={bl} />
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label style={lbl}>Program <span style={{color:'#ef4444'}}>*</span></label>
                    <select name="degree_program" value={form.degree_program} onChange={handleChange} style={{...inp,cursor:'pointer'}} onFocus={fo} onBlur={bl}>
                      <option value="BS Information Technology">BS Information Technology</option>
                      <option value="BS Computer Science">BS Computer Science</option>
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Year Level <span style={{color:'#ef4444'}}>*</span></label>
                    <select name="year_level" value={form.year_level} onChange={handleChange} style={{...inp,cursor:'pointer'}} onFocus={fo} onBlur={bl}>
                      {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Section</label>
                    <select name="section" value={form.section} onChange={handleChange} style={{...inp,cursor:'pointer'}} onFocus={fo} onBlur={bl}>
                      <option value="">Select</option>
                      {['A','B','C','D','E'].map(l => {
                        const val = `${progCode}-${form.year_level}${l}`;
                        return <option key={l} value={val}>{val}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div style={{display:'flex',gap:'0.6rem',padding:'0.85rem 1rem',borderRadius:'10px',background:'rgba(249,115,22,0.05)',border:'1px solid rgba(249,115,22,0.15)',alignItems:'flex-start'}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'1px'}}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span style={{fontSize:'0.82em',color:'#6b7280'}}>
                    A temporary password will be auto-generated and sent to the student's email. You can also copy it from the credentials card after creation.
                  </span>
                </div>
              </>
            )}

            {/* Faculty / Admin form */}
            {form.role !== 'Student' && (
              <>
                <div>
                  <label style={lbl}>Username <span style={{color:'#ef4444'}}>*</span></label>
                  <input name="username" value={form.username} onChange={handleChange} placeholder="Enter username" required style={inp} onFocus={fo} onBlur={bl} />
                </div>
                <div>
                  <label style={lbl}>Password <span style={{color:'#ef4444'}}>*</span></label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required style={inp} onFocus={fo} onBlur={bl} />
                </div>
                <div>
                  <label style={lbl}>Confirm Password <span style={{color:'#ef4444'}}>*</span></label>
                  <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Repeat password" required style={inp} onFocus={fo} onBlur={bl} />
                </div>
              </>
            )}

            {/* Error / Success */}
            {error && (
              <div style={{display:'flex',gap:'0.6rem',padding:'0.75rem 1rem',borderRadius:'10px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',color:'#dc2626',fontSize:'0.85em',alignItems:'center'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div style={{display:'flex',gap:'0.6rem',padding:'0.75rem 1rem',borderRadius:'10px',background:'rgba(22,163,74,0.06)',border:'1px solid rgba(22,163,74,0.2)',color:'#16a34a',fontSize:'0.85em',alignItems:'center'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {success}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{padding:'0.9rem',borderRadius:'11px',
                background: loading ? 'rgba(249,115,22,0.4)' : `linear-gradient(135deg, ${rc}, ${rc}cc)`,
                color:'white',border:'none',fontWeight:700,fontSize:'0.97em',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 4px 16px ${rc}40`,
                transition:'all 0.2s'}}>
              {loading ? 'Creating...' : `Create ${form.role} Account`}
            </button>
          </form>
        </div>

        {/* Credentials card — shown after student creation */}
        {createdCreds && (
          <div style={{marginTop:'1.2rem',background:'white',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 12px rgba(34,40,49,0.07)',border:'1px solid rgba(22,163,74,0.25)'}}>
            <div style={{padding:'1rem 1.5rem',background:'rgba(22,163,74,0.06)',borderBottom:'1px solid rgba(22,163,74,0.15)',display:'flex',alignItems:'center',gap:'0.6rem'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{fontWeight:700,color:'#16a34a',fontSize:'0.9em'}}>Student account created successfully!</span>
            </div>

            {createdCreds.email && (
              <div style={{padding:'0.7rem 1.5rem',borderBottom:'1px solid #f0f0f0',fontSize:'0.82em',color:'#6b7280'}}>
                📧 Credentials sent to <strong style={{color:'#222831'}}>{createdCreds.email}</strong>
              </div>
            )}

            <div style={{padding:'1rem 1.5rem',display:'flex',flexDirection:'column',gap:'0.6rem'}}>
              {[
                {key:'username', label:'USERNAME',     value: createdCreds.username, color:'#222831'},
                {key:'password', label:'TEMP PASSWORD', value: createdCreds.password, color:'#F97316'},
                {key:'url',      label:'LOGIN URL',     value: `${window.location.origin}/login`, color:'#3b82f6'},
              ].map(({key, label, value, color}) => (
                <div key={key} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0.9rem',borderRadius:'8px',background:'#f9fafb',border:'1px solid #f0f0f0'}}>
                  <div>
                    <div style={{fontSize:'0.68em',fontWeight:700,color:'#9ca3af',letterSpacing:'0.06em',marginBottom:'2px'}}>{label}</div>
                    <div style={{fontFamily:'monospace',fontWeight:700,color,fontSize:'0.9em'}}>{value}</div>
                  </div>
                  <button onClick={() => copyToClipboard(value, key)}
                    style={{padding:'0.3rem 0.7rem',borderRadius:'6px',border:'1px solid #e5e7eb',background: copied===key ? 'rgba(22,163,74,0.1)' : 'white',color: copied===key ? '#16a34a' : '#6b7280',fontSize:'0.75em',fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}>
                    {copied===key ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            <div style={{padding:'0.6rem 1.5rem 1rem',fontSize:'0.75em',color:'#9ca3af'}}>
              ⚠ Copy the temporary password now — it won't be shown again.
            </div>
          </div>
        )}

        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.82em',color:'#9ca3af'}}>
          <Link to="/" style={{color:'#F97316',fontWeight:600,textDecoration:'none'}}>← Back to Dashboard</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
