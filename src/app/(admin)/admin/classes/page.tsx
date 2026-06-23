'use client'
import { useEffect, useState } from 'react'
import { getDayName } from '@/lib/utils'

type FitnessClass = {
  id: string; name: string; classType: string; dayOfWeek: number
  startTime: string; endTime: string; capacity: number; location: string; isActive: boolean
  trainer: { name: string }
  _count: { bookings: number }
}
type Trainer = { id: string; name: string }

const typeColors: Record<string, string> = {
  HIIT: '#ff4787', Yoga: '#00e5a0', Strength: '#6c47ff', Cardio: '#ffa040', Pilates: '#00d4ff', Functional: '#a855f7', Circuit: '#f59e0b',
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<FitnessClass[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', classType: '', trainerId: '', dayOfWeek: '1', startTime: '09:00', endTime: '10:00', capacity: '20', location: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([fetch('/api/classes').then(r => r.json()), fetch('/api/trainers').then(r => r.json())])
      .then(([c, t]) => { setClasses(c); setTrainers(t); setLoading(false) })
  }, [])

  async function saveClass() {
    setSaving(true)
    const res = await fetch('/api/classes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, dayOfWeek: +form.dayOfWeek, capacity: +form.capacity }),
    })
    const data = await res.json()
    setClasses(p => [data, ...p])
    setShowForm(false)
    setSaving(false)
    setForm({ name: '', description: '', classType: '', trainerId: '', dayOfWeek: '1', startTime: '09:00', endTime: '10:00', capacity: '20', location: '' })
  }

  async function deactivate(id: string) {
    await fetch(`/api/classes/${id}`, { method: 'DELETE' })
    setClasses(p => p.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🗓️ Class Management</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{classes.length} active classes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Class</button>
      </div>

      <div className="page-body">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Class</th><th>Type</th><th>Day & Time</th><th>Trainer</th><th>Location</th><th>Capacity</th><th>Bookings</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? [1,2,3,4].map(i => <tr key={i}><td colSpan={8}><div className="animate-pulse" style={{ height: 20, background: 'var(--surface-2)', borderRadius: 4 }} /></td></tr>) :
              classes.map(cls => {
                const color = typeColors[cls.classType] || 'var(--primary)'
                const pct = Math.round((cls._count.bookings / cls.capacity) * 100)
                return (
                  <tr key={cls.id}>
                    <td style={{ fontWeight: 600 }}>{cls.name}</td>
                    <td><span className="badge" style={{ background: `${color}20`, color }}>{cls.classType}</span></td>
                    <td>
                      <div>{getDayName(cls.dayOfWeek)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cls.startTime} – {cls.endTime}</div>
                    </td>
                    <td>{cls.trainer.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{cls.location}</td>
                    <td>{cls.capacity}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cls._count.bookings}</span>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--danger)' : color }} />
                        </div>
                      </div>
                    </td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => deactivate(cls.id)}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Class</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Class Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Type</label>
                <input className="form-input" placeholder="HIIT, Yoga, Strength…" value={form.classType} onChange={e => setForm(p=>({...p,classType:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label>
              <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Trainer *</label>
                <select className="form-input" value={form.trainerId} onChange={e => setForm(p=>({...p,trainerId:e.target.value}))}>
                  <option value="">Select trainer</option>
                  {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select></div>
              <div className="form-group"><label className="form-label">Day of Week</label>
                <select className="form-input" value={form.dayOfWeek} onChange={e => setForm(p=>({...p,dayOfWeek:e.target.value}))}>
                  {[0,1,2,3,4,5,6].map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
                </select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
              {[['Start Time','startTime','time'],['End Time','endTime','time'],['Capacity','capacity','number'],['Location','location','text']].map(([l,k,t]) => (
                <div className="form-group" key={k}><label className="form-label">{l}</label>
                  <input className="form-input" type={t} value={(form as Record<string,string>)[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))} /></div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={saveClass} disabled={saving || !form.name || !form.trainerId}>
                {saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : '+ Create Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
