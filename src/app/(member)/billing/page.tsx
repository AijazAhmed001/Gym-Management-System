'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatDate, formatCurrency, parseFeatures } from '@/lib/utils'

type Plan = { id: string; name: string; price: number; description: string; features: string; _count?: { subscriptions: number } }
type Payment = { id: string; amount: number; status: string; description: string; createdAt: string }
type Sub = { status: string; startDate: string; plan: Plan }

const planColors: Record<string, string> = { Basic: 'var(--success)', Pro: 'var(--primary)', Elite: 'var(--accent)' }

export default function BillingPage() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<Plan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [sub, setSub] = useState<Sub | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return
    Promise.all([
      fetch('/api/plans').then(r => r.json()),
      fetch(`/api/members/${session.user.id}`).then(r => r.json()),
    ]).then(([p, m]) => {
      setPlans(p)
      setSub(m.subscription)
      setPayments(m.payments || [])
      setLoading(false)
    })
  }, [session])

  async function changePlan(planId: string) {
    setUpgrading(true)
    setMsg('')
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    })
    const data = await res.json()
    if (res.ok) {
      setSub(data.subscription)
      setPayments(p => [data.payment, ...p])
      setMsg('✅ Plan updated successfully!')
    } else {
      setMsg(`❌ ${data.error}`)
    }
    setUpgrading(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💳 Billing & Subscription</h1>
      </div>

      <div className="page-body">
        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

        {/* Current Plan */}
        <div className="card mb-6">
          <h2 className="card-title mb-4">Current Subscription</h2>
          {loading ? <div className="animate-pulse" style={{ height: 80, background: 'var(--surface-2)', borderRadius: 8 }} /> : sub ? (
            <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{ width: 60, height: 60, background: `${planColors[sub.plan.name] || 'var(--primary)'}20`, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
                {sub.plan.name === 'Elite' ? '👑' : sub.plan.name === 'Pro' ? '⭐' : '🥉'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: planColors[sub.plan.name] || 'var(--primary)' }}>{sub.plan.name} Plan</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {formatCurrency(sub.plan.price)}/month · Active since {formatDate(sub.startDate)}
                </div>
              </div>
              <span className="badge badge-success">● {sub.status}</span>
            </div>
          ) : (
            <div className="empty-state"><p>No active subscription.</p></div>
          )}
        </div>

        {/* Plan Selection */}
        <div className="card mb-6">
          <h2 className="card-title mb-6">Change Plan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {plans.map(plan => {
              const color = planColors[plan.name] || 'var(--primary)'
              const isCurrent = sub?.plan.id === plan.id
              const features = parseFeatures(plan.features)
              return (
                <div key={plan.id} className="plan-card" style={{ borderColor: isCurrent ? color : 'var(--border)', boxShadow: isCurrent ? `0 0 20px ${color}30` : 'none' }}>
                  {isCurrent && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: color, color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 999 }}>Current</div>}
                  <div style={{ color, fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</div>
                  <div className="plan-price" style={{ color }}><sup>$</sup>{plan.price}<span>/mo</span></div>
                  <div style={{ margin: '1rem 0', height: 1, background: 'var(--border)' }} />
                  {features.map((f, i) => (
                    <div key={i} className="plan-feature"><span className="plan-feature-icon">✓</span>{f}</div>
                  ))}
                  <button
                    className={`btn btn-full mt-4 ${isCurrent ? 'btn-outline' : 'btn-primary'}`}
                    style={{ borderColor: isCurrent ? color : '', color: isCurrent ? color : '' }}
                    disabled={isCurrent || upgrading}
                    onClick={() => changePlan(plan.id)}
                  >
                    {isCurrent ? 'Current Plan' : upgrading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : `Switch to ${plan.name}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment History */}
        <div className="card">
          <h2 className="card-title mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <div className="empty-state"><p>No payments yet.</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>{formatDate(p.createdAt)}</td>
                      <td>{p.description}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                      <td><span className="badge" style={{ background: p.status === 'succeeded' ? 'var(--success-dim)' : 'var(--danger-dim)', color: p.status === 'succeeded' ? 'var(--success)' : 'var(--danger)' }}>
                        {p.status === 'succeeded' ? '✓ Paid' : p.status}
                      </span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
