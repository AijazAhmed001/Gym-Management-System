'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getDayShort, getDayName } from '@/lib/utils'

type FitnessClass = {
  id: string; name: string; description: string; classType: string
  dayOfWeek: number; startTime: string; endTime: string; capacity: number; location: string
  trainer: { name: string }
  _count: { bookings: number }
}

const typeColors: Record<string, string> = {
  HIIT: '#ff4787', Yoga: '#00e5a0', Strength: '#6c47ff', Cardio: '#ffa040', Pilates: '#00d4ff', Functional: '#a855f7', Circuit: '#f59e0b',
}

export default function ClassesPage() {
  const { data: session } = useSession()
  const [classes, setClasses] = useState<FitnessClass[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FitnessClass | null>(null)
  const [booking, setBooking] = useState(false)
  const [bookMsg, setBookMsg] = useState('')
  const [filterDay, setFilterDay] = useState(-1)
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => { setClasses(d); setLoading(false) })
  }, [])

  const days = [0,1,2,3,4,5,6]
  const types = [...new Set(classes.map(c => c.classType).filter(Boolean))]
  const filtered = classes.filter(c =>
    (filterDay === -1 || c.dayOfWeek === filterDay) &&
    (!filterType || c.classType === filterType)
  )

  async function bookClass(cls: FitnessClass) {
    if (!session) return
    setBooking(true)
    setBookMsg('')
    const today = new Date()
    const diff = (cls.dayOfWeek - today.getDay() + 7) % 7
    const classDate = new Date(today)
    classDate.setDate(today.getDate() + (diff === 0 ? 7 : diff))

    const res = await fetch(`/api/classes/${cls.id}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classDate: classDate.toISOString() }),
    })
    const data = await res.json()
    if (res.ok) {
      setBookMsg('✅ Class booked successfully!')
      setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, _count: { bookings: c._count.bookings + 1 } } : c))
    } else {
      setBookMsg(`❌ ${data.error}`)
    }
    setBooking(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🗓️ Browse Classes</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{classes.length} classes available this week</p>
        </div>
      </div>

      <div className="page-body">
        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>DAY</div>
              <div className="flex gap-2 flex-wrap">
                <button className={`btn btn-sm ${filterDay === -1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDay(-1)}>All</button>
                {days.map(d => (
                  <button key={d} className={`btn btn-sm ${filterDay === d ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDay(d)}>
                    {getDayShort(d)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>TYPE</div>
              <div className="flex gap-2 flex-wrap">
                <button className={`btn btn-sm ${!filterType ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterType('')}>All</button>
                {types.map(t => (
                  <button key={t} className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterType(t)}
                    style={{ borderColor: filterType === t ? typeColors[t] : '', color: filterType === t ? typeColors[t] : '' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1rem' }}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="card animate-pulse" style={{ height: 180 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1rem' }}>
            {filtered.map(cls => {
              const pct = Math.round((cls._count.bookings / cls.capacity) * 100)
              const color = typeColors[cls.classType] || 'var(--primary)'
              return (
                <div key={cls.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => { setSelected(cls); setBookMsg('') }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge" style={{ background: `${color}20`, color }}>{cls.classType}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{getDayName(cls.dayOfWeek)}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cls.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{cls.description}</p>
                  <div className="flex gap-4 text-sm" style={{ color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
                    <span>⏰ {cls.startTime}–{cls.endTime}</span>
                    <span>📍 {cls.location}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    👤 {cls.trainer.name} · {cls._count.bookings}/{cls.capacity} booked
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--danger)' : pct >= 70 ? 'var(--warning)' : color }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selected.name}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{selected.classType}</span>
                <span className="badge badge-muted">{getDayName(selected.dayOfWeek)}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selected.description}</p>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  ['⏰ Time', `${selected.startTime} – ${selected.endTime}`],
                  ['📍 Location', selected.location],
                  ['👤 Trainer', selected.trainer.name],
                  ['👥 Capacity', `${selected._count.bookings}/${selected.capacity}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{k}</div>
                    <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${(selected._count.bookings / selected.capacity) * 100}%` }} />
              </div>
            </div>
            {bookMsg && <div className={`alert ${bookMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{bookMsg}</div>}
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={() => bookClass(selected)} disabled={booking || selected._count.bookings >= selected.capacity}>
                {booking ? <span className="spinner" style={{ width: 18, height: 18 }} /> : selected._count.bookings >= selected.capacity ? 'Class Full' : '✓ Book This Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
