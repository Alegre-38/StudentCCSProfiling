function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(34,40,49,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2rem',
        maxWidth: '400px', width: '100%',
        boxShadow: '0 24px 60px rgba(34,40,49,0.25)',
        animation: 'fadeInUp 0.2s ease-out',
      }}>
        {/* Icon */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(249,115,22,0.1)', margin: '0 auto 1.2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h3 style={{ margin: '0 0 0.5rem', textAlign: 'center', color: '#222831', fontSize: '1.1em', fontWeight: 700 }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 1.8rem', textAlign: 'center', color: '#6b7280', fontSize: '0.93em', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.7rem', borderRadius: '10px',
              border: '1px solid #d1d5db', background: 'transparent',
              color: '#393E46', fontWeight: 600, cursor: 'pointer',
              fontSize: '0.93em', transition: 'all 0.2s',
            }}
          >
            Keep Editing
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '0.7rem', borderRadius: '10px',
              border: 'none', background: '#F97316',
              color: 'white', fontWeight: 700, cursor: 'pointer',
              fontSize: '0.93em', boxShadow: '0 4px 12px rgba(249,115,22,0.35)',
              transition: 'all 0.2s',
            }}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
