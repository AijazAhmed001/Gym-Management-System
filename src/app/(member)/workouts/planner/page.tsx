'use client'
import { useState, useMemo } from 'react'

// ── Exercise Database ───────────────────────────────────────────────────────
const EXERCISE_DB = [
  // Chest
  { id:'e1',  name:'Bench Press',         muscle:'Chest',     equipment:'Barbell',    difficulty:'Intermediate', type:'Strength',   icon:'🏋️', sets:4, reps:'8-10', rest:'90s' },
  { id:'e2',  name:'Incline Dumbbell Press',muscle:'Chest',   equipment:'Dumbbell',   difficulty:'Intermediate', type:'Strength',   icon:'🏋️', sets:3, reps:'10-12',rest:'75s' },
  { id:'e3',  name:'Push-Ups',             muscle:'Chest',    equipment:'Bodyweight', difficulty:'Beginner',     type:'Strength',   icon:'💪', sets:3, reps:'15-20',rest:'60s' },
  { id:'e4',  name:'Cable Fly',            muscle:'Chest',    equipment:'Cable',      difficulty:'Intermediate', type:'Isolation',  icon:'🔗', sets:3, reps:'12-15',rest:'60s' },
  { id:'e5',  name:'Dips',                 muscle:'Chest',    equipment:'Bodyweight', difficulty:'Intermediate', type:'Strength',   icon:'💪', sets:3, reps:'10-15',rest:'75s' },
  // Back
  { id:'e6',  name:'Deadlift',             muscle:'Back',     equipment:'Barbell',    difficulty:'Advanced',     type:'Strength',   icon:'🏋️', sets:4, reps:'5-6',  rest:'120s' },
  { id:'e7',  name:'Pull-Ups',             muscle:'Back',     equipment:'Bodyweight', difficulty:'Intermediate', type:'Strength',   icon:'💪', sets:4, reps:'6-10', rest:'90s' },
  { id:'e8',  name:'Bent-Over Row',        muscle:'Back',     equipment:'Barbell',    difficulty:'Intermediate', type:'Strength',   icon:'🏋️', sets:4, reps:'8-10', rest:'90s' },
  { id:'e9',  name:'Lat Pulldown',         muscle:'Back',     equipment:'Cable',      difficulty:'Beginner',     type:'Strength',   icon:'🔗', sets:3, reps:'10-12',rest:'75s' },
  { id:'e10', name:'Seated Cable Row',     muscle:'Back',     equipment:'Cable',      difficulty:'Beginner',     type:'Strength',   icon:'🔗', sets:3, reps:'10-12',rest:'75s' },
  // Legs
  { id:'e11', name:'Squat',               muscle:'Legs',      equipment:'Barbell',    difficulty:'Intermediate', type:'Strength',   icon:'🏋️', sets:5, reps:'5',    rest:'120s' },
  { id:'e12', name:'Romanian Deadlift',   muscle:'Legs',      equipment:'Barbell',    difficulty:'Intermediate', type:'Strength',   icon:'🏋️', sets:3, reps:'8-10', rest:'90s' },
  { id:'e13', name:'Leg Press',           muscle:'Legs',      equipment:'Machine',    difficulty:'Beginner',     type:'Strength',   icon:'🔩', sets:4, reps:'10-12',rest:'90s' },
  { id:'e14', name:'Lunges',              muscle:'Legs',      equipment:'Dumbbell',   difficulty:'Beginner',     type:'Strength',   icon:'🚶', sets:3, reps:'12 each',rest:'75s'},
  { id:'e15', name:'Calf Raises',         muscle:'Legs',      equipment:'Bodyweight', difficulty:'Beginner',     type:'Isolation',  icon:'👣', sets:4, reps:'15-20',rest:'60s' },
  { id:'e16', name:'Box Jumps',           muscle:'Legs',      equipment:'Bodyweight', difficulty:'Intermediate', type:'Cardio',     icon:'📦', sets:3, reps:'8-10', rest:'90s' },
  // Shoulders
  { id:'e17', name:'Overhead Press',      muscle:'Shoulders', equipment:'Barbell',    difficulty:'Intermediate', type:'Strength',   icon:'🏋️', sets:4, reps:'6-8',  rest:'90s' },
  { id:'e18', name:'Lateral Raise',       muscle:'Shoulders', equipment:'Dumbbell',   difficulty:'Beginner',     type:'Isolation',  icon:'🏃', sets:3, reps:'12-15',rest:'60s' },
  { id:'e19', name:'Face Pull',           muscle:'Shoulders', equipment:'Cable',      difficulty:'Beginner',     type:'Isolation',  icon:'🔗', sets:3, reps:'15-20',rest:'60s' },
  { id:'e20', name:'Arnold Press',        muscle:'Shoulders', equipment:'Dumbbell',   difficulty:'Intermediate', type:'Strength',   icon:'💪', sets:3, reps:'10-12',rest:'75s' },
  // Arms
  { id:'e21', name:'Barbell Curl',        muscle:'Arms',      equipment:'Barbell',    difficulty:'Beginner',     type:'Isolation',  icon:'💪', sets:3, reps:'10-12',rest:'60s' },
  { id:'e22', name:'Tricep Pushdown',     muscle:'Arms',      equipment:'Cable',      difficulty:'Beginner',     type:'Isolation',  icon:'🔗', sets:3, reps:'12-15',rest:'60s' },
  { id:'e23', name:'Hammer Curl',         muscle:'Arms',      equipment:'Dumbbell',   difficulty:'Beginner',     type:'Isolation',  icon:'🔨', sets:3, reps:'10-12',rest:'60s' },
  { id:'e24', name:'Skull Crushers',      muscle:'Arms',      equipment:'Barbell',    difficulty:'Intermediate', type:'Isolation',  icon:'💀', sets:3, reps:'10-12',rest:'75s' },
  { id:'e25', name:'Chin-Ups',            muscle:'Arms',      equipment:'Bodyweight', difficulty:'Intermediate', type:'Strength',   icon:'💪', sets:3, reps:'6-10', rest:'90s' },
  // Core
  { id:'e26', name:'Plank',               muscle:'Core',      equipment:'Bodyweight', difficulty:'Beginner',     type:'Endurance',  icon:'🧘', sets:3, reps:'60s',  rest:'60s' },
  { id:'e27', name:'Crunches',            muscle:'Core',      equipment:'Bodyweight', difficulty:'Beginner',     type:'Isolation',  icon:'🤸', sets:3, reps:'20-25',rest:'45s' },
  { id:'e28', name:'Hanging Leg Raise',   muscle:'Core',      equipment:'Bodyweight', difficulty:'Intermediate', type:'Isolation',  icon:'🏃', sets:3, reps:'12-15',rest:'60s' },
  { id:'e29', name:'Russian Twists',      muscle:'Core',      equipment:'Bodyweight', difficulty:'Beginner',     type:'Isolation',  icon:'🔄', sets:3, reps:'20 each',rest:'45s'},
  { id:'e30', name:'Cable Crunch',        muscle:'Core',      equipment:'Cable',      difficulty:'Beginner',     type:'Isolation',  icon:'🔗', sets:3, reps:'15-20',rest:'60s' },
  // Cardio
  { id:'e31', name:'Treadmill Run',       muscle:'Full Body', equipment:'Machine',    difficulty:'Beginner',     type:'Cardio',     icon:'🏃', sets:1, reps:'20-30 min',rest:'-' },
  { id:'e32', name:'Burpees',             muscle:'Full Body', equipment:'Bodyweight', difficulty:'Intermediate', type:'Cardio',     icon:'⚡', sets:4, reps:'10-15',rest:'60s' },
  { id:'e33', name:'Jump Rope',           muscle:'Full Body', equipment:'Other',      difficulty:'Beginner',     type:'Cardio',     icon:'🪢', sets:5, reps:'2 min', rest:'60s' },
  { id:'e34', name:'Mountain Climbers',   muscle:'Full Body', equipment:'Bodyweight', difficulty:'Beginner',     type:'Cardio',     icon:'⛰️', sets:3, reps:'40s',  rest:'30s' },
  { id:'e35', name:'Battle Ropes',        muscle:'Full Body', equipment:'Other',      difficulty:'Intermediate', type:'Cardio',     icon:'〰️', sets:4, reps:'30s',  rest:'60s' },
  // Flexibility
  { id:'e36', name:'Hip Flexor Stretch',  muscle:'Legs',      equipment:'Bodyweight', difficulty:'Beginner',     type:'Flexibility',icon:'🧘', sets:2, reps:'60s each',rest:'30s'},
  { id:'e37', name:'Foam Rolling',        muscle:'Full Body', equipment:'Other',      difficulty:'Beginner',     type:'Flexibility',icon:'🟥', sets:1, reps:'10 min',rest:'-' },
  { id:'e38', name:'Cat-Cow Stretch',     muscle:'Core',      equipment:'Bodyweight', difficulty:'Beginner',     type:'Flexibility',icon:'🐱', sets:2, reps:'15 reps',rest:'30s'},
]

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const MUSCLES = ['All','Chest','Back','Legs','Shoulders','Arms','Core','Full Body']
const EQUIPMENT = ['All','Barbell','Dumbbell','Bodyweight','Cable','Machine','Other']
const DIFFICULTIES = ['All','Beginner','Intermediate','Advanced']
const TYPES = ['All','Strength','Isolation','Cardio','Endurance','Flexibility']

const MUSCLE_COLORS: Record<string,string> = {
  Chest:'#7c5cfc', Back:'#14b8a6', Legs:'#f59e0b', Shoulders:'#f472b6',
  Arms:'#38bdf8', Core:'#fb7185', 'Full Body':'#a78bfa'
}
const DIFF_COLORS: Record<string,string> = { Beginner:'#10b981', Intermediate:'#f59e0b', Advanced:'#ef4444' }
const TYPE_COLORS: Record<string,string> = {
  Strength:'#7c5cfc', Isolation:'#14b8a6', Cardio:'#fb7185', Endurance:'#f59e0b', Flexibility:'#a78bfa'
}

type Exercise = typeof EXERCISE_DB[number]
type PlannedExercise = Exercise & { customSets?: number; customReps?: string; note?: string }
type WeekPlan = Record<string, PlannedExercise[]>

const DEFAULT_PLAN: WeekPlan = { Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[], Saturday:[], Sunday:[] }

export default function WorkoutPlannerPage() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(DEFAULT_PLAN)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [search, setSearch] = useState('')
  const [filterMuscle, setFilterMuscle] = useState('All')
  const [filterEquip, setFilterEquip] = useState('All')
  const [filterDiff, setFilterDiff] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [tab, setTab] = useState<'library'|'planner'|'custom'>('planner')
  const [showAdd, setShowAdd] = useState(false)
  const [customExercise, setCustomExercise] = useState({ name:'', muscle:'Chest', equipment:'Bodyweight', difficulty:'Beginner', type:'Strength', sets:3, reps:'10', note:'' })
  const [saved, setSaved] = useState(false)

  const filtered = useMemo(() =>
    EXERCISE_DB.filter(e =>
      (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.muscle.toLowerCase().includes(search.toLowerCase())) &&
      (filterMuscle === 'All' || e.muscle === filterMuscle) &&
      (filterEquip === 'All' || e.equipment === filterEquip) &&
      (filterDiff === 'All' || e.difficulty === filterDiff) &&
      (filterType === 'All' || e.type === filterType)
    ), [search, filterMuscle, filterEquip, filterDiff, filterType])

  function addToDay(ex: Exercise) {
    setWeekPlan(p => ({ ...p, [selectedDay]: [...p[selectedDay], { ...ex }] }))
  }

  function removeFromDay(day: string, idx: number) {
    setWeekPlan(p => ({ ...p, [day]: p[day].filter((_,i) => i !== idx) }))
  }

  function isInDay(exId: string) {
    return weekPlan[selectedDay].some(e => e.id === exId)
  }

  function savePlan() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function addCustom() {
    if (!customExercise.name.trim()) return
    const custom: Exercise = {
      id: `custom-${Date.now()}`,
      name: customExercise.name,
      muscle: customExercise.muscle,
      equipment: customExercise.equipment,
      difficulty: customExercise.difficulty,
      type: customExercise.type,
      icon: '⭐',
      sets: customExercise.sets,
      reps: customExercise.reps,
      rest: '60s'
    }
    setWeekPlan(p => ({ ...p, [selectedDay]: [...p[selectedDay], custom] }))
    setCustomExercise({ name:'', muscle:'Chest', equipment:'Bodyweight', difficulty:'Beginner', type:'Strength', sets:3, reps:'10', note:'' })
    setTab('planner')
  }

  const totalExercises = Object.values(weekPlan).reduce((sum,day) => sum + day.length, 0)
  const activeDays = Object.values(weekPlan).filter(d => d.length > 0).length
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--text)' }}>💪 Workout Planner</h1>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Design your weekly training schedule</p>
        </div>
        <div className="flex gap-3 items-center">
          {saved && <span className="badge badge-success" style={{ padding:'0.375rem 0.875rem', fontSize:'0.8rem' }}>✓ Plan Saved!</span>}
          <button className="btn btn-primary btn-sm" onClick={savePlan}>💾 Save Plan</button>
        </div>
      </div>

      <div className="page-body">
        {/* Hero Banner */}
        <div className="hero-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
          <div style={{ position:'absolute', width:180, height:180, top:-60, right:80, background:'rgba(255,255,255,0.08)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', width:100, height:100, bottom:-40, right:200, background:'rgba(255,255,255,0.06)', borderRadius:'50%' }} />
          <div style={{ position:'relative' }}>
            <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#fff', marginBottom:'0.375rem' }}>Your Training Week</h2>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.875rem' }}>Build, customize and track your perfect workout schedule</p>
          </div>
          <div style={{ display:'flex', gap:'1.5rem', position:'relative' }}>
            {[
              { label:'Total Exercises', val: totalExercises, icon:'🏋️' },
              { label:'Training Days',   val: activeDays,     icon:'📅' },
              { label:'Rest Days',       val: 7 - activeDays, icon:'😴' },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem' }}>{s.icon}</div>
                <div style={{ fontSize:'1.75rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.65)', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Calendar Strip */}
        <div className="card mb-6" style={{ padding:'1rem 1.25rem' }}>
          <div className="schedule-grid">
            {DAYS.map((day, i) => {
              const count = weekPlan[day].length
              const isToday = day === today
              const isSelected = day === selectedDay
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding:'0.625rem 0.25rem',
                    borderRadius:'var(--radius)',
                    border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-light)',
                    background: isSelected ? 'var(--primary-dim)' : isToday ? 'var(--surface-3)' : 'var(--surface)',
                    cursor:'pointer', transition:'all 0.18s',
                    textAlign:'center'
                  }}
                >
                  <div style={{ fontSize:'0.7rem', fontWeight:700, color: isSelected ? 'var(--primary)' : 'var(--text-faint)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{DAY_SHORT[i]}</div>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, color: isToday ? 'var(--primary)' : 'var(--text-muted)', marginTop:2 }}>{isToday ? 'Today' : ''}</div>
                  <div style={{ marginTop:'0.375rem' }}>
                    {count > 0 ? (
                      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:22, height:22, borderRadius:'50%', background:'var(--primary)', color:'#fff', fontSize:'0.7rem', fontWeight:700 }}>{count}</span>
                    ) : (
                      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:22, height:22, borderRadius:'50%', background:'var(--surface-3)', color:'var(--text-faint)', fontSize:'0.7rem' }}>—</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Layout: Left = Day Plan, Right = Exercise Library */}
        <div className="planner-split" style={{ alignItems:'start' }}>

          {/* LEFT — Day Plan */}
          <div className="section-card">
            <div className="section-header">
              <div>
                <h3 style={{ fontWeight:700, fontSize:'1rem', color:'var(--text)' }}>📅 {selectedDay}</h3>
                <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{weekPlan[selectedDay].length} exercises planned</p>
              </div>
              <button className="btn btn-soft btn-sm" onClick={() => { setTab('custom'); setShowAdd(true) }}>+ Custom</button>
            </div>

            <div style={{ padding:'1rem', minHeight:300 }}>
              {weekPlan[selectedDay].length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏋️</div>
                  <div className="empty-title">No exercises yet</div>
                  <div className="empty-desc">Browse the library and add exercises to {selectedDay}</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {weekPlan[selectedDay].map((ex, idx) => (
                    <div key={idx} className="workout-pill">
                      <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', flex:1, minWidth:0 }}>
                        <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{ex.icon}</span>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontWeight:600, fontSize:'0.82rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ex.name}</div>
                          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{ex.sets} sets × {ex.reps} · {ex.rest} rest</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.375rem', flexShrink:0 }}>
                        <span className="badge" style={{ background:`${MUSCLE_COLORS[ex.muscle] || 'var(--primary)'}15`, color:MUSCLE_COLORS[ex.muscle] || 'var(--primary)', fontSize:'0.65rem' }}>{ex.muscle}</span>
                        <button
                          onClick={() => removeFromDay(selectedDay, idx)}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--danger)', fontSize:'1rem', padding:'2px', lineHeight:1 }}
                          title="Remove"
                        >✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Week Overview */}
            <div style={{ borderTop:'1px solid var(--border-light)', padding:'1rem' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>Week Overview</div>
              {DAYS.map(day => (
                <div key={day} onClick={() => setSelectedDay(day)}
                  style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.375rem', cursor:'pointer', padding:'0.375rem 0.5rem', borderRadius:'var(--radius-sm)', background: selectedDay === day ? 'var(--primary-soft)' : 'transparent', transition:'background 0.15s' }}>
                  <span style={{ fontSize:'0.75rem', fontWeight:600, color: selectedDay === day ? 'var(--primary)' : 'var(--text-muted)', width:32 }}>{day.slice(0,3)}</span>
                  <div style={{ flex:1, height:6, borderRadius:999, background:'var(--surface-3)', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min((weekPlan[day].length / 8) * 100, 100)}%`, background:'var(--grad-primary)', borderRadius:999 }} />
                  </div>
                  <span style={{ fontSize:'0.7rem', color:'var(--text-faint)', width:20, textAlign:'right' }}>{weekPlan[day].length}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Exercise Library + Custom Form */}
          <div className="section-card">
            <div className="section-header">
              <div className="tabs" style={{ flex:1 }}>
                <button className={`tab ${tab === 'planner' || tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>📚 Exercise Library</button>
                <button className={`tab ${tab === 'custom' ? 'active' : ''}`} onClick={() => setTab('custom')}>⭐ Create Custom</button>
              </div>
            </div>

            {tab === 'custom' ? (
              /* Custom Exercise Form */
              <div style={{ padding:'1.5rem' }}>
                <div style={{ marginBottom:'1.25rem' }}>
                  <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.25rem' }}>⭐ Create Your Exercise</h3>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Design a custom exercise and add it to {selectedDay}</p>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Exercise Name *</label>
                    <input className="form-input" placeholder="e.g. Bulgarian Split Squat" value={customExercise.name} onChange={e => setCustomExercise(p => ({ ...p, name:e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Muscle Group</label>
                    <select className="form-input" value={customExercise.muscle} onChange={e => setCustomExercise(p => ({ ...p, muscle:e.target.value }))}>
                      {MUSCLES.filter(m => m !== 'All').map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Equipment</label>
                    <select className="form-input" value={customExercise.equipment} onChange={e => setCustomExercise(p => ({ ...p, equipment:e.target.value }))}>
                      {EQUIPMENT.filter(m => m !== 'All').map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select className="form-input" value={customExercise.difficulty} onChange={e => setCustomExercise(p => ({ ...p, difficulty:e.target.value }))}>
                      {DIFFICULTIES.filter(m => m !== 'All').map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-input" value={customExercise.type} onChange={e => setCustomExercise(p => ({ ...p, type:e.target.value }))}>
                      {TYPES.filter(m => m !== 'All').map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sets</label>
                    <input type="number" className="form-input" min={1} max={10} value={customExercise.sets} onChange={e => setCustomExercise(p => ({ ...p, sets:+e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reps / Duration</label>
                    <input className="form-input" placeholder="e.g. 10-12 or 60s" value={customExercise.reps} onChange={e => setCustomExercise(p => ({ ...p, reps:e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Notes (optional)</label>
                    <input className="form-input" placeholder="Technique cues, focus points..." value={customExercise.note} onChange={e => setCustomExercise(p => ({ ...p, note:e.target.value }))} />
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button className="btn btn-outline flex-1" onClick={() => setTab('library')}>← Back to Library</button>
                  <button className="btn btn-primary flex-1" onClick={addCustom} disabled={!customExercise.name.trim()}>
                    + Add to {selectedDay}
                  </button>
                </div>
              </div>
            ) : (
              /* Exercise Library */
              <div>
                {/* Search */}
                <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border-light)' }}>
                  <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input className="form-input" placeholder="Search exercises, muscles..." value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius:'var(--radius-sm)' }} />
                  </div>
                </div>

                {/* Filters */}
                <div style={{ padding:'0.875rem 1.25rem', borderBottom:'1px solid var(--border-light)', background:'var(--surface-2)' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
                    <div>
                      <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.375rem' }}>💪 Muscle</div>
                      <div className="filter-bar">
                        {MUSCLES.map(m => (
                          <button key={m} className={`filter-chip ${filterMuscle === m ? 'active' : ''}`} onClick={() => setFilterMuscle(m)}>
                            {m === 'All' ? 'All' : m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.625rem' }}>
                      <div>
                        <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.375rem' }}>🔑 Difficulty</div>
                        <div className="filter-bar">
                          {DIFFICULTIES.map(d => <button key={d} className={`filter-chip ${filterDiff === d ? 'active' : ''}`} onClick={() => setFilterDiff(d)}>{d}</button>)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.375rem' }}>🏷️ Type</div>
                        <div className="filter-bar">
                          {TYPES.map(t => <button key={t} className={`filter-chip ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>{t}</button>)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.375rem' }}>⚙️ Equipment</div>
                      <div className="filter-bar">
                        {EQUIPMENT.map(eq => <button key={eq} className={`filter-chip ${filterEquip === eq ? 'active' : ''}`} onClick={() => setFilterEquip(eq)}>{eq}</button>)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results count */}
                <div style={{ padding:'0.625rem 1.25rem', fontSize:'0.78rem', color:'var(--text-muted)', borderBottom:'1px solid var(--border-light)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span><strong style={{ color:'var(--primary)' }}>{filtered.length}</strong> exercises found</span>
                  <span>Adding to: <strong style={{ color:'var(--primary)' }}>{selectedDay}</strong></span>
                </div>

                {/* Exercise List */}
                <div style={{ maxHeight:420, overflowY:'auto', padding:'0.75rem' }}>
                  {filtered.length === 0 ? (
                    <div className="empty-state" style={{ padding:'2rem' }}>
                      <div className="empty-icon">🔍</div>
                      <div className="empty-title">No exercises found</div>
                      <div className="empty-desc">Try different filters</div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                      {filtered.map(ex => {
                        const inDay = isInDay(ex.id)
                        const muscleColor = MUSCLE_COLORS[ex.muscle] || 'var(--primary)'
                        const diffColor = DIFF_COLORS[ex.difficulty] || 'var(--text-muted)'
                        return (
                          <div key={ex.id} className={`exercise-card ${inDay ? 'selected' : ''}`}
                            onClick={() => !inDay ? addToDay(ex) : null}
                          >
                            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                              <span style={{ fontSize:'1.4rem', flexShrink:0, width:36, textAlign:'center' }}>{ex.icon}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem', flexWrap:'wrap' }}>
                                  <span style={{ fontWeight:700, fontSize:'0.875rem' }}>{ex.name}</span>
                                  {inDay && <span style={{ fontSize:'0.68rem', background:'var(--success-dim)', color:'var(--success)', padding:'1px 6px', borderRadius:999, fontWeight:700 }}>✓ Added</span>}
                                </div>
                                <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                                  <span style={{ fontSize:'0.68rem', padding:'1px 7px', borderRadius:999, background:`${muscleColor}15`, color:muscleColor, fontWeight:600 }}>{ex.muscle}</span>
                                  <span style={{ fontSize:'0.68rem', padding:'1px 7px', borderRadius:999, background:`${diffColor}15`, color:diffColor, fontWeight:600 }}>{ex.difficulty}</span>
                                  <span style={{ fontSize:'0.68rem', padding:'1px 7px', borderRadius:999, background:'var(--surface-3)', color:'var(--text-muted)', fontWeight:600 }}>{ex.equipment}</span>
                                  <span style={{ fontSize:'0.68rem', padding:'1px 7px', borderRadius:999, background:`${TYPE_COLORS[ex.type] || 'var(--primary)'}15`, color:TYPE_COLORS[ex.type] || 'var(--primary)', fontWeight:600 }}>{ex.type}</span>
                                </div>
                              </div>
                              <div style={{ textAlign:'right', flexShrink:0 }}>
                                <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--primary)' }}>{ex.sets}×{ex.reps}</div>
                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{ex.rest}</div>
                                {!inDay && (
                                  <button
                                    className="btn btn-soft btn-sm"
                                    style={{ marginTop:'0.375rem', padding:'0.25rem 0.625rem', fontSize:'0.72rem' }}
                                    onClick={(e) => { e.stopPropagation(); addToDay(ex) }}
                                  >+ Add</button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
