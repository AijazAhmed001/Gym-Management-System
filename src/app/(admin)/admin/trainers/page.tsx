'use client'
import { useEffect, useState } from 'react'
import { getDayName, parseArray } from '@/lib/utils'

type Trainer = { id: string; name: string; email: string; phone?: string; bio?: string; specializations: string; experience: number; isActive: boolean; _count?: { classes: number } }

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '', specializations: '', experience: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/trainers').then(r => r.json()).then(d => { setTrainers(d); setLoading(false) })
  }, [])

  async function saveTrainer() {
    setSaving(true)
    const specs = form.specializations.split(',').map(s => s.trim()).filter(Boolean)
    const res = await fetch('/api/trainers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, specializations: JSON.stringify(specs), experience: +form.experience }),
    })
    const data = await res.json()
    setTrainers(p => [data, ...p])
    setShowForm(false)
    setSaving(false)
    setForm({ name: '', email: '', phone: '', bio: '', specializations: '', experience: '' })
  }

  async function deactivate(id: string) {
    await fetch(`/api/trainers/${id}`, { method: 'DELETE' })
    setTrainers(p => p.filter(t => t.id !== id))
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#6c47ff','#ff4787','#00e5a0','#ffa040','#00d4ff']

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🏋️ Trainer Management</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{trainers.length} active trainers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Trainer</button>
      </div>

      <div className="page-body">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {[1,2,3].map(i => <div key={i} className="card animate-pulse" style={{ height: 240 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {trainers.map((t, i) => {
              const specs = parseArray(t.specializations)
              const color = colors[i % colors.length]
              return (
                <div key={t.id} className="trainer-card">
                  <div className="trainer-avatar" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 0 20px ${color}40` }}>
                    {getInitials(t.name)}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: '1rem' }}>
                    {t.experience} years exp · {t._count?.classes || 0} classes
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    {specs.slice(0,3).map((s, si) => (
                      <span key={si} className="badge badge-muted" style={{ fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>
                  {t.bio && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'left' }}>{t.bio.slice(0, 100)}…</p>}
                  <button className="btn btn-danger btn-sm btn-full" onClick={() => deactivate(t.id)}>Deactivate</button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Trainer</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Years Experience</label>
                <input className="form-input" type="number" value={form.experience} onChange={e => setForm(p=>({...p,experience:e.target.value}))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Specializations (comma-separated)</label>
              <input className="form-input" placeholder="Yoga, HIIT, Strength" value={form.specializations} onChange={e => setForm(p=>({...p,specializations:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows={3} value={form.bio} onChange={e => setForm(p=>({...p,bio:e.target.value}))} />
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={saveTrainer} disabled={saving || !form.name || !form.email}>
                {saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : '+ Add Trainer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
