'use client'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

type Stats = {
  kpis: { totalMembers: number; activeSubscriptions: number; monthlyRevenue: number; totalRevenue: number }
  revenueData: { month: string; revenue: number }[]
  planDistribution: { name: string; count: number }[]
  topClasses: { name: string; bookings: number }[]
}

const COLORS = ['#6c47ff','#ff4787','#00e5a0','#ffa040']

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) })
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📈 Reports & Analytics</h1>
      </div>
      <div className="page-body">
        {/* Summary Cards */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
          {[
            { icon: '💰', label: 'Total Revenue', value: stats ? formatCurrency(stats.kpis.totalRevenue) : '—', color: 'success' },
            { icon: '📅', label: 'MRR', value: stats ? formatCurrency(stats.kpis.monthlyRevenue) : '—', color: 'primary' },
            { icon: '👥', label: 'Total Members', value: stats?.kpis.totalMembers ?? '—', color: 'warning' },
            { icon: '✅', label: 'Active Subs', value: stats?.kpis.activeSubscriptions ?? '—', color: 'accent' },
          ].map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <div className="kpi-icon" style={{ fontSize: '1.25rem' }}>{k.icon}</div>
              <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{loading ? '—' : k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="card">
            <h2 className="card-title mb-4">Monthly Revenue Trend</h2>
            {loading ? <div className="animate-pulse" style={{ height: 260, background: 'var(--surface-2)', borderRadius: 8 }} /> : (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v) || 0)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Bar dataKey="revenue" fill="#6c47ff" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="card-title mb-4">Plan Distribution</h2>
            {loading ? <div className="animate-pulse" style={{ height: 260, background: 'var(--surface-2)', borderRadius: 8 }} /> : (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats?.planDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${((percent ?? 0)*100).toFixed(0)}%`}>
                      {stats?.planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title mb-4">Top Classes by Bookings</h2>
          {loading ? <div className="animate-pulse" style={{ height: 240, background: 'var(--surface-2)', borderRadius: 8 }} /> : (
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topClasses} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Bar dataKey="bookings" fill="#ff4787" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
