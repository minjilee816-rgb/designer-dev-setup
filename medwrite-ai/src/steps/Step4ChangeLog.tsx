import { useState } from 'react'

interface Props {
  onNext: () => void
}

type ChangeStatus = 'Applied' | 'Rejected' | 'Escalated'

interface Change {
  id: number
  status: ChangeStatus
  title: string
  source: string
  before?: string
  after?: string
  /** Visible on Escalated rows so the user sees what the director's options would be. */
  proposedAfter?: string
  /** Set once a director response is captured. Shown in a small banner inside the card. */
  directorNote?: string
}

const initialChanges: Change[] = [
  {
    id: 1,
    status: 'Applied',
    title: 'Table 12.1: Updated N=624',
    source: 'Dr. Raj · Required #4',
    before: 'N=312 (per-protocol)',
    after: 'N=624 (full analysis set)',
  },
  {
    id: 2,
    status: 'Applied',
    title: 'Table 11.4: Added Bonferroni footnote',
    source: 'Dr. Shaha · Required #7',
    before: 'No footnote',
    after: '† Bonferroni-corrected p-values',
  },
  {
    id: 3,
    status: 'Applied',
    title: 'Sec 2.1: Added ICH E9(R1) reference',
    source: 'Lisa · Suggestion #3',
    before: 'No reference',
    after: 'Per ICH E9(R1) guidelines…',
  },
  {
    id: 4,
    status: 'Rejected',
    title: 'Sec 12.2: Remove per-protocol ref',
    source: 'Lisa · Suggestion #8',
  },
  {
    id: 5,
    status: 'Escalated',
    title: 'Fig 12.3: Forest plot regeneration',
    source: 'Dr. Raj · Blocker #1',
    before: 'SAP v1.0 definitions',
    after: 'Pending director review',
    proposedAfter: 'Regenerate with SAP v2.0',
  },
]

const statusMeta: Record<ChangeStatus, { label: string; klass: string }> = {
  Applied: { label: '✓ Applied', klass: 'applied' },
  Rejected: { label: '✗ Rejected', klass: 'rejected' },
  Escalated: { label: '↑ Escalated', klass: 'escalated' },
}

export default function Step4ChangeLog({ onNext }: Props) {
  const [changes, setChanges] = useState(initialChanges)
  const [verifiedApplied, setVerifiedApplied] = useState(true)
  const [verifiedRejections, setVerifiedRejections] = useState(true)

  const undo = (id: number) => {
    setChanges((prev) => prev.filter((c) => c.id !== id))
  }

  // Convert an Escalated row into a resolved one based on the director response
  const resolveEscalation = (id: number, response: 'accept' | 'reject') => {
    setChanges((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.status !== 'Escalated') return c
        if (response === 'accept') {
          return {
            ...c,
            status: 'Applied',
            after: c.proposedAfter ?? c.after,
            directorNote: 'Director approved this change',
          }
        }
        return {
          ...c,
          status: 'Rejected',
          after: undefined,
          before: undefined,
          directorNote: 'Director declined this change',
        }
      }),
    )
  }

  const applied = changes.filter((c) => c.status === 'Applied').length
  const rejected = changes.filter((c) => c.status === 'Rejected').length
  const escalated = changes.filter((c) => c.status === 'Escalated').length
  const escalationPending = escalated > 0

  const canSubmit = verifiedApplied && verifiedRejections && !escalationPending

  return (
    <div className="changelog-v2">
      {/* Left column */}
      <div className="changelog-v2__list">
        <h2 className="changelog-v2__title">Change Log — with Before/After Diff</h2>

        {changes.map((c) => {
          const meta = statusMeta[c.status]
          return (
            <article key={c.id} className={`diff-card diff-card--${meta.klass}`}>
              <div className="diff-card__head">
                <span className={`diff-card__badge diff-card__badge--${meta.klass}`}>{meta.label}</span>
                <div className="diff-card__title-block">
                  <div className="diff-card__title">{c.title}</div>
                  <a className="diff-card__source" href="#" onClick={(e) => e.preventDefault()}>
                    🔗 {c.source}
                  </a>
                </div>
                {c.status === 'Applied' && (
                  <button className="diff-card__undo" onClick={() => undo(c.id)} type="button">
                    ⤺ Undo
                  </button>
                )}
              </div>

              {c.before !== undefined && c.after !== undefined && (
                <div className="diff-card__diff">
                  <div className="diff-card__before">− {c.before}</div>
                  <div className="diff-card__after">+ {c.after}</div>
                </div>
              )}

              {/* Director response widget on Escalated rows */}
              {c.status === 'Escalated' && (
                <div className="director-response">
                  <div className="director-response__head">
                    <span className="director-response__title">Awaiting director response</span>
                    <span className="director-response__hint">
                      Proposed fix: <em>{c.proposedAfter ?? '—'}</em>
                    </span>
                  </div>
                  <div className="director-response__actions">
                    <button
                      className="btn-tag btn-tag--accept"
                      type="button"
                      onClick={() => resolveEscalation(c.id, 'accept')}
                    >
                      ✓ Director Accepted
                    </button>
                    <button
                      className="btn-tag btn-tag--reject"
                      type="button"
                      onClick={() => resolveEscalation(c.id, 'reject')}
                    >
                      ✗ Director Rejected
                    </button>
                  </div>
                </div>
              )}

              {c.directorNote && (
                <div className={`director-note director-note--${meta.klass}`}>
                  {c.status === 'Applied' ? '✓' : '✗'} {c.directorNote}
                </div>
              )}
            </article>
          )
        })}
      </div>

      {/* Right column */}
      <aside className="changelog-v2__summary">
        <h3 className="summary-v2__title">Incorporation Summary</h3>

        <div className="summary-v2__rows">
          <div className="summary-v2__row">
            <span>Changes applied</span>
            <span className="summary-v2__num summary-v2__num--green">{applied}</span>
          </div>
          <div className="summary-v2__row">
            <span>Rejected (with rationale)</span>
            <span className="summary-v2__num summary-v2__num--red">{rejected}</span>
          </div>
          <div className="summary-v2__row">
            <span>Escalated to director</span>
            <span className="summary-v2__num summary-v2__num--orange">{escalated}</span>
          </div>
          <div className="summary-v2__row">
            <span>Deferred to next cycle</span>
            <span className="summary-v2__num summary-v2__num--muted">1</span>
          </div>
          <div className="summary-v2__row">
            <span>Open blockers</span>
            <span className="summary-v2__num summary-v2__num--green">0</span>
          </div>
        </div>

        {rejected > 0 && (
          <div className="rationale">
            <div className="rationale__title">Rejection Rationale</div>
            <div className="rationale__body">
              Per-protocol ref is required by EMA guidance. Change conflicts with regulatory requirements.
            </div>
          </div>
        )}

        <div className="presubmit">
          <div className="presubmit__title">✅ Review Changes Before Submission</div>
          <label className="presubmit__row">
            <input
              type="checkbox"
              checked={verifiedApplied}
              onChange={(e) => setVerifiedApplied(e.target.checked)}
            />
            <span className="checkbox-mark" aria-hidden="true" />
            <span className="presubmit__label presubmit__label--green">All applied changes verified</span>
          </label>
          <label className="presubmit__row">
            <input
              type="checkbox"
              checked={verifiedRejections}
              onChange={(e) => setVerifiedRejections(e.target.checked)}
            />
            <span className="checkbox-mark" aria-hidden="true" />
            <span className="presubmit__label presubmit__label--green">Rejection rationales documented</span>
          </label>
          <div className={`presubmit__row presubmit__row--readonly${escalationPending ? '' : ' presubmit__row--done'}`}>
            <span className={`presubmit__static-mark${escalationPending ? ' presubmit__static-mark--pending' : ' presubmit__static-mark--done'}`}>
              {escalationPending ? '' : '✓'}
            </span>
            <span className={`presubmit__label ${escalationPending ? 'presubmit__label--orange' : 'presubmit__label--green'}`}>
              Escalation responses {escalationPending ? 'pending' : 'received'}
            </span>
          </div>
        </div>

        <button
          className="btn-pill btn-pill--primary changelog-v2__submit"
          onClick={onNext}
          disabled={!canSubmit}
          type="button"
        >
          Submit for Sign-off →
        </button>
      </aside>
    </div>
  )
}
