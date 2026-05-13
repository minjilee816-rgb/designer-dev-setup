import { useEffect } from 'react'

export interface ReportSubject {
  name: string
  role: string
  avatarColor: string
  initial: string
  sections: string
  comments: number
  completedAt?: string
}

interface Props {
  open: boolean
  subject: ReportSubject | null
  onClose: () => void
}

const sectionBreakdown = [
  { section: 'Sec 11 — Statistical Methods', state: 'Reviewed', comments: 4, notes: 'Endpoints confirmed against SAP v2.0' },
  { section: 'Sec 12 — Efficacy Results', state: 'Reviewed', comments: 6, notes: 'Flagged Table 12.1 denominator (resolved as N=624)' },
  { section: 'Sec 14 — Safety Tables', state: 'Reviewed', comments: 2, notes: 'No additional safety signals' },
]

const decisions = [
  { tag: 'Blocker', label: 'Forest plot SAP version mismatch', resolution: 'Escalated to director' },
  { tag: 'Required', label: 'Table 12.1 denominator should be N=624', resolution: 'Accepted — applied' },
  { tag: 'Required', label: 'Add Bonferroni footnote on Table 11.4', resolution: 'Accepted — applied' },
]

export default function ViewReportModal({ open, subject, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !subject) return null

  return (
    <div className="modal__backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <h3 id="report-title" className="modal__title">Reviewer Report</h3>
            <div className="modal__subtitle">Complete · {subject.comments} comments · {subject.sections}</div>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close" type="button">×</button>
        </header>

        <div className="modal__body modal__body--scroll">
          <div className="msg-recipient">
            <span className="msg-recipient__avatar" style={{ background: subject.avatarColor }}>
              {subject.initial}
            </span>
            <div>
              <div className="msg-recipient__name">{subject.name}</div>
              <div className="msg-recipient__role">{subject.role}</div>
            </div>
            <span className="report-status-pill">✓ Complete</span>
          </div>

          <div className="report-stats">
            <div className="report-stat">
              <div className="report-stat__label">Sections reviewed</div>
              <div className="report-stat__value">3 of 3</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">Comments raised</div>
              <div className="report-stat__value">{subject.comments}</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">Avg time per section</div>
              <div className="report-stat__value">1h 24m</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">Status</div>
              <div className="report-stat__value report-stat__value--green">Complete</div>
            </div>
          </div>

          <section className="report-section">
            <h4 className="report-section__title">Section-by-section</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>State</th>
                  <th>Comments</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sectionBreakdown.map((row) => (
                  <tr key={row.section}>
                    <td className="report-table__strong">{row.section}</td>
                    <td><span className="report-pill report-pill--green">{row.state}</span></td>
                    <td>{row.comments}</td>
                    <td className="report-table__muted">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="report-section">
            <h4 className="report-section__title">Key decisions</h4>
            <ul className="report-decisions">
              {decisions.map((d) => (
                <li key={d.label} className="report-decisions__item">
                  <span className={`tag ${d.tag === 'Blocker' ? 'tag--blocker' : 'tag--required'}`}>{d.tag}</span>
                  <div className="report-decisions__body">
                    <div className="report-decisions__label">{d.label}</div>
                    <div className="report-decisions__resolution">→ {d.resolution}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="modal__footer modal__footer--space">
          <button className="btn-pill btn-pill--ghost" type="button">📄 Download PDF</button>
          <div className="modal__footer-actions">
            <button className="btn-pill btn-pill--ghost" onClick={onClose} type="button">Close</button>
            <button className="btn-pill btn-pill--primary" type="button">Mark Acknowledged</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
