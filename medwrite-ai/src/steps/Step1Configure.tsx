import { useState } from 'react'

interface Props {
  onNext: () => void
}

const reviewTypes = ['Initial', 'Interim', 'Final'] as const
const scopes = ['Full Document', 'Statistical Sections', 'Regulatory Sections', 'Custom'] as const

interface Reviewer {
  initial: string
  name: string
  role: string
  sections: string
  deadline: string
  avatarColor: string
}

const initialReviewers: Reviewer[] = [
  { initial: 'D', name: 'Dr. Raj Patel', role: 'Biostatistician', sections: 'Sec 11, 12, 14', deadline: 'May 12, 2026', avatarColor: '#d98c26' },
  { initial: 'L', name: 'Lisa Chen', role: 'Regulatory Affairs', sections: 'Sec 1, 2, 15, 16', deadline: 'May 12, 2026', avatarColor: '#269973' },
  { initial: 'M', name: 'Maria Santos', role: 'Pharmacovigilance', sections: 'Sec 12.3, 13', deadline: 'May 12, 2026', avatarColor: '#9b59d4' },
  { initial: 'T', name: 'Tom Bradley', role: 'Data Management', sections: 'Sec 11, 14.2', deadline: 'May 12, 2026', avatarColor: '#3b82f6' },
]

const tocItems = [
  { num: '1.', text: 'Title Page', bold: true },
  { num: '2.', text: 'Synopsis', bold: true },
  { num: '3.', text: 'Table of Contents', bold: true },
  { num: '', text: '…', bold: false, muted: true },
  { num: '11.', text: 'Efficacy Evaluation', bold: true },
  { num: '11.1', text: 'Primary Endpoint Analysis', bold: false, muted: true },
  { num: '11.2', text: 'Secondary Endpoints', bold: false, muted: true },
  { num: '12.', text: 'Safety Evaluation', bold: true },
  { num: '12.1', text: 'Adverse Events Summary', bold: false, muted: true },
  { num: '12.2', text: 'Lab Abnormalities', bold: false, muted: true },
  { num: '12.3', text: 'Vital Signs', bold: false, muted: true },
  { num: '14.', text: 'Statistical Methods', bold: true },
  { num: '14.1', text: 'Sample Size', bold: false, muted: true },
  { num: '14.2', text: 'Data Handling', bold: false, muted: true },
]

export default function Step1Configure({ onNext }: Props) {
  const [reviewType, setReviewType] = useState<typeof reviewTypes[number]>('Final')
  const [scope, setScope] = useState<typeof scopes[number]>('Full Document')
  const [deadline, setDeadline] = useState('May 12, 2026')
  const [instructions, setInstructions] = useState('')
  const [reviewers, setReviewers] = useState<Reviewer[]>(initialReviewers)

  const removeReviewer = (name: string) => {
    setReviewers((prev) => prev.filter((r) => r.name !== name))
  }

  const allComplete = reviewers.length > 0 && deadline.trim().length > 0

  return (
    <div className="cfg">
      <div className="cfg__scroll">
        {/* Section 1 — Select Document */}
        <section className="cfg-section">
          <h2 className="cfg-section__title">
            <span className="cfg-section__num">1</span>
            Select Document
          </h2>
          <div className="doc-card doc-card--selected">
            <div className="doc-card__icon">📄</div>
            <div className="doc-card__body">
              <div className="doc-card__name">CSR-2024-0847 — Phase III Compound X</div>
              <div className="doc-card__meta">
                v2.1 · Last modified: May 10, 2026 · DB Lock confirmed
              </div>
              <div className="doc-card__validated">✓ Document validated</div>
            </div>
          </div>
        </section>

        {/* Section 2 — Review Settings */}
        <section className="cfg-section">
          <h2 className="cfg-section__title">
            <span className="cfg-section__num">2</span>
            Review Settings
          </h2>
          <div className="cfg-settings">
            {/* Left column */}
            <div>
              <div className="field">
                <label className="field__label">Review Type *</label>
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
                <label className="field__label">Review Scope *</label>
                {scopes.map((s) => (
                  <div key={s} className="radio-row" onClick={() => setScope(s)} style={{ cursor: 'pointer' }}>
                    <span className={`radio${scope === s ? ' radio--on' : ''}`} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div>
              <div className="field">
                <label className="field__label">Deadline *</label>
                <input
                  className="input input--wide"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <div className="field__warn">
                  ⚠ Only 5 business days — consider extending for a full document review
                </div>
              </div>

              <div className="field">
                <label className="field__label">Instructions</label>
                <textarea
                  className="textarea textarea--wide"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Focus on updated data tables after DB lock v2..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Assign Reviewers */}
        <section className="cfg-section">
          <h2 className="cfg-section__title">
            <span className="cfg-section__num">3</span>
            Assign Reviewers
          </h2>
          <div className="reviewers">
            {reviewers.map((r, i) => (
              <div key={r.name} className={`reviewer-row${i % 2 === 1 ? ' reviewer-row--alt' : ''}`}>
                <div className="reviewer-row__avatar" style={{ background: r.avatarColor }}>{r.initial}</div>
                <div className="reviewer-row__name">
                  <div className="reviewer-row__title">{r.name}</div>
                  <div className="reviewer-row__sub">{r.role}</div>
                </div>
                <div className="reviewer-row__col">{r.sections}</div>
                <div className="reviewer-row__col">{r.deadline}</div>
                <div className="reviewer-row__status">Assigned</div>
                <button
                  className="reviewer-row__remove"
                  onClick={() => removeReviewer(r.name)}
                  aria-label={`Remove ${r.name}`}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
            <button className="btn-outline btn-outline--primary" type="button">+ Add Reviewer</button>
          </div>
        </section>
      </div>

      {/* Document preview side panel */}
      <aside className="cfg-preview">
        <h3 className="cfg-preview__title">Document Preview</h3>
        <div className="cfg-preview__sub">CSR-2024-0847 v2.1</div>
        <ul className="toc">
          {tocItems.map((t, i) => (
            <li
              key={i}
              className={`toc__item${t.bold ? ' toc__item--bold' : ''}${(t as { muted?: boolean }).muted ? ' toc__item--muted' : ''}`}
            >
              {t.num && <span className="toc__num">{t.num}</span>}
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Footer bar */}
      <div className="cfg-footer">
        <button className="btn-pill btn-pill--ghost" type="button">💾 Save as Draft</button>
        <div className={`cfg-footer__status${allComplete ? ' cfg-footer__status--ok' : ''}`}>
          {allComplete
            ? `✓ All required fields complete · ${reviewers.length} reviewer${reviewers.length === 1 ? '' : 's'} assigned`
            : '⚠ Complete required fields and assign at least one reviewer'}
        </div>
        <button
          className="btn-pill btn-pill--primary"
          onClick={onNext}
          type="button"
          disabled={!allComplete}
        >
          Review & Launch →
        </button>
      </div>
    </div>
  )
}
