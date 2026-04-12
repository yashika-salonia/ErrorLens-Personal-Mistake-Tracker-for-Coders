import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DomainPerformance({ data = [] }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Domain Performance</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            dataKey="domain"
            type="category"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={80}
          />
          <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']} />
          <Bar dataKey="accuracy" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}