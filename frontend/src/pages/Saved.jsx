import { useState, useEffect } from 'react'
import { savedApi } from '../services/api'
import { useSaved, useApplications } from '../hooks/useJobFinder'
import { JobCard, DetailPanel, ApplyModal } from '../components/JobComponents'

export default function Saved() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { savedIds, toggle: toggleSave, isSaved } = useSaved()
  const { appliedIds, apply, hasApplied } = useApplications()
  const [selected, setSelected] = useState(null)
  const [applyJob, setApplyJob] = useState(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    savedApi.getSaved()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [])

  // Remove from list when unsaved
  const handleToggle = async (jobId) => {
    await toggleSave(jobId)
    setJobs(prev => prev.filter(j => j.id !== jobId))
    if (selected?.id === jobId) setSelected(null)
  }

  const handleApply = async (data) => {
    await apply(data)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <>
      {toast && <div className="toast">✓ Application submitted successfully!</div>}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApply} />}

      <h1 className="page-title">Saved Jobs</h1>
      <p className="page-sub">{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</p>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">★</div>
          <h3>No saved jobs yet</h3>
          <p style={{ fontSize: 13 }}>Star a job on the Browse page to save it here</p>
        </div>
      ) : (
        <div className="split">
          <div className={`list-col ${!selected ? 'full' : ''}`}>
            {jobs.map(j => (
              <JobCard key={j.id} job={j} selected={selected?.id === j.id}
                onSelect={j => setSelected(prev => prev?.id === j.id ? null : j)}
                isSaved={true} onToggleSave={handleToggle}
                hasApplied={hasApplied(j.id)} />
            ))}
          </div>
          {selected && (
            <div className="detail-col">
              <DetailPanel job={selected}
                isSaved={true} onToggleSave={handleToggle}
                hasApplied={hasApplied(selected.id)} onApply={setApplyJob} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
