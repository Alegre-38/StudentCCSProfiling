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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 768px) { .login-left { display: none !important; } .login-right { width: 100% !important; } }
      `}</style>

      {/* ── Left Panel — PnC Branding ── */}
      <div className="login-left" style={{
        width: '50%', background: 'linear-gradient(160deg, #1a2a4a 0%, #0f1e38 60%, #1a3a2a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', left:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(249,115,22,0.06)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, textAlign:'center', animation:'fadeIn 0.6s ease' }}>
          {/* PnC Logo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <img
              src="https://www.pnc.edu.ph/wp-content/uploads/2021/07/PNC-Logo.png"
              alt="Pamantasan ng Cabuyao"
              style={{ width: '140px', height: '140px', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
              onError={e => { e.target.style.display='none'; }}
            />
          </div>

          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.5em', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            Pamantasan ng Cabuyao
          </h2>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.85em', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
            College of Computer Studies
          </p>

          <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg,#F97316,#d9620f)', borderRadius: '2px', margin: '1.2rem auto' }} />

          <p style={{ margin: 0, fontSize: '1.1em', fontWeight: 700, color: '#F97316', letterSpacing: '0.02em' }}>
            Student Profiling System
          </p>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.78em', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            Manage and track student academic<br />profiles, skills, and activities.
          </p>

          {/* Bottom badges */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['Academic Records', 'Skills Tracking', 'Clearance'].map(b => (
              <span key={b} style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.72em', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="login-right" style={{
        width: '50%', background: '#f0f2f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease 0.1s both' }}>

          {/* Mobile logo (hidden on desktop) */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'none' }} className="mobile-logo">
            <img src="https://www.pnc.edu.ph/wp-content/uploads/2021/07/PNC-Logo.png" alt="PnC" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
          </div>

          {/* Form card */}
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(34,40,49,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg,#F97316,#d9620f)' }} />

            <div style={{ padding: '2.2rem 2.2rem 2rem' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.5em', fontWeight: 800, color: '#222831', letterSpacing: '-0.3px' }}>
                  Welcome back
                </h1>
                <p style={{ margin: 0, fontSize: '0.85em', color: '#9ca3af' }}>
                  Sign in to your Profiling System account
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75em', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input type="text" name="username" value={form.username} onChange={handleChange}
                      placeholder="Enter your username" required autoComplete="username"
                      style={{ ...inp, paddingLeft: '2.5rem' }}
                      onFocus={e => { e.target.style.borderColor='#F97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75em', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  marginTop: '0.3rem', padding: '0.9rem', borderRadius: '10px',
                  background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#F97316,#d9620f)',
                  color: 'white', border: 'none', fontWeight: 700, fontSize: '1em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.35)',
                  transition: 'all 0.2s', letterSpacing: '0.02em',
                }}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.4rem', marginBottom: 0, fontSize: '0.83em', color: '#9ca3af' }}>
                New student?{' '}
                <Link to="/register" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>
                  Create a student account
                </Link>
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.75em', color: '#9ca3af' }}>
            © {new Date().getFullYear()} Pamantasan ng Cabuyao · CCS Student Profiling System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
