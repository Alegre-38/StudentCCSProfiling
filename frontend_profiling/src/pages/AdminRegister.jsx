import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function AdminRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', password_confirmation: '', role: 'Faculty', first_name: '', last_name: '', email: '', degree_program: 'BS CS', year_level: 1, section: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdCreds, setCreatedCreds] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'Admin') {
    return (
      <div style={{minHeight:'100vh', background:'#1a1f27', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif"}}>
        <div style={{textAlign:'center', color:'#EEEEEE'}}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 1rem', display:'block'}}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h2 style={{color:'#F97316', margin:'0 0 0.5rem'}}>Access Denied</h2>
          <p style={{color:'rgba(238,238,238,0.5)', marginBottom:'1.5rem'}}>This page is for administrators only.</p>
          <Link to="/" style={{color:'#F97316', fontWeight:600}}>Go back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setCreatedCreds(null);
    if (form.role !== 'Student' && form.password !== form.password_confirmation) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/admin-register`, form);
      if (form.role === 'Student') {
        setCreatedCreds({ username: res.data.user.username, password: res.data.temp_password, email: form.email });
      } else {
        setSuccess(`Account created: ${res.data.user.username} (${res.data.user.role})`);
      }
      setForm({ username: '', password: '', password_confirmation: '', role: form.role, first_name: '', last_name: '', email: '', degree_program: 'BS CS', year_level: 1, section: '' });
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors || {})[0]?.[0]
        || 'Failed to create account.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'0.75rem 1rem', borderRadius:'10px',
    border:'1.5px solid rgba(255,255,255,0.08)', background:'rgba(15,18,24,0.6)',
    color:'#EEEEEE', fontSize:'0.93em', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
    boxSizing:'border-box',
  };
  const labelStyle = {
    display:'block', marginBottom:'0.4rem', fontSize:'0.75em',
    fontWeight:700, color:'rgba(238,238,238,0.5)', letterSpacing:'0.07em', textTransform:'uppercase',
  };
  const focusIn = e => { e.target.style.borderColor='#F97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)'; };
  const focusOut = e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; };

  const roleColors = { Faculty: '#60a5fa', Admin: '#a78bfa', Student: '#34d399' };
  const roleColor = roleColors[form.role] || '#F97316';

  return (
    <div style={{minHeight:'100vh', background:'#1a1f27', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>
      {/* Background blobs */}
      <div style={{position:'fixed', top:'-100px', right:'-100px', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(249,115,22,0.06)', pointerEvents:'none', filter:'blur(40px)'}} />
      <div style={{position:'fixed', bottom:'-80px', left:'-80px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(96,165,250,0.05)', pointerEvents:'none', filter:'blur(40px)'}} />

      <div style={{width:'100%', maxWidth:'440px', position:'relative', zIndex:1}}>
        {/* Card */}
        <div style={{background:'#222831', borderRadius:'20px', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.06)'}}>
          {/* Top accent bar */}
          <div style={{height:'3px', background:`linear-gradient(90deg, #F97316, ${roleColor})`}} />

          <div style={{padding:'2.5rem 2.5rem 2rem'}}>
            {/* Header */}
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
              <div style={{width:'60px', height:'60px', borderRadius:'16px', background:'rgba(249,115,22,0.1)', border:'1.5px solid rgba(249,115,22,0.25)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', boxShadow:'0 8px 24px rgba(249,115,22,0.15)'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h1 style={{margin:0, fontSize:'1.45em', fontWeight:800, color:'#EEEEEE', letterSpacing:'-0.02em'}}>Manage Accounts</h1>
              <p style={{margin:'0.35rem 0 0', fontSize:'0.83em', color:'rgba(238,238,238,0.4)'}}>Create and manage system accounts</p>
              <span style={{marginTop:'0.7rem', display:'inline-block', padding:'0.25rem 0.9rem', borderRadius:'20px', background:'rgba(249,115,22,0.12)', border:'1px solid rgba(249,115,22,0.25)', fontSize:'0.72em', color:'#F97316', fontWeight:700, letterSpacing:'0.06em'}}>
                ADMIN ONLY
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1.1rem'}}>

              {/* Role selector — styled tabs */}
              <div>
                <label style={labelStyle}>Account Type</label>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem'}}>
                  {['Faculty','Admin','Student'].map(r => (
                    <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                      style={{padding:'0.6rem', borderRadius:'10px', border:`1.5px solid ${form.role===r ? roleColors[r] : 'rgba(255,255,255,0.08)'}`,
                        background: form.role===r ? `rgba(${r==='Faculty'?'96,165,250':r==='Admin'?'167,139,250':'52,211,153'},0.12)` : 'rgba(15,18,24,0.4)',
                        color: form.role===r ? roleColors[r] : 'rgba(238,238,238,0.45)',
                        fontWeight: form.role===r ? 700 : 500, fontSize:'0.85em', cursor:'pointer', transition:'all 0.2s'}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Enter username" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>

              {/* Student-specific fields */}
              {form.role === 'Student' && (
                <>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem'}}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Email (Gmail)</label>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'rgba(238,238,238,0.3)', pointerEvents:'none'}}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@gmail.com" required style={{...inputStyle, paddingLeft:'2.4rem'}} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                  </div>

                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem'}}>
                    <div>
                      <label style={labelStyle}>Degree Program</label>
                      <select name="degree_program" value={form.degree_program} onChange={handleChange} style={{...inputStyle, cursor:'pointer'}} onFocus={focusIn} onBlur={focusOut}>
                        <option value="BS CS">BS CS</option>
                        <option value="BS IT">BS IT</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Year Level</label>
                      <select name="year_level" value={form.year_level} onChange={handleChange} style={{...inputStyle, cursor:'pointer'}} onFocus={focusIn} onBlur={focusOut}>
                        {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Section</label>
                    <select name="section" value={form.section||''} onChange={handleChange} style={{...inputStyle, cursor:'pointer'}} onFocus={focusIn} onBlur={focusOut}>
                      <option value="">Select Section</option>
                      {['A','B','C','D','E'].map(l => {
                        const prog = form.degree_program === 'BS IT' ? 'BSIT' : 'BSCS';
                        const val = `${prog}-${form.year_level}${l}`;
                        return <option key={l} value={val}>{val}</option>;
                      })}
                    </select>
                  </div>
                  <div style={{display:'flex', gap:'0.6rem', padding:'0.8rem 1rem', borderRadius:'10px', background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.15)', color:'rgba(238,238,238,0.55)', fontSize:'0.81em', alignItems:'flex-start'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:'1px'}}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    A temporary password will be auto-generated. Give it to the student so they can log in.
                  </div>
                </>
              )}

              {/* Faculty/Admin password fields */}
              {form.role !== 'Student' && (
                <>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Repeat password" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                </>
              )}

              {/* Error / Success */}
              {error && (
                <div style={{display:'flex', gap:'0.6rem', padding:'0.75rem 1rem', borderRadius:'10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5', fontSize:'0.85em', alignItems:'center'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div style={{display:'flex', gap:'0.6rem', padding:'0.75rem 1rem', borderRadius:'10px', background:'rgba(22,163,74,0.1)', border:'1px solid rgba(22,163,74,0.2)', color:'#86efac', fontSize:'0.85em', alignItems:'center'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {success}
                </div>
              )}

              {/* Created credentials card */}
              {createdCreds && (
                <div style={{borderRadius:'12px', background:'rgba(22,163,74,0.07)', border:'1px solid rgba(22,163,74,0.2)', overflow:'hidden'}}>
                  <div style={{padding:'0.75rem 1rem', borderBottom:'1px solid rgba(22,163,74,0.15)', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{color:'#86efac', fontWeight:700, fontSize:'0.83em'}}>Student account created successfully</span>
                  </div>
                  {createdCreds.email && (
                    <div style={{padding:'0.6rem 1rem', borderBottom:'1px solid rgba(22,163,74,0.1)', color:'rgba(238,238,238,0.45)', fontSize:'0.78em'}}>
                      Credentials sent to <strong style={{color:'#EEEEEE'}}>{createdCreds.email}</strong>
                    </div>
                  )}
                  <div style={{padding:'0.75rem 1rem', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                    {[['USERNAME', createdCreds.username, '#EEEEEE'], ['TEMP PASSWORD', createdCreds.password, '#F97316'], ['LOGIN URL', `${window.location.origin}/login`, '#60a5fa']].map(([k,v,c]) => (
                      <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.4rem 0.6rem', borderRadius:'7px', background:'rgba(0,0,0,0.2)'}}>
                        <span style={{color:'rgba(238,238,238,0.4)', fontSize:'0.72em', fontWeight:700, letterSpacing:'0.05em'}}>{k}</span>
                        <span style={{color:c, fontWeight:700, fontFamily:'monospace', fontSize:'0.88em'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:'0.5rem 1rem 0.75rem', color:'rgba(238,238,238,0.35)', fontSize:'0.74em'}}>
                    ⚠ Copy these now — the password won't be shown again.
                  </div>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{marginTop:'0.2rem', padding:'0.9rem', borderRadius:'11px',
                  background: loading ? 'rgba(249,115,22,0.4)' : 'linear-gradient(135deg, #F97316, #d9620f)',
                  color:'white', border:'none', fontWeight:700, fontSize:'0.97em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(249,115,22,0.35)',
                  transition:'all 0.2s', letterSpacing:'0.02em'}}>
                {loading ? 'Creating account...' : `Create ${form.role} Account`}
              </button>
            </form>

            <p style={{textAlign:'center', marginTop:'1.5rem', marginBottom:0, fontSize:'0.82em', color:'rgba(238,238,238,0.3)'}}>
              <Link to="/" style={{color:'#F97316', fontWeight:600, textDecoration:'none'}}>← Back to Dashboard</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
