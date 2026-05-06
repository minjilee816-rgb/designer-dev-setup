type Step = {
  readonly id: number
  readonly short: string
}

interface Props {
  steps: readonly Step[]
  current: number
  onChange: (id: number) => void
}

export default function StepNav({ steps, current, onChange }: Props) {
  return (
    <div className="stepnav">
      <span className="stepnav__label">Sarah's flow</span>
      {steps.map((s, i) => (
        <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <button
            className={`stepnav__btn${current === s.id ? ' stepnav__btn--active' : ''}`}
            onClick={() => onChange(s.id)}
          >
            {s.id}. {s.short}
          </button>
          {i < steps.length - 1 && <span className="stepnav__sep">→</span>}
        </span>
      ))}
    </div>
  )
}
