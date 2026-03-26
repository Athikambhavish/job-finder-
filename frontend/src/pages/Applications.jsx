import { useApplications } from '../hooks/useJobFinder'

export default function Applications() {
  const { applications } = useApplications()

  return (
    <>
      <h1 className="page-title">My Applications</h1>
      <p className="page-sub">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>

      {applications.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p style={{ fontSize: 13 }}>Apply to jobs on the Browse page to track them here</p>
        </div>
      ) : (
        <div>
          {applications.map(app => (
            <div key={app.id} className="app-card">
              <div style={{ width: 44, height: 44, borderRadius: 11, background: '#0F4C8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                {app.company?.[0] || 'J'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{app.jobTitle}</p>
                    <p style={{ fontSize: 12, color: '#666' }}>{app.company}</p>
                  </div>
                  <span className={`status-badge status-${app.status}`}>{app.status}</span>
                </div>
                {app.coverNote && (
                  <p style={{ fontSize: 12, color: '#888', marginTop: 6, fontStyle: 'italic' }}>"{app.coverNote}"</p>
                )}
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
                  Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
