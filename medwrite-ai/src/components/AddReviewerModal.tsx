import { useEffect, useRef, useState } from 'react'

export interface NewReviewer {
  name: string
  role: string
  sections: string
  deadline: string
}

interface Props {
  open: boolean
  defaultDeadline: string
  onClose: () => void
  onAdd: (r: NewReviewer) => void
}

const roles = [
  'Biostatistician',
  'Regulatory Affairs',
  'Pharmacovigilance',
  'Data Management',
  'Medical Writer',
  'Clinical Operations',
  'Other',
]

export default function AddReviewerModal({ open, defaultDeadline, onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState(roles[0])
  const [sections, setSections] = useState('')
  const [deadline, setDeadline] = useState(defaultDeadline)
  const [touched, setTouched] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Reset state every time the modal opens
  useEffect(() => {
    if (open) {
      setName('')
      setRole(roles[0])
      setSections('')
      setDeadline(defaultDeadline)
      setTouched(false)
      // Focus the first field after the modal mounts
      setTimeout(() => firstInputRef.current?.focus(), 0)
    }
  }, [open, defaultDeadline])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const isValid = name.trim().length > 0 && role.trim().length > 0 && deadline.trim().length > 0

  const submit = () => {
    setTouched(true)
    if (!isValid) return
    onAdd({
      name: name.trim(),
      role: role.trim(),
      sections: sections.trim() || '—',
      deadline: deadline.trim(),
    })
  }

  return (
    <div className="modal__backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-reviewer-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h3 id="add-reviewer-title" className="modal__title">Add Reviewer</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close" type="button">×</button>
        </header>

        <div className="modal__body">
          <div className="field">
            <label className="field__label" htmlFor="ar-name">Full Name *</label>
            <input
              id="ar-name"
              ref={firstInputRef}
              className="input input--wide"
              placeholder="e.g. Dr. Anita Kim"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {touched && !name.trim() && <div className="field__warn">⚠ Name is required</div>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="ar-role">Role *</label>
            <select
              id="ar-role"
              className="input input--wide"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="ar-sections">Sections to review</label>
            <input
              id="ar-sections"
              className="input input--wide"
              placeholder="e.g. Sec 11, 12.3, 14"
              value={sections}
              onChange={(e) => setSections(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="ar-deadline">Deadline *</label>
            <input
              id="ar-deadline"
              className="input input--wide"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <footer className="modal__footer">
          <button className="btn-pill btn-pill--ghost" onClick={onClose} type="button">Cancel</button>
          <button className="btn-pill btn-pill--primary" onClick={submit} type="button">
            Add Reviewer
          </button>
        </footer>
      </div>
    </div>
  )
}
