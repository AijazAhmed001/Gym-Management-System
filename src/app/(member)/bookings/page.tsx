'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatDate, getDayName } from '@/lib/utils'

type Booking = {
  id: string; status: string; bookedAt: string; classDate: string
  class: { name: string; startTime: string; endTime: string; location: string; classType: string; trainer: { name: string } }
}

const statusColors: Record<string, string> = { BOOKED: 'var(--primary)', ATTENDED: 'var(--success)', CANCELLED: 'var(--danger)', NO_SHOW: 'var(--warning)' }

export default function BookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/members/${session.user.id}`).then(r => r.json()).then(d => {
      setBookings(d.bookings || [])
      setLoading(false)
    })
  }, [session])

  const now = new Date()
  const upcoming = bookings.filter(b => new Date(b.classDate) >= now && b.status === 'BOOKED')
  const past = bookings.filter(b => new Date(b.classDate) < now || b.status !== 'BOOKED')

  async function cancel(b: Booking) {
    await fetch(`/api/classes/${b.class}/book`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classDate: b.classDate }) })
    setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'CANCELLED' } : x))
  }

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 My Bookings</h1>
        <div className="tabs" style={{ width: 240 }}>
          <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</button>
          <button className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>History ({past.length})</button>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => <div key={i} className="card animate-pulse" style={{ height: 80 }} />)}
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📋</div>
            <p>{tab === 'upcoming' ? 'No upcoming bookings.' : 'No booking history yet.'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Date & Time</th>
                  <th>Trainer</th>
                  <th>Location</th>
                  <th>Status</th>
                  {tab === 'upcoming' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {list.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.class.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.class.classType}</div>
                    </td>
                    <td>
                      <div>{getDayName(new Date(b.classDate).getDay())}, {formatDate(b.classDate)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.class.startTime} – {b.class.endTime}</div>
                    </td>
                    <td>{b.class.trainer.name}</td>
                    <td>{b.class.location}</td>
                    <td>
                      <span className="badge" style={{ background: `${statusColors[b.status]}20`, color: statusColors[b.status] }}>{b.status}</span>
                    </td>
                    {tab === 'upcoming' && (
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => cancel(b)}>Cancel</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
