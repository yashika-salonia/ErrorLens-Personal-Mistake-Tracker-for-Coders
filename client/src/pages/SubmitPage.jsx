import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { problemService } from '../services/problemService';
import { submissionService } from '../services/submissionService';
import MistakeTag from '../components/mistakes/MistakeTag';
import toast from 'react-hot-toast';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'c', 'typescript', 'go', 'rust'];

// Backend ke exact enums
const STATUSES = [
  { value: 'accepted',            label: 'Accepted',             color: '#22d3a6' },
  { value: 'wrong-answer',        label: 'Wrong Answer',         color: '#f87171' },
  { value: 'runtime-error',       label: 'Runtime Error',        color: '#a78bfa' },
  { value: 'time-limit-exceeded', label: 'Time Limit Exceeded',  color: '#fbbf24' },
  { value: 'compile-error',       label: 'Compile Error',        color: '#fb923c' },
];

const MISTAKE_TYPES = [
  { value: 'syntax',           label: 'Syntax' },
  { value: 'logic',            label: 'Logic' },
  { value: 'runtime',          label: 'Runtime' },
  { value: 'performance',      label: 'Performance' },
  { value: 'edge-case',        label: 'Edge Case' },
  { value: 'validation',       label: 'Validation' },
  { value: 'authentication',   label: 'Authentication' },
  { value: 'authorization',    label: 'Authorization' },
  { value: 'configuration',    label: 'Configuration' },
  { value: 'dependency',       label: 'Dependency' },
  { value: 'state-management', label: 'State Management' },
  { value: 'api-integration',  label: 'API Integration' },
  { value: 'database-query',   label: 'Database Query' },
  { value: 'security',         label: 'Security' },
];

const CODE_TEMPLATES = {
  javascript: '// Write your solution here\nfunction solution(input) {\n  \n}\n',
  python:     '# Write your solution here\ndef solution(input):\n    pass\n',
  java:       'class Solution {\n    public static void main(String[] args) {\n        // Write here\n    }\n}',
  cpp:        '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write here\n    return 0;\n}',
  c:          '#include <stdio.h>\n\nint main() {\n    // Write here\n    return 0;\n}',
  typescript: 'function solution(input: any): any {\n  \n}\n',
  go:         'package main\n\nfunc main() {\n    // Write here\n}\n',
  rust:       'fn main() {\n    // Write here\n}\n',
};

export default function SubmitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem]           = useState(null);
  const [language, setLanguage]         = useState('javascript');
  const [code, setCode]                 = useState(CODE_TEMPLATES.javascript);
  const [status, setStatus]             = useState('accepted');
  const [notes, setNotes]               = useState('');
  const [selectedMistakes, setSelectedMistakes] = useState([]);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(null);

  useEffect(() => {
    problemService.getById(id)
      .then(r => setProblem(r.data))
      .catch(() => toast.error('Problem not found'));
  }, [id]);

  const toggleMistake = (val) => {
    setSelectedMistakes(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(CODE_TEMPLATES[lang] || '// Write here\n');
  };

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error('Please write your code first');
    setSubmitting(true);
    try {
      const payload = {
        problemId: id,          // backend "problem" field expect karta hai
        code,
        language,
        status,
        mistakeTypes: status !== 'accepted' ? selectedMistakes : [],
      };
      const res = await submissionService.submit(payload);
      setSubmitted(res.data);
      toast.success('Submission saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) return (
    <div className="page-loading"><div className="loading-pulse">Loading…</div></div>
  );

  if (submitted) {
    const st = STATUSES.find(s => s.value === submitted.status);
    return (
      <div className="submit-success">
        <div style={{ fontSize: 64, color: st?.color || '#22d3a6' }}>
          {submitted.status === 'accepted' ? '✓' : '✗'}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Submission Saved!</h2>
        <span className="badge badge-lg" style={{ background: `${st?.color}20`, color: st?.color }}>
          {st?.label || submitted.status}
        </span>
        {submitted.mistakeTypes?.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {submitted.mistakeTypes.map(m => <MistakeTag key={m} type={m} />)}
          </div>
        )}
        <div className="success-actions">
          <button className="btn-primary" onClick={() => navigate(`/problems/${id}`)}>
            View Problem
          </button>
          <button className="btn-ghost" onClick={() => {
            setSubmitted(null); setSelectedMistakes([]); setNotes('');
          }}>Submit Again</button>
          <button className="btn-ghost" onClick={() => navigate('/problems')}>
            All Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="submit-header">
        <button className="btn-ghost back-btn" onClick={() => navigate(`/problems/${id}`)}>
          ← Back
        </button>
        <div>
          <h1 className="page-title">{problem.title}</h1>
          <p className="page-desc">Log your attempt and track your mistakes</p>
        </div>
      </div>

      <div className="submit-layout">
        {/* Left: Problem Info */}
        <div className="problem-panel">
          <div className="panel-section">
            <h3>Problem</h3>
            <p className="problem-desc-text">{problem.description}</p>
          </div>
          {problem.constraints && (
            <div className="panel-section">
              <h3>Constraints</h3>
              <pre className="code-block">{problem.constraints}</pre>
            </div>
          )}
          {problem.examples && (
            <div className="panel-section">
              <h3>Examples</h3>
              <pre className="code-block">{problem.examples}</pre>
            </div>
          )}
        </div>

        {/* Right: Editor + Controls */}
        <div className="editor-panel">
          {/* Language tabs */}
          <div className="editor-toolbar">
            <div className="lang-tabs">
              {LANGUAGES.map(l => (
                <button key={l}
                  className={`lang-tab ${language === l ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="editor-wrapper">
            <Editor
              height="380px"
              language={language}
              value={code}
              onChange={val => setCode(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontLigatures: true,
              }}
            />
          </div>

          {/* Status + Mistakes + Submit */}
          <div className="submit-controls">

            {/* Status picker */}
            <div className="form-group">
              <label className="form-label">How did it go?</label>
              <div className="status-pills">
                {STATUSES.map(s => (
                  <button key={s.value}
                    onClick={() => { setStatus(s.value); if (s.value === 'accepted') setSelectedMistakes([]); }}
                    style={{
                      padding: '7px 16px', borderRadius: 100,
                      border: `1px solid ${status === s.value ? s.color : 'var(--border2)'}`,
                      background: status === s.value ? `${s.color}18` : 'none',
                      color: status === s.value ? s.color : 'var(--text-3)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.12s',
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mistake types — only show when not accepted */}
            {status !== 'accepted' && (
              <div className="form-group">
                <label className="form-label">
                  What went wrong? 
                  <span style={{ color: 'var(--text-3)', marginLeft: 6, fontWeight: 400, textTransform: 'none' }}>
                    (select all that apply)
                  </span>
                </label>
                <div className="mistake-grid">
                  {MISTAKE_TYPES.map(m => (
                    <button key={m.value}
                      className={`mistake-chip ${selectedMistakes.includes(m.value) ? 'selected' : ''}`}
                      onClick={() => toggleMistake(m.value)}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Selected mistakes preview */}
                {selectedMistakes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {selectedMistakes.map(m => (
                      <MistakeTag key={m} type={m} onRemove={toggleMistake} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            <button className="btn-primary btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <span className="spinner"></span> : '💾 Save Submission'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}