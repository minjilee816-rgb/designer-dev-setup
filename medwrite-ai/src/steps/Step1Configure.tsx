import { useState } from 'react'

interface Props {
  onNext: () => void
}

const reviewTypes = ['Initial', 'Interim', 'Final'] as const
const scopes = ['Full Document', 'Statistical Sections', 'Regulatory Sections', 'Custom'] as const

export default function Step1Configure({ onNext }: Props) {
  const [reviewType, setReviewType] = useState<typeof reviewTypes[number]>('Final')
  const [scope, setScope] = useState<typeof scopes[number]>('Full Document')
  const [deadline, setDeadline] = useState('May 12, 2026')
  const [instructions, setInstructions] = useState('')

  return (
    <>
      <div className="form-col">
        <h2>New Review Cycle</h2>
        <p className="form-col__sub">CSR-2024-0847 — Phase III Compound X</p>

        <div className="field">
          <label className="field__label">Review Type</label>
          <div className="seg">
            {reviewTypes.map((t) => (
              <button
                key={t}
                className={`seg__btn${reviewType === t ? ' seg__btn--active' : ''}`}
                onClick={() => setReviewType(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field__label">Review Scope</label>
          {scopes.map((s) => (
            <div key={s} className="radio-row" onClick={() => setScope(s)} style={{ cursor: 'pointer' }}>
              <span className={`radio${scope === s ? ' radio--on' : ''}`} />
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="field">
          <label className="field__label">Deadline</label>
          <input
            className="input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label">Instructions</label>
          <textarea
            className="textarea"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Focus on updated data tables after DB lock v2..."
          />
        </div>

        <button className="btn-primary" onClick={onNext} type="button">
          Next: Assign Reviewers →
        </button>
      </div>

      <aside className="preview-panel">
        <h3>Document Preview</h3>
        <p className="preview-panel__sub">CSR-2024-0847 v2.1</p>
        <div className="preview-lines">
          {[280, 240, 200, 280, 240, 200, 280, 240, 200, 280, 240, 200].map((w, i) => (
            <div key={i} className="preview-line" style={{ width: w }} />
          ))}
        </div>
      </aside>
    </>
  )
}
