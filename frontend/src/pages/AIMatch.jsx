import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApplications, useSaved } from '../hooks/useJobFinder'
import { JobCard, DetailPanel, ApplyModal } from '../components/JobComponents'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: 'You are an expert career advisor. Always return only valid JSON, no markdown, no explanation.',
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  const raw = data.content?.map(b => b.text || '').join('') || ''
  try { return JSON.parse(raw.replace(/```json|```/g, '').trim()) } catch { return null }
}

export default function AIMatch() {
  const { user } = useAuth()
  const { savedIds, toggle: toggleSave, isSaved } = useSaved()
  const { appliedIds, apply, hasApplied } = useApplications()

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [applyJob, setApplyJob] = useState(null)
  const [toast, setToast] = useState(false)

  const runMatch = async () => {
    if (!user) { setError('Please sign in first.'); return }
    setLoading(true); setError(''); setResult(null)

    const prompt = `A job seeker has this profile:
- Name: ${user.name}
- Location: ${user.location || 'Not specified'}
- Experience: ${user.experienceLevel || 'Not specified'}
- Skills: ${user.skills || 'Not specified'}
- Desired Salary: ${user.desiredSalary || 'Not specified'}
- Remote Preferred: ${user.preferredRemote ? 'Yes' : 'No'}
- Bio: ${user.bio || 'Not provided'}

Return a JSON object with:
1. "matches": array of exactly 6 job objects each with:
   - id (1-6), title, company, location, type (FULL_TIME/CONTRACT/PART_TIME), salaryLabel, tags (array of 3), companyLogo (1 letter), companyColor (hex brand color), remote (bool), description (2 sentences), matchScore (0-100), matchReason (1 sentence), postedAt (ISO date string, recent)
2. "summary": 1 sentence about their job market outlook
3. "insights": array of 3 short career insight strings
4. "missingSkills": array of up to 4 skill strings they should learn`

    const data = await callClaude(prompt)
    if (data?.matches) setResult(data)
    else setError('Could not generate matches. Please try again.')
    setLoading(false)
  }

  const handleApply = async (data) => {
    await apply(data)
    setToast(true); setTimeout(() => setToast(false), 3000)
  }

  const hasProfile = user?.skills || user?.experienceLevel || user?.bio

  return (
    <>
      {toast && <div className="toast">✓ Application submitted!</div>}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApply} />}

      {/* Header */}
      <div style={{ background: 'linear-gradient(130deg,#0F4C8A,#1a6bbf)', borderRadius: 18, padding: '28px 32px', marginBottom: 24 }}>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>Powered by Claude AI</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 28, marginBottom: 8 }}>
          Your <em>perfect</em> job matches
        </h1>
        {user && (
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 13, marginBottom: 16 }}>
            Based on your profile: {user.skills?.split(',').slice(0,3).join(', ') || 'no skills set yet'} ·{' '}
            {user.experienceLevel || 'experience not set'}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={runMatch} disabled={loading || !user}
            style={{ padding: '12px 24px', background: '#fff', color: '#0F4C8A', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: user ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            {loading ? '✦ Finding matches…' : '✦ Find My Matches'}
          </button>
          {!hasProfile && user && (
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 12 }}>
              💡 <a href='/profile' style={{ color: '#fff', textDecoration: 'underline' }}>Complete your profile</a> for better matches
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
          <div className="spinner" />
          <p style={{ color: '#555', fontWeight: 500 }}>Claude AI is analyzing your profile…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>{error}</div>
      )}

      {/* Not logged in */}
      {!user && (
        <div className="empty">
          <div className="empty-icon">🔒</div>
          <h3>Sign in to get AI matches</h3>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            <a href='/login' style={{ color: '#0F4C8A', fontWeight: 600 }}>Sign in</a> or <a href='/register' style={{ color: '#0F4C8A', fontWeight: 600 }}>create an account</a>
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Summary banner */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #ECEAE4', padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0F4C8A', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>AI Summary</p>
              <p style={{ fontSize: 14, color: '#333' }}>{result.summary}</p>
            </div>
            {result.missingSkills?.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6 }}>Skills to learn:</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {result.missingSkills.map(s => (
                    <span key={s} style={{ fontSize: 11, background: '#FFFBEB', color: '#b45309', padding: '3px 9px', borderRadius: 12, fontWeight: 600, border: '1px solid #fde68a' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          {result.insights?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
              {result.insights.map((ins, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1.5px solid #ECEAE4' }}>
                  <p style={{ fontSize: 11, color: '#0F4C8A', fontWeight: 800, marginBottom: 4 }}>Insight {i + 1}</p>
                  <p style={{ fontSize: 12, color: '#444', lineHeight: 1.5 }}>{ins}</p>
                </div>
              ))}
            </div>
          )}

          {/* Job matches */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: selected ? '0 0 400px' : 1 }}>
              {result.matches.map(j => (
                <JobCard key={j.id} job={j} selected={selected?.id === j.id}
                  onSelect={j => setSelected(prev => prev?.id === j.id ? null : j)}
                  isSaved={isSaved(j.id)} onToggleSave={toggleSave}
                  hasApplied={hasApplied(j.id)} matchScore={j.matchScore} />
              ))}
            </div>
            {selected && (
              <div style={{ flex: 1 }}>
                <DetailPanel job={selected}
                  isSaved={isSaved(selected.id)} onToggleSave={toggleSave}
                  hasApplied={hasApplied(selected.id)} onApply={setApplyJob} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
