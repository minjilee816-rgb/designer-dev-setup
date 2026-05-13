import { useEffect, useRef, useState } from 'react'

export interface EscalationSubject {
  name: string
  role: string
  sections: string
  avatarColor: string
  initial: string
  daysOverdue?: number
  openComments?: number
}

type Urgency = 'low' | 'medium' | 'high'

const routes = [
  { id: 'manager', label: "Reviewer's manager", note: 'Default — quickest to act' },
  { id: 'director', label: 'Mark Thompson (Clinical Director)', note: 'For deadline-critical issues' },
  { id: 'ops', label: 'Clinical Operations on-call', note: 'For staffing/availability problems' },
] as const

interface Props {
  open: boolean
  subject: EscalationSubject | null
  onClose: () => void
  onSubmit: (payload: { route: string; urgency: Urgency; reason: string }) => void
}

export default function EscalateModal({ open, subject, onClose, onSubmit }: Props) {
  const [route, setRoute] = useState<string>('manager')
  const [urgency, setUrgency] = useState<Urgency>('high')
  const [reason, setReason] = useState('')
  const reasonRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && subject) {
      setRoute('manager')
      setUrgency(subject.daysOverdue && subject.daysOverdue >= 2 ? 'high' : 'medium')
      setReason(
        subject.daysOverdue
          ? `${subject.name} is ${subject.daysOverdue}d overdue on ${subject.sections}${subject.openComments ? ` with ${subject.openComments} unresolved comments` : ''}. Cycle deadline at risk.`
          : `${subject.name} has stalled on ${subject.sections}. Needs immediate attention.`,
      )
      setTimeout(() => reasonRef.current?.focus(), 50)
    }
  }, [open, subject])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !subject) return null

  const canSubmit = reason.trim().length > 0

  return (
    <div className="modal__backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="escalate-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header modal__header--danger">
          <div>
            <h3 id="escalate-title" className="modal__title">🔴 Escalate</h3>
            <div className="modal__subtitle">{subject.name} · {subject.sections}</div>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close" type="button">×</button>
        </header>

        <div className="modal__body">
          {subject.daysOverdue && (
            <div className="escalate-context">
              <strong>{subject.daysOverdue}d overdue</strong>
              {subject.openComments ? ` · ${subject.openComments} unresolved comments` : ''}
              {' '}· Cycle deadline May 15 (in 3 days)
            </div>
          )}

          <div className="field">
            <label className="field__label">Route to</label>
            <div className="route-list">
              {routes.map((r) => (
                <label key={r.id} className={`route-row${route === r.id ? ' route-row--active' : ''}`}>
                  <input
                    type="radio"
                    name="route"
                    value={r.id}
                    checked={route === r.id}
                    onChange={() => setRoute(r.id)}
                  />
                  <span className="approval-row__dot" aria-hidden="true" />
                  <div>
                    <div className="route-row__label">{r.label}</div>
                    <div className="route-row__note">{r.note}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field__label">Urgency</label>
            <div className="seg-chip-row">
              {(['low', 'medium', 'high'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`seg-chip seg-chip--${u}${urgency === u ? ' seg-chip--active' : ''}`}
                  onClick={() => setUrgency(u)}
                >
                  {u === 'low' ? '🟢 Low' : u === 'medium' ? '🟡 Medium' : '🔴 High'}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="esc-reason">Reason *</label>
            <textarea
              id="esc-reason"
              ref={reasonRef}
              className="cover-note"
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="msg-hint">
              This message + the reviewer's status snapshot will be sent to the selected recipient.
            </div>
          </div>
        </div>

        <footer className="modal__footer">
          <button className="btn-pill btn-pill--ghost" onClick={onClose} type="button">Cancel</button>
          <button
            className="btn-pill btn-pill--danger"
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit({ route, urgency, reason: reason.trim() })}
          >
            🔴 Escalate now
          </button>
        </footer>
      </div>
    </div>
  )
}
