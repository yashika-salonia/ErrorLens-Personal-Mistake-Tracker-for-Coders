import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { submissionService } from '../services/submissionService';
import Badge from '../components/ui/Badge';
import MistakeTag from '../components/mistakes/MistakeTag';
import toast from 'react-hot-toast';

const DIFF_COLORS = { easy: 'green', medium: 'amber', hard: 'red' };

const STATUS_META = {
  'accepted':            { color: '#22d3a6', icon: '✓', label: 'Accepted' },
  'wrong-answer':        { color: '#f87171', icon: '✗', label: 'Wrong Answer' },
  'runtime-error':       { color: '#a78bfa', icon: '!', label: 'Runtime Error' },
  'time-limit-exceeded': { color: '#fbbf24', icon: '⏱', label: 'Time Limit' },
  'compile-error':       { color: '#fb923c', icon: '⚠', label: 'Compile Error' },
};

const DOMAIN_ICONS = {
  frontend: '🖥', backend: '⚙', database: '🗄', devops: '🔧',
  'system-design': '🏗', dsa: '◈', mobile: '📱', security: '🔒', 'ai-ml': '🤖'
};

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem]         = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('description');
  const [deleting, setDeleting]       = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [p, s] = await Promise.allSettled([
          problemService.getById(id),
          submissionService.getByProblem(id),
        ]);
        if (p.status === 'fulfilled') setProblem(p.value.data);
        if (s.status === 'fulfilled') setSubmissions(
          Array.isArray(s.value.data) ? s.value.data : []
        );
      } catch {
        toast.error('Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this problem and all its submissions?')) return;
    setDeleting(true);
    try {
      await problemService.delete(id);
      toast.success('Problem deleted');
      navigate('/problems');
    } catch {
      toast.error('Delete failed');
      setDeleting(false);
    }
  };

  // Stats from submissions
  const totalAttempts  = submissions.length;
  const accepted       = submissions.filter(s => s.status === 'accepted').length;
  const acceptRate     = totalAttempts > 0 ? Math.round((accepted / totalAttempts) * 100) : 0;
  const allMistakes    = submissions.flatMap(s => s.mistakeTypes || []);
  const mistakeFreq    = allMistakes.reduce((acc, m) => { acc[m] = (acc[m] || 0) + 1; return acc; }, {});
  const topMistakes    = Object.entries(mistakeFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (loading) return <div className="page-loading"><div className="loading-pulse">Loading…</div></div>;
  if (!problem) return <div className="page-loading"><p>Problem not found</p></div>;

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-ghost back-btn" onClick={() => navigate('/problems')}>← Back</button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="detail-title-row">
              <h1 className="page-title">{problem.title}</h1>
              <Badge label={problem.difficulty} color={DIFF_COLORS[problem.difficulty]} size="lg" />
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                {DOMAIN_ICONS[problem.domain]} {problem.domain}
              </span>
            </div>

            {/* Tags */}
            {problem.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {problem.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 12, padding: '2px 10px', borderRadius: 100,
                    background: 'var(--bg-card2)', color: 'var(--text-2)',
                    border: '1px solid var(--border)',
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Expected time complexity */}
            {problem.expectedTimeComplexity && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-3)' }}>
                Expected: <code style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {problem.expectedTimeComplexity}
                </code>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={() => navigate(`/problems/${id}/submit`)}>
              ▶ Add Submission
            </button>
            <button className="btn-ghost" onClick={handleDelete} disabled={deleting}
              style={{ color: 'var(--red)', borderColor: 'rgba(248,113,113,0.3)' }}>
              {deleting ? <span className="spinner"></span> : '✕ Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      {totalAttempts > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Attempts',     value: totalAttempts,      color: 'var(--text-1)' },
            { label: 'Accepted',     value: accepted,            color: '#22d3a6' },
            { label: 'Accept Rate',  value: `${acceptRate}%`,    color: acceptRate >= 50 ? '#22d3a6' : '#f87171' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 20px', textAlign: 'center', minWidth: 100,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{label}</div>
            </div>
          ))}

          {/* Top mistakes */}
          {topMistakes.length > 0 && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 20px', flex: 1,
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                Top Mistakes
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {topMistakes.map(([type, count]) => (
                  <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MistakeTag type={type} />
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="detail-tabs">
        {['description', 'submissions'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'submissions' && totalAttempts > 0 && (
              <span className="tab-count" style={{ marginLeft: 6 }}>{totalAttempts}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="detail-content">
        {tab === 'description' && (
          <div className="problem-desc">
            <div className="desc-section">
              <h3>Description</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{problem.description}</p>
            </div>
          </div>
        )}

        {tab === 'submissions' && (
          <div>
            {submissions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◉</div>
                <p>No submissions yet</p>
                <button className="btn-primary"
                  onClick={() => navigate(`/problems/${id}/submit`)}>
                  Add First Submission
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {submissions.map((s, i) => {
                  const meta = STATUS_META[s.status] || { color: '#64748b', icon: '?', label: s.status };
                  return (
                    <div key={s._id} style={{
                      background: 'var(--bg-base)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '16px 20px',
                      borderLeft: `3px solid ${meta.color}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ color: meta.color, fontWeight: 700, fontSize: 16 }}>{meta.icon}</span>
                          <span style={{ color: meta.color, fontWeight: 600, fontSize: 14 }}>{meta.label}</span>
                          <span style={{
                            background: 'var(--bg-hover)', border: '1px solid var(--border)',
                            borderRadius: 4, padding: '1px 8px', fontSize: 12,
                            color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace',
                          }}>{s.language}</span>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {s.mistakeTypes?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                          {s.mistakeTypes.map(m => <MistakeTag key={m} type={m} />)}
                        </div>
                      )}

                      {s.code && (
                        <details style={{ marginTop: 8 }}>
                          <summary style={{ fontSize: 12, color: 'var(--text-3)', cursor: 'pointer', userSelect: 'none' }}>
                            View Code
                          </summary>
                          <pre className="code-block" style={{ marginTop: 8, fontSize: 12 }}>
                            {s.code}
                          </pre>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}