import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const STEPS = ['Personal', 'Contact', 'Academic', 'Guardian'];

const empty = {
  // Personal
  Student_ID:'', Last_Name:'', First_Name:'', Middle_Name:'',
  Date_of_Birth:'', Age:'', Gender:'', Civil_Status:'', Nationality:'Filipino', Religion:'',
  // Contact
  Email:'', Mobile_Number:'', Street:'', Barangay:'', City:'', Province:'', ZIP_Code:'',
  // Academic
  Year_Level:'1', Degree_Program:'', Section:'', School_Year:'', Enrollment_Status:'New',
  // Guardian
  Guardian_Name:'', Guardian_Relationship:'', Guardian_Contact:'', Guardian_Occupation:'', Guardian_Address:'',
};

const field = (label, name, formData, onChange, opts = {}) => (
  <div style={{display:'flex', flexDirection:'column', gap:'0.3rem'}}>
    <label style={{fontSize:'0.82em', fontWeight:600, color:'#393E46'}}>{label}{opts.required && <span style={{color:'#F97316'}}> *</span>}</label>
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

function RegisterStudent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(empty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleChange = e => {
    const val = e.target.value;
    const updated = { ...formData, [e.target.name]: val };
    // Auto-calc age from DOB
    if (e.target.name === 'Date_of_Birth' && val) {
      const age = Math.floor((new Date() - new Date(val)) / (365.25 * 24 * 60 * 60 * 1000));
      updated.Age = age;
    }
    setFormData(updated);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError('');
    axios.post(`${API_URL}/students`, formData)
      .then(() => navigate('/students'))
      .catch(err => {
        const errors = err.response?.data?.errors || {};
        const firstField = Object.keys(errors)[0];
        const msg = errors[firstField]?.[0] || err.response?.data?.message || 'Registration failed.';
        if (firstField === 'Student_ID') setStep(2);
        else if (firstField === 'Email') setStep(1);
        setError(msg);
        setIsSubmitting(false);
      });
  };

  const sectionStyle = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' };
  const fullRow = { gridColumn:'1 / -1' };

  const sections = [
    // Step 0 — Personal
    <div key="personal" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'1rem'}}>
        {field('Last Name', 'Last_Name', formData, handleChange, {required:true})}
        {field('First Name', 'First_Name', formData, handleChange, {required:true})}
        {field('Middle Name', 'Middle_Name', formData, handleChange)}
      </div>
      <div style={sectionStyle}>
        {field('Date of Birth', 'Date_of_Birth', formData, handleChange, {type:'date', required:true})}
        {field('Age', 'Age', formData, handleChange, {type:'number', placeholder:'Auto-calculated'})}
        {field('Gender', 'Gender', formData, handleChange, {type:'select', required:true, options:[{v:'',l:'Select'},{v:'Male',l:'Male'},{v:'Female',l:'Female'},{v:'Other',l:'Other'}]})}
        {field('Civil Status', 'Civil_Status', formData, handleChange, {type:'select', options:[{v:'',l:'Select'},{v:'Single',l:'Single'},{v:'Married',l:'Married'},{v:'Widowed',l:'Widowed'}]})}
        {field('Nationality', 'Nationality', formData, handleChange)}
        {field('Religion', 'Religion', formData, handleChange)}
      </div>
    </div>,

    // Step 1 — Contact
    <div key="contact" style={sectionStyle}>
      {field('Email Address', 'Email', formData, handleChange, {type:'email', required:true})}
      {field('Mobile Number', 'Mobile_Number', formData, handleChange, {placeholder:'09XXXXXXXXX'})}
      <div style={fullRow}>{field('Street', 'Street', formData, handleChange)}</div>
      {field('Barangay', 'Barangay', formData, handleChange)}
      {field('City / Municipality', 'City', formData, handleChange)}
      {field('Province', 'Province', formData, handleChange)}
      {field('ZIP Code', 'ZIP_Code', formData, handleChange)}
    </div>,

    // Step 2 — Academic
    <div key="academic" style={sectionStyle}>
      {field('Student ID', 'Student_ID', formData, handleChange, {required:true, placeholder:'2024-XXXX'})}
      {field('Year Level', 'Year_Level', formData, handleChange, {type:'select', required:true, options:[1,2,3,4,5].map(n=>({v:String(n),l:`Year ${n}`}))})}
      <div style={fullRow}>{field('Course / Degree Program', 'Degree_Program', formData, handleChange, {required:true, type:'select', options:[{v:'',l:'Select Program'},{v:'BS Information Technology',l:'BS Information Technology'},{v:'BS Computer Science',l:'BS Computer Science'},{v:'BS Information Systems',l:'BS Information Systems'},{v:'BS Mathematics',l:'BS Mathematics'}]})}</div>
      {field('Section', 'Section', formData, handleChange, {placeholder:'e.g. BSIT-3A'})}
      {field('School Year', 'School_Year', formData, handleChange, {placeholder:'e.g. 2024-2025'})}
      <div style={fullRow}>{field('Enrollment Status', 'Enrollment_Status', formData, handleChange, {type:'select', required:true, options:[{v:'New',l:'New'},{v:'Transferee',l:'Transferee'},{v:'Returning',l:'Returning'}]})}</div>
    </div>,

    // Step 3 — Guardian
    <div key="guardian" style={sectionStyle}>
      {field('Parent / Guardian Name', 'Guardian_Name', formData, handleChange)}
      {field('Relationship to Student', 'Guardian_Relationship', formData, handleChange, {type:'select', options:[{v:'',l:'Select'},{v:'Parent',l:'Parent'},{v:'Guardian',l:'Guardian'},{v:'Sibling',l:'Sibling'},{v:'Relative',l:'Relative'},{v:'Other',l:'Other'}]})}
      {field('Contact Number', 'Guardian_Contact', formData, handleChange, {placeholder:'09XXXXXXXXX'})}
      {field('Occupation', 'Guardian_Occupation', formData, handleChange)}
      <div style={fullRow}>{field('Address (if different from student)', 'Guardian_Address', formData, handleChange)}</div>
    </div>,
  ];

  return (
    <div className="page-container">
      <ConfirmModal
        isOpen={showCancelModal}
        title="Discard Registration?"
        message="You have unsaved changes. Are you sure you want to cancel registering this student?"
        onConfirm={() => navigate('/students')}
        onCancel={() => setShowCancelModal(false)}
      />

      <div className="page-header" style={{textAlign:'center'}}>
        <h1 className="page-title">Register New Student</h1>
        <p className="page-subtitle">Complete all sections to register a student profile.</p>
      </div>

      {/* Step indicator */}
      <div style={{display:'flex', gap:'0', marginBottom:'2rem', background:'white', borderRadius:'12px', padding:'0.5rem', boxShadow:'0 2px 8px rgba(34,40,49,0.08)', border:'1px solid #e5e7eb', maxWidth:'700px', margin:'0 auto 2rem'}}>
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

      <div>
        {/* Error alert banner */}
        {error && (
          <div style={{maxWidth:'700px', margin:'0 auto 1rem', padding:'0.9rem 1.2rem', borderRadius:'10px', background:'#fef2f2', border:'1px solid #fca5a5', display:'flex', alignItems:'flex-start', gap:'0.75rem'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:'1px'}}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <div style={{fontWeight:700, color:'#dc2626', fontSize:'0.88em', marginBottom:'0.15rem'}}>Registration Failed</div>
              <div style={{color:'#b91c1c', fontSize:'0.85em'}}>{error}</div>
            </div>
            <button type="button" onClick={() => setError('')} style={{marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#dc2626', padding:0, boxShadow:'none', flexShrink:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}

        <div className="modern-card" style={{maxWidth:'700px', margin:'0 auto', overflow:'visible'}}>
          <h2 style={{margin:'0 0 1.5rem', fontSize:'1em', fontWeight:700, color:'#222831', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'2px solid #F97316', paddingBottom:'0.6rem', display:'inline-block'}}>
            {STEPS[step]} Information
          </h2>

          {sections[step]}
        </div>

        {/* Navigation */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1.2rem', maxWidth:'700px', margin:'1.2rem auto 0'}}>
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
              <button type="button" onClick={handleSubmit} className="btn-primary" disabled={isSubmitting} style={{padding:'0.65rem 1.6rem'}}>
                {isSubmitting ? 'Registering...' : 'Register Student'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterStudent;
