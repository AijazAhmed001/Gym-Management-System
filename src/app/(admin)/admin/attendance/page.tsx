'use client'
import { useEffect, useState } from 'react'
import { formatDate, getDayName } from '@/lib/utils'

type Booking = { id: string; status: string; classDate: string; user: { name: string; email: string }; class: { name: string; trainer: { name: string } } }

const statusColors: Record<string,string> = { BOOKED: 'var(--primary)', ATTENDED: 'var(--success)', CANCELLED: 'var(--danger)', NO_SHOW: 'var(--warning)' }

export default function AdminAttendancePage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    // Fetch all classes and their bookings
    fetch('/api/classes').then(r => r.json()).then(async (classes) => {
      const all: Booking[] = []
      for (const cls of classes.slice(0, 6)) {
        const detail = await fetch(`/api/classes/${cls.id}`).then(r => r.json())
        if (detail.bookings) {
          all.push(...detail.bookings.map((b: Booking) => ({ ...b, class: { name: cls.name, trainer: cls.trainer } })))
        }
      }
      setBookings(all)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const stats = {
    total: bookings.length,
    attended: bookings.filter(b => b.status === 'ATTENDED').length,
    booked: bookings.filter(b => b.status === 'BOOKED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Attendance</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bookings.length} total bookings</p>
        </div>
      </div>
      <div className="page-body">
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
          {[
            { icon: '📊', label: 'Total Bookings', value: stats.total, color: 'primary' },
            { icon: '✅', label: 'Attended', value: stats.attended, color: 'success' },
            { icon: '🕐', label: 'Upcoming', value: stats.booked, color: 'warning' },
            { icon: '❌', label: 'Cancelled', value: stats.cancelled, color: 'accent' },
          ].map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <div className="kpi-icon" style={{ fontSize: '1.25rem' }}>{k.icon}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Booking Records</h2>
            <div className="tabs" style={{ width: 360 }}>
              {['ALL','BOOKED','ATTENDED','CANCELLED'].map(s => (
                <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)} style={{ fontSize: '0.75rem' }}>{s}</button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="animate-pulse" style={{ height: 200, background: 'var(--surface-2)', borderRadius: 8 }} />
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>No records found.</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Member</th><th>Class</th><th>Date</th><th>Trainer</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.slice(0,50).map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.user?.name || '—'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                      </td>
                      <td>{b.class?.name || '—'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.classDate ? `${getDayName(new Date(b.classDate).getDay())}, ${formatDate(b.classDate)}` : '—'}</td>
                      <td style={{ fontSize: '0.85rem' }}>{b.class?.trainer?.name || '—'}</td>
                      <td><span className="badge" style={{ background: `${statusColors[b.status] || 'var(--primary)'}20`, color: statusColors[b.status] || 'var(--primary)' }}>{b.status}</span></td>
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
