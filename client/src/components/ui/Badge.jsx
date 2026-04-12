const COLOR_MAP = {
  easy:    'badge-green',
  medium:  'badge-amber',
  hard:    'badge-red',
  green:   'badge-green',
  amber:   'badge-amber',
  red:     'badge-red',
  blue:    'badge-blue',
  purple:  'badge-purple',
  gray:    'badge-gray',
  admin:   'badge-purple',
  user:    'badge-blue',
};

export default function Badge({ label, color, size = 'sm' }) {
  const colorClass = COLOR_MAP[color] || COLOR_MAP[label?.toLowerCase()] || 'badge-gray';
  return (
    <span className={`badge ${colorClass} ${size === 'lg' ? 'badge-lg' : ''}`}>
      {label}
    </span>
  );
}