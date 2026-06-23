'use client'
import { useEffect, useState } from 'react'
import { formatDate, formatCurrency, parseFeatures } from '@/lib/utils'

type Plan = { id: string; name: string; price: number; description: string; features: string; _count: { subscriptions: number } }

const planColors: Record<string, string> = { Basic: 'var(--success)', Pro: 'var(--primary)', Elite: 'var(--accent)' }
const planIcons: Record<string, string> = { Basic: '🥉', Pro: '⭐', Elite: '👑' }

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/plans').then(r => r.json()).then(d => { setPlans(d); setLoading(false) })
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💎 Membership Plans</h1>
      </div>
      <div className="page-body">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[1,2,3].map(i => <div key={i} className="card animate-pulse" style={{ height: 360 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem' }}>
            {plans.map(plan => {
              const color = planColors[plan.name] || 'var(--primary)'
              const features = parseFeatures(plan.features)
              return (
                <div key={plan.id} className="plan-card" style={{ borderColor: plan.name === 'Pro' ? color : 'var(--border)', boxShadow: plan.name === 'Pro' ? `0 0 24px ${color}30` : 'none', position: 'relative' }}>
                  {plan.name === 'Pro' && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: color, color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 999 }}>Most Popular</div>
                  )}
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{planIcons[plan.name] || '💎'}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color }}>{plan.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{plan.description}</div>
                  </div>
                  <div className="plan-price" style={{ color, textAlign: 'center', marginBottom: '1rem' }}>
                    <sup>$</sup>{plan.price}<span>/mo</span>
                  </div>
                  <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{plan._count.subscriptions}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active subscribers</div>
                  </div>
                  <div style={{ marginBottom: '0.5rem', color }}>
                    Monthly Revenue: <strong>{formatCurrency(plan.price * plan._count.subscriptions)}</strong>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />
                  {features.map((f, i) => (
                    <div key={i} className="plan-feature"><span className="plan-feature-icon">✓</span>{f}</div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* Summary */}
        {!loading && (
          <div className="card mt-6">
            <h2 className="card-title mb-4">Revenue Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
              {plans.map(p => (
                <div key={p.id} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <div style={{ color: planColors[p.name] || 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{p.name}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>{formatCurrency(p.price * p._count.subscriptions)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p._count.subscriptions} × {formatCurrency(p.price)}/mo</div>
                </div>
              ))}
              <div style={{ background: 'var(--primary-dim)', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid rgba(108,71,255,0.2)' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>Total</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--primary)' }}>
                  {formatCurrency(plans.reduce((a, p) => a + p.price * p._count.subscriptions, 0))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly recurring revenue</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
