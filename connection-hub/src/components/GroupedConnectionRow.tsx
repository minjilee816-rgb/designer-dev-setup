import { ChevronRight, ChevronDown } from '@design-systems/icons'
import { Badge } from '@ids-ts/badge'
import { B2, B3 } from '@ids-ts/typography'
import type { Institution, ConnectionStatus } from './products'
import { InstitutionLogo } from './InstitutionLogo'
import styles from './GroupedConnectionRow.module.css'

interface GroupedConnectionRowProps {
  name: string
  institutions: Institution[]
  expanded: boolean
  onToggle: () => void
  onOpenChild: (id: string) => void
  onFixChild: (id: string) => void
}

const STATUS_BADGE: Record<ConnectionStatus, 'success' | 'error' | 'warning'> = {
  active: 'success',
  expired: 'error',
  lapsed: 'warning',
  canceled: 'warning',
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  lapsed: 'Lapsed',
  canceled: 'Canceled',
}

function summarizeAccounts(institution: Institution): string | null {
  const lastFours = institution.accounts.map((a) => `…${a.lastFour}`)
  if (lastFours.length === 0) return null
  if (lastFours.length <= 2) return lastFours.join(', ')
  return `${lastFours.slice(0, 2).join(', ')}, +${lastFours.length - 2}`
}

export function GroupedConnectionRow({
  name,
  institutions,
  expanded,
  onToggle,
  onOpenChild,
  onFixChild,
}: GroupedConnectionRowProps) {
  const count = institutions.length
  const representative = institutions[0]

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.summary}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <InstitutionLogo institution={representative} className={styles.logo} />
        <div className={styles.text}>
          <B2 as="span" className={styles.name}>
            {name}
          </B2>
          <B3 as="span" className={styles.subtitle}>
            {count} connections
          </B3>
        </div>
        <span className={styles.summaryChev}>
          <ChevronDown
            size="small"
            className={`${styles.chevDown} ${expanded ? styles.chevDownOpen : ''}`}
          />
        </span>
      </button>

      {expanded && (
        <div className={styles.children}>
          {institutions.map((institution) => {
            const summary = summarizeAccounts(institution)
            const isError =
              institution.status === 'expired' || institution.status === 'lapsed'
            return (
              <button
                key={institution.id}
                type="button"
                className={styles.childRow}
                onClick={() =>
                  isError
                    ? onFixChild(institution.id)
                    : onOpenChild(institution.id)
                }
                aria-label={`Manage ${institution.name}`}
              >
                <div className={styles.childText}>
                  <B2 as="span" className={styles.childName}>
                    {institution.name}
                  </B2>
                  {summary && (
                    <B3 as="span" className={styles.childSubtitle}>
                      {summary}
                    </B3>
                  )}
                </div>
                <Badge
                  status={STATUS_BADGE[institution.status]}
                  priority="primary"
                  capitalization="caps"
                  aria-label={STATUS_LABEL[institution.status]}
                >
                  {STATUS_LABEL[institution.status]}
                </Badge>
                <ChevronRight size="small" className={styles.childChev} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
