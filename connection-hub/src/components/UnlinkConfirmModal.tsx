import { useEffect } from 'react'
import { H2, B2, B3 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { Close } from '@design-systems/icons'
import type { Institution } from './products'
import { InstitutionLogo } from './InstitutionLogo'
import styles from './UnlinkConfirmModal.module.css'

interface UnlinkConfirmModalProps {
  institution: Institution | null
  onClose: () => void
  onConfirm: () => void
  onViewConsent: () => void
}

export function UnlinkConfirmModal({
  institution,
  onClose,
  onConfirm,
  onViewConsent,
}: UnlinkConfirmModalProps) {
  useEffect(() => {
    if (!institution) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [institution, onClose])

  if (!institution) return null

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlink-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <div className={styles.providerRow}>
            <InstitutionLogo
              institution={institution}
              className={styles.providerLogo}
            />
            <div className={styles.providerText}>
              <B2 as="p" className={styles.providerName}>
                {institution.name}
              </B2>
              <B3 as="p" className={styles.providerMeta}>
                {institution.website}
              </B3>
              <B3 as="p" className={styles.providerMeta}>
                {institution.phone}
              </B3>
            </div>
          </div>
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
          <H2 as="h1" id="unlink-title" className={styles.title}>
            You're unlinking your {institution.name} accounts
          </H2>
          <B2 as="p" className={styles.description}>
            When you unlink, you withdraw your consent for Intuit to access data
            from the following accounts. {institution.name} will keep the data
            they've already collected. You can link your accounts again at any
            time.
          </B2>

          <div className={styles.accountList}>
            {institution.accounts.map((account) => (
              <div key={account.id} className={styles.accountRow}>
                <B2 as="span" className={styles.accountName}>
                  {account.name}
                </B2>
                <B2 as="span" className={styles.accountLast}>
                  …{account.lastFour}
                </B2>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Button priority="tertiary" size="medium" onClick={onViewConsent}>
            View consent
          </Button>
          <div className={styles.footerRight}>
            <Button priority="secondary" size="medium" onClick={onClose}>
              Cancel
            </Button>
            <Button
              priority="primary"
              purpose="destructive"
              size="medium"
              onClick={onConfirm}
            >
              Unlink now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
