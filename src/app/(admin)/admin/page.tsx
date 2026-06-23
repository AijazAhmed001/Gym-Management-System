'use client'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

type Stats = {
  kpis: { totalMembers: number; activeSubscriptions: number; monthlyRevenue: number; classesToday: number; totalRevenue: number }
  revenueData: { month: string; revenue: number }[]
  memberGrowth: { month: string; members: number }[]
  topClasses: { name: string; bookings: number }[]
  planDistribution: { name: string; count: number }[]
}

const PIE_COLORS = ['#7c5cfc','#f472b6','#14b8a6','#f59e0b']

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) })
  }, [])

  const kpis = [
    { icon: '👥', label: 'Total Members',       value: stats?.kpis.totalMembers ?? '—',                       color: 'primary', change: '+12%' },
    { icon: '✅', label: 'Active Subscriptions', value: stats?.kpis.activeSubscriptions ?? '—',               color: 'teal',    change: '+8%' },
    { icon: '💰', label: 'Monthly Revenue',       value: stats ? formatCurrency(stats.kpis.monthlyRevenue) : '—', color: 'amber',   change: '+22%' },
    { icon: '🗓️', label: 'Classes Today',         value: stats?.kpis.classesToday ?? '—',                     color: 'rose',    change: '' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Admin Overview</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Welcome back, Admin · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Total Revenue: <span style={{ color: 'var(--success)', fontWeight: 700 }}>{stats ? formatCurrency(stats.kpis.totalRevenue) : '—'}</span>
        </div>
      </div>

      <div className="page-body">
        {/* KPIs */}
        <div className="kpi-grid">
          {kpis.map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <div className="kpi-card-accent" />
              <div className="kpi-icon" style={{ fontSize: '1.4rem' }}>{k.icon}</div>
              <div className="kpi-value">{loading ? '—' : k.value}</div>
              <div className="kpi-label">{k.label}</div>
              {k.change && <div className="kpi-change up">▲ {k.change} this month</div>}
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="charts-grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📈 Revenue (12 months)</h2>
            </div>
            {loading ? <div className="skeleton" style={{ height: 280, borderRadius: 8 }} /> : (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,92,252,0.08)" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v) || 0)} contentStyle={{ background: '#fff', border: '1px solid rgba(124,92,252,0.15)', borderRadius: 10, boxShadow: '0 4px 20px rgba(124,92,252,0.12)' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#7c5cfc" strokeWidth={2.5} dot={{ fill: '#7c5cfc', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header"><h2 className="card-title">🥧 Plan Distribution</h2></div>
            {loading ? <div className="skeleton" style={{ height: 280, borderRadius: 8 }} /> : (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats?.planDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                      {stats?.planDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(124,92,252,0.15)', borderRadius: 10, boxShadow: '0 4px 20px rgba(124,92,252,0.12)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-grid-2">
          <div className="card">
            <div className="card-header"><h2 className="card-title">👥 Member Growth</h2></div>
            {loading ? <div className="skeleton" style={{ height: 240, borderRadius: 8 }} /> : (
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.memberGrowth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.08)" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(20,184,166,0.15)', borderRadius: 10, boxShadow: '0 4px 20px rgba(20,184,166,0.12)' }} />
                    <Line type="monotone" dataKey="members" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: '#14b8a6', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header"><h2 className="card-title">🏆 Top Classes by Bookings</h2></div>
            {loading ? <div className="skeleton" style={{ height: 240, borderRadius: 8 }} /> : (
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.topClasses} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,114,182,0.08)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} width={100} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(244,114,182,0.15)', borderRadius: 10, boxShadow: '0 4px 20px rgba(244,114,182,0.12)' }} />
                    <Bar dataKey="bookings" fill="#f472b6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
