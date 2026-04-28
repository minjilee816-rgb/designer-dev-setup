import { useState, useEffect } from 'react'
import { B2, B3 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { Badge } from '@ids-ts/badge'
import {
  ChevronRight,
  CircleInfo,
  Close,
} from '@design-systems/icons'
import styles from './PastConsentDetailModal.module.css'

export type PastConsentRecord = {
  id: string
  provider: string
  providerWebsite: string
  providerPhone: string
  providerLogoUrl: string
  providerBgColor: string
  providerFallbackColor?: string
  statusLabel: string
  statusDetail: string
  accounts: { name: string; lastFour: string }[]
}

interface PastConsentDetailModalProps {
  record: PastConsentRecord | null
  onClose: () => void
}

type ConsentItem = {
  id: string
  title: string
  details: string
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    id: 'access',
    title: 'What can Intuit Access?',
    details:
      'Account numbers, routing numbers, balances, transaction history (up to 24 months), account type, and account holder information.',
  },
  {
    id: 'usage',
    title: 'How will this data be used?',
    details:
      'Data was used to categorize transactions, reconcile accounts, generate reports, and surface insights across Intuit products.',
  },
  {
    id: 'change',
    title: 'Can I change my mind?',
    details:
      'You can re-link this institution from your connections hub at any time to restart data sharing.',
  },
]

export function PastConsentDetailModal({
  record,
  onClose,
}: PastConsentDetailModalProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    if (!record) return
    setLogoFailed(false)
    setOpenId(null)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [record, onClose])

  if (!record) return null

  const initial = record.provider.trim().charAt(0).toUpperCase()
  const bg = logoFailed
    ? record.providerFallbackColor ?? record.providerBgColor
    : record.providerBgColor
  const isLightBg = bg === '#FFFFFF'

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="past-consent-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <div className={styles.providerRow}>
            <div
              className={styles.providerLogo}
              style={{
                backgroundColor: bg,
                border: isLightBg
                  ? '1px solid var(--color-container-border-primary)'
                  : 'none',
              }}
              aria-hidden="true"
            >
              {logoFailed ? (
                <span
                  className={styles.providerInitial}
                  style={{
                    color: isLightBg ? 'var(--color-text-primary)' : '#FFFFFF',
                  }}
                >
                  {initial}
                </span>
              ) : (
                <img
                  src={record.providerLogoUrl}
                  alt=""
                  className={styles.providerImg}
                  onError={() => setLogoFailed(true)}
                />
              )}
            </div>
            <div className={styles.providerText}>
              <B2
                as="p"
                id="past-consent-detail-title"
                className={styles.providerName}
              >
                {record.provider}
              </B2>
              <B3 as="p" className={styles.providerMeta}>
                {record.providerWebsite}
              </B3>
              <B3 as="p" className={styles.providerMeta}>
                {record.providerPhone}
              </B3>
            </div>
          </div>
          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="More information"
            >
              <CircleInfo size="small" />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <Close size="small" />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.sectionCard}>
            <div className={styles.statusRow}>
              <Badge
                status="draft"
                priority="primary"
                capitalization="caps"
                aria-label={record.statusLabel}
              >
                {record.statusLabel}
              </Badge>
              <B2 as="span" className={styles.statusDetail}>
                {record.statusDetail}
              </B2>
            </div>

            <div className={styles.divider} />

            <div className={styles.accountsRow}>
              <B2 as="span" className={styles.accountsLabel}>
                Accounts
              </B2>
              <div className={styles.accountsList}>
                {record.accounts.map((acc) => (
                  <B2 as="span" key={acc.lastFour} className={styles.accountLine}>
                    {acc.name}{' '}
                    <span className={styles.accountLast}>(…{acc.lastFour})</span>
                  </B2>
                ))}
              </div>
            </div>

            <div className={styles.items}>
              {CONSENT_ITEMS.map((item) => {
                const expanded = openId === item.id
                return (
                  <div key={item.id} className={styles.item}>
                    <button
                      type="button"
                      className={styles.itemHeader}
                      aria-expanded={expanded}
                      onClick={() =>
                        setOpenId((prev) =>
                          prev === item.id ? null : item.id,
                        )
                      }
                    >
                      <ChevronRight
                        size="small"
                        className={`${styles.chev} ${expanded ? styles.chevOpen : ''}`}
                      />
                      <B2 as="span" className={styles.itemTitle}>
                        {item.title}
                      </B2>
                    </button>
                    {expanded && (
                      <B2 as="p" className={styles.itemDetails}>
                        {item.details}
                      </B2>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button priority="secondary" size="medium" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
