import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const RANGE_OPTIONS = ['week', 'month', 'year'];

export default function TrendChart({ data = [], range, onRangeChange }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Submission Trend</h3>
        <div className="range-tabs">
          {RANGE_OPTIONS.map(r => (
            <button
              key={r}
              className={`range-tab ${range === r ? 'active' : ''}`}
              onClick={() => onRangeChange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22d3a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22d3a6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#22d3a6"
            fill="url(#trendGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}