import { useState } from 'react'

interface Props {
  onNext: () => void
}

type Status = 'Complete' | 'In Progress' | 'Not Started' | 'Overdue'

interface Reviewer {
  id: string
  initial: string
  avatarColor: string
  name: string
  role: string
  sections: string
  status: Status
  progress: number
  comments: number
  action: { label: string; kind: 'view' | 'nudge' | 'reminder' | 'escalate' } | null
}

const reviewers: Reviewer[] = [
  { id: 'raj', initial: 'D', avatarColor: '#d98c26', name: 'Dr. Raj Patel', role: 'Biostatistician', sections: 'Sec 11, 12, 14', status: 'Complete', progress: 100, comments: 12, action: { label: 'View Report', kind: 'view' } },
  { id: 'lisa', initial: 'L', avatarColor: '#269973', name: 'Lisa Chen', role: 'Regulatory Affairs', sections: 'Sec 1, 2, 15, 16', status: 'In Progress', progress: 60, comments: 8, action: { label: 'Send Nudge', kind: 'nudge' } },
  { id: 'maria', initial: 'M', avatarColor: '#9b59d4', name: 'Maria Santos', role: 'Pharmacovig.', sections: 'Sec 12.3, 13', status: 'Not Started', progress: 0, comments: 0, action: { label: 'Send Reminder', kind: 'reminder' } },
  { id: 'tom', initial: 'T', avatarColor: '#3b82f6', name: 'Tom Bradley', role: 'Data Mgmt', sections: 'Sec 11, 14.2', status: 'Overdue', progress: 30, comments: 7, action: { label: '● Escalate', kind: 'escalate' } },
]

const statusFilters: Array<'All' | Status> = ['All', 'Complete', 'In Progress', 'Not Started', 'Overdue']

const statusClass: Record<Status, string> = {
  Complete: 'status--green',
  'In Progress': 'status--orange',
  'Not Started': 'status--muted',
  Overdue: 'status--red',
}

const sectionProgress = [
  { name: 'Sec 1-2', pct: 100, color: 'green' },
  { name: 'Sec 11', pct: 75, color: 'green' },
  { name: 'Sec 12', pct: 40, color: 'orange' },
  { name: 'Sec 13', pct: 0, color: 'gray' },
  { name: 'Sec 14', pct: 30, color: 'red' },
  { name: 'Sec 15-16', pct: 60, color: 'blue' },
]

// Mon → Sun heights in % of chart area
const velocity = [
  { day: 'Mon', height: 38, active: false },
  { day: 'Tue', height: 55, active: false },
  { day: 'Wed', height: 32, active: false },
  { day: 'Thu', height: 80, active: false },
  { day: 'Fri', height: 92, active: false },
  { day: 'Sat', height: 22, active: false },
  { day: 'Sun', height: 70, active: true },
]

export default function Step2Dashboard({ onNext }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<typeof statusFilters[number]>('All')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showAlert, setShowAlert] = useState(true)

  const filtered = reviewers.filter((r) => {
    const matchesQ =
      search.trim() === '' ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase()) ||
      r.sections.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    return matchesQ && matchesStatus
  })

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id))

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map((r) => r.id)))
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="dash-v2">
      {/* Toolbar */}
      <div className="dash-toolbar">
        <div className="dash-search">
          <span className="dash-search__icon">🔍</span>
          <input
            className="dash-search__input"
            placeholder="Search reviewers or sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="dash-status-row">
          {statusFilters.map((s) => (
            <button
              key={s}
              className={`dash-status-chip${statusFilter === s ? ' dash-status-chip--active' : ''}`}
              onClick={() => setStatusFilter(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
        <button className="bulk-btn" type="button" disabled={selected.size === 0}>
          ⚡ Bulk Actions{selected.size > 0 ? ` (${selected.size})` : ''}
        </button>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi kpi--with-sub">
          <div className="kpi__label">Progress</div>
          <div className="kpi__main">
            <span className="kpi__value">4/6</span>
            <span className="kpi__sub">reviewers done</span>
          </div>
        </div>
        <div className="kpi kpi--with-sub kpi--orange">
          <div className="kpi__label">Comments</div>
          <div className="kpi__main">
            <span className="kpi__value">47</span>
            <span className="kpi__sub">total received</span>
          </div>
        </div>
        <div className="kpi kpi--with-sub kpi--red">
          <div className="kpi__label">Blockers</div>
          <div className="kpi__main">
            <span className="kpi__value kpi__value--red">2</span>
            <span className="kpi__sub">need attention</span>
          </div>
        </div>
        <div className="kpi kpi--with-sub kpi--warn">
          <div className="kpi__label">Days Left</div>
          <div className="kpi__main">
            <span className="kpi__value kpi__value--warn">3</span>
            <span className="kpi__sub">deadline May 15</span>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      {showAlert && (
        <div className="alert-banner">
          <span className="alert-banner__dot" />
          <strong>ALERT:</strong>&nbsp;Tom Bradley is overdue by 2 days on Sec 11, 14.2 — 7 unresolved comments
          <button className="alert-banner__close" onClick={() => setShowAlert(false)} aria-label="Dismiss" type="button">×</button>
        </div>
      )}

      {/* Reviewer table */}
      <table className="dash-table">
        <thead>
          <tr>
            <th className="dash-table__check">
              <label className="dash-table__check-label">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                <span className="checkbox-mark" aria-hidden="true" />
              </label>
            </th>
            <th>Reviewer</th>
            <th>Role</th>
            <th>Sections</th>
            <th>Status</th>
            <th className="dash-table__progress-head">Progress</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className={r.status === 'Overdue' ? 'row--overdue' : ''}>
              <td className="dash-table__check">
                <label className="dash-table__check-label">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggleOne(r.id)}
                  />
                  <span className="checkbox-mark" aria-hidden="true" />
                </label>
              </td>
              <td>
                <div className="reviewer-cell">
                  <span className="reviewer-cell__avatar" style={{ background: r.avatarColor }}>{r.initial}</span>
                  <div>
                    <div className="reviewer-cell__name">{r.name}</div>
                    <div className="reviewer-cell__role">{r.role}</div>
                  </div>
                </div>
              </td>
              <td className="dash-table__role">{r.role}</td>
              <td className="dash-table__sections">{r.sections}</td>
              <td className={`status ${statusClass[r.status]}`}>{r.status}</td>
              <td className="dash-table__progress-cell">
                <div className="inline-bar">
                  <div
                    className={`inline-bar__fill inline-bar__fill--${
                      r.status === 'Complete' ? 'green' : r.status === 'Overdue' ? 'red' : 'blue'
                    }`}
                    style={{ width: `${r.progress}%` }}
                  />
                </div>
                <span className="inline-bar__pct">{r.progress}%</span>
              </td>
              <td>{r.comments}</td>
              <td>
                {r.action && (
                  <button className={`action-btn action-btn--${r.action.kind}`} type="button">
                    {r.action.label}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section-level progress */}
      <section className="dash-section">
        <h3 className="dash-section__title">Section-level Progress</h3>
        <div className="section-grid">
          {sectionProgress.map((s) => (
            <div key={s.name} className="section-cell">
              <div className="section-cell__head">
                <span className="section-cell__name">{s.name}</span>
                <span className="section-cell__pct">{s.pct}%</span>
              </div>
              <div className="section-bar">
                <div
                  className={`section-bar__fill section-bar__fill--${s.color}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review velocity */}
      <section className="dash-section">
        <h3 className="dash-section__title">Review Velocity — Last 7 Days</h3>
        <div className="velocity-chart">
          {velocity.map((d) => (
            <div key={d.day} className="velocity-col">
              <div
                className={`velocity-bar${d.active ? ' velocity-bar--active' : ''}`}
                style={{ height: `${d.height}%` }}
              />
              <div className="velocity-day">{d.day}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer actions */}
      <div className="dash-footer">
        <button className="btn-pill btn-pill--primary" onClick={onNext} type="button">
          Start Comment Triage
        </button>
        <button className="btn-pill btn-pill--ghost" type="button">Send All Reminders</button>
        <button className="btn-pill btn-pill--ghost" type="button">📊 Export Report</button>
      </div>
    </div>
  )
}
