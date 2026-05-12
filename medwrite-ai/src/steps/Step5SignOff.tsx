import { useState } from 'react'

interface Props {
  onReset: () => void
}

const readiness = [
  'All reviewer sections complete (4/4)',
  'All blockers resolved (2/2)',
  'Comment incorporation verified',
  'No open escalations',
  'Change log reviewed and approved',
  'Document version confirmed (v2.2)',
]

const packageItems = [
  { icon: '📄', label: 'CSR v2.2 (post-review)' },
  { icon: '📊', label: 'Review Summary Report' },
  { icon: '📋', label: 'Full Audit Trail (47 entries)' },
  { icon: '✅', label: 'Comment Resolution Log' },
  { icon: '🔗', label: 'Diff: v2.1 → v2.2' },
]

const approvalOptions = [
  { id: 'full', label: 'Full approval' },
  { id: 'conditional', label: 'Conditional approval (with notes)' },
  { id: 'rereview', label: 'Request re-review' },
] as const

const defaultCoverNote =
  'Hi Mark — all reviews are complete. Please note the escalated forest plot issue (Fig 12.3): Dr. Raj flagged SAP v1.0 definitions which have been updated. The rejected per-protocol change was kept per EMA guidance. Ready for your review.'

export default function Step5SignOff({ onReset }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [coverNote, setCoverNote] = useState(defaultCoverNote)
  const [approval, setApproval] = useState<typeof approvalOptions[number]['id']>('full')

  return (
    <div className="signoff-v2">
      {/* LEFT — checklist + package + recipient */}
      <div className="signoff-v2__left">
        <section className="signoff-section">
          <h3 className="signoff-section__title">Pre-Submission Readiness Checklist</h3>
          <div className="gates-banner">
            <span className="gates-banner__icon">✅</span>
            <strong>ALL GATES PASSED</strong>
            <span className="gates-banner__sep">—</span>
            <span className="gates-banner__sub">Ready for submission</span>
          </div>
          <ul className="readiness">
            {readiness.map((r) => (
              <li key={r} className="readiness__item">
                <span className="readiness__check" aria-hidden="true">
                  <span className="readiness__check-tick">✓</span>
                </span>
                <span className="readiness__label">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="signoff-section">
          <h3 className="signoff-section__title">Sign-off Package</h3>
          <ul className="package-list">
            {packageItems.map((p) => (
              <li key={p.label} className="package-list__item">
                <span className="package-list__icon">{p.icon}</span>
                <span>{p.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="signoff-section">
          <h3 className="signoff-section__title">Submit to:</h3>
          <div className="recipient-card">
            <div className="avatar avatar--purple">M</div>
            <div className="recipient-card__body">
              <div className="recipient-card__name">Mark Thompson — Clinical Director</div>
              <div className="recipient-card__meta">
                <span className="recipient-card__dot" />
                Available · Last active 2h ago
              </div>
            </div>
          </div>
          <button className="delegate-link" type="button">or delegate to another director ↓</button>
        </section>
      </div>

      {/* RIGHT — director preview, cover note, approval, submit */}
      <aside className="signoff-v2__right">
        <section className="signoff-section">
          <h3 className="signoff-section__title">
            <span>👁</span> Director's View Preview
          </h3>
          <div className="dir-preview">
            <div className="dir-preview__sub">What Mark will see:</div>

            <div className="dir-preview__block">
              <div className="dir-preview__block-title">📊 Review Scorecard:</div>
              <div className="dir-preview__line">4/4 reviewers complete · 47 comments resolved</div>
              <div className="dir-preview__line">0 open blockers · 2 escalations addressed</div>
            </div>

            <div className="dir-preview__block">
              <div className="dir-preview__block-title">📝 Key Changes:</div>
              <div className="dir-preview__line">3 changes applied, 1 rejected, 1 escalated</div>
            </div>

            <div className="dir-preview__block">
              <div className="dir-preview__block-title">⚠ Attention Items:</div>
              <div className="dir-preview__line">Forest plot regeneration was escalated</div>
              <div className="dir-preview__line">Per-protocol reference was rejected</div>
            </div>

            <a className="dir-preview__audit" href="#" onClick={(e) => e.preventDefault()}>
              🔗 One-click access to full audit trail
            </a>
          </div>
        </section>

        <section className="signoff-section">
          <h3 className="signoff-section__title">
            <span>📝</span> Cover Note for Director
          </h3>
          <textarea
            className="cover-note"
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            rows={5}
          />
        </section>

        <section className="signoff-section">
          <h3 className="signoff-section__title">Approval Options</h3>
          <div className="approval-list">
            {approvalOptions.map((o) => (
              <label key={o.id} className={`approval-row${approval === o.id ? ' approval-row--active' : ''}`}>
                <input
                  type="radio"
                  name="approval"
                  value={o.id}
                  checked={approval === o.id}
                  onChange={() => setApproval(o.id)}
                />
                <span className="approval-row__dot" aria-hidden="true" />
                <span className="approval-row__label">{o.label}</span>
              </label>
            ))}
          </div>
        </section>

        <button
          className={`signoff-cta${submitted ? ' signoff-cta--done' : ''}`}
          onClick={() => setSubmitted(true)}
          disabled={submitted}
          type="button"
        >
          {submitted ? '✓ Submitted to Mark Thompson' : '✓ Submit for Sign-off'}
        </button>

        {submitted && (
          <div className="signoff-toast">
            <strong>Sent for sign-off.</strong>&nbsp;Mark will be notified — you'll see his decision in your inbox.
            <button
              className="signoff-toast__link"
              onClick={() => {
                setSubmitted(false)
                onReset()
              }}
              type="button"
            >
              Start a new review cycle →
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
