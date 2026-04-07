import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const card = {
  background: '#fff', border: '1px solid rgba(57,62,70,0.1)',
  borderRadius: '16px', padding: '1.8rem',
  boxShadow: '0 2px 12px rgba(34,40,49,0.06)', marginBottom: '1.5rem',
};
const inp = {
  width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px',
  border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.93em',
  boxSizing: 'border-box', color: '#222831', background: 'white',
};

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
    <span style={{ fontSize: '0.72em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
    <span style={{ fontSize: '0.93em', color: '#222831', fontWeight: 500 }}>{value || <span style={{ color: '#d1d5db' }}>—</span>}</span>
  </div>
);

function EditModal({ faculty, onClose, onSaved }) {
  const [form, setForm] = useState({
    First_Name: faculty.First_Name || '',
    Middle_Name: faculty.Middle_Name || '',
    Last_Name: faculty.Last_Name || '',
    Email: faculty.Email || '',
    Contact_Number: faculty.Contact_Number || '',
    Position: faculty.Position || '',
    Department: faculty.Department || '',
    Employment_Type: faculty.Employment_Type || 'Full-Time',
    Hire_Date: faculty.Hire_Date || '',
    Specialization: faculty.Specialization || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    axios.put(`${API_URL}/faculties/${faculty.Faculty_ID}`, form)
      .then(() => { onSaved(); onClose(); })
      .catch(err => {
        const msg = err.response?.data?.message
          || Object.values(err.response?.data?.errors || {})[0]?.[0]
          || 'Update failed.';
        setError(msg);
        setSaving(false);
      });
  };

  const labelStyle = { display: 'block', fontSize: '0.78em', fontWeight: 600, color: '#393E46', marginBottom: '0.3rem' };
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(34,40,49,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(34,40,49,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1em', fontWeight: 800, color: '#222831' }}>Edit Faculty Information</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.2em', lineHeight: 1, padding: '0.2rem', boxShadow: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div><label style={labelStyle}>First Name <span style={{color:'#F97316'}}>*</span></label><input name="First_Name" value={form.First_Name} onChange={handleChange} required style={inp} /></div>
            <div><label style={labelStyle}>Middle Name</label><input name="Middle_Name" value={form.Middle_Name} onChange={handleChange} style={inp} /></div>
            <div><label style={labelStyle}>Last Name <span style={{color:'#F97316'}}>*</span></label><input name="Last_Name" value={form.Last_Name} onChange={handleChange} required style={inp} /></div>
          </div>

          {/* Contact */}
          <div style={grid2}>
            <div><label style={labelStyle}>Email Address <span style={{color:'#F97316'}}>*</span></label><input name="Email" type="email" value={form.Email} onChange={handleChange} required style={inp} /></div>
            <div><label style={labelStyle}>Contact Number</label><input name="Contact_Number" value={form.Contact_Number} onChange={handleChange} placeholder="09XXXXXXXXX" style={inp} /></div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '0.2rem 0' }} />

          {/* Employment */}
          <div style={grid2}>
            <div><label style={labelStyle}>Position</label><input name="Position" value={form.Position} onChange={handleChange} placeholder="e.g. Instructor I" style={inp} /></div>
            <div>
              <label style={labelStyle}>Department <span style={{color:'#F97316'}}>*</span></label>
              <select name="Department" value={form.Department} onChange={handleChange} required style={inp}>
                <option value="">Select</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Information Systems</option>
                <option>Mathematics</option>
                <option>Engineering</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Employment Type</label>
              <select name="Employment_Type" value={form.Employment_Type} onChange={handleChange} style={inp}>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contractual</option>
              </select>
            </div>
            <div><label style={labelStyle}>Hire Date</label><input name="Hire_Date" type="date" value={form.Hire_Date} onChange={handleChange} style={inp} /></div>
          </div>
          <div><label style={labelStyle}>Specialization</label><input name="Specialization" value={form.Specialization} onChange={handleChange} placeholder="e.g. Machine Learning, Web Development" style={inp} /></div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', fontSize: '0.88em' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.4rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'transparent', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.93em' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '0.65rem 1.6rem' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FacultyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState({ type: '', group: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => { fetchFaculty(); }, [id]);

  const fetchFaculty = () => {
    setLoading(true);
    axios.get(`${API_URL}/faculties/${id}`)
      .then(res => { setFaculty(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleAssignRole = e => {
    e.preventDefault();
    setSubmitting(true);
    axios.post(`${API_URL}/faculties/${id}/roles`, {
      Advisory_Type: newRole.type,
      Assigned_Group: newRole.group,
    }).then(() => {
      setNewRole({ type: '', group: '' });
      fetchFaculty();
    }).catch(console.error)
      .finally(() => setSubmitting(false));
  };

  if (loading) return <div className="page-container"><p style={{ color: '#64748b', padding: '2rem' }}>Loading profile...</p></div>;
  if (!faculty) return <div className="page-container"><p style={{ color: '#ef4444', padding: '2rem' }}>Faculty not found.</p></div>;

  const isFullTime = faculty.Employment_Type === 'Full-Time';
  const initials = ((faculty.First_Name?.[0] || '') + (faculty.Last_Name?.[0] || '')).toUpperCase();

  return (
    <div className="page-container">
      {showEdit && <EditModal faculty={faculty} onClose={() => setShowEdit(false)} onSaved={fetchFaculty} />}

      {/* Back button */}
      <button
        onClick={() => navigate('/faculties')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid rgba(57,62,70,0.2)', borderRadius: '8px', padding: '0.45rem 1rem', cursor: 'pointer', color: '#393E46', fontWeight: 600, fontSize: '0.85em', marginBottom: '1.4rem', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#222831'; e.currentTarget.style.color = '#EEEEEE'; e.currentTarget.style.borderColor = '#222831'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#393E46'; e.currentTarget.style.borderColor = 'rgba(57,62,70,0.2)'; }}
      >
        <IconArrow /> Back to Faculty
      </button>

      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #222831 0%, #393E46 100%)', borderRadius: '16px', padding: '2rem', marginBottom: '1.2rem', boxShadow: '0 6px 24px rgba(34,40,49,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3em', color: 'white', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <h1 style={{ margin: '0 0 0.3rem 0', fontSize: '1.7em', fontWeight: 800, color: '#EEEEEE' }}>
                {faculty.First_Name} {faculty.Last_Name}
              </h1>
              <p style={{ margin: '0 0 0.15rem 0', color: 'rgba(238,238,238,0.6)', fontSize: '0.9em' }}>
                {faculty.Position || 'Faculty'} &mdash; {faculty.Department}
              </p>
              <p style={{ margin: 0, color: 'rgba(238,238,238,0.4)', fontSize: '0.82em' }}>{faculty.Email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.8rem 1.4rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.8em', fontWeight: 800, color: '#F97316', lineHeight: 1 }}>{faculty.roles?.length || 0}</div>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Roles</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.8rem 1.4rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.4em', fontWeight: 800, color: isFullTime ? '#4ade80' : '#fbbf24', lineHeight: 1 }}>{faculty.Employment_Type || 'N/A'}</div>
              <div style={{ fontSize: '0.68em', color: 'rgba(238,238,238,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Status</div>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', color: '#F97316', borderRadius: '8px', padding: '0.5rem 1.1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.83em', transition: 'all 0.2s' }}
            >
              <IconEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
        <div style={card}>
          <h2 style={{ margin: '0 0 1.4rem 0', fontSize: '0.95em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #F97316', paddingBottom: '0.5rem', display: 'inline-block' }}>Personal Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <InfoRow label="First Name" value={faculty.First_Name} />
            <InfoRow label="Last Name" value={faculty.Last_Name} />
            <InfoRow label="Middle Name" value={faculty.Middle_Name} />
            <InfoRow label="Contact Number" value={faculty.Contact_Number} />
            <div style={{ gridColumn: '1 / -1' }}><InfoRow label="Email Address" value={faculty.Email} /></div>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: '0 0 1.4rem 0', fontSize: '0.95em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #F97316', paddingBottom: '0.5rem', display: 'inline-block' }}>Employment Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <InfoRow label="Faculty ID" value={faculty.Faculty_ID} />
            <InfoRow label="Position" value={faculty.Position} />
            <InfoRow label="Department" value={faculty.Department} />
            <InfoRow label="Employment Type" value={faculty.Employment_Type} />
            <InfoRow label="Hire Date" value={faculty.Hire_Date} />
            <InfoRow label="Specialization" value={faculty.Specialization} />
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.2rem' }}>
        <div style={card}>
          <h2 style={{ margin: '0 0 1.4rem 0', fontSize: '0.95em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #F97316', paddingBottom: '0.5rem', display: 'inline-block' }}>Assigned Roles</h2>
          {!faculty.roles?.length ? (
            <p style={{ color: '#9ca3af', fontSize: '0.9em' }}>No roles assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {faculty.roles.map(role => (
                <div key={role.Role_ID} style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)', borderLeft: '4px solid #F97316', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#222831', fontSize: '0.93em' }}>{role.Advisory_Type} Advisor</div>
                  <div style={{ fontSize: '0.82em', color: '#6b7280', marginTop: '0.2rem' }}>
                    Group: <span style={{ color: '#F97316', fontWeight: 600 }}>{role.Assigned_Group}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={card}>
          <h2 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95em', fontWeight: 700, color: '#222831', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #F97316', paddingBottom: '0.5rem', display: 'inline-block' }}>Assign New Role</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.83em', marginBottom: '1.2rem', marginTop: '0.8rem' }}>
            Assign an advisory or administrative role to this faculty member.
          </p>
          <form onSubmit={handleAssignRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78em', fontWeight: 600, color: '#393E46', marginBottom: '0.3rem' }}>Advisory Type <span style={{ color: '#F97316' }}>*</span></label>
              <select value={newRole.type} onChange={e => setNewRole({ ...newRole, type: e.target.value })} required style={inp}>
                <option value="">Select type</option>
                <option value="Academic">Academic Advisor</option>
                <option value="Thesis">Thesis Advisor</option>
                <option value="Organization">Org Moderator</option>
                <option value="Research">Research Lead</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78em', fontWeight: 600, color: '#393E46', marginBottom: '0.3rem' }}>Assigned Group / Section <span style={{ color: '#F97316' }}>*</span></label>
              <input type="text" placeholder="e.g. BSIT-3A or Tech Club" value={newRole.group} onChange={e => setNewRole({ ...newRole, group: e.target.value })} required style={inp} />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ padding: '0.65rem', marginTop: '0.4rem' }}>
              {submitting ? 'Assigning...' : 'Assign Role'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FacultyDetail;
