import { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

const STATUS_COLORS = {
  'accepted':            '#22d3a6',
  'wrong-answer':        '#f87171',
  'runtime-error':       '#a78bfa',
  'time-limit-exceeded': '#fbbf24',
  'compile-error':       '#fb923c',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary]         = useState(null);
  const [statusData, setStatusData]   = useState([]);
  const [mistakeData, setMistakeData] = useState([]);
  const [domainData, setDomainData]   = useState([]);
  const [trend, setTrend]             = useState([]);
  const [personality, setPersonality] = useState(null);
  const [trendRange, setTrendRange]   = useState('week');
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, st, mt, dp, tr, pp] = await Promise.allSettled([
          analyticsService.getSummary(),
          analyticsService.getStatusBreakdown(),
          analyticsService.getMistakeTypes(),
          analyticsService.getDomainPerformance(),
          analyticsService.getTrend(trendRange),
          analyticsService.getMistakePersonality(),
        ]);

        // { success, data: { totalSubmissions, accepted, uniqueProblemsAttempted, acceptanceRate } }
        if (s.status === 'fulfilled') setSummary(s.value.data?.data ?? s.value.data);

        // { success, data: [ { status, count } ] }
        if (st.status === 'fulfilled') setStatusData(st.value.data?.data ?? []);

        // { success, data: [ { mistakeType, count } ] }  ← field is mistakeType not type!
        if (mt.status === 'fulfilled') {
          const raw = mt.value.data?.data ?? [];
          // Normalize to { type, count } for chart
          setMistakeData(raw.map(d => ({ type: d.mistakeType || d.type, count: d.count })));
        }

        // { success, data: [ { domain, totalAttempts, accepted, accuracy } ] }
        if (dp.status === 'fulfilled') setDomainData(dp.value.data?.data ?? []);

        // { success, range, data: [ { date, submissions, accepted } ] }  ← field is submissions not count!
        if (tr.status === 'fulfilled') {
          const raw = tr.value.data?.data ?? [];
          // Normalize to { date, count } for chart
          setTrend(raw.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            count: d.submissions ?? d.count ?? 0,
          })));
        }

        // { success, data: { personality, topMistakes, tip } }
        if (pp.status === 'fulfilled') setPersonality(pp.value.data?.data ?? pp.value.data);

      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trendRange]);

  const displayName = user?.name || user?.username || 'Coder';

  if (loading) return (
    <div className="page-loading"><div className="loading-pulse">Loading analytics…</div></div>
  );

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-desc">Welcome back, <strong>{displayName}</strong></p>
        </div>
        {personality && personality.personality !== 'Not enough data yet' && (
          <div className="personality-badge">
            <span className="personality-icon">◈</span>
            <div>
              <div className="personality-label">Your Style</div>
              <div className="personality-name">{personality.personality}</div>
              {personality.tip && (
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, maxWidth: 200 }}>
                  {personality.tip}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-teal">
          <div className="stat-value">{summary?.uniqueProblemsAttempted ?? 0}</div>
          <div className="stat-label">Problems Attempted</div>
        </div>
        <div className="stat-card stat-blue">
          <div className="stat-value">{summary?.acceptanceRate ?? 0}%</div>
          <div className="stat-label">Acceptance Rate</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-value">{summary?.totalSubmissions ?? 0}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-value">{summary?.accepted ?? 0}</div>
          <div className="stat-label">Accepted</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">

        {/* Status Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Status Breakdown</h3>
          {statusData.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 180 }}>
              <div className="empty-icon">◉</div>
              <p>Submit solutions to see breakdown</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} dataKey="count" nameKey="status"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {statusData.map((entry, i) => (
                  <span key={i} className="legend-item">
                    <span className="legend-dot"
                      style={{ background: STATUS_COLORS[entry.status] || '#64748b' }}></span>
                    {entry.status} ({entry.count})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Submission Trend</h3>
            <div className="range-tabs">
              {['week', 'month', 'year'].map(r => (
                <button key={r} className={`range-tab ${trendRange === r ? 'active' : ''}`}
                  onClick={() => setTrendRange(r)}>{r}</button>
              ))}
            </div>
          </div>
          {trend.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 180 }}>
              <div className="empty-icon">📈</div>
              <p>No submissions in this range</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22d3a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#22d3a6"
                  fill="url(#tg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Domain Performance */}
        <div className="chart-card">
          <h3 className="chart-title">Domain Performance</h3>
          {domainData.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 180 }}>
              <div className="empty-icon">◈</div>
              <p>No domain data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={domainData} layout="vertical"
                margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis dataKey="domain" type="category"
                  tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} />
                <Tooltip formatter={v => [`${v}%`, 'Accuracy']} />
                <Bar dataKey="accuracy" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Mistake Frequency */}
        <div className="chart-card">
          <h3 className="chart-title">Mistake Frequency</h3>
          {mistakeData.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 180 }}>
              <div className="empty-icon">🎯</div>
              <p>No mistakes logged yet — great!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mistakeData}
                margin={{ top: 5, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#94a3b8' }}
                  angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f472b6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}