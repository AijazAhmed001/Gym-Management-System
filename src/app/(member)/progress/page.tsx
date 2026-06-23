'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatDate } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type Entry = { id: string; date: string; weight?: number; bodyFat?: number; chest?: number; waist?: number; hips?: number; bicep?: number }

export default function ProgressPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', bicep: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [metric, setMetric] = useState<'weight' | 'bodyFat' | 'waist'>('weight')

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/members/${session.user.id}/progress`).then(r => r.json()).then(d => { setEntries(d); setLoading(false) })
  }, [session])

  async function saveEntry() {
    if (!session?.user?.id) return
    setSaving(true)
    const res = await fetch(`/api/members/${session.user.id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString(),
        weight: form.weight ? +form.weight : null,
        bodyFat: form.bodyFat ? +form.bodyFat : null,
        chest: form.chest ? +form.chest : null,
        waist: form.waist ? +form.waist : null,
        hips: form.hips ? +form.hips : null,
        bicep: form.bicep ? +form.bicep : null,
        notes: form.notes,
      }),
    })
    const data = await res.json()
    setEntries(p => [...p, data])
    setShowForm(false)
    setSaving(false)
    setForm({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', bicep: '', notes: '' })
  }

  const chartData = entries.map(e => ({
    date: formatDate(e.date, 'MMM d'),
    weight: e.weight,
    bodyFat: e.bodyFat,
    waist: e.waist,
  }))

  const latest = entries[entries.length - 1]
  const first  = entries[0]
  const weightChange = latest?.weight && first?.weight ? (latest.weight - first.weight).toFixed(1) : null

  const metricLabels = { weight: 'Weight (kg)', bodyFat: 'Body Fat (%)', waist: 'Waist (cm)' }
  const metricColors = { weight: '#6c47ff', bodyFat: '#ff4787', waist: '#00e5a0' }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📈 Progress Tracker</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{entries.length} entries recorded</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Log Entry</button>
      </div>

      <div className="page-body">
        {/* Summary Cards */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
          {[
            { icon: '⚖️', label: 'Current Weight', value: latest?.weight ? `${latest.weight.toFixed(1)} kg` : '—', color: 'primary' },
            { icon: '🔥', label: 'Body Fat', value: latest?.bodyFat ? `${latest.bodyFat.toFixed(1)}%` : '—', color: 'accent' },
            { icon: '📏', label: 'Waist', value: latest?.waist ? `${latest.waist.toFixed(1)} cm` : '—', color: 'success' },
            { icon: '📉', label: 'Total Change', value: weightChange ? `${+weightChange > 0 ? '+' : ''}${weightChange} kg` : '—', color: 'warning' },
          ].map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <div className="kpi-icon" style={{ fontSize: '1.25rem' }}>{k.icon}</div>
              <div className="kpi-value" style={{ fontSize: '1.4rem' }}>{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Progress Chart</h2>
            <div className="tabs" style={{ width: 320 }}>
              {Object.entries(metricLabels).map(([k, v]) => (
                <button key={k} className={`tab ${metric === k ? 'active' : ''}`} onClick={() => setMetric(k as 'weight' | 'bodyFat' | 'waist')}>{v.split(' ')[0]}</button>
              ))}
            </div>
          </div>
          {loading ? <div style={{ height: 280, background: 'var(--surface-2)', borderRadius: 8 }} className="animate-pulse" /> : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
                  <Line type="monotone" dataKey={metric} stroke={metricColors[metric]} strokeWidth={2.5} dot={{ fill: metricColors[metric], strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="card">
          <h2 className="card-title mb-4">History</h2>
          {entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <p>No progress entries yet.</p>
              <button className="btn btn-primary mt-4" onClick={() => setShowForm(true)}>Log First Entry</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Date</th><th>Weight</th><th>Body Fat</th><th>Chest</th><th>Waist</th><th>Hips</th></tr></thead>
                <tbody>
                  {[...entries].reverse().map(e => (
                    <tr key={e.id}>
                      <td>{formatDate(e.date)}</td>
                      <td>{e.weight ? `${e.weight.toFixed(1)} kg` : '—'}</td>
                      <td>{e.bodyFat ? `${e.bodyFat.toFixed(1)}%` : '—'}</td>
                      <td>{e.chest ? `${e.chest.toFixed(1)} cm` : '—'}</td>
                      <td>{e.waist ? `${e.waist.toFixed(1)} cm` : '—'}</td>
                      <td>{e.hips ? `${e.hips.toFixed(1)} cm` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Log Progress Entry</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="form-row">
              {[['Weight (kg)', 'weight'], ['Body Fat (%)', 'bodyFat'], ['Chest (cm)', 'chest'], ['Waist (cm)', 'waist'], ['Hips (cm)', 'hips'], ['Bicep (cm)', 'bicep']].map(([label, key]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" type="number" step="0.1" value={(form as Record<string,string>)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={saveEntry} disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : '💾 Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
