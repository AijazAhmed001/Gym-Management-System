'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatDate } from '@/lib/utils'

type Exercise = { name: string; sets?: number; reps?: number; weight?: number; notes?: string }
type WorkoutLog = { id: string; title: string; date: string; duration?: number; notes?: string; exercises: Exercise[] }

export default function WorkoutsPage() {
  const { data: session } = useSession()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', duration: '', notes: '' })
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/members/${session.user.id}/workouts`).then(r => r.json()).then(d => { setLogs(d); setLoading(false) })
  }, [session])

  function addExercise() { setExercises(p => [...p, { name: '', sets: '', reps: '', weight: '' }]) }
  function updateEx(i: number, f: string, v: string) { setExercises(p => p.map((e, idx) => idx === i ? { ...e, [f]: v } : e)) }
  function removeEx(i: number) { setExercises(p => p.filter((_, idx) => idx !== i)) }

  async function saveWorkout() {
    if (!session?.user?.id || !form.title) return
    setSaving(true)
    const res = await fetch(`/api/members/${session.user.id}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        date: new Date().toISOString(),
        duration: form.duration ? +form.duration : null,
        notes: form.notes,
        exercises: exercises.filter(e => e.name).map(e => ({
          name: e.name, sets: e.sets ? +e.sets : null, reps: e.reps ? +e.reps : null, weight: e.weight ? +e.weight : null,
        })),
      }),
    })
    const data = await res.json()
    setLogs(p => [data, ...p])
    setForm({ title: '', duration: '', notes: '' })
    setExercises([{ name: '', sets: '', reps: '', weight: '' }])
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">💪 Workout Tracker</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{logs.length} sessions logged</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Log Workout</button>
      </div>

      <div className="page-body">
        {/* Stats row */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
          {[
            { icon: '🗓️', label: 'Total Sessions', value: logs.length, color: 'primary' },
            { icon: '⏱️', label: 'Avg Duration', value: logs.filter(l => l.duration).length ? `${Math.round(logs.filter(l=>l.duration).reduce((a,l)=>a+(l.duration||0),0)/logs.filter(l=>l.duration).length)}m` : '—', color: 'success' },
            { icon: '🏋️', label: 'Total Exercises', value: logs.reduce((a,l)=>a+l.exercises.length,0), color: 'accent' },
          ].map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <div className="kpi-icon" style={{ fontSize: '1.25rem' }}>{k.icon}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => <div key={i} className="card animate-pulse" style={{ height: 80 }} />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">💪</div>
            <p>No workouts logged yet.</p>
            <button className="btn btn-primary mt-4" onClick={() => setShowForm(true)}>Log Your First Workout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.map(log => (
              <div key={log.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div style={{ width: 44, height: 44, background: 'var(--primary-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🏋️</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{log.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(log.date)} · {log.exercises.length} exercises{log.duration ? ` · ${log.duration}min` : ''}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1rem', color: 'var(--text-faint)', transition: 'transform 0.2s', transform: expanded === log.id ? 'rotate(180deg)' : '' }}>▼</span>
                </div>
                {expanded === log.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    {log.notes && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{log.notes}</p>}
                    <div className="table-wrapper">
                      <table>
                        <thead><tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th></tr></thead>
                        <tbody>
                          {log.exercises.map((ex, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 500 }}>{ex.name}</td>
                              <td>{ex.sets ?? '—'}</td>
                              <td>{ex.reps ?? '—'}</td>
                              <td>{ex.weight ? `${ex.weight}kg` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Log Workout</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Workout Title *</label>
                <input className="form-input" placeholder="e.g. Push Day" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (min)</label>
                <input className="form-input" type="number" placeholder="60" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={2} placeholder="How did it feel?" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Exercises</label>
              <button className="btn btn-ghost btn-sm" onClick={addExercise}>+ Add Exercise</button>
            </div>
            {exercises.map((ex, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input className="form-input" placeholder="Exercise name" value={ex.name} onChange={e => updateEx(i, 'name', e.target.value)} />
                <input className="form-input" type="number" placeholder="Sets" value={ex.sets} onChange={e => updateEx(i, 'sets', e.target.value)} />
                <input className="form-input" type="number" placeholder="Reps" value={ex.reps} onChange={e => updateEx(i, 'reps', e.target.value)} />
                <input className="form-input" type="number" placeholder="kg" value={ex.weight} onChange={e => updateEx(i, 'weight', e.target.value)} />
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeEx(i)}>✕</button>
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <button className="btn btn-outline flex-1" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={saveWorkout} disabled={saving || !form.title}>
                {saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : '💾 Save Workout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
