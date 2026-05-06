interface Props {
  onNext: () => void
}

const changes = [
  { status: '✓ Applied', cls: 'status--applied', text: 'Table 12.1: Updated N=624' },
  { status: '✓ Applied', cls: 'status--applied', text: 'Table 11.4: Added Bonferroni footnote' },
  { status: '✓ Applied', cls: 'status--applied', text: 'Sec 2.1: Added ICH E9(R1) reference' },
  { status: '✗ Rejected', cls: 'status--rejected', text: 'Sec 12.2: Remove per-protocol ref' },
  { status: '⚡ Escalated', cls: 'status--escalated', text: 'Fig 12.3: Forest plot regeneration' },
  { status: '⏳ Deferred', cls: 'status--deferred', text: 'Forest plot label styling' },
]

export default function Step4ChangeLog({ onNext }: Props) {
  return (
    <div className="changelog">
      <div>
        <h2 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Change Log</h2>
        <div className="changelog__list">
          {changes.map((c) => (
            <div key={c.text} className="change-row">
              <div className={`change-row__status ${c.cls}`}>{c.status}</div>
              <div className="change-row__text">{c.text}</div>
            </div>
          ))}
        </div>
      </div>

      <aside className="summary-side">
        <h3>Summary</h3>
        <ul>
          <li>3 changes applied</li>
          <li>1 rejected (with rationale)</li>
          <li>1 escalated to director</li>
          <li>1 deferred to next cycle</li>
          <li style={{ height: 8 }} />
          <li>0 open blockers</li>
        </ul>
        <button className="btn-primary" style={{ width: '100%', height: 40 }} onClick={onNext} type="button">
          Submit for Sign-off →
        </button>
      </aside>
    </div>
  )
}
