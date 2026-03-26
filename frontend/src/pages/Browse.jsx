import { useState, useCallback } from 'react'
import { useJobs, useSaved, useApplications } from '../hooks/useJobFinder'
import { JobCard, DetailPanel, ApplyModal } from '../components/JobComponents'

const QUICK = ['React Engineer', 'Data Scientist', 'Product Designer', 'ML Engineer', 'DevOps']
const TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']

export default function Browse() {
  const { jobs, loading, error, fetchJobs } = useJobs()
  const { savedIds, toggle: toggleSave, isSaved } = useSaved()
  const { appliedIds, apply, hasApplied } = useApplications()

  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [remote, setRemote] = useState(false)
  const [selected, setSelected] = useState(null)
  const [applyJob, setApplyJob] = useState(null)
  const [toast, setToast] = useState(false)
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (kw = keyword) => {
    setSearching(true)
    await fetchJobs({ keyword: kw || undefined, location: location || undefined, type: type || undefined, remote: remote || undefined })
    setSearching(false)
  }, [keyword, location, type, remote, fetchJobs])

  const handleApply = async (data) => {
    await apply(data)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <>
      {toast && <div className="toast">✓ Application submitted successfully!</div>}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApply} />}

      {/* Hero */}
      <div className="hero">
        <p className="hero-label">Live database · {jobs.length} jobs</p>
        <h1>Find your <em>perfect</em> next role</h1>
        <div className="hero-search">
          <input className="hero-input" value={keyword} onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()} placeholder="Job title, company, or skill…" />
          <input className="hero-input" value={location} onChange={e => setLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()} placeholder="Location…" style={{ maxWidth: 180 }} />
          <button className="hero-btn" onClick={() => search()} disabled={searching}>
            {searching ? 'Searching…' : '🔍 Search'}
          </button>
        </div>
        <div className="quick-searches">
          {QUICK.map(q => (
            <button key={q} className="quick-chip" onClick={() => { setKeyword(q); search(q) }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <label className={`filter-check ${remote ? 'on' : ''}`}>
          <input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} style={{ accentColor: '#0F4C8A' }} />
          Remote Only
        </label>
        <button className="hero-btn" style={{ padding: '7px 14px', background: '#fff', border: '1.5px solid #ECEAE4', color: '#555', fontSize: 12 }}
          onClick={() => { setKeyword(''); setLocation(''); setType(''); setRemote(false); fetchJobs() }}>
          Clear
        </button>
        <span className="results-count">{jobs.length} jobs found</span>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
          ⚠ {error}
        </div>
      )}

      {/* Job list + detail */}
      <div className="split">
        <div className={`list-col ${!selected ? 'full' : ''}`}>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : jobs.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p style={{ fontSize: 13 }}>Try different keywords or clear your filters</p>
            </div>
          ) : jobs.map(j => (
            <JobCard key={j.id} job={j} selected={selected?.id === j.id}
              onSelect={j => setSelected(prev => prev?.id === j.id ? null : j)}
              isSaved={isSaved(j.id)} onToggleSave={toggleSave}
              hasApplied={hasApplied(j.id)} />
          ))}
        </div>

        {selected && (
          <div className="detail-col">
            <DetailPanel job={selected}
              isSaved={isSaved(selected.id)} onToggleSave={toggleSave}
              hasApplied={hasApplied(selected.id)} onApply={setApplyJob} />
          </div>
        )}
      </div>
    </>
  )
}
