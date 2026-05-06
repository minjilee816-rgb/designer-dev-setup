interface Props {
  onNext: () => void
}

const reviewers = [
  { name: 'Dr. Raj Patel', role: 'Biostatistician', sections: 'Sec 11,12,14', status: 'Complete', statusClass: 'status--green', comments: 12, action: '' },
  { name: 'Lisa Chen', role: 'Regulatory Affairs', sections: 'Sec 1,2,15,16', status: 'In Progress', statusClass: 'status--orange', comments: 8, action: '' },
  { name: 'Maria Santos', role: 'Pharmacovig.', sections: 'Sec 12.3,13', status: 'Not Started', statusClass: 'status--red', comments: 0, action: 'Nudge' },
  { name: 'Tom Bradley', role: 'Data Mgmt', sections: 'Sec 11.1,14.2', status: 'Overdue', statusClass: 'status--red', comments: 7, action: 'Escalate' },
]

export default function Step2Dashboard({ onNext }: Props) {
  return (
    <div className="dash">
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi__label">Progress</div>
          <div className="kpi__value">4/6</div>
        </div>
        <div className="kpi kpi--orange">
          <div className="kpi__label">Comments</div>
          <div className="kpi__value">47</div>
        </div>
        <div className="kpi kpi--red">
          <div className="kpi__label">Blockers</div>
          <div className="kpi__value">2</div>
        </div>
        <div className="kpi kpi--green">
          <div className="kpi__label">Days Left</div>
          <div className="kpi__value">3</div>
        </div>
      </div>

      <h2 className="section-title">Reviewer Progress</h2>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '18%' }}>Reviewer</th>
            <th style={{ width: '15%' }}>Role</th>
            <th style={{ width: '18%' }}>Sections</th>
            <th style={{ width: '12%' }}>Status</th>
            <th style={{ width: '12%' }}>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviewers.map((r) => (
            <tr key={r.name}>
              <td className="name">{r.name}</td>
              <td>{r.role}</td>
              <td>{r.sections}</td>
              <td className={`status ${r.statusClass}`}>{r.status}</td>
              <td>{r.comments}</td>
              <td>{r.action && <button className="action-link">{r.action}</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: '67%' }} />
        <span className="progress-bar__pct">67%</span>
      </div>

      <div className="action-row">
        <button className="btn-pill btn-pill--primary" onClick={onNext}>
          Start Comment Triage
        </button>
        <button className="btn-pill btn-pill--ghost">Send Reminders</button>
      </div>
    </div>
  )
}
