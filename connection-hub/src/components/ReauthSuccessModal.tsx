import { useEffect } from 'react'
import { H2 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { CircleCheckFill, Close } from '@design-systems/icons'
import styles from './ReauthSuccessModal.module.css'

interface ReauthSuccessModalProps {
  open: boolean
  onClose: () => void
}

export function ReauthSuccessModal({
  open,
  onClose,
}: ReauthSuccessModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reauth-success-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <Close size="small" />
          </button>
        </div>

        <div className={styles.body}>
          <CircleCheckFill className={styles.icon} aria-hidden="true" />
          <H2 as="h1" id="reauth-success-title" className={styles.title}>
            You're all set!
          </H2>
        </div>

        <div className={styles.footer}>
          <Button priority="primary" size="medium" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}
