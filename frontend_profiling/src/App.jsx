import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useKeepAlive } from './hooks/useKeepAlive';
import './App.css';

// Lazy-loaded pages
const StudentsList        = lazy(() => import('./pages/StudentsList'));
const StudentDetail       = lazy(() => import('./pages/StudentDetail'));
const RegisterStudent     = lazy(() => import('./pages/RegisterStudent'));
const FacultyList         = lazy(() => import('./pages/FacultyList'));
const FacultyDetail       = lazy(() => import('./pages/FacultyDetail'));
const RegisterFaculty     = lazy(() => import('./pages/RegisterFaculty'));
const Dashboard           = lazy(() => import('./pages/Dashboard'));
const ComprehensiveSearch = lazy(() => import('./pages/ComprehensiveSearch'));
const Login               = lazy(() => import('./pages/Login'));
const Register            = lazy(() => import('./pages/Register'));
const AdminRegister       = lazy(() => import('./pages/AdminRegister'));
const StudentPortal       = lazy(() => import('./pages/StudentPortal'));

function PageLoader() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',flexDirection:'column',gap:'1rem'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:'32px',height:'32px',border:'3px solid rgba(249,115,22,0.15)',borderTop:'3px solid #F97316',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
      <span style={{fontSize:'0.8em',color:'rgba(238,238,238,0.3)',letterSpacing:'0.06em'}}>Loading…</span>
    </div>
  );
}

const IconMenu = () => <svg style={{width:'22px',height:'22px',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round',fill:'none'}} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconStudents = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconFaculty  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconSearch   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconLogout   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconDashboard= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconAdmin    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

const NAV = [
  { to: '/students',  label: 'Student Information', Icon: IconStudents },
  { to: '/faculties', label: 'Faculty Information',  Icon: IconFaculty  },
  { to: '/search',    label: 'Comprehensive Search', Icon: IconSearch   },
];

function ProtectedLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  if (!user) return <Navigate to="/login" replace />;

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : 'AU';
  const isAdmin = user.role === 'Admin';

  return (
    <div className="app-layout">
      <header className="top-header">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Menu">
          <IconMenu />
        </button>
        <span className="header-title">Profiling System</span>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.6rem'}}>
          <span style={{fontSize:'0.82em', color:'rgba(238,238,238,0.5)'}}>{user.username}</span>
          <button onClick={logout} title="Sign out" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(238,238,238,0.7)',borderRadius:'8px',padding:'0.4rem 0.7rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.82em',fontWeight:600,transition:'all 0.2s'}}>
            <IconLogout /> Sign out
          </button>
        </div>
      </header>

      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>Profiling System</h1>
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="sidebar-section-label">MODULES</div>
        <nav className="sidebar-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <span className="icon"><IconDashboard /></span> Dashboard
          </Link>
          {NAV.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className={location.pathname.startsWith(to) ? 'active' : ''}>
              <span className="icon"><Icon /></span> {label}
            </Link>
          ))}
        </nav>

        {isAdmin && (
          <>
            <div className="sidebar-section-label">ADMIN</div>
            <nav className="sidebar-nav">
              <Link to="/admin/register" className={location.pathname === '/admin/register' ? 'active' : ''}>
                <span className="icon"><IconAdmin /></span> Manage Accounts
              </Link>
            </nav>
          </>
        )}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div style={{fontWeight:700,fontSize:'0.88em',color:'#EEEEEE'}}>{user.username}</div>
              <div style={{fontSize:'0.73em',color:'rgba(238,238,238,0.4)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{user.role}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                    element={<Dashboard />} />
            <Route path="/students"            element={<StudentsList />} />
            <Route path="/students/register"   element={<RegisterStudent />} />
            <Route path="/students/:id"        element={<StudentDetail />} />
            <Route path="/faculties"           element={<FacultyList />} />
            <Route path="/faculties/register"  element={<RegisterFaculty />} />
            <Route path="/faculties/:id"       element={<FacultyDetail />} />
            <Route path="/search"              element={<ComprehensiveSearch />} />
            <Route path="/admin/register"      element={<AdminRegister />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{minHeight:'100vh',background:'#222831',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1.5rem',fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{animation:'fadeUp 0.5s ease',textAlign:'center'}}>
          <div style={{fontSize:'2em',fontWeight:800,color:'#F97316',letterSpacing:'-1px',marginBottom:'0.3rem'}}>Profiling System</div>
          <div style={{fontSize:'0.82em',color:'rgba(238,238,238,0.3)',letterSpacing:'0.1em',textTransform:'uppercase'}}>CCS Student Profiling</div>
        </div>
        <div style={{width:'36px',height:'36px',border:'3px solid rgba(249,115,22,0.2)',borderTop:'3px solid #F97316',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
        <div style={{fontSize:'0.78em',color:'rgba(238,238,238,0.25)',letterSpacing:'0.05em'}}>Loading your session…</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/*"        element={
          user?.role === 'Student' ? <StudentLayout /> : <ProtectedLayout />
        } />
      </Routes>
    </Suspense>
  );
}

function StudentLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/*" element={<StudentPortal />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  useKeepAlive();
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
