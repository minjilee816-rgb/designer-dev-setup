import { useEffect, useRef, useState } from 'react'

export interface Reply {
  id: number
  author: string
  role?: string
  avatarColor: string
  initial: string
  time: string
  body: string
  isYou?: boolean
}

export interface ThreadComment {
  id: number
  tag: 'Blocker' | 'Required' | 'Suggestion' | 'Question'
  author: string
  role?: string
  avatarColor: string
  initial: string
  time: string
  text: string
  replies: Reply[]
}

interface Props {
  open: boolean
  comment: ThreadComment | null
  onClose: () => void
  onReply: (body: string) => void
  onAction: (action: 'accept' | 'reject' | 'escalate') => void
}

const tagClass: Record<ThreadComment['tag'], string> = {
  Blocker: 'tag--blocker',
  Required: 'tag--required',
  Suggestion: 'tag--question',
  Question: 'tag--question',
}

export default function ThreadDrawer({ open, comment, onClose, onReply, onAction }: Props) {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset draft when opening for a different comment
  useEffect(() => {
    if (open) {
      setDraft('')
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [open, comment?.id])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !comment) return null

  const submit = () => {
    if (draft.trim().length === 0) return
    onReply(draft.trim())
    setDraft('')
  }

  const onTextareaKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Comment thread">
        <header className="drawer__header">
          <div className="drawer__title-row">
            <h3 className="drawer__title">Thread</h3>
            <button className="drawer__close" onClick={onClose} aria-label="Close thread" type="button">×</button>
          </div>
          <div className="drawer__actions">
            <button className="btn-tag btn-tag--accept" onClick={() => onAction('accept')} type="button">Accept</button>
            <button className="btn-tag btn-tag--reject" onClick={() => onAction('reject')} type="button">Reject</button>
            <button className="btn-tag btn-tag--escalate" onClick={() => onAction('escalate')} type="button">Escalate</button>
          </div>
        </header>

        <div className="drawer__body">
          {/* Pinned original comment */}
          <article className="thread-original">
            <div className="thread-original__head">
              <span className={`tag ${tagClass[comment.tag]}`}>{comment.tag}</span>
              <span className="thread-msg__author">{comment.author}</span>
              {comment.role && <span className="thread-msg__role">· {comment.role}</span>}
              <span className="thread-msg__time">{comment.time}</span>
            </div>
            <div className="thread-original__text">{comment.text}</div>
          </article>

          {comment.replies.length > 0 && (
            <div className="thread-divider">
              <span className="thread-divider__line" />
              <span className="thread-divider__label">
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
              <span className="thread-divider__line" />
            </div>
          )}

          <div className="thread-replies">
            {comment.replies.map((r) => (
              <div key={r.id} className={`thread-msg${r.isYou ? ' thread-msg--you' : ''}`}>
                <div className="thread-msg__avatar" style={{ background: r.avatarColor }}>{r.initial}</div>
                <div className="thread-msg__body">
                  <div className="thread-msg__head">
                    <span className="thread-msg__author">{r.author}</span>
                    {r.role && <span className="thread-msg__role">· {r.role}</span>}
                    <span className="thread-msg__time">{r.time}</span>
                  </div>
                  <div className="thread-msg__bubble">{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="drawer__footer">
          <div className="thread-reply">
            <div className="thread-msg__avatar thread-msg__avatar--you">Y</div>
            <div className="thread-reply__field">
              <textarea
                ref={textareaRef}
                className="thread-reply__textarea"
                placeholder="Reply to this thread… (⌘↵ to send)"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onTextareaKey}
                rows={3}
              />
              <div className="thread-reply__bar">
                <span className="thread-reply__hint">Replying as <strong>You</strong></span>
                <button
                  className="btn-pill btn-pill--primary"
                  onClick={submit}
                  disabled={draft.trim().length === 0}
                  type="button"
                >
                  Send reply →
                </button>
              </div>
            </div>
          </div>
        </footer>
      </aside>
    </>
  )
}
