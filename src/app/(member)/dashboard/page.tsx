'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatDate, getDayName } from '@/lib/utils'

type DashboardData = {
  bookings: Array<{
    id: string; classDate: string; status: string
    class: { name: string; startTime: string; endTime: string; location: string; classType: string; trainer: { name: string } }
  }>
  subscription: { status: string; plan: { name: string; price: number } } | null
  workoutCount: number
  notifications: Array<{ id: string; title: string; message: string; type: string; createdAt: string }>
}

const QUICK_ACTIONS = [
  { href:'/classes',          icon:'🗓️', label:'Book a Class',    color:'var(--primary)',  bg:'var(--primary-dim)' },
  { href:'/workouts/planner', icon:'📆', label:'Plan Workouts',   color:'#f472b6',         bg:'var(--accent-dim)' },
  { href:'/workouts',         icon:'💪', label:'Log Workout',     color:'var(--teal)',     bg:'var(--teal-dim)' },
  { href:'/progress',         icon:'📈', label:'Track Progress',  color:'var(--amber)',    bg:'var(--amber-dim)' },
  { href:'/billing',          icon:'💳', label:'Manage Plan',     color:'var(--rose)',     bg:'var(--rose-dim)' },
  { href:'/profile',          icon:'👤', label:'Edit Profile',    color:'var(--violet)',   bg:'var(--violet-dim)' },
]

const notifColors: Record<string,string> = { SUCCESS:'var(--success)', INFO:'var(--primary)', WARNING:'var(--amber)', ALERT:'var(--danger)' }
const notifIcons:  Record<string,string> = { SUCCESS:'✅', INFO:'💡', WARNING:'⚠️', ALERT:'🚨' }
const classTypeColors: Record<string,string> = {
  HIIT:'#fb7185', Yoga:'#14b8a6', Strength:'#7c5cfc', Cardio:'#f59e0b',
  Pilates:'#38bdf8', Functional:'#a78bfa', Circuit:'#10b981'
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/member').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = session?.user?.name?.split(' ')[0] || 'there'
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

  const planName  = data?.subscription?.plan.name || 'None'
  const planColor = planName === 'Elite' ? '#f472b6' : planName === 'Pro' ? 'var(--primary)' : 'var(--teal)'
  const planGradient = planName === 'Elite'
    ? 'linear-gradient(135deg,#f472b6,#fb7185)'
    : planName === 'Pro'
    ? 'var(--grad-primary)'
    : 'var(--grad-emerald)'

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize:'1.05rem', fontWeight:700 }}>{greeting}, {firstName} 👋</h1>
          <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:2 }}>{today}</p>
        </div>
        <Link href="/classes" className="btn btn-primary btn-sm">+ Book a Class</Link>
      </div>

      <div className="page-body animate-fade">
        {/* Hero Banner */}
        <div className="hero-banner" style={{ marginBottom:'1.5rem' }}>
          <div style={{ position:'absolute', width:200, height:200, top:-80, right:60, background:'rgba(255,255,255,0.08)', borderRadius:'50%', filter:'blur(10px)' }} />
          <div style={{ position:'absolute', width:120, height:120, bottom:-50, right:220, background:'rgba(255,255,255,0.06)', borderRadius:'50%', filter:'blur(8px)' }} />
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.65)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.375rem' }}>IronPeak Fitness</div>
              <h2 style={{ fontSize:'1.6rem', fontWeight:800, color:'#fff', marginBottom:'0.375rem' }}>Welcome back, {firstName}!</h2>
              <p style={{ color:'rgba(255,255,255,0.70)', fontSize:'0.875rem' }}>
                {data?.subscription ? `${planName} Member · $${data.subscription.plan.price}/mo` : 'No active plan'}
              </p>
            </div>
            <div style={{ display:'flex', gap:'2rem' }}>
              {[
                { label:'Classes This Week', val: data?.bookings.length ?? '—', icon:'🗓️' },
                { label:'Workouts (30d)',    val: data?.workoutCount ?? '—',    icon:'💪' },
                { label:'Membership',       val: planName,                      icon:'💳' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.25rem' }}>{s.icon}</div>
                  <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#fff', lineHeight:1.1 }}>{s.val}</div>
                  <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.60)', marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Row */}
        {loading ? (
          <div className="kpi-grid" style={{ marginBottom:'1.5rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:120, borderRadius:'var(--radius-lg)' }} />)}
          </div>
        ) : (
          <div className="kpi-grid" style={{ marginBottom:'1.5rem' }}>
            <div className="kpi-card primary">
              <div className="kpi-card-accent" />
              <div className="kpi-icon">💳</div>
              <div className="kpi-label">Membership Plan</div>
              <div className="kpi-value" style={{ fontSize:'1.4rem', background:planGradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {planName}
              </div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:'0.375rem' }}>
                {data?.subscription?.status === 'ACTIVE' ? (
                  <span className="stat-chip success" style={{ fontSize:'0.7rem' }}>✓ Active</span>
                ) : <span className="stat-chip rose">Inactive</span>}
              </div>
            </div>

            <div className="kpi-card teal">
              <div className="kpi-card-accent" />
              <div className="kpi-icon">📋</div>
              <div className="kpi-label">Upcoming Bookings</div>
              <div className="kpi-value">{data?.bookings.length || 0}</div>
              <div className="kpi-change up">↑ Sessions this week</div>
            </div>

            <div className="kpi-card accent">
              <div className="kpi-card-accent" />
              <div className="kpi-icon">💪</div>
              <div className="kpi-label">Workouts (30 days)</div>
              <div className="kpi-value">{data?.workoutCount || 0}</div>
              <div className="kpi-change up">Sessions logged</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card mb-6">
          <h2 className="card-title" style={{ marginBottom:'1rem' }}>⚡ Quick Actions</h2>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map(a => (
              <Link key={a.href} href={a.href}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', padding:'1rem 0.5rem', borderRadius:'var(--radius)', border:'1.5px solid var(--border-light)', background:'var(--surface-2)', cursor:'pointer', transition:'all 0.18s', textDecoration:'none' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.bg; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.transform = '' }}
              >
                <span style={{ fontSize:'1.5rem' }}>{a.icon}</span>
                <span style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', textAlign:'center', lineHeight:1.3 }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-content-grid">
          {/* Upcoming Classes */}
          <div className="section-card">
            <div className="section-header">
              <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>📅 Upcoming Classes</h2>
              <Link href="/bookings" style={{ fontSize:'0.78rem', color:'var(--primary)', fontWeight:600 }}>View all →</Link>
            </div>
            <div style={{ padding:'1rem' }}>
              {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height:64, borderRadius:'var(--radius)', marginBottom:8 }} />) :
                data?.bookings.length === 0 ? (
                  <div className="empty-state" style={{ padding:'2rem' }}>
                    <div className="empty-icon">🗓️</div>
                    <div className="empty-title">No upcoming classes</div>
                    <div className="empty-desc">Book a class to get started</div>
                    <Link href="/classes" className="btn btn-primary btn-sm mt-4">Browse Classes</Link>
                  </div>
                ) : (
                  data?.bookings.map(b => {
                    const color = classTypeColors[b.class.classType] || 'var(--primary)'
                    return (
                      <div key={b.id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.875rem', marginBottom:'0.5rem', background:'var(--surface-2)', borderRadius:'var(--radius)', border:`1px solid ${color}20` }}>
                        <div style={{ width:44, height:44, background:`${color}15`, borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                          {b.class.classType === 'Yoga' ? '🧘' : b.class.classType === 'HIIT' ? '⚡' : b.class.classType === 'Strength' ? '🏋️' : '🏃'}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:'0.875rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{b.class.name}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:2 }}>
                            {getDayName(new Date(b.classDate).getDay())} · {b.class.startTime}–{b.class.endTime}
                          </div>
                        </div>
                        <span style={{ fontSize:'0.7rem', padding:'2px 8px', borderRadius:999, background:`${color}15`, color, fontWeight:600, whiteSpace:'nowrap' }}>{b.class.classType}</span>
                      </div>
                    )
                  })
                )
              }
            </div>
          </div>

          {/* Notifications */}
          <div className="section-card">
            <div className="section-header">
              <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>🔔 Notifications</h2>
              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{data?.notifications.length || 0} unread</span>
            </div>
            <div style={{ padding:'1rem' }}>
              {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height:72, borderRadius:'var(--radius)', marginBottom:8 }} />) :
                data?.notifications.length === 0 ? (
                  <div className="empty-state" style={{ padding:'2rem' }}>
                    <div className="empty-icon">🔔</div>
                    <div className="empty-title">All caught up!</div>
                    <div className="empty-desc">No new notifications</div>
                  </div>
                ) : (
                  data?.notifications.map(n => {
                    const color = notifColors[n.type] || 'var(--primary)'
                    return (
                      <div key={n.id} style={{ display:'flex', gap:'0.75rem', padding:'0.875rem', marginBottom:'0.5rem', background:'var(--surface-2)', borderRadius:'var(--radius)', borderLeft:`3px solid ${color}`, alignItems:'flex-start' }}>
                        <span style={{ fontSize:'1.1rem', flexShrink:0, marginTop:2 }}>{notifIcons[n.type] || 'ℹ️'}</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:'0.82rem' }}>{n.title}</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{n.message}</div>
                        </div>
                      </div>
                    )
                  })
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
