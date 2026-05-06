import { useState } from 'react'

interface Props {
  onReset: () => void
}

const packageItems = [
  '📄 CSR v2.2 (post-review)',
  '📊 Review Summary Report',
  '📋 Full Audit Trail (47 entries)',
  '📝 Comment Resolution Log',
  '🔗 Diff: v2.1 → v2.2',
]

export default function Step5SignOff({ onReset }: Props) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="signoff">
      <div className="package-card">
        <h3>Sign-off Package</h3>
        {packageItems.map((item) => (
          <div key={item} className="package-card__item">{item}</div>
        ))}
      </div>

      <div className="signoff__label">Submit to:</div>
      <div className="recipient">
        <div className="avatar">M</div>
        <div className="recipient__name">Mark Thompson — Clinical Director</div>
      </div>

      <button
        className={`btn-signoff${submitted ? ' btn-signoff--done' : ''}`}
        onClick={() => setSubmitted(true)}
        disabled={submitted}
        type="button"
      >
        {submitted ? '✓ Submitted' : '✓  Submit for Sign-off'}
      </button>

      {submitted && (
        <div className="toast">
          Sign-off package sent to Mark Thompson. You'll be notified when reviewed.
          <div style={{ marginTop: 8 }}>
            <button
              className="action-link"
              style={{ fontSize: 12, padding: 0 }}
              onClick={() => {
                setSubmitted(false)
                onReset()
              }}
            >
              Start a new review cycle →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
