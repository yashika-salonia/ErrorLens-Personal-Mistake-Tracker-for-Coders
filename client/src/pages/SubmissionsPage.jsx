import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submissionService } from '../services/submissionService';
import MistakeTag from '../components/mistakes/MistakeTag';
import toast from 'react-hot-toast';

const STATUS_META = {
  'accepted':            { color: '#22d3a6', bg: 'rgba(34,211,166,0.12)',  icon: '✓', label: 'Accepted' },
  'wrong-answer':        { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: '✗', label: 'Wrong Answer' },
  'runtime-error':       { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: '!', label: 'Runtime Error' },
  'time-limit-exceeded': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  icon: '⏱', label: 'Time Limit' },
  'compile-error':       { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  icon: '⚠', label: 'Compile Error' },
};

const MISTAKE_TYPES = [
  'syntax', 'logic', 'runtime', 'performance', 'edge-case',
  'validation', 'authentication', 'authorization', 'configuration',
  'dependency', 'state-management', 'api-integration', 'database-query', 'security'
];

export default function SubmissionsPage() {
  const [submissions, setSubmissions]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const [editingId, setEditingId]       = useState(null);
  const [editMistakes, setEditMistakes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await submissionService.getMine();
        console.log('Submissions response:', res.data); // debug

        // Backend returns { success, data: [...], meta: {} }
        const data = res.data?.data ?? res.data;
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Submissions error:', err.response?.data || err.message);
        toast.error('Failed to load submissions');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter);

  const handleUpdateMistakes = async (id) => {
    try {
      await submissionService.updateMistakes(id, { mistakeTypes: editMistakes });
      setSubmissions(prev =>
        prev.map(s => s._id === id ? { ...s, mistakeTypes: editMistakes } : s)
      );
      toast.success('Mistakes updated!');
      setEditingId(null);
    } catch {
      toast.error('Update failed');
    }
  };

  const statuses = ['all', ...Object.keys(STATUS_META)];

  return (
    <div className="submissions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Submissions</h1>
          <p className="page-desc">{submissions.length} total submissions</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-filter-tabs">
        {statuses.map(s => (
          <button key={s}
            className={`status-filter-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}>
            {s !== 'all' && STATUS_META[s] && (
              <span style={{ color: STATUS_META[s].color, marginRight: 4 }}>
                {STATUS_META[s].icon}
              </span>
            )}
            {s === 'all' ? 'All' : STATUS_META[s]?.label || s}
            <span className="tab-count">
              {s === 'all'
                ? submissions.length
                : submissions.filter(x => x.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="page-loading"><div className="loading-pulse">Loading…</div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◉</div>
          <p>{filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}</p>
          {filter === 'all' && (
            <button className="btn-primary" onClick={() => navigate('/problems')}>
              Start Solving
            </button>
          )}
        </div>
      ) : (
        <div className="submissions-cards">
          {filtered.map(s => {
            const meta = STATUS_META[s.status] || {
              color: '#64748b', bg: 'rgba(100,116,139,0.1)', icon: '?', label: s.status
            };
            return (
              <div key={s._id} className="submission-card"
                style={{ borderLeft: `3px solid ${meta.color}` }}>

                <div className="sub-card-header">
                  <div className="sub-problem-name"
                    onClick={() => {
                      const pid = s.problem?._id || s.problem;
                      if (pid) navigate(`/problems/${pid}`);
                    }}>
                    {s.problem?.title || 'Problem'}
                  </div>
                  <div className="sub-status-badge"
                    style={{ color: meta.color, background: meta.bg }}>
                    {meta.icon} {meta.label}
                  </div>
                </div>

                <div className="sub-card-meta">
                  <span className="sub-lang-badge">{s.language}</span>
                  {s.problem?.domain && (
                    <span style={{
                      fontSize: 12, color: 'var(--text-3)',
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border)',
                      borderRadius: 4, padding: '1px 8px',
                    }}>{s.problem.domain}</span>
                  )}
                  {s.problem?.difficulty && (
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 100, fontWeight: 600,
                      background: s.problem.difficulty === 'easy'
                        ? 'rgba(74,222,128,0.12)'
                        : s.problem.difficulty === 'medium'
                          ? 'rgba(251,191,36,0.12)'
                          : 'rgba(248,113,113,0.12)',
                      color: s.problem.difficulty === 'easy' ? '#4ade80'
                        : s.problem.difficulty === 'medium' ? '#fbbf24' : '#f87171',
                    }}>{s.problem.difficulty}</span>
                  )}
                  <span className="sub-date" style={{ marginLeft: 'auto' }}>
                    {new Date(s.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>

                {s.mistakeTypes?.length > 0 && (
                  <div className="sub-mistakes-row">
                    {s.mistakeTypes.map(m => <MistakeTag key={m} type={m} />)}
                  </div>
                )}

                {/* Inline mistake editor */}
                {editingId === s._id ? (
                  <div className="mistake-editor">
                    <div className="mistake-grid">
                      {MISTAKE_TYPES.map(m => (
                        <button key={m}
                          className={`mistake-chip ${editMistakes.includes(m) ? 'selected' : ''}`}
                          onClick={() => setEditMistakes(prev =>
                            prev.includes(m)
                              ? prev.filter(x => x !== m)
                              : [...prev, m]
                          )}>
                          {m.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                    <div className="editor-actions">
                      <button className="btn-primary"
                        onClick={() => handleUpdateMistakes(s._id)}>Save</button>
                      <button className="btn-ghost"
                        onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-ghost btn-sm" style={{ marginTop: 8 }}
                    onClick={() => {
                      setEditingId(s._id);
                      setEditMistakes(s.mistakeTypes || []);
                    }}>
                    ✎ Edit Mistakes
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}