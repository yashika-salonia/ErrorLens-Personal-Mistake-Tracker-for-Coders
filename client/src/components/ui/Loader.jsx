export default function Loader({ text = 'Loading…', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="page-loading">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div className="loader-ring"></div>
          <span className="loading-pulse">{text}</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', color: 'var(--text-3)', fontSize: 14 }}>
      <span className="spinner" style={{ width: 14, height: 14 }}></span>
      {text}
    </div>
  );
}