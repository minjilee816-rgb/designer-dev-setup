import { useState } from 'react'

interface Props {
  onNext: () => void
}

type TagKind = 'Blocker' | 'Required' | 'Suggestion' | 'Question'

interface Comment {
  id: number
  tag: TagKind
  author: string
  text: string
}

const filters = ['All (47)', 'Blockers (2)', 'Required (14)', 'Suggestions (18)', 'Questions (13)']

const initialComments: Comment[] = [
  { id: 1, tag: 'Blocker', author: 'Dr. Raj', text: 'Forest plot uses old SAP v1.0 definitions' },
  { id: 2, tag: 'Required', author: 'Dr. Raj', text: 'Table 12.1 denominator should be N=624' },
  { id: 3, tag: 'Required', author: 'Dr. Gupta', text: 'Missing Bonferroni footnote on Table 11.4' },
  { id: 4, tag: 'Suggestion', author: 'Lisa', text: 'Add ICH E9(R1) reference in Section 2.1' },
]

const tagClass: Record<TagKind, string> = {
  Blocker: 'tag--blocker',
  Required: 'tag--required',
  Suggestion: 'tag--suggestion',
  Question: 'tag--question',
}

export default function Step3Triage({ onNext }: Props) {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [resolved, setResolved] = useState<Set<number>>(new Set())

  const handleAction = (id: number) => {
    setResolved((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const visible = initialComments.filter((c) => !resolved.has(c.id))

  return (
    <div className="triage">
      <div className="triage__left">
        <div className="ai-banner">
          ✨ AI found 3 clusters and 1 conflict. 8 comments on Table 11.4, 5 on regulatory language.
        </div>

        <div className="chip-row">
          {filters.map((f) => (
            <button
              key={f}
              className={`chip${activeFilter === f ? ' chip--active' : ''}`}
              onClick={() => setActiveFilter(f)}
              type="button"
            >
              {f}
            </button>
          ))}
        </div>

        {visible.map((c) => (
          <div key={c.id} className="comment-card">
            <span className={`tag ${tagClass[c.tag]}`}>{c.tag}</span>
            <span className="comment-card__author">{c.author}</span>
            <span />
            <div className="comment-card__actions">
              <button className="btn-tag btn-tag--accept" onClick={() => handleAction(c.id)}>Accept</button>
              <button className="btn-tag btn-tag--reject" onClick={() => handleAction(c.id)}>Reject</button>
              <button className="btn-tag btn-tag--escalate" onClick={() => handleAction(c.id)}>Escalate</button>
              <button className="btn-tag btn-tag--defer" onClick={() => handleAction(c.id)}>Defer</button>
            </div>
            <p className="comment-card__text">{c.text}</p>
          </div>
        ))}

        {visible.length === 0 && (
          <button className="btn-pill btn-pill--primary" style={{ alignSelf: 'flex-start' }} onClick={onNext}>
            Continue to Change Log →
          </button>
        )}
      </div>

      <aside className="summary-card">
        <h3>Resolution Summary</h3>

        <div className="summary-row">
          <div className="summary-row__head">
            <span>Blockers</span>
            <span className="summary-row__count">0/2</span>
          </div>
          <div className="bar">
            <div className="bar__fill bar__fill--red" style={{ width: '1%' }} />
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__head">
            <span>Required</span>
            <span className="summary-row__count">5/14</span>
          </div>
          <div className="bar">
            <div className="bar__fill bar__fill--orange" style={{ width: '36%' }} />
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__head">
            <span>Suggestions</span>
            <span className="summary-row__count">6/18</span>
          </div>
          <div className="bar">
            <div className="bar__fill bar__fill--green" style={{ width: '33%' }} />
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__head">
            <span>Questions</span>
            <span className="summary-row__count">1/13</span>
          </div>
          <div className="bar">
            <div className="bar__fill bar__fill--blue" style={{ width: '8%' }} />
          </div>
        </div>

        <div className="conflict-box">
          <div className="conflict-box__title">⚠️ Conflict: Dr. Raj vs Lisa on Sec 12.2</div>
          <div className="conflict-box__body">
            Opposing suggestions on per-protocol analysis placement. Needs your call.
          </div>
        </div>
      </aside>
    </div>
  )
}
