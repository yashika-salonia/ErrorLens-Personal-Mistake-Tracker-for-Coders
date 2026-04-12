// This is a helper — actual toasting is done via react-hot-toast in App.jsx
// Use this for inline alert-style messages inside components

export default function Toast({ type = 'info', message }) {
  if (!message) return null;

  const styles = {
    info:    { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa', border: 'rgba(96,165,250,0.25)',  icon: 'ℹ' },
    success: { bg: 'rgba(34,211,166,0.1)',  color: '#22d3a6', border: 'rgba(34,211,166,0.25)',  icon: '✓' },
    error:   { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.25)', icon: '✗' },
    warning: { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: 'rgba(251,191,36,0.25)',  icon: '⚠' },
  };

  const s = styles[type];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 8, padding: '10px 14px',
      fontSize: 14, marginBottom: 12,
    }}>
      <span style={{ fontWeight: 700 }}>{s.icon}</span>
      {message}
    </div>
  );
}