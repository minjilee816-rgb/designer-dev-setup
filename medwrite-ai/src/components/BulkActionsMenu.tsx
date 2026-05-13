import { useEffect, useRef } from 'react'

export type BulkAction = 'message' | 'deadline' | 'escalate' | 'export'

interface Props {
  open: boolean
  selectedCount: number
  onClose: () => void
  onAction: (action: BulkAction) => void
}

const items: { id: BulkAction; icon: string; label: string; hint?: string; danger?: boolean }[] = [
  { id: 'message', icon: '✉️', label: 'Send Message to Selected', hint: 'One nudge to everyone in this list' },
  { id: 'deadline', icon: '📅', label: 'Adjust Deadline', hint: 'Push the deadline for these reviewers only' },
  { id: 'escalate', icon: '🔴', label: 'Escalate Selected', hint: 'Route to manager(s)', danger: true },
  { id: 'export', icon: '📊', label: 'Export Selection as CSV', hint: 'For weekly status reports' },
]

export default function BulkActionsMenu({ open, selectedCount, onClose, onAction }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="bulk-menu" ref={ref} role="menu">
      <div className="bulk-menu__head">
        <strong>{selectedCount}</strong> reviewer{selectedCount === 1 ? '' : 's'} selected
      </div>
      <div className="bulk-menu__list">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            role="menuitem"
            className={`bulk-menu__item${it.danger ? ' bulk-menu__item--danger' : ''}`}
            onClick={() => onAction(it.id)}
          >
            <span className="bulk-menu__icon">{it.icon}</span>
            <span className="bulk-menu__text">
              <span className="bulk-menu__label">{it.label}</span>
              {it.hint && <span className="bulk-menu__hint">{it.hint}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
