import type { ReactNode } from 'react'
import {
  Notification,
  Question,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  Cart,
} from '@design-systems/icons'
import styles from './TurboTaxShell.module.css'

interface TurboTaxShellProps {
  children: ReactNode
  onClose: () => void
}

type NavItem = {
  id: string
  label: string
  active?: boolean
  expandable?: boolean
  expanded?: boolean
}

const PRIMARY_NAV: NavItem[] = [
  { id: 'tax-home', label: 'Tax home' },
  { id: 'documents', label: 'Documents', expandable: true, expanded: true },
]

const DOCUMENTS_SUB_NAV: NavItem[] = [
  { id: 'linked-accounts', label: 'Linked accounts', active: true },
]

const TAXES_NAV: NavItem[] = [
  { id: 'my-info', label: 'My info' },
  { id: 'federal', label: 'Federal', expandable: true },
  { id: 'state', label: 'State' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'File' },
]

const TOOLS_NAV: NavItem[] = [
  { id: 'tax-tools', label: 'Tax tools', expandable: true },
  { id: 'refer', label: 'Refer and earn' },
]

const ACCOUNT_NAV: NavItem[] = [
  { id: 'intuit-account', label: 'Intuit account' },
  { id: 'cambiar', label: 'Cambiar a español' },
  { id: 'switch-products', label: 'Switch products', expandable: true },
  { id: 'sign-out', label: 'Sign out' },
]

function TtLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#D52B1E" />
      <path
        d="M7 9 L17 9 M12 9 L12 17"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function TurboTaxShell({ children, onClose }: TurboTaxShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sideNav} aria-label="Primary">
        <div className={styles.brandRow}>
          <TtLogo />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Do It Yourself</span>
            <span className={styles.brandEdition}>Free edition</span>
          </div>
        </div>

        <div className={styles.navSection}>
          {PRIMARY_NAV.map((item) => (
            <div key={item.id}>
              <SideNavItem
                item={item}
                onClick={item.id === 'tax-home' ? onClose : undefined}
              />
              {item.id === 'documents' && (
                <div className={styles.subNavSection}>
                  {DOCUMENTS_SUB_NAV.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className={`${styles.subNavItem} ${
                        sub.active ? styles.subNavItemActive : ''
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.navHeader}>2025 TAXES</div>
        <div className={styles.navSection}>
          {TAXES_NAV.map((item) => (
            <SideNavItem key={item.id} item={item} />
          ))}
        </div>

        <div className={styles.navDivider} />

        <div className={styles.navSection}>
          {TOOLS_NAV.map((item) => (
            <SideNavItem key={item.id} item={item} />
          ))}
        </div>

        <div className={styles.navSpacer} />

        <div className={styles.navSection}>
          {ACCOUNT_NAV.map((item) => (
            <SideNavItem key={item.id} item={item} />
          ))}
        </div>
      </aside>

      <header className={styles.topBar}>
        <div className={styles.refundGroup}>
          <div className={styles.refundBlock}>
            <span className={styles.refundLabel}>Federal refund</span>
            <span className={styles.refundValue}>$3,453</span>
          </div>
          <div className={styles.refundBlock}>
            <span className={styles.refundLabel}>CA due</span>
            <span className={styles.refundValueDark}>$235</span>
          </div>
          <button type="button" className={styles.explainBtn}>
            Explain my taxes
          </button>
          <button
            type="button"
            className={styles.collapseBtn}
            aria-label="Collapse refund tracker"
          >
            <ChevronLeft size="small" />
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size="small" />
          <span>Search or ask a question</span>
        </div>

        <div className={styles.topIcons}>
          <button type="button" className={styles.iconBtn} aria-label="Notifications">
            <Notification size="small" />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Cart">
            <Cart size="small" />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Help">
            <Question size="small" />
          </button>
          <button type="button" className={styles.expertBtn}>
            Get expert help
          </button>
        </div>
      </header>

      <div className={styles.progressBar}>
        <label className={styles.toggle}>
          <input type="checkbox" defaultChecked aria-label="Show progress" />
          <span className={styles.toggleTrack} aria-hidden="true">
            <span className={styles.toggleThumb} />
          </span>
        </label>
        <div className={styles.progressSteps}>
          <ProgressStep label="My info" complete />
          <ProgressStep label="Federal" inProgress />
          <ProgressStep label="State" />
          <ProgressStep label="Review" />
        </div>
        <div className={styles.timeEstimate}>
          <span className={styles.timeStrong}>1h 35m</span>
          <span className={styles.timeMuted}> / 1h 55m</span>
        </div>
      </div>

      <main className={styles.content}>{children}</main>
    </div>
  )
}

function SideNavItem({
  item,
  onClick,
}: {
  item: NavItem
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
      onClick={onClick}
    >
      <span className={styles.navLabel}>{item.label}</span>
      {item.expandable && (
        <span className={styles.navChevron} aria-hidden="true">
          {item.expanded ? (
            <ChevronUp size="small" />
          ) : (
            <ChevronDown size="small" />
          )}
        </span>
      )}
    </button>
  )
}

function ProgressStep({
  label,
  complete,
  inProgress,
}: {
  label: string
  complete?: boolean
  inProgress?: boolean
}) {
  return (
    <div className={styles.step}>
      <span className={styles.stepLabel}>{label}</span>
      <span
        className={`${styles.stepBar} ${complete ? styles.stepBarComplete : ''} ${
          inProgress ? styles.stepBarInProgress : ''
        }`}
      />
    </div>
  )
}
