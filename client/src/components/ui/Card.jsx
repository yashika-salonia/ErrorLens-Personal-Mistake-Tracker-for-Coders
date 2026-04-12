export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`profile-card ${hover ? 'card-hover' : ''} ${className}`}
      style={!padding ? { padding: 0, overflow: 'hidden' } : {}}
    >
      {children}
    </div>
  );
}