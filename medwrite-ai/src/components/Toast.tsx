import { useEffect } from 'react'

export type ToastKind = 'success' | 'info' | 'warning' | 'danger'

export interface ToastMessage {
  id: number
  kind: ToastKind
  text: string
}

interface Props {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

const iconFor: Record<ToastKind, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  danger: '🔴',
}

export default function ToastHost({ toasts, onDismiss }: Props) {
  return (
    <div className="toast-host" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 4200)
    return () => clearTimeout(id)
  }, [toast.id, onDismiss])

  return (
    <div className={`toast-item toast-item--${toast.kind}`}>
      <span className="toast-item__icon">{iconFor[toast.kind]}</span>
      <span className="toast-item__text">{toast.text}</span>
      <button className="toast-item__close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss" type="button">×</button>
    </div>
  )
}
