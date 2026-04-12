import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  accepted:      '#22d3a6',
  wrong_answer:  '#f87171',
  time_limit:    '#fbbf24',
  runtime_error: '#a78bfa',
  compile_error: '#fb923c',
  partial:       '#60a5fa',
};

export default function StatusPieChart({ data }) {
  // Backend se koi bhi format aaye — safely handle karo
  const chartData = Array.isArray(data)
    ? data
    : data && typeof data === 'object'
      ? Object.entries(data).map(([status, count]) => ({ status, count }))
      : [];

  if (chartData.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Status Breakdown</h3>
        <div className="empty-state" style={{ minHeight: 180 }}>
          <div className="empty-icon">◉</div>
          <p>No submissions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={85}
            paddingAngle={3}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[entry.status] || '#64748b'} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [v, n]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pie-legend">
        {chartData.map((entry, i) => (
          <span key={i} className="legend-item">
            <span className="legend-dot" style={{ background: STATUS_COLORS[entry.status] || '#64748b' }}></span>
            {entry.status} ({entry.count})
          </span>
        ))}
      </div>
    </div>
  );
}