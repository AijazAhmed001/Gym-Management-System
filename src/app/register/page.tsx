'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

type Plan = { id: string; name: string; price: number; features: string; description: string }

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [plans, setPlans] = useState<Plan[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', planId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/plans').then(r => r.json()).then(setPlans)
  }, [])

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const planColors: Record<string, string> = { Basic: 'var(--success)', Pro: 'var(--primary)', Elite: 'var(--accent)' }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card animate-slide" style={{ maxWidth: step === 3 ? 760 : 440 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🏋️</div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem' }}>IronPeak</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-2px' }}>Fitness Portal</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6" style={{ justifyContent: 'center' }}>
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: s <= step ? 'var(--primary)' : 'var(--surface-3)',
                color: s <= step ? '#fff' : 'var(--text-faint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
                transition: 'all 0.3s',
                boxShadow: s === step ? '0 0 16px var(--primary-glow)' : 'none',
              }}>{s <= step - 1 ? '✓' : s}</div>
              {s < 3 && <div style={{ width: 40, height: 2, background: s < step ? 'var(--primary)' : 'var(--surface-3)', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {step === 1 && (
          <div className="animate-fade">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Start your fitness journey today</p>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="John Doe" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input className="form-input" type="tel" placeholder="+1 555 000 0000" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="At least 8 characters" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button className="btn btn-primary btn-full btn-lg"
              onClick={() => { if (form.name && form.email && form.password) setStep(2); else setError('Please fill all required fields.') }}
            >Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade">
            <h2 className="auth-title">Choose your plan</h2>
            <p className="auth-subtitle">Select the membership that fits your goals</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {plans.map(plan => {
                const feats: string[] = JSON.parse(plan.features)
                const selected = form.planId === plan.id
                return (
                  <div key={plan.id}
                    onClick={() => setForm(p => ({ ...p, planId: plan.id }))}
                    style={{
                      border: `2px solid ${selected ? planColors[plan.name] || 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)', padding: '1.25rem', cursor: 'pointer',
                      background: selected ? 'rgba(108,71,255,0.08)' : 'var(--surface-2)',
                      transition: 'all 0.2s',
                      boxShadow: selected ? `0 0 20px ${planColors[plan.name] || 'var(--primary-glow)'}40` : 'none',
                    }}>
                    <div style={{ fontWeight: 700, color: planColors[plan.name] || 'var(--primary)', marginBottom: '0.5rem' }}>{plan.name}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '0.75rem' }}>
                      ${plan.price}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
                    </div>
                    {feats.slice(0, 4).map((f, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>✓ {f}</div>
                    ))}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary flex-1 btn-lg" onClick={() => setStep(3)} disabled={!form.planId}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade">
            <h2 className="auth-title">Complete your signup</h2>
            <p className="auth-subtitle">Review and confirm your membership</p>
            {plans.filter(p => p.id === form.planId).map(plan => (
              <div key={plan.id} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{plan.name} Plan</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>${plan.price}/mo</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Billed monthly. Cancel anytime.</div>
              </div>
            ))}
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--success)' }}>🔒 Demo Mode — No real payment required</div>
              Your subscription will be activated immediately with a simulated payment.
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary flex-1 btn-lg" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : '🚀 Start Membership'}
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
