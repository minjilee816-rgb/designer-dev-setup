import { useState, useEffect, useMemo } from 'react'
import { H2, B2, B3 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { Badge } from '@ids-ts/badge'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Close,
} from '@design-systems/icons'
import {
  PastConsentDetailModal,
  type PastConsentRecord,
} from './PastConsentDetailModal'
import styles from './PastConsentsModal.module.css'

interface PastConsentsModalProps {
  open: boolean
  onClose: () => void
  records?: ConsentRecord[]
}

export type ConsentRecordStatus = 'withdrawn' | 'canceled'

export type ConsentRecord = {
  id: string
  provider: string
  start: string
  end: string
  status: ConsentRecordStatus
  detail: PastConsentRecord
}

export const SEED_RECORDS: ConsentRecord[] = [
  {
    id: '1',
    provider: 'Chase',
    start: 'Jan 02, 2024',
    end: 'You withdrew on Feb 10, 2026',
    status: 'withdrawn',
    detail: {
      id: '1',
      provider: 'Chase',
      providerWebsite: 'www.chase.com',
      providerPhone: '1-800-933-6262',
      providerLogoUrl: 'https://cdn.simpleicons.org/chase/FFFFFF',
      providerBgColor: '#117ACA',
      statusLabel: 'Withdrawn',
      statusDetail: 'You withdrew on Feb 10, 2026',
      accounts: [
        { name: 'Personal Checking', lastFour: '1605' },
        { name: 'Business Savings', lastFour: '7685' },
      ],
    },
  },
  {
    id: '2',
    provider: 'Navy Federal',
    start: 'Dec 02, 2023',
    end: 'You withdrew on Jun 06, 2025',
    status: 'withdrawn',
    detail: {
      id: '2',
      provider: 'Navy Federal',
      providerWebsite: 'www.navyfederal.org',
      providerPhone: '1-888-842-6328',
      providerLogoUrl: 'https://logo.clearbit.com/navyfederal.org',
      providerBgColor: '#FFFFFF',
      providerFallbackColor: '#003366',
      statusLabel: 'Withdrawn',
      statusDetail: 'You withdrew on Jun 06, 2025',
      accounts: [{ name: 'Checking', lastFour: '2208' }],
    },
  },
  {
    id: '3',
    provider: 'US Bank',
    start: 'Aug 27, 2024',
    end: 'You withdrew at bank on May 12, 2025',
    status: 'withdrawn',
    detail: {
      id: '3',
      provider: 'US Bank',
      providerWebsite: 'www.usbank.com',
      providerPhone: '1-800-872-2657',
      providerLogoUrl: 'https://logo.clearbit.com/usbank.com',
      providerBgColor: '#FFFFFF',
      providerFallbackColor: '#0C2074',
      statusLabel: 'Withdrawn',
      statusDetail: 'You withdrew at bank on May 12, 2025',
      accounts: [
        { name: 'Savings', lastFour: '4487' },
        { name: 'Credit Card', lastFour: '9012' },
      ],
    },
  },
  {
    id: '4',
    provider: 'Ally Financial',
    start: 'Feb 18, 2022',
    end: 'Canceled by Intuit on Apr 12, 2025',
    status: 'canceled',
    detail: {
      id: '4',
      provider: 'Ally Financial',
      providerWebsite: 'www.ally.com',
      providerPhone: '1-877-247-2559',
      providerLogoUrl: 'https://logo.clearbit.com/ally.com',
      providerBgColor: '#FFFFFF',
      providerFallbackColor: '#6B2C91',
      statusLabel: 'Canceled',
      statusDetail: 'Canceled by Intuit on Apr 12, 2025',
      accounts: [{ name: 'Online Savings', lastFour: '5512' }],
    },
  },
]

const STATUS_LABEL: Record<ConsentRecordStatus, string> = {
  withdrawn: 'Withdrawn',
  canceled: 'Canceled',
}

const PAGE_SIZE = 10

export function PastConsentsModal({
  open,
  onClose,
  records = SEED_RECORDS,
}: PastConsentsModalProps) {
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<PastConsentRecord | null>(null)

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

  const providers = useMemo(
    () => Array.from(new Set(records.map((r) => r.provider))),
    [records],
  )

  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (providerFilter === 'all' || r.provider === providerFilter) &&
          (statusFilter === 'all' || r.status === statusFilter),
      ),
    [records, providerFilter, statusFilter],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length)
  const pageRecords = filtered.slice(pageStart, pageEnd)

  if (!open) return null

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="past-consents-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <H2 as="h1" id="past-consents-title" className={styles.title}>
            Your past consents
          </H2>
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
          <div className={styles.filters}>
            <FilterSelect
              label="All providers"
              value={providerFilter}
              onChange={(v) => {
                setProviderFilter(v)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'All providers' },
                ...providers.map((p) => ({ value: p, label: p })),
              ]}
            />
            <FilterSelect
              label="All statuses"
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'withdrawn', label: 'Withdrawn' },
                { value: 'canceled', label: 'Canceled' },
              ]}
            />
          </div>

          <div className={styles.tableWrap} role="region" aria-label="Past consents">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Provider</th>
                  <th scope="col">Consent start</th>
                  <th scope="col">Consent end</th>
                  <th scope="col">Consent status</th>
                  <th scope="col" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {pageRecords.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <B2 as="span" className={styles.provider}>
                        {r.provider}
                      </B2>
                    </td>
                    <td>
                      <B2 as="span" className={styles.muted}>
                        {r.start}
                      </B2>
                    </td>
                    <td>
                      <B2 as="span" className={styles.muted}>
                        {r.end}
                      </B2>
                    </td>
                    <td>
                      <Badge
                        status="draft"
                        priority="primary"
                        capitalization="caps"
                        aria-label={STATUS_LABEL[r.status]}
                      >
                        {STATUS_LABEL[r.status]}
                      </Badge>
                    </td>
                    <td className={styles.actionCell}>
                      <a
                        className={styles.viewLink}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setViewing(r.detail)
                        }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <B2 as="p" className={styles.empty}>
                No past consents match your filters.
              </B2>
            )}
          </div>

          {filtered.length > 0 && (
            <div className={styles.pagination}>
              <B3 as="span" className={styles.pageCount}>
                {pageStart + 1}-{pageEnd} of {filtered.length} items
              </B3>
              <div className={styles.pageControls}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size="small" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''}`}
                    onClick={() => setPage(p)}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size="small" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button priority="secondary" size="medium" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>

      <PastConsentDetailModal
        record={viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className={styles.selectWrap}>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size="small" className={styles.selectChev} aria-hidden="true" />
    </div>
  )
}
