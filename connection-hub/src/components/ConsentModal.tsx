import { useState, useEffect } from 'react'
import { H2, B2, B3 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import {
  ArrowsLgLeftRight,
  ChevronRight,
  CircleInfo,
  Close,
} from '@design-systems/icons'
import type { Institution } from './products'
import { InstitutionLogo } from './InstitutionLogo'
import styles from './ConsentModal.module.css'

interface ConsentModalProps {
  institution: Institution | null
  onClose: () => void
  variant?: 'review' | 'gate'
  onAgree?: () => void
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
      'Account numbers, routing numbers, balances, transaction history (up to 24 months), account type, and account holder information. This data populates your financial tools and is never sold or shared with third parties without your explicit consent.',
  },
  {
    id: 'usage',
    title: 'How will this data be used?',
    details:
      'Your data is used to categorize transactions, reconcile accounts, generate reports, and surface insights across Intuit products (QuickBooks, TurboTax, Credit Karma, and Mint). Data is never sold or used for advertising.',
  },
  {
    id: 'change',
    title: 'Can I change my mind?',
    details:
      'Yes. You can unlink this institution or revoke access at any time from your connections hub. Some institutions may require reauthentication every 90 days per regulatory requirements.',
  },
]

export function ConsentModal({
  institution,
  onClose,
  variant = 'review',
  onAgree,
}: ConsentModalProps) {
  const [openId, setOpenId] = useState<string | null>(null)

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
        aria-labelledby="consent-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
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
          <H2 as="h1" id="consent-title" className={styles.title}>
            We need your consent to continue
          </H2>

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
                      setOpenId((prev) => (prev === item.id ? null : item.id))
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

        {variant === 'gate' ? (
          <div className={`${styles.footer} ${styles.footerGate}`}>
            <div className={styles.footerActions}>
              <Button priority="secondary" size="medium" onClick={onClose}>
                Cancel
              </Button>
              <Button
                priority="primary"
                size="medium"
                onClick={onAgree ?? onClose}
              >
                Agree
              </Button>
            </div>
            <B3 as="p" className={styles.terms}>
              By selecting <strong>Agree</strong>, you agree to Intuit's{' '}
              <a href="#" className={styles.termsLink}>
                Terms of Service
              </a>
            </B3>
          </div>
        ) : (
          <div className={styles.footer}>
            <div className={styles.footerActions}>
              <Button priority="primary" size="medium" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
