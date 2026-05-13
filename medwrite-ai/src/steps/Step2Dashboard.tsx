import { useState } from 'react'
import SendMessageModal, { type MessageKind } from '../components/SendMessageModal'
import ViewReportModal from '../components/ViewReportModal'
import EscalateModal from '../components/EscalateModal'
import BulkActionsMenu, { type BulkAction } from '../components/BulkActionsMenu'
import ToastHost, { type ToastKind, type ToastMessage } from '../components/Toast'

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
  daysOverdue?: number
  daysSinceLastUpdate?: number
  completedAt?: string
}

const reviewers: Reviewer[] = [
  { id: 'raj', initial: 'D', avatarColor: '#d98c26', name: 'Dr. Raj Patel', role: 'Biostatistician', sections: 'Sec 11, 12, 14', status: 'Complete', progress: 100, comments: 12, completedAt: 'Yesterday' },
  { id: 'lisa', initial: 'L', avatarColor: '#269973', name: 'Lisa Chen', role: 'Regulatory Affairs', sections: 'Sec 1, 2, 15, 16', status: 'In Progress', progress: 60, comments: 8, daysSinceLastUpdate: 1 },
  { id: 'maria', initial: 'M', avatarColor: '#9b59d4', name: 'Maria Santos', role: 'Pharmacovig.', sections: 'Sec 12.3, 13', status: 'Not Started', progress: 0, comments: 0, daysSinceLastUpdate: 4 },
  { id: 'tom', initial: 'T', avatarColor: '#3b82f6', name: 'Tom Bradley', role: 'Data Mgmt', sections: 'Sec 11, 14.2', status: 'Overdue', progress: 30, comments: 7, daysOverdue: 2 },
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

const velocity = [
  { day: 'Mon', height: 38, active: false },
  { day: 'Tue', height: 55, active: false },
  { day: 'Wed', height: 32, active: false },
  { day: 'Thu', height: 80, active: false },
  { day: 'Fri', height: 92, active: false },
  { day: 'Sat', height: 22, active: false },
  { day: 'Sun', height: 70, active: true },
]

let toastSeq = 0

export default function Step2Dashboard({ onNext }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<typeof statusFilters[number]>('All')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showAlert, setShowAlert] = useState(true)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Modal targets
  const [messageTarget, setMessageTarget] = useState<{ reviewer: Reviewer; kind: MessageKind } | null>(null)
  const [reportTarget, setReportTarget] = useState<Reviewer | null>(null)
  const [escalateTarget, setEscalateTarget] = useState<Reviewer | null>(null)

  const pushToast = (kind: ToastKind, text: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, kind, text }])
  }

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

  // Per-row action dispatcher
  const handleRowAction = (r: Reviewer) => {
    if (r.status === 'Complete') setReportTarget(r)
    else if (r.status === 'In Progress') setMessageTarget({ reviewer: r, kind: 'nudge' })
    else if (r.status === 'Not Started') setMessageTarget({ reviewer: r, kind: 'reminder' })
    else if (r.status === 'Overdue') setEscalateTarget(r)
  }

  const rowActionLabel = (r: Reviewer) => {
    switch (r.status) {
      case 'Complete': return 'View Report'
      case 'In Progress': return 'Send Nudge'
      case 'Not Started': return 'Send Reminder'
      case 'Overdue': return '● Escalate'
    }
  }

  const rowActionKind = (r: Reviewer) => {
    switch (r.status) {
      case 'Complete': return 'view'
      case 'In Progress': return 'nudge'
      case 'Not Started': return 'reminder'
      case 'Overdue': return 'escalate'
    }
  }

  const handleBulkAction = (action: BulkAction) => {
    setBulkOpen(false)
    const names = reviewers
      .filter((r) => selected.has(r.id))
      .map((r) => r.name.split(' ')[0])
      .join(', ')
    switch (action) {
      case 'message':
        pushToast('success', `Message draft prepared for ${names}. Sent via Slack + Email.`)
        break
      case 'deadline':
        pushToast('info', `Deadline picker would open for ${names}. (Demo)`)
        break
      case 'escalate':
        pushToast('warning', `${selected.size} reviewer(s) escalated to their managers.`)
        break
      case 'export':
        pushToast('success', `Exported ${selected.size} reviewer(s) as CSV.`)
        break
    }
    setSelected(new Set())
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
        <div className="bulk-anchor">
          <button
            className="bulk-btn"
            type="button"
            disabled={selected.size === 0}
            onClick={() => setBulkOpen((o) => !o)}
          >
            ⚡ Bulk Actions{selected.size > 0 ? ` (${selected.size})` : ''} ▾
          </button>
          <BulkActionsMenu
            open={bulkOpen && selected.size > 0}
            selectedCount={selected.size}
            onClose={() => setBulkOpen(false)}
            onAction={handleBulkAction}
          />
        </div>
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
          <button
            className="alert-banner__action"
            type="button"
            onClick={() => {
              const tom = reviewers.find((r) => r.id === 'tom')!
              setEscalateTarget(tom)
            }}
          >
            Escalate now
          </button>
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
                <button
                  className={`action-btn action-btn--${rowActionKind(r)}`}
                  type="button"
                  onClick={() => handleRowAction(r)}
                >
                  {rowActionLabel(r)}
                </button>
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
        <button
          className="btn-pill btn-pill--ghost"
          type="button"
          onClick={() => pushToast('success', `Reminders sent to all reviewers with pending sections.`)}
        >
          Send All Reminders
        </button>
        <button
          className="btn-pill btn-pill--ghost"
          type="button"
          onClick={() => pushToast('success', `Exported full reviewer status as CSV.`)}
        >
          📊 Export Report
        </button>
      </div>

      {/* Modals */}
      <SendMessageModal
        open={messageTarget !== null}
        kind={messageTarget?.kind ?? 'nudge'}
        recipient={messageTarget?.reviewer ?? null}
        onClose={() => setMessageTarget(null)}
        onSend={(payload) => {
          const r = messageTarget?.reviewer
          setMessageTarget(null)
          if (!r) return
          const channelLabel = payload.channel === 'both' ? 'Slack + Email' : payload.channel === 'slack' ? 'Slack' : 'Email'
          const verb = payload.kind === 'nudge' ? 'Nudge' : 'Reminder'
          pushToast('success', `${verb} sent to ${r.name} via ${channelLabel}.`)
        }}
      />

      <ViewReportModal
        open={reportTarget !== null}
        subject={reportTarget}
        onClose={() => setReportTarget(null)}
      />

      <EscalateModal
        open={escalateTarget !== null}
        subject={escalateTarget}
        onClose={() => setEscalateTarget(null)}
        onSubmit={(payload) => {
          const r = escalateTarget
          setEscalateTarget(null)
          if (!r) return
          const routeLabel =
            payload.route === 'manager'
              ? "manager"
              : payload.route === 'director'
              ? 'Mark Thompson'
              : 'Clinical Ops'
          pushToast('warning', `Escalated ${r.name} to ${routeLabel} (urgency: ${payload.urgency}).`)
        }}
      />

      <ToastHost toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  )
}
