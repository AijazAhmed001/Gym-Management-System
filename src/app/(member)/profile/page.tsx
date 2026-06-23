'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getInitials } from '@/lib/utils'

type Profile = { fitnessGoal?: string; fitnessLevel?: string; emergencyName?: string; emergencyPhone?: string }
type User = { id: string; name: string; email: string; phone?: string; gender?: string; address?: string; dateOfBirth?: string; profile?: Profile }

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', gender: '', address: '', fitnessGoal: '', fitnessLevel: '', emergencyName: '', emergencyPhone: '' })

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/members/${session.user.id}`).then(r => r.json()).then(d => {
      setUser(d)
      setForm({
        name: d.name || '', phone: d.phone || '', gender: d.gender || '', address: d.address || '',
        fitnessGoal: d.profile?.fitnessGoal || '', fitnessLevel: d.profile?.fitnessLevel || '',
        emergencyName: d.profile?.emergencyName || '', emergencyPhone: d.profile?.emergencyPhone || '',
      })
      setLoading(false)
    })
  }, [session])

  async function save() {
    if (!session?.user?.id) return
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/members/${session.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, phone: form.phone, gender: form.gender, address: form.address,
        profile: { fitnessGoal: form.fitnessGoal, fitnessLevel: form.fitnessLevel, emergencyName: form.emergencyName, emergencyPhone: form.emergencyPhone },
      }),
    })
    if (res.ok) setMsg('✅ Profile updated successfully!')
    else setMsg('❌ Failed to update profile.')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div style={{ padding: '2rem' }}><div className="card animate-pulse" style={{ height: 300 }} /></div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👤 Profile Settings</h1>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : '💾 Save Changes'}
        </button>
      </div>
      <div className="page-body">
        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

        <div className="profile-grid">
          {/* Avatar Card */}
          <div>
            <div className="card text-center">
              <div className="avatar avatar-xl" style={{ margin: '0 auto 1rem' }}>{getInitials(user?.name || 'U')}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{user?.email}</div>
              <div className="badge badge-primary mt-3" style={{ margin: '0.75rem auto 0' }}>MEMBER</div>
              <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                <div className="flex gap-2 mb-2"><span>📧</span><span>{user?.email}</span></div>
                {user?.phone && <div className="flex gap-2 mb-2"><span>📱</span><span>{user.phone}</span></div>}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h2 className="card-title mb-4">Personal Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                    <option value="">Prefer not to say</option>
                    <option>Male</option><option>Female</option><option>Non-binary</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fitness Level</label>
                  <select className="form-input" value={form.fitnessLevel} onChange={e => setForm(p => ({ ...p, fitnessLevel: e.target.value }))}>
                    <option value="">Select level</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Fitness Goal</label>
                <textarea className="form-input" rows={2} value={form.fitnessGoal} onChange={e => setForm(p => ({ ...p, fitnessGoal: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
            </div>

            <div className="card">
              <h2 className="card-title mb-4">🚨 Emergency Contact</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input className="form-input" value={form.emergencyName} onChange={e => setForm(p => ({ ...p, emergencyName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input className="form-input" value={form.emergencyPhone} onChange={e => setForm(p => ({ ...p, emergencyPhone: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
