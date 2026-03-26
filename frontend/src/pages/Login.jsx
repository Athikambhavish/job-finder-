import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9F8F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420, border: '1.5px solid #ECEAE4', boxShadow: '0 8px 40px rgba(0,0,0,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: '#0F4C8A', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>◎</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Finder<em style={{ color: '#0F4C8A' }}>AI</em></span>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 }}>Welcome back</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Sign in to your account to continue</p>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}

        {[['Email', 'email', 'email', 'you@example.com'], ['Password', 'password', 'password', '••••••••']].map(([label, field, type, ph]) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>{label}</label>
            <input type={type} value={form[field]} placeholder={ph}
              onChange={e => set(field, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid #ECEAE4', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading || !form.email || !form.password}
          style={{ width: '100%', padding: 13, marginTop: 8, background: form.email && form.password ? '#0F4C8A' : '#C8D8F0', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0F4C8A', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
