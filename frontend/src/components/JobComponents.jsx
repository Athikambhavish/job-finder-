import { useState } from 'react'

// ── Job Card ──────────────────────────────────────────────────
export function JobCard({ job, selected, onSelect, isSaved, onToggleSave, hasApplied, matchScore }) {
  return (
    <div className={`job-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(job)}>
      <div className="card-inner">
        <div className="company-logo" style={{ background: job.companyColor || '#0F4C8A' }}>
          {job.companyLogo || job.company?.[0] || 'J'}
        </div>
        <div className="card-body">
          <div className="card-header">
            <div>
              <p className="card-title">{job.title}</p>
              <p className="card-company">{job.company} · {job.location}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {matchScore !== undefined && (
                <span className="badge" style={{
                  background: matchScore >= 80 ? '#DCFCE7' : matchScore >= 60 ? '#FEF9C3' : '#FEE2E2',
                  color:      matchScore >= 80 ? '#16a34a' : matchScore >= 60 ? '#b45309' : '#dc2626'
                }}>
                  {matchScore}% match
                </span>
              )}
              <button className="save-btn" onClick={e => { e.stopPropagation(); onToggleSave?.(job.id) }}
                style={{ color: isSaved ? '#f59e0b' : '#ccc' }}>
                {isSaved ? '★' : '☆'}
              </button>
            </div>
          </div>
          <div className="card-badges">
            <span className="badge badge-type">{job.type?.replace('_', ' ')}</span>
            {job.remote && <span className="badge badge-remote">Remote</span>}
            {job.tags?.slice(0, 3).map(t => <span key={t} className="badge badge-tag">{t}</span>)}
          </div>
          <div className="card-footer">
            <span className="card-salary">{job.salaryLabel}</span>
            <span className="card-posted">{formatDate(job.postedAt)}</span>
          </div>
          {job.matchReason && <p className="match-reason">✦ {job.matchReason}</p>}
          {hasApplied && <p className="card-applied">✓ Applied</p>}
        </div>
      </div>
    </div>
  )
}

// ── Detail Panel ──────────────────────────────────────────────
export function DetailPanel({ job, isSaved, onToggleSave, hasApplied, onApply }) {
  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-logo" style={{ background: job.companyColor || '#0F4C8A' }}>
          {job.companyLogo || job.company?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="detail-title">{job.title}</h2>
          <p className="detail-company">{job.company} · {job.location}</p>
        </div>
        <button className="save-btn detail-close" style={{ color: isSaved ? '#f59e0b' : '#ccc', fontSize: 22 }}
          onClick={() => onToggleSave?.(job.id)}>
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {[job.type?.replace('_', ' '), job.remote && '🌐 Remote', formatDate(job.postedAt)].filter(Boolean).map(b => (
          <span key={b} className="badge badge-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{b}</span>
        ))}
      </div>

      <div className="detail-salary-box">
        <p className="detail-salary-label">Compensation</p>
        <p className="detail-salary">{job.salaryLabel}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p className="section-label">Skills</p>
        <div className="detail-tags">
          {job.tags?.map(t => <span key={t} className="detail-tag">{t}</span>)}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p className="section-label">About the Role</p>
        <p className="detail-desc">{job.description}</p>
      </div>

      {job.url && job.url !== '#' && (
        <a href={job.url} target="_blank" rel="noreferrer"
          style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#0F4C8A', marginBottom: 10 }}>
          View original posting ↗
        </a>
      )}

      {hasApplied ? (
        <div className="applied-box">
          <span>✅</span>
          <div>
            <p style={{ fontWeight: 700, color: '#16a34a', fontSize: 13 }}>Application Submitted</p>
            <p style={{ fontSize: 12, color: '#555' }}>You'll hear back soon.</p>
          </div>
        </div>
      ) : (
        <button className="apply-btn" onClick={() => onApply(job)}>Apply Now →</button>
      )}
    </div>
  )
}

// ── Apply Modal ───────────────────────────────────────────────
export function ApplyModal({ job, onClose, onSubmit }) {
  const [form, setForm] = useState({ applicantName: '', applicantEmail: '', coverNote: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.applicantName.trim() && form.applicantEmail.trim()

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      await onSubmit({ ...form, jobId: job.id })
      onClose()
    } catch (e) {
      setError(e?.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 46, height: 46, borderRadius: 12, background: job.companyColor || '#0F4C8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>
            {job.companyLogo}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{job.title}</p>
            <p style={{ color: '#666', fontSize: 13 }}>{job.company}</p>
          </div>
        </div>

        {[['Full Name', 'applicantName', 'text', 'Your full name'],
          ['Email Address', 'applicantEmail', 'email', 'you@example.com']].map(([label, field, type, ph]) => (
          <div className="form-group" key={field}>
            <label className="form-label">{label}</label>
            <input type={type} className="form-input" value={form[field]} placeholder={ph}
              onChange={e => set(field, e.target.value)} />
          </div>
        ))}

        <div className="form-group">
          <label className="form-label">Cover Note (optional)</label>
          <textarea className="form-textarea" value={form.coverNote} placeholder="Why are you excited about this role?"
            onChange={e => set('coverNote', e.target.value)} />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 8 }}>{error}</p>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={!valid || loading}>
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso), now = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 7) return `${diff}d ago`
  if (diff < 14) return '1w ago'
  return `${Math.floor(diff / 7)}w ago`
}
