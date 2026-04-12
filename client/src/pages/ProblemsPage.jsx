import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { problemService } from '../services/problemService';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const DIFFICULTIES = ['', 'easy', 'medium', 'hard'];
const DOMAINS = [
  '', 'frontend', 'backend', 'database', 'devops',
  'system-design', 'dsa', 'mobile', 'security', 'ai-ml'
];
const DIFF_COLORS = { easy: 'green', medium: 'amber', hard: 'red' };
const DOMAIN_ICONS = {
  frontend: '🖥', backend: '⚙', database: '🗄', devops: '🔧',
  'system-design': '🏗', dsa: '◈', mobile: '📱', security: '🔒', 'ai-ml': '🤖'
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({ domain: '', difficulty: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'easy',
    domain: 'dsa', tags: '', expectedTimeComplexity: '',
  });
  const navigate = useNavigate();

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.domain)     params.domain     = filters.domain;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.search)     params.search     = filters.search;

      const res = await problemService.getAll(params);
      console.log('GET /api/problems response:', res.data);

      // Har possible format handle karo
      const data = res.data;
      if (Array.isArray(data))                setProblems(data);
      else if (Array.isArray(data?.problems)) setProblems(data.problems);
      else if (Array.isArray(data?.data))     setProblems(data.data);
      else {
        console.warn('Unknown response format:', data);
        setProblems([]);
      }
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      toast.error('Failed to load problems');
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        title:       form.title.trim(),
        description: form.description.trim(),
        difficulty:  form.difficulty,
        domain:      form.domain,
        tags:        form.tags
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
        ...(form.expectedTimeComplexity.trim() && {
          expectedTimeComplexity: form.expectedTimeComplexity.trim()
        }),
      };

      console.log('POST /api/problems payload:', payload);
      const res = await problemService.create(payload);
      console.log('POST /api/problems response:', res.data);

      toast.success('Problem added!');
      setShowForm(false);
      setForm({
        title: '', description: '', difficulty: 'easy',
        domain: 'dsa', tags: '', expectedTimeComplexity: ''
      });
      await fetchProblems();

    } catch (err) {
      console.error('Create error:', err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to create problem');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this problem?')) return;
    try {
      await problemService.delete(id);
      toast.success('Deleted!');
      await fetchProblems();
    } catch (err) {
      console.error('Delete error:', err.response?.data);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="problems-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Problems</h1>
          <p className="page-desc">{problems.length} problems in your tracker</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Problem'}
        </button>
      </div>

      <div className="filters-bar">
        <input className="filter-search" type="text" placeholder="Search problems…"
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <select className="filter-select" value={filters.difficulty}
          onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>{d || 'All Difficulties'}</option>
          ))}
        </select>
        <select className="filter-select" value={filters.domain}
          onChange={e => setFilters({ ...filters, domain: e.target.value })}>
          {DOMAINS.map(d => (
            <option key={d} value={d}>{d || 'All Domains'}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="create-form-card">
          <h3 className="form-title">Add New Problem</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input"
                  placeholder="e.g. Two Sum, Design URL Shortener"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty *</label>
                <select className="form-input" value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Description *</label>
              <textarea className="form-input form-textarea" rows={3}
                placeholder="Describe the problem…"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Domain *</label>
                <select className="form-input" value={form.domain}
                  onChange={e => setForm({ ...form, domain: e.target.value })}>
                  {DOMAINS.filter(Boolean).map(d => (
                    <option key={d} value={d}>{DOMAIN_ICONS[d]} {d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Complexity</label>
                <input className="form-input" placeholder="O(n log n)"
                  value={form.expectedTimeComplexity}
                  onChange={e => setForm({ ...form, expectedTimeComplexity: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" placeholder="array, dp, graph"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? <span className="spinner"></span> : 'Add Problem'}
              </button>
              <button type="button" className="btn-ghost"
                onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="page-loading"><div className="loading-pulse">Loading…</div></div>
      ) : problems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <p>No problems yet. Add your first one!</p>
        </div>
      ) : (
        <div className="problems-table">
          <div className="table-header">
            <span>#</span>
            <span>Title</span>
            <span>Domain</span>
            <span>Difficulty</span>
            <span>Actions</span>
          </div>
          {problems.map((p, i) => (
            <div key={p._id} className="table-row"
              onClick={() => navigate(`/problems/${p._id}`)}>
              <span className="row-num">{i + 1}</span>
              <div>
                <div className="row-title">{p.title}</div>
                {p.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontSize: 11, padding: '1px 7px', borderRadius: 100,
                        background: 'var(--bg-hover)', color: 'var(--text-3)',
                        border: '1px solid var(--border)',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="row-domain">{DOMAIN_ICONS[p.domain]} {p.domain}</span>
              <Badge label={p.difficulty} color={DIFF_COLORS[p.difficulty]} />
              <div className="row-actions" onClick={e => e.stopPropagation()}>
                <button className="btn-icon"
                  onClick={() => navigate(`/problems/${p._id}/submit`)}>▶ Solve</button>
                <button className="btn-icon danger"
                  onClick={(e) => handleDelete(p._id, e)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}