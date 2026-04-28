import type { ReactNode } from 'react'
import {
  Plus,
  Bookmark,
  Notification,
  ChevronDown,
  ChevronUp,
  Settings,
  GridTile,
  ChartLine,
  Search,
  Question,
  Briefcase,
  Document,
  Lightning,
  IntuitAssist,
  SlidersH,
} from '@design-systems/icons'
import styles from './QuickBooksShell.module.css'

interface QuickBooksShellProps {
  children: ReactNode
  onClose: () => void
}

type AppGroup = {
  id: string
  name: string
  color: string
  glyph: 'M' | 'E' | 'S' | 'C' | 'T' | 'ST' | 'BT' | 'L' | 'P'
  expanded?: boolean
  items?: string[]
}

const APP_GROUPS: AppGroup[] = [
  {
    id: 'accounting',
    name: 'Accounting',
    color: '#0F1F3D',
    glyph: 'M',
    expanded: true,
    items: [
      'Client overview',
      'Books review',
      'Bank transactions',
      'Integration transa…',
      'Receipts',
      'Reconcile',
      'Rules',
      'Chart of accounts',
      'Recurring transact…',
      'Revenue recogniti…',
      'Fixed assets',
      'My accountant',
      'Live Experts',
    ],
  },
  { id: 'expenses', name: 'Expenses & Bills', color: '#0F1F3D', glyph: 'E' },
  { id: 'sales', name: 'Sales & Get Paid', color: '#0F1F3D', glyph: 'S' },
  { id: 'customer', name: 'Customer Hub', color: '#0F1F3D', glyph: 'C' },
  { id: 'team', name: 'Team', color: '#0F1F3D', glyph: 'T' },
  { id: 'salestax', name: 'Sales Tax', color: '#0F1F3D', glyph: 'ST' },
  { id: 'businesstax', name: 'Business Tax', color: '#0F1F3D', glyph: 'BT' },
  { id: 'lending', name: 'Lending', color: '#0F1F3D', glyph: 'L' },
  { id: 'payroll', name: 'Payroll', color: '#0F1F3D', glyph: 'P' },
]

function GroupGlyph({ glyph, color }: { glyph: string; color: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <circle cx="12" cy="12" r="12" fill={color} />
      {glyph === 'M' && (
        <path
          d="M7 8 L7 16 M17 8 L17 16 M7 8 L12 14 L17 8"
          stroke="#4ADE80"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {glyph === 'E' && (
        <path
          d="M8 8 L16 8 L16 11 L10 11 L10 13 L15 13 L15 16 L8 16 Z"
          fill="#4ADE80"
        />
      )}
      {glyph === 'S' && (
        <path
          d="M15 9 Q15 7 12 7 Q9 7 9 10 Q9 12 12 12 Q15 12 15 14 Q15 17 12 17 Q9 17 9 15"
          stroke="#4ADE80"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {glyph === 'C' && (
        <path
          d="M16 10 Q16 7 12 7 Q8 7 8 12 Q8 17 12 17 Q16 17 16 14"
          stroke="#4ADE80"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {glyph === 'T' && (
        <path
          d="M7 8 L17 8 M12 8 L12 17"
          stroke="#4ADE80"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {glyph === 'ST' && (
        <g fill="#F87171">
          <circle cx="9" cy="12" r="2.5" />
          <circle cx="15" cy="12" r="2.5" />
        </g>
      )}
      {glyph === 'BT' && (
        <path
          d="M8 16 L8 9 L12 7 L16 9 L16 16 Z"
          fill="#F87171"
        />
      )}
      {glyph === 'L' && (
        <path
          d="M7 16 Q7 11 12 11 Q17 11 17 16"
          stroke="#4ADE80"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {glyph === 'P' && (
        <path
          d="M9 7 L9 17 M9 7 Q15 7 15 10 Q15 13 9 13"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export function QuickBooksShell({ children, onClose }: QuickBooksShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <div className={styles.topBrand}>
          <div className={styles.qbLogoCircle} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#2CA01C" />
              <path
                d="M9 8 Q6 8 6 12 Q6 16 9 16 L13 16"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M15 16 Q18 16 18 12 Q18 8 15 8 L11 8"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className={styles.qbWordmark} aria-hidden="true">
            <span className={styles.qbWordmarkTop}>INTUIT</span>
            <span className={styles.qbWordmarkBottom}>quickbooks</span>
          </div>
        </div>

        <div className={styles.topDivider} aria-hidden="true" />

        <button type="button" className={styles.companySwitcher}>
          Magnolia Landscaping
          <ChevronDown size="small" />
        </button>

        <div className={styles.searchBox} aria-hidden="true">
          <Search size="small" />
          <span>Search, jump to, or ask a question</span>
        </div>

        <div className={styles.topIcons}>
          <button
            type="button"
            className={`${styles.topIconBtn} ${styles.hideLg}`}
            aria-label="Apps"
          >
            <Briefcase size="small" />
          </button>
          <button
            type="button"
            className={`${styles.topIconBtn} ${styles.hideLg}`}
            aria-label="Documents"
          >
            <Document size="small" />
          </button>
          <button
            type="button"
            className={`${styles.topIconBtn} ${styles.hideMd}`}
            aria-label="Quick actions"
          >
            <Lightning size="small" />
          </button>
          <button
            type="button"
            className={`${styles.topIconBtn} ${styles.hideMd}`}
            aria-label="Integrations"
          >
            <IntuitAssist size="small" />
          </button>
          <button
            type="button"
            className={`${styles.topIconBtn} ${styles.hideSm}`}
            aria-label="Notifications"
          >
            <Notification size="small" />
          </button>
          <button
            type="button"
            className={styles.topIconBtn}
            aria-label="Settings"
            onClick={onClose}
          >
            <Settings size="small" />
          </button>
          <button
            type="button"
            className={`${styles.topIconBtn} ${styles.hideSm}`}
            aria-label="Help"
          >
            <Question size="small" />
          </button>
          <div className={styles.avatar} aria-hidden="true">J</div>
        </div>
      </div>

      <nav className={styles.iconRail} aria-label="Primary">
        <RailItem icon={<Plus size="small" />} label="Create" />
        <RailItem icon={<Bookmark size="small" />} label="Bookmarks" />
        <RailItem icon={<GridTile size="small" />} label="Dashboard" />
        <RailItem icon={<IntuitAssist size="small" />} label="Feed" />
        <RailItem icon={<ChartLine size="small" />} label="Reports" />
        <RailItem icon={<GridTile size="small" />} label="My apps" active />

        <div className={styles.railSection}>PINNED</div>
        <div className={styles.railPinnedItem}>
          <GroupGlyph glyph="M" color="#0F1F3D" />
          <span className={styles.railLabel}>Accounting</span>
        </div>
        <div className={styles.railPinnedItem}>
          <GroupGlyph glyph="E" color="#0F1F3D" />
          <span className={styles.railLabel}>Expenses</span>
        </div>
        <div className={styles.railPinnedItem}>
          <GroupGlyph glyph="S" color="#0F1F3D" />
          <span className={styles.railLabel}>Sales</span>
        </div>

        <div className={styles.customizeWrap}>
          <RailItem icon={<SlidersH size="small" />} label="Customize" />
        </div>
      </nav>

      <aside className={styles.appsPanel} aria-label="My Apps">
        <div className={styles.appsHeader}>MY APPS</div>
        {APP_GROUPS.map((group) => (
          <div key={group.id} className={styles.appGroup}>
            <button type="button" className={styles.appGroupHeader}>
              <GroupGlyph glyph={group.glyph} color={group.color} />
              <span className={styles.appGroupName}>{group.name}</span>
              <span className={styles.appGroupChevron}>
                {group.expanded ? (
                  <ChevronUp size="small" />
                ) : (
                  <ChevronDown size="small" />
                )}
              </span>
            </button>
            {group.expanded && group.items && (
              <div className={styles.appSubList}>
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.appSubItem} ${
                      item === 'Bank transactions' ? styles.appSubItemActive : ''
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  )
}

function RailItem({
  icon,
  label,
  active,
}: {
  icon: ReactNode
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`${styles.railItem} ${active ? styles.railItemActive : ''}`}
    >
      <span
        className={`${styles.railIconBox} ${active ? styles.railIconBoxActive : ''}`}
      >
        {icon}
      </span>
      <span className={styles.railLabel}>{label}</span>
    </button>
  )
}
