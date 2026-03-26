import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import { useNavigate } from 'react-router-dom'

const SKILLS = ['JavaScript','TypeScript','React','Vue','Node.js','Python','Java','Go','Rust','Swift','Kotlin','SQL','GraphQL','AWS','Docker','Kubernetes','Machine Learning','Data Science','UI/UX','Product Management','DevOps','Cybersecurity','Rust','C++']
const EXP_LEVELS = ['Entry Level (0-2 yrs)', 'Mid Level (3-5 yrs)', 'Senior (6-9 yrs)', 'Staff / Lead (10+ yrs)']

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills || '',
    experienceLevel: user?.experienceLevel || '',
    desiredSalary: user?.desiredSalary || '',
    preferredRemote: user?.preferredRemote || false,
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [error, setError] = useState('')

  const selectedSkills = form.skills ? form.skills.split(',').filter(Boolean) : []
  const toggleSkill = (sk) => {
    const cur = new Set(selectedSkills)
    cur.has(sk) ? cur.delete(sk) : cur.add(sk)
    setForm(f => ({ ...f, skills: [...cur].join(',') }))
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const updated = await authApi.updateProfile(form)
      updateUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError('Failed to save profile.')
    } finally { setSaving(false) }
  }

  const handleResume = async (file) => {
    if (!file) return
    setUploading(true); setUploadMsg('')
    try {
      const res = await authApi.uploadResume(file)
      updateUser({ resumeUrl: res.url })
      setUploadMsg(`✓ Uploaded: ${res.filename}`)
    } catch (e) {
      setUploadMsg('Upload failed. Max size is 5MB.')
    } finally { setUploading(false) }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(130deg,#0F4C8A,#1a6bbf)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 800 }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 22, marginBottom: 2 }}>{user?.name}</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13 }}>{user?.email}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login') }}
          style={{ padding: '8px 16px', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign Out
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #ECEAE4', padding: 28, marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 18 }}>Profile Settings</h3>

        {error && <div style={{ background: '#FEF2F2', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[['Location', 'location', 'text', 'e.g. New York, NY'],
            ['Desired Salary', 'desiredSalary', 'text', 'e.g. $120k-$160k']].map(([label, field, type, ph]) => (
            <div key={field}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>{label}</label>
              <input type={type} value={form[field]} placeholder={ph}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #ECEAE4', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Experience Level</label>
          <select value={form.experienceLevel} onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #ECEAE4', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}>
            <option value=''>Select level…</option>
            {EXP_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder='Brief professional summary…'
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #ECEAE4', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', minHeight: 80, outline: 'none' }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>
            Skills <span style={{ color: '#0F4C8A' }}>({selectedSkills.length} selected)</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SKILLS.map(sk => (
              <button key={sk} onClick={() => toggleSkill(sk)}
                style={{ padding: '5px 11px', borderRadius: 16, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  background: selectedSkills.includes(sk) ? '#0F4C8A' : '#F7F5F0',
                  color: selectedSkills.includes(sk) ? '#fff' : '#555',
                  borderColor: selectedSkills.includes(sk) ? '#0F4C8A' : 'transparent' }}>
                {sk}
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
          <input type='checkbox' checked={form.preferredRemote} onChange={e => setForm(f => ({ ...f, preferredRemote: e.target.checked }))} style={{ accentColor: '#0F4C8A', width: 16, height: 16 }} />
          Prefer remote roles
        </label>

        <button onClick={handleSave} disabled={saving}
          style={{ width: '100%', padding: 13, background: '#0F4C8A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>

      {/* Resume Upload */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #ECEAE4', padding: 28 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 6 }}>Resume</h3>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Upload your resume to use with AI job matching</p>

        {user?.resumeUrl && (
          <div style={{ background: '#F0FFF4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#16a34a', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>📄</span>
            <span>Resume uploaded · <a href={`http://localhost:8080${user.resumeUrl}`} target='_blank' rel='noreferrer' style={{ color: '#0F4C8A' }}>View</a></span>
          </div>
        )}

        <input ref={fileRef} type='file' accept='.pdf,.doc,.docx,.txt' onChange={e => handleResume(e.target.files[0])} style={{ display: 'none' }} />

        <div onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleResume(e.dataTransfer.files[0]) }}
          style={{ border: '2px dashed #C8D8F0', borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: '#F4F8FF' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F4C8A', marginBottom: 3 }}>
            {uploading ? 'Uploading…' : 'Drop your resume or click to browse'}
          </p>
          <p style={{ fontSize: 11, color: '#888' }}>PDF, DOC, DOCX · max 5MB</p>
        </div>

        {uploadMsg && (
          <p style={{ fontSize: 13, marginTop: 10, color: uploadMsg.startsWith('✓') ? '#16a34a' : '#dc2626', fontWeight: 500 }}>{uploadMsg}</p>
        )}
      </div>
    </div>
  )
}
