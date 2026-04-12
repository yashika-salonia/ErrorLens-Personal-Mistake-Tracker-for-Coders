export default function SummaryCard({ label, value, color = 'teal', icon }) {
  return (
    <div className={`stat-card stat-${color}`}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}