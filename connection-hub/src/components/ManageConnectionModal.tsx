import { useState, useEffect } from 'react'
import { H1, H2, B2, B3 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { Switch } from '@ids-ts/switch'
import {
  ArrowsLgLeftRight,
  ChevronDown,
  Close,
  TriangleExclamationFill,
} from '@design-systems/icons'
import type { Institution, Account, Intent } from './products'
import { InstitutionLogo } from './InstitutionLogo'
import { ConsentModal } from './ConsentModal'
import { UnlinkConfirmModal } from './UnlinkConfirmModal'
import {
  ToggleConfirmModal,
  type ToggleConfirmIntent,
} from './ToggleConfirmModal'
import styles from './ManageConnectionModal.module.css'

const PRODUCT_NAME: Record<string, string> = {
  quickbooks: 'QuickBooks',
  turbotax: 'TurboTax',
  creditkarma: 'Credit Karma',
  intuit: 'Intuit',
}

interface ManageConnectionModalProps {
  institution: Institution | null
  product?: 'quickbooks' | 'turbotax' | 'creditkarma' | 'intuit'
  onClose: () => void
  onIntentChange: (accountId: string, intentId: string, enabled: boolean) => void
  onUnlink: (id: string) => void
}

const formatBalance = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

export function ManageConnectionModal({
  institution,
  product = 'intuit',
  onClose,
  onIntentChange,
  onUnlink,
}: ManageConnectionModalProps) {
  const [consentOpen, setConsentOpen] = useState(false)
  const [unlinkOpen, setUnlinkOpen] = useState(false)
  const [pendingToggle, setPendingToggle] =
    useState<ToggleConfirmIntent | null>(null)

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
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.closeTop}`}
            onClick={onClose}
            aria-label="Close"
          >
            <Close size="small" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.hero}>
            <div className={styles.logoPair} aria-hidden="true">
              <div className={`${styles.providerLogo} ${styles.intuitLogo}`}>
                <span className={styles.intuitWordmark}>intuit</span>
              </div>
              <ArrowsLgLeftRight size="small" className={styles.logoArrows} />
              <InstitutionLogo
                institution={institution}
                className={styles.providerLogo}
              />
            </div>
            <H2 as="h1" id="manage-title" className={styles.heroTitle}>
              Manage {institution.name}
            </H2>
          </div>

          {institution.reauthNotice && (
            <div className={styles.banner} role="alert">
              <TriangleExclamationFill
                size="small"
                className={styles.bannerIcon}
              />
              <B3 as="p" className={styles.bannerText}>
                {institution.reauthNotice.message}{' '}
                <span className={styles.bannerCode}>
                  ({institution.reauthNotice.errorCode})
                </span>
              </B3>
              <Button priority="tertiary" size="small">
                Fix now
              </Button>
            </div>
          )}

          <div className={styles.accountsList}>
            {institution.accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                product={product}
                onIntentRequest={(intent, nextEnabled) =>
                  setPendingToggle({
                    accountId: account.id,
                    accountName: account.name,
                    intentId: intent.id,
                    intentLabel: intent.label,
                    nextEnabled,
                  })
                }
              />
            ))}
          </div>

          {product === 'turbotax' && (
            <ConnectionImportTaxDoc
              institution={institution}
              onRequest={(nextEnabled) =>
                setPendingToggle({
                  accountId: '__connection__',
                  accountName: institution.name,
                  intentId: '__connection-tax__',
                  intentLabel: 'Import tax document',
                  nextEnabled,
                  scope: 'connection',
                })
              }
            />
          )}

        </div>

        <div className={styles.footer}>
          <Button
            priority="tertiary"
            purpose="destructive"
            size="medium"
            onClick={() => setUnlinkOpen(true)}
          >
            Unlink
          </Button>
          <div className={styles.footerRight}>
            <Button
              priority="secondary"
              size="medium"
              onClick={() => setConsentOpen(true)}
            >
              View consent
            </Button>
            <Button priority="primary" size="medium" onClick={onClose}>
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <ConsentModal
        institution={consentOpen ? institution : null}
        onClose={() => setConsentOpen(false)}
      />

      <UnlinkConfirmModal
        institution={unlinkOpen ? institution : null}
        onClose={() => setUnlinkOpen(false)}
        onConfirm={() => {
          onUnlink(institution.id)
          setUnlinkOpen(false)
          onClose()
        }}
        onViewConsent={() => {
          setUnlinkOpen(false)
          setConsentOpen(true)
        }}
      />

      <ToggleConfirmModal
        institution={pendingToggle ? institution : null}
        pendingToggle={pendingToggle}
        appName={PRODUCT_NAME[product] ?? 'this app'}
        onClose={() => setPendingToggle(null)}
        onConfirm={() => {
          if (pendingToggle) {
            if (pendingToggle.scope === 'connection') {
              institution.accounts.forEach((account) => {
                const intent = account.intents.find((i) =>
                  i.id.endsWith('-tax'),
                )
                if (intent && intent.enabled !== pendingToggle.nextEnabled) {
                  onIntentChange(account.id, intent.id, pendingToggle.nextEnabled)
                }
              })
            } else {
              onIntentChange(
                pendingToggle.accountId,
                pendingToggle.intentId,
                pendingToggle.nextEnabled,
              )
            }
          }
          setPendingToggle(null)
        }}
      />
    </div>
  )
}

function AccountCard({
  account,
  product,
  onIntentRequest,
}: {
  account: Account
  product: 'quickbooks' | 'turbotax' | 'creditkarma' | 'intuit'
  onIntentRequest: (intent: Intent, nextEnabled: boolean) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const visibleIntents = account.intents.filter((intent) => {
    if (product === 'quickbooks' && intent.id.endsWith('-tax')) return false
    if (product === 'turbotax' && intent.id.endsWith('-sync')) return false
    if (product === 'turbotax' && intent.id.endsWith('-tax')) return false
    if (product === 'creditkarma' && intent.id.endsWith('-tax')) return false
    return true
  })

  return (
    <div className={styles.accountCard}>
      <div className={styles.accountMain}>
        <div className={styles.accountLabelRow}>
          {account.hasError && (
            <TriangleExclamationFill
              size="small"
              className={styles.accountErrorIcon}
              aria-label="Error"
            />
          )}
          <B3 as="span" className={styles.accountLabel}>
            {account.name} (…{account.lastFour})
          </B3>
        </div>
        <H1 className={styles.accountBalance}>
          {formatBalance(account.balance)}
        </H1>
        <B3 as="p" className={styles.accountUpdated}>
          {account.lastUpdated}
        </B3>
      </div>

      <button
        type="button"
        className={`${styles.viewDetails} ${expanded ? styles.viewDetailsOpen : ''}`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <B2 as="span" className={styles.viewDetailsLabel}>
          View details
        </B2>
        <ChevronDown
          size="small"
          className={`${styles.viewChev} ${expanded ? styles.viewChevOpen : ''}`}
        />
      </button>

      {expanded && (
        <div className={styles.intents}>
          {visibleIntents.map((intent) => (
            <IntentToggle
              key={intent.id}
              intent={intent}
              disabled={account.hasError}
              onChange={(enabled) => onIntentRequest(intent, enabled)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function IntentToggle({
  intent,
  disabled,
  onChange,
}: {
  intent: Intent
  disabled?: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div
      className={`${styles.intentRow} ${disabled ? styles.intentRowDisabled : ''}`}
    >
      <B2 as="span" className={styles.intentLabel}>
        {intent.label}
      </B2>
      <Switch
        aria-label={intent.label}
        checked={intent.enabled}
        disabled={disabled}
        onChange={() => !disabled && onChange(!intent.enabled)}
      />
    </div>
  )
}

function ConnectionImportTaxDoc({
  institution,
  onRequest,
}: {
  institution: Institution
  onRequest: (nextEnabled: boolean) => void
}) {
  const taxIntents = institution.accounts
    .map((acc) => acc.intents.find((i) => i.id.endsWith('-tax')))
    .filter((i): i is Intent => Boolean(i))
  if (taxIntents.length === 0) return null
  const enabled = taxIntents.some((i) => i.enabled)
  const allErrored = institution.accounts.every((a) => a.hasError)

  return (
    <div className={styles.connectionIntent}>
      <B2 as="span" className={styles.intentLabel}>
        Import tax document
      </B2>
      <Switch
        aria-label="Import tax document"
        checked={enabled}
        disabled={allErrored}
        onChange={() => !allErrored && onRequest(!enabled)}
      />
    </div>
  )
}
