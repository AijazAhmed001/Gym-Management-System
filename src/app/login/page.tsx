'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (!res || res.error || !res.ok) {
        setError('Invalid email or password. Please try again.')
        setLoading(false)
        return
      }
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      router.push(session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  function fill(type: 'admin' | 'member') {
    setEmail('')
    setPassword('')
    setTimeout(() => {
      setEmail(type === 'admin' ? 'admin@ironpeak.com' : 'john.doe@email.com')
      setPassword(type === 'admin' ? 'admin123' : 'member123')
    }, 10)
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

      <div className="auth-card animate-slide">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🏋️</div>
          <div>
            <div style={{ fontFamily:'Plus Jakarta Sans', fontWeight:800, fontSize:'1.2rem', background:'var(--grad-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IronPeak</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'-1px' }}>Fitness Portal</div>
          </div>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your IronPeak account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position:'relative' }}>
              <input
                id="password"
                className="form-input"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight:'3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                style={{ position:'absolute', right:'0.875rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer', fontSize:'1rem', padding:'4px', lineHeight:1 }}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button id="signin-btn" className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width:18, height:18 }} /> : 'Sign In →'}
          </button>
        </form>

        <div className="auth-divider">Quick Demo Access</div>

        <div className="demo-btn-grid">
          <button type="button" className="btn btn-outline" onClick={() => fill('admin')} style={{ fontSize:'0.8rem', gap:'0.375rem' }}>
            👑 Admin Demo
          </button>
          <button type="button" className="btn btn-outline" onClick={() => fill('member')} style={{ fontSize:'0.8rem', gap:'0.375rem' }}>
            👤 Member Demo
          </button>
        </div>

        <div style={{ background:'var(--surface-3)', borderRadius:'var(--radius)', padding:'0.875rem 1rem', fontSize:'0.78rem', color:'var(--text-muted)', border:'1px solid var(--border-light)' }}>
          <div style={{ fontWeight:700, marginBottom:'0.375rem', color:'var(--text)', fontSize:'0.8rem' }}>Demo credentials</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
            <div>👑 <strong>Admin:</strong> admin@ironpeak.com / admin123</div>
            <div>👤 <strong>Member:</strong> john.doe@email.com / member123</div>
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.82rem', color:'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color:'var(--primary)', fontWeight:700 }}>Create account</Link>
        </p>
      </div>
    </div>
  )
}
