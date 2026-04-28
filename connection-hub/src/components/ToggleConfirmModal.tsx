import { useEffect } from 'react'
import { H2, B2, B3 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { Close } from '@design-systems/icons'
import type { Institution } from './products'
import { InstitutionLogo } from './InstitutionLogo'
import styles from './ToggleConfirmModal.module.css'

export type ToggleConfirmIntent = {
  accountId: string
  accountName: string
  intentId: string
  intentLabel: string
  nextEnabled: boolean
  scope?: 'account' | 'connection'
}

interface ToggleConfirmModalProps {
  institution: Institution | null
  pendingToggle: ToggleConfirmIntent | null
  appName?: string
  onClose: () => void
  onConfirm: () => void
}

export function ToggleConfirmModal({
  institution,
  pendingToggle,
  appName = 'this app',
  onClose,
  onConfirm,
}: ToggleConfirmModalProps) {
  useEffect(() => {
    if (!pendingToggle || !institution) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [pendingToggle, institution, onClose])

  if (!pendingToggle || !institution) return null

  const isDisabling = !pendingToggle.nextEnabled
  const isConnectionScope = pendingToggle.scope === 'connection'
  const title = isConnectionScope
    ? isDisabling
      ? `Disable ${pendingToggle.intentLabel.toLowerCase()}?`
      : `Enable ${pendingToggle.intentLabel.toLowerCase()}?`
    : isDisabling
      ? 'Disable this account?'
      : 'Enable this account?'
  const description = isConnectionScope
    ? isDisabling
      ? `We'll stop importing tax documents from ${institution.name} into ${appName}.`
      : `We'll start importing tax documents from ${institution.name} into ${appName}.`
    : isDisabling
      ? `We'll stop importing new transactions from ${pendingToggle.accountName} into ${appName}.`
      : `We'll start importing transactions from ${pendingToggle.accountName} into ${appName}.`

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="toggle-confirm-title"
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
          <H2 as="h1" id="toggle-confirm-title" className={styles.title}>
            {title}
          </H2>
          <B2 as="p" className={styles.description}>
            {description}
          </B2>
        </div>

        <div className={styles.footer}>
          <Button priority="secondary" size="medium" onClick={onClose}>
            Cancel
          </Button>
          {isDisabling ? (
            <Button
              priority="secondary"
              purpose="destructive"
              size="medium"
              onClick={onConfirm}
            >
              Disable now
            </Button>
          ) : (
            <Button priority="primary" size="medium" onClick={onConfirm}>
              Enable now
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
