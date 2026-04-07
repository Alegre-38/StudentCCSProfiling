import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'0.75rem 1rem', borderRadius:'10px',
    border:'1px solid rgba(255,255,255,0.1)',
    background:'rgba(34,40,49,0.6)', color:'#EEEEEE',
    fontSize:'0.95em', outline:'none', transition:'border-color 0.2s',
    boxSizing:'border-box',
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#222831',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'1.5rem', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",
    }}>
      <div style={{position:'fixed', top:'-80px', right:'-80px', width:'320px', height:'320px', borderRadius:'50%', background:'rgba(249,115,22,0.08)', pointerEvents:'none'}} />
      <div style={{position:'fixed', bottom:'-60px', left:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(57,62,70,0.5)', pointerEvents:'none'}} />

      <div style={{width:'100%', maxWidth:'400px', background:'#393E46', borderRadius:'20px', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.4)', position:'relative', zIndex:1}}>
        <div style={{height:'4px', background:'linear-gradient(90deg, #F97316, #d9620f)'}} />

        <div style={{padding:'2.5rem 2.5rem 2rem'}}>
          <div style={{textAlign:'center', marginBottom:'2rem'}}>
            <div style={{width:'56px', height:'56px', borderRadius:'14px', background:'linear-gradient(135deg, #F97316, #d9620f)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', boxShadow:'0 8px 20px rgba(249,115,22,0.35)'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 style={{margin:0, fontSize:'1.6em', fontWeight:800, color:'#EEEEEE', letterSpacing:'-0.3px'}}>ProfileSys</h1>
            <p style={{margin:'0.3rem 0 0', fontSize:'0.88em', color:'rgba(238,238,238,0.45)'}}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div>
              <label style={{display:'block', marginBottom:'0.4rem', fontSize:'0.82em', fontWeight:600, color:'rgba(238,238,238,0.65)', letterSpacing:'0.04em'}}>USERNAME</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Enter your username" required autoComplete="username" style={inputStyle}
                onFocus={e => e.target.style.borderColor='#F97316'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.4rem', fontSize:'0.82em', fontWeight:600, color:'rgba(238,238,238,0.65)', letterSpacing:'0.04em'}}>PASSWORD</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required autoComplete="current-password" style={inputStyle}
                onFocus={e => e.target.style.borderColor='#F97316'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>

            {error && (
              <div style={{padding:'0.75rem 1rem', borderRadius:'8px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', color:'#fca5a5', fontSize:'0.88em'}}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{marginTop:'0.4rem', padding:'0.85rem', borderRadius:'10px', background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #F97316, #d9620f)', color:'white', border:'none', fontWeight:700, fontSize:'1em', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.4)', transition:'all 0.2s'}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{textAlign:'center', marginTop:'1.5rem', marginBottom:0, fontSize:'0.83em', color:'rgba(238,238,238,0.35)'}}>
            New student?{' '}
            <Link to="/register" style={{color:'#F97316', fontWeight:600, textDecoration:'none'}}>Create a student account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
