import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function AdminRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', password_confirmation: '', role: 'Faculty' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Only admins can access this page
  if (!user || user.role !== 'Admin') {
    return (
      <div style={{minHeight:'100vh', background:'#222831', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif"}}>
        <div style={{textAlign:'center', color:'#EEEEEE'}}>
          <div style={{fontSize:'3em', marginBottom:'1rem'}}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto', display:'block'}}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
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
    setError(''); setSuccess('');
    if (form.password !== form.password_confirmation) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/admin-register`, form);
      setSuccess(`Account created: ${res.data.user.username} (${res.data.user.role})`);
      setForm({ username: '', password: '', password_confirmation: '', role: 'Faculty' });
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
    width:'100%', padding:'0.7rem 1rem', borderRadius:'10px',
    border:'1px solid rgba(255,255,255,0.1)', background:'rgba(34,40,49,0.6)',
    color:'#EEEEEE', fontSize:'0.95em', outline:'none', transition:'border-color 0.2s',
    boxSizing:'border-box',
  };
  const labelStyle = { display:'block', marginBottom:'0.4rem', fontSize:'0.82em', fontWeight:600, color:'rgba(238,238,238,0.65)', letterSpacing:'0.04em' };

  return (
    <div style={{minHeight:'100vh', background:'#222831', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>
      <div style={{position:'fixed', top:'-80px', right:'-80px', width:'320px', height:'320px', borderRadius:'50%', background:'rgba(249,115,22,0.08)', pointerEvents:'none'}} />
      <div style={{position:'fixed', bottom:'-60px', left:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(57,62,70,0.5)', pointerEvents:'none'}} />

      <div style={{width:'100%', maxWidth:'420px', background:'#393E46', borderRadius:'20px', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.4)', position:'relative', zIndex:1}}>
        <div style={{height:'4px', background:'linear-gradient(90deg, #F97316, #d9620f)'}} />

        <div style={{padding:'2.5rem 2.5rem 2rem'}}>
          <div style={{textAlign:'center', marginBottom:'2rem'}}>
            <div style={{width:'56px', height:'56px', borderRadius:'14px', background:'linear-gradient(135deg, #222831, #393E46)', border:'2px solid rgba(249,115,22,0.4)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', boxShadow:'0 8px 20px rgba(0,0,0,0.3)'}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h1 style={{margin:0, fontSize:'1.5em', fontWeight:800, color:'#EEEEEE'}}>Admin Panel</h1>
            <p style={{margin:'0.3rem 0 0', fontSize:'0.85em', color:'rgba(238,238,238,0.45)'}}>Create Faculty or Admin accounts</p>
            <div style={{marginTop:'0.6rem', display:'inline-block', padding:'0.2rem 0.8rem', borderRadius:'20px', background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', fontSize:'0.75em', color:'#F97316', fontWeight:700}}>
              ADMIN ONLY
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div>
              <label style={labelStyle}>USERNAME</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Enter username" required style={inputStyle}
                onFocus={e => e.target.style.borderColor='#F97316'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={labelStyle}>ROLE</label>
              <select name="role" value={form.role} onChange={handleChange} style={{...inputStyle, cursor:'pointer'}}>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required style={inputStyle}
                onFocus={e => e.target.style.borderColor='#F97316'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Repeat password" required style={inputStyle}
                onFocus={e => e.target.style.borderColor='#F97316'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>

            {error && (
              <div style={{padding:'0.75rem 1rem', borderRadius:'8px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', color:'#fca5a5', fontSize:'0.88em'}}>{error}</div>
            )}
            {success && (
              <div style={{padding:'0.75rem 1rem', borderRadius:'8px', background:'rgba(22,163,74,0.12)', border:'1px solid rgba(22,163,74,0.25)', color:'#86efac', fontSize:'0.88em'}}>{success}</div>
            )}

            <button type="submit" disabled={loading} style={{marginTop:'0.4rem', padding:'0.85rem', borderRadius:'10px', background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #F97316, #d9620f)', color:'white', border:'none', fontWeight:700, fontSize:'1em', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.4)', transition:'all 0.2s'}}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p style={{textAlign:'center', marginTop:'1.5rem', marginBottom:0, fontSize:'0.83em', color:'rgba(238,238,238,0.35)'}}>
            <Link to="/" style={{color:'#F97316', fontWeight:600, textDecoration:'none'}}>Back to Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
