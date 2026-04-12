export default function PersonalityBadge({ data }) {
  if (!data) return null;

  const label = data.label || data.personality || 'Unknown';
  const description = data.description || '';

  return (
    <div className="personality-badge">
      <span className="personality-icon">◈</span>
      <div>
        <div className="personality-label">Your Coding Style</div>
        <div className="personality-name">{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{description}</div>
        )}
      </div>
    </div>
  );
}