import { useState, type MouseEvent } from 'react'
import { B2, B3 } from '@ids-ts/typography'
import { Switch } from '@ids-ts/switch'
import {
  ChevronDown,
  CircleCheckFill,
  Refresh,
  TriangleExclamationFill,
} from '@design-systems/icons'
import type { Account } from './products'
import styles from './AccountRow.module.css'

interface AccountRowProps {
  account: Account
  onIntentChange: (intentId: string, enabled: boolean) => void
  onRefresh?: (accountId: string) => void
}

const formatBalance = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

export function AccountRow({ account, onIntentChange, onRefresh }: AccountRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (refreshing) return
    setRefreshing(true)
    onRefresh?.(account.id)
    window.setTimeout(() => setRefreshing(false), 900)
  }

  return (
    <div className={styles.account}>
      <button
        type="button"
        className={styles.summary}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className={styles.accountNameWrap}>
          {account.hasError && (
            <TriangleExclamationFill
              size="small"
              className={styles.errorIcon}
              aria-label="Needs attention"
            />
          )}
          <B2 as="span" className={styles.accountName}>
            {account.name} (…{account.lastFour})
          </B2>
        </span>
        <B2 as="span" className={styles.balance}>
          {formatBalance(account.balance)}
        </B2>
        <B3 as="span" className={styles.updated}>
          {account.lastUpdated}
        </B3>
        <span
          role="button"
          tabIndex={0}
          className={styles.refreshBtn}
          onClick={handleRefresh}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              handleRefresh(e as unknown as MouseEvent<HTMLElement>)
            }
          }}
          aria-label={`Refresh ${account.name}`}
        >
          <Refresh
            size="small"
            className={`${styles.refreshIcon} ${refreshing ? styles.refreshSpinning : ''}`}
          />
        </span>
        <ChevronDown
          size="small"
          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
        />
      </button>

      {expanded && (
        <div className={styles.intents}>
          {account.intents.map((intent) => (
            <div key={intent.id} className={styles.intentRow}>
              <B2 as="span" className={styles.intentLabel}>
                {intent.label}
              </B2>
              {intent.kind === 'checkmark' ? (
                <CircleCheckFill
                  size="small"
                  className={styles.checkIcon}
                  aria-label={intent.enabled ? 'Enabled' : 'Disabled'}
                />
              ) : (
                <Switch
                  aria-label={intent.label}
                  checked={intent.enabled}
                  onChange={() => onIntentChange(intent.id, !intent.enabled)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
