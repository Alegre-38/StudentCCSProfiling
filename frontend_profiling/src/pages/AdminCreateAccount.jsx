import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function AdminCreateAccount() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', password_confirmation: '', role: 'Faculty' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Block non-admins entirely
  if (!user || user.role !== 'Admin') {
    return (
      <div style={{minHeight:'100vh', background:'#222831', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif"}}>
        <div style={{textAlign:'center', color:'#EEEEEE'}}>
          <div style={{fontSize:'3em', marginBottom:'1rem'}}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={{color:'#F97316', margin:'0 0 0.5rem'}}>Access Denied</h2>
          <p style={{color:'rgba(238,238,238,0.5)', margin:'0 0 1.5rem'}}>This page is restricted to administrators only.</p>
          <button onClick={() => navigate('/')} style={{padding:'0.7rem 1.5rem', background:'#F97316', color:'white', border:'none', borderRadius:'10px', fontWeight:700, cursor:'pointer'}}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/admin-register`, form);
      setSuccess(`Account created! Username: ${res.data.user.username} | Role: ${res.data.user.role}`);
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
    width:'100%', padding:'0.7rem 1rem', borderRadius:'8px',
    border:'1px solid #d1d5db', background:'white',
    fontSize:'0.95em', outline:'none', color:'#222831',
    transition:'border-color 0.2s', boxSizing:'border-box',
  };
  const labelStyle = { display:'block', marginBottom:'0.4rem', fontWeight:600, color:'#393E46', fontSize:'0.9em' };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Create Staff Account</h1>
        <p className="page-subtitle">Admin-only — create accounts for Faculty or other Admins.</p>
      </div>

      <div className="modern-card" style={{maxWidth:'480px', margin:'0 auto'}}>
        {/* Admin badge */}
        <div style={{display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.35rem 0.9rem', background:'rgba(249,115,22,0.1)', borderRadius:'20px', marginBottom:'1.5rem', border:'1px solid rgba(249,115,22,0.25)'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={{fontSize:'0.8em', fontWeight:700, color:'#F97316'}}>ADMIN ACCESS ONLY</span>
        </div>

        {success && (
          <div style={{padding:'0.9rem 1rem', borderRadius:'8px', background:'rgba(22,163,74,0.08)', border:'1px solid rgba(22,163,74,0.25)', color:'#16a34a', fontSize:'0.9em', marginBottom:'1rem', fontWeight:600}}>
            {success}
          </div>
        )}
        {error && (
          <div style={{padding:'0.9rem 1rem', borderRadius:'8px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', color:'#dc2626', fontSize:'0.9em', marginBottom:'1rem'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1.1rem'}}>
          <div>
            <label style={labelStyle}>Role</label>
            <select name="role" value={form.role} onChange={handleChange} style={{...inputStyle, background:'white'}}>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Enter username" required style={inputStyle}
              onFocus={e => e.target.style.borderColor='#F97316'}
              onBlur={e => e.target.style.borderColor='#d1d5db'} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required style={inputStyle}
              onFocus={e => e.target.style.borderColor='#F97316'}
              onBlur={e => e.target.style.borderColor='#d1d5db'} />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Repeat password" required style={inputStyle}
              onFocus={e => e.target.style.borderColor='#F97316'}
              onBlur={e => e.target.style.borderColor='#d1d5db'} />
          </div>
          <div style={{display:'flex', gap:'0.8rem', justifyContent:'flex-end', marginTop:'0.5rem'}}>
            <button type="button" onClick={() => navigate('/')} style={{padding:'0.65rem 1.4rem', border:'1px solid #d1d5db', borderRadius:'8px', background:'transparent', cursor:'pointer', color:'#393E46', fontWeight:600}}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{padding:'0.65rem 1.6rem'}}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateAccount;
