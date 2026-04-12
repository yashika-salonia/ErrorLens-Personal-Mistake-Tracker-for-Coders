import { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    analyticsService.getAdminOverview()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="page-loading"><div className="loading-pulse">Loading…</div></div>;
  if (!data)   return <div className="page-loading"><p>No data available</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Overview</h1>
          <p className="page-desc">Platform-wide statistics</p>
        </div>
        <span className="badge badge-purple badge-lg">Admin</span>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Users',       value: data.totalUsers       ?? 0, color: 'teal'   },
          { label: 'Total Problems',    value: data.totalProblems    ?? 0, color: 'blue'   },
          { label: 'Total Submissions', value: data.totalSubmissions ?? 0, color: 'purple' },
          { label: 'Acceptance Rate',   value: `${data.acceptanceRate ?? 0}%`, color: 'amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`stat-card stat-${color}`}>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {data.problemsByDifficulty && (
        <div className="charts-grid" style={{ marginTop: 24 }}>
          <div className="chart-card">
            <h3 className="chart-title">Problems by Difficulty</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.problemsByDifficulty} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="difficulty" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}
                  fill="#6366f1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {data.submissionsByStatus && (
            <div className="chart-card">
              <h3 className="chart-title">Submissions by Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.submissionsByStatus} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#94a3b8' }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22d3a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}