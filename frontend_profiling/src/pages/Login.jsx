import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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

  const inp = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', background: 'white', color: '#222831',
    fontSize: '0.93em', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/pnc-building.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      position: 'relative',
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,25,0.65)', backdropFilter: 'blur(2px)' }} />

      {/* Login card */}
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, animation: 'fadeIn 0.5s ease' }}>

        {/* PnC branding above card */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src="/ccs-logo.png"
            alt="College of Computer Studies"
            style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }}
            onError={e => e.target.style.display = 'none'}
          />
          <div style={{ marginTop: '0.8rem', color: 'white', fontWeight: 800, fontSize: '1.05em', letterSpacing: '0.01em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Pamantasan ng Cabuyao
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8em', marginTop: '3px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            College of Computer Studies
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg,#F97316,#d9620f)' }} />

          <div style={{ padding: '2.2rem 2.2rem 2rem' }}>
            <div style={{ marginBottom: '1.8rem', textAlign: 'center' }}>
              <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.4em', fontWeight: 800, color: '#222831', letterSpacing: '-0.3px' }}>
                Student Profiling System
              </h1>
              <p style={{ margin: 0, fontSize: '0.83em', color: '#9ca3af' }}>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75em', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input type="text" name="username" value={form.username} onChange={handleChange}
                    placeholder="Enter your username" required autoComplete="username"
                    style={{ ...inp, paddingLeft: '2.5rem' }}
                    onFocus={e => { e.target.style.borderColor='#F97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75em', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your password" required autoComplete="current-password"
                    style={{ ...inp, paddingLeft: '2.5rem', paddingRight: '2.8rem' }}
                    onFocus={e => { e.target.style.borderColor='#F97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPw
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', fontSize: '0.85em', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                marginTop: '0.3rem', padding: '0.9rem', borderRadius: '10px',
                background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#F97316,#d9620f)',
                color: 'white', border: 'none', fontWeight: 700, fontSize: '1em',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.35)',
                transition: 'all 0.2s',
              }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.4rem', marginBottom: 0, fontSize: '0.83em', color: '#9ca3af' }}>
              New student?{' '}
              <Link to="/register" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>Create a student account</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72em', color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} Pamantasan ng Cabuyao · CCS Student Profiling System
        </p>
      </div>
    </div>
  );
}

export default Login;
