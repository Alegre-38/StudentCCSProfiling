import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const STEPS = ['Personal & Contact', 'Employment'];

const empty = {
  Faculty_ID: '', First_Name: '', Middle_Name: '', Last_Name: '',
  Position: '', Department: '', Employment_Type: 'Full-Time', Hire_Date: '',
  Email: '', Contact_Number: '', Office_Location: '', Specialization: '',
};

const field = (label, name, formData, onChange, opts = {}) => (
  <div style={{display:'flex', flexDirection:'column', gap:'0.3rem'}}>
    <label style={{fontSize:'0.82em', fontWeight:600, color:'#393E46'}}>
      {label}{opts.required && <span style={{color:'#F97316'}}> *</span>}
    </label>
    {opts.type === 'select' ? (
      <select name={name} value={formData[name]} onChange={onChange} required={opts.required}
        style={{padding:'0.65rem 1rem', borderRadius:'8px', border:'1px solid #d1d5db', background:'white', fontSize:'0.93em', color:'#222831', outline:'none'}}>
        {opts.options.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
      </select>
    ) : (
      <input type={opts.type || 'text'} name={name} value={formData[name]} onChange={onChange}
        placeholder={opts.placeholder || ''} required={opts.required}
        style={{padding:'0.65rem 1rem', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'0.93em', color:'#222831', outline:'none', background:'white'}} />
    )}
  </div>
);

function RegisterFaculty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(empty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    axios.post(`${API_URL}/faculties`, formData)
      .then(() => navigate('/faculties'))
      .catch(err => {
        const msg = err.response?.data?.message
          || Object.values(err.response?.data?.errors || {})[0]?.[0]
          || 'Registration failed.';
        setError(msg);
        setIsSubmitting(false);
      });
  };

  const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' };
  const grid3 = { display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'1rem' };

  const sections = [
    // Step 0 — Personal + Contact merged
    <div key="personal" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
      <div style={grid3}>
        {field('First Name', 'First_Name', formData, handleChange, {required:true})}
        {field('Middle Name', 'Middle_Name', formData, handleChange)}
        {field('Last Name', 'Last_Name', formData, handleChange, {required:true})}
      </div>
      <hr style={{border:'none', borderTop:'1px solid #f0f0f0', margin:'0'}} />
      <div style={grid2}>
        {field('Email Address', 'Email', formData, handleChange, {type:'email', required:true})}
        {field('Contact Number', 'Contact_Number', formData, handleChange, {placeholder:'09XXXXXXXXX'})}
      </div>
    </div>,

    // Step 1 — Employment
    <div key="employment" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
      <div style={grid2}>
        {field('Faculty ID', 'Faculty_ID', formData, handleChange, {required:true, placeholder:'FAC-XXXXX'})}
        {field('Position', 'Position', formData, handleChange, {required:true, placeholder:'e.g. Instructor I, Asst. Professor'})}
        {field('Department', 'Department', formData, handleChange, {required:true, type:'select', options:[
          {v:'',l:'Select Department'},
          {v:'Computer Science',l:'Computer Science'},
          {v:'Information Technology',l:'Information Technology'},
          {v:'Information Systems',l:'Information Systems'},
          {v:'Mathematics',l:'Mathematics'},
          {v:'Engineering',l:'Engineering'},
        ]})}
        {field('Employment Status', 'Employment_Type', formData, handleChange, {type:'select', options:[
          {v:'Full-Time',l:'Full-Time'},
          {v:'Part-Time',l:'Part-Time'},
          {v:'Contractual',l:'Contractual'},
        ]})}
        {field('Hire Date', 'Hire_Date', formData, handleChange, {type:'date'})}
        {field('Specialization', 'Specialization', formData, handleChange, {placeholder:'e.g. Machine Learning, Web Development'})}
      </div>
    </div>,
  ];

  return (
    <div className="page-container">
      <ConfirmModal
        isOpen={showCancelModal}
        title="Discard Registration?"
        message="You have unsaved changes. Are you sure you want to cancel registering this faculty member?"
        onConfirm={() => navigate('/faculties')}
        onCancel={() => setShowCancelModal(false)}
      />

      <div className="page-header" style={{textAlign:'center'}}>
        <h1 className="page-title">Register New Faculty</h1>
        <p className="page-subtitle">Complete all sections to register a faculty member.</p>
      </div>

      {/* Step indicator */}
      <div style={{display:'flex', gap:'0', marginBottom:'2rem', background:'white', borderRadius:'12px', padding:'0.5rem', boxShadow:'0 2px 8px rgba(34,40,49,0.08)', border:'1px solid #e5e7eb', maxWidth:'640px', margin:'0 auto 2rem'}}>
        {STEPS.map((s, i) => (
          <button key={s} type="button" onClick={() => setStep(i)}
            style={{
              flex:1, padding:'0.6rem 0.5rem', border:'none', borderRadius:'8px',
              fontWeight:600, fontSize:'0.85em', cursor:'pointer', transition:'all 0.2s',
              background: step === i ? '#F97316' : 'transparent',
              color: step === i ? 'white' : i < step ? '#F97316' : '#9ca3af',
              boxShadow: step === i ? '0 2px 8px rgba(249,115,22,0.3)' : 'none',
            }}>
            <span style={{display:'block', fontSize:'0.75em', marginBottom:'1px', opacity:0.7}}>{i + 1}</span>
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modern-card" style={{maxWidth:'640px', margin:'0 auto', overflow:'visible'}}>
          {sections[step]}

          {error && (
            <div style={{marginTop:'1rem', padding:'0.75rem 1rem', borderRadius:'8px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', color:'#dc2626', fontSize:'0.88em'}}>
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'640px', margin:'1.2rem auto 0'}}>
          <button type="button" onClick={() => setShowCancelModal(true)}
            style={{padding:'0.65rem 1.4rem', border:'1px solid #d1d5db', borderRadius:'8px', background:'transparent', cursor:'pointer', color:'#393E46', fontWeight:600, fontSize:'0.93em'}}>
            Cancel
          </button>
          <div style={{display:'flex', gap:'0.8rem'}}>
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                style={{padding:'0.65rem 1.4rem', border:'1px solid #d1d5db', borderRadius:'8px', background:'transparent', cursor:'pointer', color:'#393E46', fontWeight:600, fontSize:'0.93em'}}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} className="btn-primary" style={{padding:'0.65rem 1.6rem'}}>
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{padding:'0.65rem 1.6rem'}}>
                {isSubmitting ? 'Registering...' : 'Register Faculty'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterFaculty;
