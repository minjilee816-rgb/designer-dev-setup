import { useEffect } from 'react'
import { H2, B2 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { CircleCheckFill } from '@design-systems/icons'
import styles from './UnlinkSuccessModal.module.css'

interface UnlinkSuccessModalProps {
  open: boolean
  institutionName: string | null
  onClose: () => void
}

export function UnlinkSuccessModal({
  open,
  institutionName,
  onClose,
}: UnlinkSuccessModalProps) {
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
        aria-labelledby="unlink-success-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.body}>
          <CircleCheckFill className={styles.icon} aria-hidden="true" />
          <H2 as="h1" id="unlink-success-title" className={styles.title}>
            You unlinked your accounts
          </H2>
          <B2 as="p" className={styles.description}>
            Intuit can no longer access data from your {institutionName}{' '}
            accounts. This action only applies to this account connection
            between {institutionName} and Intuit. Visit{' '}
            <a href="#" className={styles.link}>
              Your past consents
            </a>{' '}
            to see details about this account connection.
          </B2>
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
