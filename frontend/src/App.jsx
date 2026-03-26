import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Browse from './pages/Browse'
import Saved from './pages/Saved'
import Applications from './pages/Applications'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AIMatch from './pages/AIMatch'
import './index.css'

function Nav() {
  const { user, logout } = useAuth()
  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-icon">◎</div>
          <span className="logo-text">Finder<em>AI</em></span>
        </NavLink>
        <nav className="nav-links">
          {[['/', 'Browse'], ['/ai-match', '✦ AI Match'], ['/saved', 'Saved'], ['/applications', 'Applications']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0F4C8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              {user.name?.split(' ')[0]}
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="nav-btn">Sign In</NavLink>
              <NavLink to="/register" style={{ padding: '6px 16px', borderRadius: 7, background: '#0F4C8A', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/ai-match" element={<AIMatch />} />
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
