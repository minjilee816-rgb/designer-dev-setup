import { B2, B3 } from '@ids-ts/typography'
import { Badge } from '@ids-ts/badge'
import { Button } from '@ids-ts/button'
import { ChevronRight, TriangleExclamationFill } from '@design-systems/icons'
import type { Institution, ConnectionStatus } from './products'
import { InstitutionLogo } from './InstitutionLogo'
import styles from './ConnectionRow.module.css'

interface ConnectionRowProps {
  institution: Institution
  onOpen: () => void
  onFix?: () => void
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  active: 'Active',
  lapsed: 'Lapsed',
  expired: 'Expired',
  canceled: 'Canceled',
}

const STATUS_BADGE: Record<
  ConnectionStatus,
  'success' | 'warning' | 'error' | 'info'
> = {
  active: 'success',
  lapsed: 'warning',
  expired: 'error',
  canceled: 'info',
}

export function ConnectionRow({ institution, onOpen, onFix }: ConnectionRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={`Manage ${institution.name} connection`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.cardMain}>
        <InstitutionLogo institution={institution} className={styles.logo} />

        <B2 as="span" className={styles.name}>
          {institution.name}
        </B2>

        <div className={styles.trailing}>
          <Badge
            status={STATUS_BADGE[institution.status]}
            priority="primary"
            capitalization="caps"
            aria-label={STATUS_LABEL[institution.status]}
          >
            {STATUS_LABEL[institution.status]}
          </Badge>
          <ChevronRight
            size="small"
            className={styles.chevron}
            aria-hidden="true"
          />
        </div>
      </div>

      {institution.reauthNotice && (
        <div
          className={styles.bannerWrap}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.banner}
            role="alert"
            tabIndex={0}
            onClick={() => onFix?.()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onFix?.()
              }
            }}
          >
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
            <Button
              priority="tertiary"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onFix?.()
              }}
            >
              Fix now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
