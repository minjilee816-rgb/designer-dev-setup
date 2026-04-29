import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Notification,
  Menu,
  Card,
  MoneyBagUs,
  ShieldCheck,
  Home,
  Close,
  Cash,
  ChartBar,
  ClockCounterclockwise,
  ChevronLeft,
} from '@design-systems/icons'
import { INSTITUTIONS } from './products'
import styles from './CreditKarmaShell.module.css'

interface CreditKarmaShellProps {
  children: ReactNode
  onClose: () => void
}

type TopTab = 'dashboard' | 'tax' | 'credit' | 'accounts' | 'debts'

const TOP_TABS: { id: TopTab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tax', label: 'Tax' },
  { id: 'credit', label: 'Credit' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'debts', label: 'Debts' },
]

export function CreditKarmaShell({ children, onClose }: CreditKarmaShellProps) {
  const [activeTab, setActiveTab] = useState<TopTab>('dashboard')
  const [subScreen, setSubScreen] = useState<'linked' | null>(null)
  const [pendingLinkMore, setPendingLinkMore] = useState(false)

  const handleLinkMore = () => {
    setSubScreen('linked')
    setPendingLinkMore(true)
  }

  const childrenWithProps =
    isValidElement(children) && pendingLinkMore
      ? cloneElement(children as React.ReactElement<{ autoOpenLink?: boolean; onAutoOpenLinkHandled?: () => void }>, {
          autoOpenLink: true,
          onAutoOpenLinkHandled: () => setPendingLinkMore(false),
        })
      : children

  useEffect(() => {
    document.body.classList.add('ck-mobile')
    return () => {
      document.body.classList.remove('ck-mobile')
    }
  }, [])

  const scrollRef = useRef<HTMLElement>(null)
  const onLinkedScreen = subScreen === 'linked'

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [subScreen])

  return (
    <div className={styles.stage}>
      <div className={styles.phone}>
        <div className={styles.notch} aria-hidden="true" />

        <div className={styles.statusBar} aria-hidden="true">
          <span className={styles.statusTime}>12:22</span>
          <ArrowUpRight />
          <div className={styles.statusRight}>
            <SignalDots />
            <WifiGlyph />
            <BatteryGlyph />
          </div>
        </div>

        {!onLinkedScreen && (
          <>
            <header className={styles.appHeader}>
              <h1 className={styles.appTitle}>For you</h1>
              <div className={styles.headerIcons}>
                <button type="button" className={styles.iconBtn} aria-label="Notifications">
                  <Notification size="small" />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label="Close"
                  onClick={onClose}
                >
                  <Menu size="small" />
                </button>
              </div>
            </header>

            <nav className={styles.topTabs} aria-label="Sections">
              {TOP_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.topTab} ${
                    activeTab === tab.id ? styles.topTabActive : ''
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSubScreen(null)
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </>
        )}

        <main className={styles.scroll} ref={scrollRef}>
          {onLinkedScreen ? (
            <div className={styles.linkedScreen}>
              <button
                type="button"
                className={styles.backRow}
                aria-label="Back to Accounts"
                onClick={() => setSubScreen(null)}
              >
                <ChevronLeft size="medium" />
              </button>
              {childrenWithProps}
            </div>
          ) : activeTab === 'accounts' ? (
            <AccountsContent
              onOpenLinked={() => setSubScreen('linked')}
              onLinkMore={handleLinkMore}
            />
          ) : (
            <DashboardContent />
          )}
        </main>

        <nav className={styles.bottomNav} aria-label="Primary">
          <BottomTab icon={<Home size="small" />} label="For you" active />
          <BottomTab icon={<Card size="small" />} label="Cards" />
          <BottomTab icon={<MoneyBagUs size="small" />} label="Loans" />
          <BottomTab icon={<ShieldCheck size="small" />} label="Insurance" />
          <BottomTab icon={<MoneyStackGlyph />} label="Money" />
        </nav>

        <div className={styles.homeIndicator} aria-hidden="true" />
      </div>
    </div>
  )
}

function BottomTab({
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
      className={`${styles.bottomTab} ${active ? styles.bottomTabActive : ''}`}
    >
      <span className={styles.bottomTabIcon}>{icon}</span>
      <span className={styles.bottomTabLabel}>{label}</span>
    </button>
  )
}

type Range = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'All'

function AccountsContent({
  onOpenLinked,
  onLinkMore,
}: {
  onOpenLinked: () => void
  onLinkMore: () => void
}) {
  const [range, setRange] = useState<Range>('All')
  const ranges: Range[] = ['1M', '3M', '6M', 'YTD', '1Y', 'All']

  const brokenCount = INSTITUTIONS.filter(
    (inst) => inst.status === 'expired' || inst.status === 'lapsed',
  ).length

  return (
    <div className={styles.accounts}>
      <section className={styles.netWorth}>
        <div className={styles.netWorthLeft}>
          <span className={styles.netWorthLabel}>Net worth</span>
          <span className={styles.netWorthBig}>-$1,707.095</span>
          <div className={styles.netWorthDelta}>
            <span className={styles.deltaTriangle} aria-hidden="true">▲</span>
            <span className={styles.deltaAmount}>$5,539</span>
            <span className={styles.deltaPeriod}>since you joined</span>
          </div>
        </div>
      </section>

      {brokenCount > 0 && (
        <button
          type="button"
          className={styles.attentionBanner}
          onClick={onOpenLinked}
        >
          <span className={styles.attentionIcon} aria-hidden="true">
            <ClockCounterclockwise size="small" />
          </span>
          <span className={styles.attentionText}>
            <strong>
              {brokenCount} linked {brokenCount === 1 ? 'account needs' : 'accounts need'} attention
            </strong>
            <span className={styles.attentionFix}>Fix now</span>
          </span>
        </button>
      )}

      <NetWorthChart />

      <div className={styles.yearAxis} aria-hidden="true">
        <span>2020</span>
        <span>2021</span>
        <span>2022</span>
        <span>2023</span>
        <span>2024</span>
      </div>

      <div className={styles.rangePills} role="tablist" aria-label="Time range">
        {ranges.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={r === range}
            className={`${styles.rangePill} ${
              r === range ? styles.rangePillActive : ''
            }`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <p className={styles.basedOn}>
        Based on credit report and linked accounts
        <span className={styles.infoBubble} aria-hidden="true">i</span>
      </p>

      <div className={styles.divider} />

      <section>
        <div className={styles.categoryHeader}>
          <h2 className={styles.categoryTitle}>Assets</h2>
          <button type="button" className={styles.linkMore} onClick={onLinkMore}>Link more</button>
        </div>
        <p className={styles.categoryTotal}>$409,462</p>
        <div className={styles.categoryRows}>
          <CategoryRow
            icon={<Cash size="small" />}
            label="Cash"
            sub="4 accounts"
            amount="$12,345"
            onClick={onOpenLinked}
          />
          <CategoryRow
            icon={<ChartBar size="small" />}
            label="Investments"
            sub="1 account"
            amount="$15,367"
            onClick={onOpenLinked}
          />
          <CategoryRow
            icon={<Home size="small" />}
            label="Property"
            sub="1 account"
            amount="$381,750"
            onClick={onOpenLinked}
          />
        </div>
      </section>

      <div className={styles.divider} />

      <section>
        <div className={styles.categoryHeader}>
          <h2 className={styles.categoryTitle}>Debts</h2>
          <button type="button" className={styles.linkMore} onClick={onLinkMore}>Link more</button>
        </div>
        <p className={styles.categoryTotal}>$296,308</p>
        <div className={styles.categoryRows}>
          <CategoryRow
            icon={<Card size="small" />}
            label="Credit cards"
            sub="2 accounts"
            amount="$1,834"
            onClick={onOpenLinked}
          />
          <CategoryRow
            icon={<Home size="small" />}
            label="Mortgage"
            sub="1 account"
            amount="$294,474"
            onClick={onOpenLinked}
          />
        </div>
      </section>

      <div className={styles.endSpacer} />
    </div>
  )
}

function CategoryRow({
  icon,
  label,
  sub,
  amount,
  onClick,
}: {
  icon: ReactNode
  label: string
  sub: string
  amount: string
  onClick?: () => void
}) {
  return (
    <button type="button" className={styles.categoryRow} onClick={onClick}>
      <span className={styles.categoryIcon}>{icon}</span>
      <span className={styles.categoryText}>
        <span className={styles.categoryLabel}>{label}</span>
        <span className={styles.categorySub}>{sub}</span>
      </span>
      <span className={styles.categoryAmount}>{amount}</span>
    </button>
  )
}

function NetWorthChart() {
  return (
    <svg
      className={styles.bigChart}
      viewBox="0 0 320 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points="0,140 30,138 50,135 70,132 95,118 120,112 140,108 165,90 185,80 200,86 220,72 240,60 260,40 285,30 320,28"
        fill="none"
        stroke="#1D8354"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DashboardContent() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.netWorth}>
        <div className={styles.netWorthLeft}>
          <span className={styles.netWorthLabel}>Net Worth</span>
          <span className={styles.netWorthValue}>-$1,707,095</span>
          <div className={styles.netWorthDelta}>
            <span className={styles.deltaTriangle} aria-hidden="true">
              ▲
            </span>
            <span className={styles.deltaAmount}>$5.4k</span>
            <span className={styles.deltaPeriod}>Last 30 days</span>
          </div>
        </div>
        <NetWorthSpark />
      </section>

      <div className={styles.divider} />

      <section className={styles.scoreRow}>
        <ScoreCard bureau="TransUnion" score={760} delta="▲ 1pt today" />
        <ScoreCard bureau="Equifax" score={760} delta="— No change" muted />
      </section>

      <div className={styles.divider} />

      <section className={styles.refundRow}>
        <div>
          <p className={styles.refundLabel}>CK est. '24 tax refund</p>
          <p className={styles.refundValue}>$--</p>
        </div>
        <button type="button" className={styles.refundReveal}>
          Reveal refund
        </button>
      </section>

      <article className={styles.tipCard}>
        <div className={styles.tipHeader}>
          <div className={styles.tipBadge}>
            <span>Powered by</span>
            <span className={styles.tipBadgeBrand}>
              <span className={styles.tipBadgeMark} aria-hidden="true">
                <CheckCircleSmall />
              </span>
              turbotax
            </span>
          </div>
          <button
            type="button"
            className={styles.tipClose}
            aria-label="Dismiss"
          >
            <Close size="small" />
          </button>
        </div>
        <p className={styles.tipBody}>
          IRS has released new tax brackets for 2024, see if you'll pay more or
          less based on your income of $173,000
        </p>
      </article>

      <div className={styles.sectionGap} />

      <section className={styles.offerSection}>
        <div className={styles.offerHeader}>
          <h2 className={styles.offerTitle}>Suggested offer</h2>
          <button type="button" className={styles.seeWhy}>
            <span className={styles.seeWhyIcon} aria-hidden="true">
              ✦
            </span>
            See Why
          </button>
        </div>
        <p className={styles.offerSub}>Based on your credit and paid partnerships</p>
        <p className={styles.offerDisclosure}>
          Advertiser disclosure & editorial note{' '}
          <span className={styles.infoBubble} aria-hidden="true">
            i
          </span>
        </p>

        <article className={styles.cardOffer}>
          <div className={styles.creditCard}>
            <div className={styles.creditCardBrand}>AMERICAN EXPRESS</div>
            <div className={styles.creditCardChip} />
            <div className={styles.creditCardCenturion}>
              <CenturionGlyph />
            </div>
            <div className={styles.creditCardWaves} aria-hidden="true">
              <WavesGlyph />
            </div>
            <div className={styles.creditCardNumber}>7997</div>
            <div className={styles.creditCardExp}>09</div>
            <div className={styles.creditCardName}>C F FROST</div>
            <div className={styles.creditCardAmexMark}>AMEX</div>
          </div>
          <h3 className={styles.cardOfferTitle}>American Express® Gold Card</h3>
        </article>
      </section>

      <div className={styles.endSpacer} />
    </div>
  )
}

function ScoreCard({
  bureau,
  score,
  delta,
  muted,
}: {
  bureau: string
  score: number
  delta: string
  muted?: boolean
}) {
  return (
    <div className={styles.scoreCard}>
      <span className={styles.bureauName}>{bureau}</span>
      <span className={styles.scoreValue}>{score}</span>
      <span
        className={`${styles.scoreDelta} ${muted ? styles.scoreDeltaMuted : ''}`}
      >
        {delta}
      </span>
      <ScoreBars />
      <span className={styles.scoreLabel}>Excellent</span>
    </div>
  )
}

function ScoreBars() {
  return (
    <div className={styles.scoreBars} aria-hidden="true">
      <span className={styles.markerWrap}>
        <span className={styles.marker}>▼</span>
      </span>
      <div className={styles.bars}>
        <span className={`${styles.bar} ${styles.bar1}`} />
        <span className={`${styles.bar} ${styles.bar2}`} />
        <span className={`${styles.bar} ${styles.bar3}`} />
        <span className={`${styles.bar} ${styles.bar4}`} />
        <span className={`${styles.bar} ${styles.bar5}`} />
      </div>
    </div>
  )
}

function NetWorthSpark() {
  return (
    <svg
      className={styles.spark}
      viewBox="0 0 120 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points="0,40 15,42 30,44 45,46 60,44 70,12 90,10 105,10 120,12"
        fill="none"
        stroke="#1D8354"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.locArrow}
    >
      <path
        d="M5 19 L19 5 M9 5 L19 5 L19 15"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SignalDots() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#000" />
      <rect x="5" y="5" width="3" height="7" rx="0.5" fill="#000" />
      <rect x="10" y="2" width="3" height="10" rx="0.5" fill="#000" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" fill="#000" />
    </svg>
  )
}

function WifiGlyph() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
      <path
        d="M1 4 Q8 -1 15 4"
        stroke="#000"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M3 7 Q8 3 13 7"
        stroke="#000"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10" r="1.2" fill="#000" />
    </svg>
  )
}

function BatteryGlyph() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="2.5"
        fill="none"
        stroke="#000"
        strokeOpacity="0.4"
      />
      <rect x="2" y="2" width="18" height="8" rx="1.5" fill="#000" />
      <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="#000" opacity="0.4" />
    </svg>
  )
}

function CheckCircleSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
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

function CenturionGlyph() {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="#3F2A1A" strokeWidth="1" />
      <path
        d="M24 8 C20 14 16 18 16 26 C16 34 20 38 24 40 C28 38 32 34 32 26 C32 18 28 14 24 8 Z"
        fill="#7A4B2A"
      />
      <path
        d="M20 18 L28 18 L26 24 L22 24 Z"
        fill="#3F2A1A"
        opacity="0.7"
      />
    </svg>
  )
}

function WavesGlyph() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true">
      <path
        d="M3 13 Q6 8 3 3"
        stroke="#3F2A1A"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M9 13 Q12 8 9 3"
        stroke="#3F2A1A"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M15 13 Q18 8 15 3"
        stroke="#3F2A1A"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoneyStackGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="8" width="18" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="13" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 6 L19 6 M6 4 L18 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
