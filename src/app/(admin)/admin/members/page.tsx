'use client'
import { useEffect, useState } from 'react'
import { formatDate, formatCurrency, getInitials } from '@/lib/utils'

type Member = {
  id: string; name: string; email: string; phone?: string; createdAt: string
  subscription?: { status: string; plan: { name: string; price: number } }
  _count: { bookings: number; workoutLogs: number }
}

const planColors: Record<string,string> = { Basic: 'var(--success)', Pro: 'var(--primary)', Elite: 'var(--accent)' }

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch(`/api/members?search=${search}`).then(r => r.json()).then(d => { setMembers(d); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function deleteMember(id: string) {
    if (!confirm('Delete this member? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/members/${id}`, { method: 'DELETE' })
    setMembers(p => p.filter(m => m.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Member Management</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{members.length} members total</p>
        </div>
      </div>

      <div className="page-body">
        <div className="card mb-4">
          <div className="flex gap-3 items-center">
            <div className="search-wrapper flex-1">
              <span className="search-icon">🔍</span>
              <input className="form-input" placeholder="Search by name or email..." value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && load()} />
            </div>
            <button className="btn btn-primary" onClick={load}>Search</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Joined</th>
                <th>Bookings</th>
                <th>Workouts</th>
                <th>Monthly</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}><td colSpan={7}><div className="animate-pulse" style={{ height: 20, background: 'var(--surface-2)', borderRadius: 4 }} /></td></tr>
                ))
              ) : members.map(m => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">{getInitials(m.name)}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {m.subscription ? (
                      <span className="badge" style={{ background: `${planColors[m.subscription.plan.name] || 'var(--primary)'}20`, color: planColors[m.subscription.plan.name] || 'var(--primary)' }}>
                        {m.subscription.plan.name}
                      </span>
                    ) : <span className="badge badge-muted">No Plan</span>}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(m.createdAt)}</td>
                  <td style={{ fontWeight: 600 }}>{m._count.bookings}</td>
                  <td style={{ fontWeight: 600 }}>{m._count.workoutLogs}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                    {m.subscription ? formatCurrency(m.subscription.plan.price) : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => window.open(`/api/members/${m.id}`, '_blank')}>View</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteMember(m.id)} disabled={deleting === m.id}>
                        {deleting === m.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
