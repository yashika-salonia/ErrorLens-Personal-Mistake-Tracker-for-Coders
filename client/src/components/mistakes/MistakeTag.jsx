const MISTAKE_COLORS = {
  'syntax':           { bg: 'rgba(248,113,113,0.12)',  color: '#f87171' },
  'logic':            { bg: 'rgba(251,191,36,0.12)',   color: '#fbbf24' },
  'runtime':          { bg: 'rgba(167,139,250,0.12)',  color: '#a78bfa' },
  'performance':      { bg: 'rgba(34,211,166,0.12)',   color: '#22d3a6' },
  'edge-case':        { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa' },
  'validation':       { bg: 'rgba(251,146,60,0.12)',   color: '#fb923c' },
  'authentication':   { bg: 'rgba(244,114,182,0.12)',  color: '#f472b6' },
  'authorization':    { bg: 'rgba(244,114,182,0.12)',  color: '#f472b6' },
  'configuration':    { bg: 'rgba(100,116,139,0.15)',  color: '#94a3b8' },
  'dependency':       { bg: 'rgba(100,116,139,0.15)',  color: '#94a3b8' },
  'state-management': { bg: 'rgba(99,102,241,0.12)',   color: '#6366f1' },
  'api-integration':  { bg: 'rgba(99,102,241,0.12)',   color: '#6366f1' },
  'database-query':   { bg: 'rgba(34,211,166,0.12)',   color: '#22d3a6' },
  'security':         { bg: 'rgba(248,113,113,0.12)',  color: '#f87171' },
};

export default function MistakeTag({ type, onRemove }) {
  const style = MISTAKE_COLORS[type] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: style.bg, color: style.color,
      border: `1px solid ${style.color}40`,
      borderRadius: 100, padding: '3px 10px',
      fontSize: 12, fontWeight: 600,
    }}>
      {type.replace(/-/g, ' ')}
      {onRemove && (
        <button onClick={() => onRemove(type)} style={{
          background: 'none', border: 'none', color: 'inherit',
          cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1, opacity: 0.7,
        }}>✕</button>
      )}
    </span>
  );
}