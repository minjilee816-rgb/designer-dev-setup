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
  replies: number
}

const filters = ['All (47)', 'Blockers (2)', 'Required (14)', 'Suggestions (18)', 'Questions (13)']

const initialComments: Comment[] = [
  { id: 1, tag: 'Blocker', author: 'Dr. Raj', text: 'Forest plot uses old SAP v1.0 definitions', replies: 3 },
  { id: 2, tag: 'Required', author: 'Dr. Raj', text: 'Table 12.1 denominator should be N=624', replies: 0 },
  { id: 3, tag: 'Required', author: 'Dr. Shaha', text: 'Missing Bonferroni footnote on Table 11.4', replies: 2 },
  { id: 4, tag: 'Suggestion', author: 'Lisa', text: 'Add ICH E9(R1) reference in Section 2.1', replies: 0 },
]

const tagClass: Record<TagKind, string> = {
  Blocker: 'tag--blocker',
  Required: 'tag--required',
  Suggestion: 'tag--question',
  Question: 'tag--question',
}

export default function Step3Triage({ onNext }: Props) {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [resolved, setResolved] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [conflictResolved, setConflictResolved] = useState(false)

  const handleAction = (id: number) => {
    setResolved((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const visible = initialComments.filter((c) => !resolved.has(c.id))
  const allSelected = visible.length > 0 && visible.every((c) => selected.has(c.id))

  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(visible.map((c) => c.id)))
  }

  const batchResolve = (action: 'accept' | 'reject' | 'escalate') => {
    void action
    setResolved((prev) => {
      const next = new Set(prev)
      selected.forEach((id) => next.add(id))
      return next
    })
    setSelected(new Set())
  }

  return (
    <div className="triage-v2">
      {/* Conflict banner */}
      {!conflictResolved && (
        <div className="conflict-banner">
          <div className="conflict-banner__text">
            <span className="conflict-banner__icon">⚠</span>
            <strong>CONFLICT:</strong> Dr. Raj vs Lisa on Sec 12.2 — Opposing suggestions on per-protocol analysis. Needs your call.
          </div>
          <button
            className="conflict-banner__btn"
            type="button"
            onClick={() => setConflictResolved(true)}
          >
            Resolve
          </button>
        </div>
      )}

      <div className="triage-v2__body">
        {/* LEFT — comments list */}
        <div className="triage-v2__left">
          <div className="ai-sub">
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
            <button
              className={`chip chip--outline${selected.size > 0 ? ' chip--outline-active' : ''}`}
              onClick={toggleSelectAll}
              type="button"
            >
              <span className={`checkbox-mini${allSelected ? ' checkbox-mini--on' : ''}`} />
              Select All · Batch
            </button>
          </div>

          {/* Batch action bar */}
          {selected.size > 0 && (
            <div className="batch-bar">
              <span className="batch-bar__count">{selected.size} selected</span>
              <div className="batch-bar__actions">
                <button className="btn-tag btn-tag--accept" onClick={() => batchResolve('accept')} type="button">Accept all</button>
                <button className="btn-tag btn-tag--reject" onClick={() => batchResolve('reject')} type="button">Reject all</button>
                <button className="btn-tag btn-tag--escalate" onClick={() => batchResolve('escalate')} type="button">Escalate all</button>
              </div>
            </div>
          )}

          {/* Comment cards */}
          <div className="comment-list">
            {visible.map((c) => (
              <div key={c.id} className="comment-card-v2">
                <label className="comment-card-v2__check">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleSelect(c.id)}
                  />
                  <span className="checkbox-mark" aria-hidden="true" />
                </label>
                <div className="comment-card-v2__main">
                  <div className="comment-card-v2__header">
                    <span className={`tag ${tagClass[c.tag]}`}>{c.tag}</span>
                    <span className="comment-card-v2__author">{c.author}</span>
                  </div>
                  <div className="comment-card-v2__text">{c.text}</div>
                  {c.replies > 0 && (
                    <button className="comment-card-v2__thread" type="button">
                      💬 {c.replies} {c.replies === 1 ? 'reply' : 'replies'} <span className="comment-card-v2__thread-link">— View thread</span>
                    </button>
                  )}
                </div>
                <div className="comment-card-v2__actions">
                  <button className="btn-tag btn-tag--accept" onClick={() => handleAction(c.id)} type="button">Accept</button>
                  <button className="btn-tag btn-tag--reject" onClick={() => handleAction(c.id)} type="button">Reject</button>
                  <button className="btn-tag btn-tag--escalate" onClick={() => handleAction(c.id)} type="button">Escalate</button>
                </div>
              </div>
            ))}

            {visible.length === 0 && (
              <button
                className="btn-pill btn-pill--primary"
                style={{ alignSelf: 'flex-start', marginTop: 16 }}
                onClick={onNext}
                type="button"
              >
                Continue to Change Log →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Document context + Resolution summary */}
        <aside className="triage-v2__right">
          <section className="doc-context">
            <h3 className="doc-context__title">📄 Document Context</h3>
            <div className="doc-context__card">
              <div className="doc-context__section">Section 12.1 — Safety Evaluation</div>
              <div className="doc-context__table-name">Table 12.1: Summary of Adverse Events</div>
              <table className="doc-context__table">
                <tbody>
                  <tr className="doc-context__row doc-context__row--highlighted">
                    <td>Treatment Group</td>
                    <td className="doc-context__cell-value">N=624</td>
                    <td className="doc-context__cell-tag">← highlighted</td>
                  </tr>
                  <tr className="doc-context__row">
                    <td>Placebo Group</td>
                    <td className="doc-context__cell-value">N=312</td>
                    <td />
                  </tr>
                </tbody>
              </table>
              <div className="doc-context__stats">
                <div>Overall AE Rate: <strong>45.2% vs 38.1%</strong></div>
                <div>SAE Rate: <strong>3.2% vs 2.9%</strong></div>
                <div className="doc-context__ellipsis">…</div>
              </div>
            </div>
          </section>

          <section className="res-summary">
            <h3 className="res-summary__title">Resolution Summary</h3>

            <div className="res-row">
              <div className="res-row__head">
                <span className="res-row__label res-row__label--red">Blockers</span>
                <span className="res-row__count">0/2</span>
              </div>
              <div className="bar">
                <div className="bar__fill bar__fill--red" style={{ width: '1%' }} />
              </div>
            </div>

            <div className="res-row">
              <div className="res-row__head">
                <span className="res-row__label res-row__label--orange">Required</span>
                <span className="res-row__count">5/14</span>
              </div>
              <div className="bar">
                <div className="bar__fill bar__fill--orange" style={{ width: '36%' }} />
              </div>
            </div>

            <div className="res-row">
              <div className="res-row__head">
                <span className="res-row__label res-row__label--blue">Suggestions</span>
                <span className="res-row__count">6/18</span>
              </div>
              <div className="bar">
                <div className="bar__fill bar__fill--blue" style={{ width: '33%' }} />
              </div>
            </div>

            <div className="res-row">
              <div className="res-row__head">
                <span className="res-row__label res-row__label--purple">Questions</span>
                <span className="res-row__count">1/13</span>
              </div>
              <div className="bar">
                <div className="bar__fill bar__fill--purple" style={{ width: '8%' }} />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
