import { useEffect, useRef, useState } from 'react'

export type MessageKind = 'nudge' | 'reminder'

export interface MessageRecipient {
  name: string
  role: string
  sections: string
  avatarColor: string
  initial: string
  daysSinceLastUpdate?: number
}

interface Props {
  open: boolean
  kind: MessageKind
  recipient: MessageRecipient | null
  onClose: () => void
  onSend: (payload: { kind: MessageKind; channel: Channel; body: string }) => void
}

type Channel = 'email' | 'slack' | 'both'

const meta: Record<MessageKind, { title: string; cta: string; tone: string }> = {
  nudge: {
    title: 'Send Nudge',
    cta: 'Send Nudge',
    tone: 'Friendly check-in',
  },
  reminder: {
    title: 'Send Reminder',
    cta: 'Send Reminder',
    tone: 'Formal reminder',
  },
}

const buildTemplate = (kind: MessageKind, r: MessageRecipient): string => {
  if (kind === 'nudge') {
    return `Hi ${r.name.split(' ')[0]} —\n\nQuick check-in on your review of ${r.sections}. We're targeting end of cycle in 3 days. Let me know if you're running into any blockers or need anything from me.\n\nThanks!`
  }
  return `Hi ${r.name.split(' ')[0]},\n\nThis is a reminder that your review of ${r.sections} has not yet started${r.daysSinceLastUpdate ? ` (last activity: ${r.daysSinceLastUpdate}d ago)` : ''}. The cycle deadline is May 15. Please begin your review or let me know if you need a deadline extension.\n\nThanks for your prompt attention.`
}

export default function SendMessageModal({ open, kind, recipient, onClose, onSend }: Props) {
  const [channel, setChannel] = useState<Channel>('both')
  const [body, setBody] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && recipient) {
      setChannel('both')
      setBody(buildTemplate(kind, recipient))
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open, kind, recipient])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !recipient) return null

  const m = meta[kind]
  const canSend = body.trim().length > 0

  return (
    <div className="modal__backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-msg-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <h3 id="send-msg-title" className="modal__title">{m.title}</h3>
            <div className="modal__subtitle">{m.tone} · {recipient.name}</div>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close" type="button">×</button>
        </header>

        <div className="modal__body">
          <div className="msg-recipient">
            <span className="msg-recipient__avatar" style={{ background: recipient.avatarColor }}>
              {recipient.initial}
            </span>
            <div>
              <div className="msg-recipient__name">{recipient.name}</div>
              <div className="msg-recipient__role">{recipient.role} · {recipient.sections}</div>
            </div>
          </div>

          <div className="field">
            <label className="field__label">Channel</label>
            <div className="seg-chip-row">
              {(['email', 'slack', 'both'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`seg-chip${channel === c ? ' seg-chip--active' : ''}`}
                  onClick={() => setChannel(c)}
                >
                  {c === 'email' ? '✉️ Email' : c === 'slack' ? '💬 Slack' : '✉️💬 Both'}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="msg-body">Message</label>
            <textarea
              id="msg-body"
              ref={textareaRef}
              className="cover-note"
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="msg-hint">⌘↵ to send · Esc to cancel · template is editable</div>
          </div>
        </div>

        <footer className="modal__footer">
          <button className="btn-pill btn-pill--ghost" onClick={onClose} type="button">Cancel</button>
          <button
            className="btn-pill btn-pill--primary"
            type="button"
            disabled={!canSend}
            onClick={() => onSend({ kind, channel, body: body.trim() })}
          >
            {m.cta} →
          </button>
        </footer>
      </div>
    </div>
  )
}
