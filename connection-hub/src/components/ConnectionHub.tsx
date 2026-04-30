import { useEffect, useState } from 'react'
import { H1, B2 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { ConnectionRow } from './ConnectionRow'
import { GroupedConnectionRow } from './GroupedConnectionRow'
import { ManageConnectionModal } from './ManageConnectionModal'
import { ConsentModal } from './ConsentModal'
import { ProviderOAuthModal } from './ProviderOAuthModal'
import { ConnectingModal } from './ConnectingModal'
import { ReauthSuccessModal } from './ReauthSuccessModal'
import { UnlinkSuccessModal } from './UnlinkSuccessModal'
import { LinkAccountsModal } from './LinkAccountsModal'
import type { AvailableProvider } from './availableProviders'
import {
  PastConsentsModal,
  SEED_RECORDS,
  type ConsentRecord,
} from './PastConsentsModal'
import {
  INSTITUTIONS,
  type Institution,
  type ConnectionStatus,
} from './products'
import styles from './ConnectionHub.module.css'

function BankIllustration() {
  return (
    <svg
      className={styles.emptyIllustration}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Building body */}
      <rect x="26" y="50" width="68" height="36" rx="2" fill="#E8EDF2" />
      {/* Pillars */}
      <rect x="33" y="56" width="8" height="24" rx="1" fill="#BCC7D4" />
      <rect x="48" y="56" width="8" height="24" rx="1" fill="#BCC7D4" />
      <rect x="63" y="56" width="8" height="24" rx="1" fill="#BCC7D4" />
      <rect x="78" y="56" width="8" height="24" rx="1" fill="#BCC7D4" />
      {/* Roof / pediment */}
      <path d="M20 50 L60 24 L100 50 Z" fill="#BCC7D4" />
      {/* Steps */}
      <rect x="20" y="84" width="80" height="5" rx="1" fill="#BCC7D4" />
      <rect x="14" y="89" width="92" height="5" rx="1" fill="#BCC7D4" />
    </svg>
  )
}

function LinkedAccountsEmptyState() {
  return (
    <div className={styles.emptyState}>
      <BankIllustration />
      <h2 className={styles.emptyHeading}>No linked accounts yet</h2>
      <p className={styles.emptyMessage}>
        Link a bank or financial institution to see all your accounts in one place.
      </p>
    </div>
  )
}

interface ConnectionHubProps {
  product?: 'quickbooks' | 'turbotax' | 'creditkarma' | 'intuit'
  autoOpenLink?: boolean
  onAutoOpenLinkHandled?: () => void
}

export function ConnectionHub({
  product = 'intuit',
  autoOpenLink = false,
  onAutoOpenLinkHandled,
}: ConnectionHubProps = {}) {
  const [institutions, setInstitutions] = useState<Institution[]>(INSTITUTIONS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [fixId, setFixId] = useState<string | null>(null)
  const [oauthId, setOauthId] = useState<string | null>(null)
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [reauthSuccessOpen, setReauthSuccessOpen] = useState(false)
  const [unlinkedName, setUnlinkedName] = useState<string | null>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [pendingNewProvider, setPendingNewProvider] =
    useState<AvailableProvider | null>(null)
  const [pastConsentsOpen, setPastConsentsOpen] = useState(false)
  const [pastConsents, setPastConsents] = useState<ConsentRecord[]>(SEED_RECORDS)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  useEffect(() => {
    if (autoOpenLink) {
      setLinkOpen(true)
      onAutoOpenLinkHandled?.()
    }
  }, [autoOpenLink, onAutoOpenLinkHandled])

  const active = institutions.find((i) => i.id === activeId) ?? null

  // For OAuth/Connecting, prefer the in-flight new provider if set so the
  // brand color + logo come through even though it isn't in `institutions` yet.
  const newProviderAsInstitution: Institution | null = pendingNewProvider
    ? {
        id: pendingNewProvider.id,
        name: pendingNewProvider.name,
        logoUrl: pendingNewProvider.logoUrl,
        bgColor: pendingNewProvider.bgColor,
        fallbackColor: pendingNewProvider.fallbackColor,
        website: '',
        phone: '',
        status: 'active',
        accounts: [],
      }
    : null

  const fixing =
    (fixId &&
      (institutions.find((i) => i.id === fixId) ??
        (pendingNewProvider?.id === fixId
          ? newProviderAsInstitution
          : null))) ||
    null

  const oauthing =
    (oauthId &&
      (institutions.find((i) => i.id === oauthId) ??
        (pendingNewProvider?.id === oauthId
          ? newProviderAsInstitution
          : null))) ||
    null

  const connecting =
    (connectingId &&
      (institutions.find((i) => i.id === connectingId) ??
        (pendingNewProvider?.id === connectingId
          ? newProviderAsInstitution
          : null))) ||
    null

  const reauthenticateInstitution = (id: string) => {
    setInstitutions((prev) =>
      prev.map((inst) => {
        if (inst.id !== id) return inst
        const { reauthNotice, ...rest } = inst
        // strip the reauthNotice and clear hasError on accounts
        void reauthNotice
        return {
          ...rest,
          status: 'active' as ConnectionStatus,
          accounts: inst.accounts.map((acc) => ({ ...acc, hasError: false })),
        }
      }),
    )
  }

  const addLinkedInstitution = (provider: AvailableProvider) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    const stamp = Date.now()
    const randLastFour = () =>
      String(Math.floor(1000 + Math.random() * 9000))
    const randBetween = (min: number, max: number) =>
      Math.round((min + Math.random() * (max - min)) * 100) / 100
    const intentsFor = (idPrefix: string) => [
      {
        id: `${idPrefix}-verified`,
        label: 'Account verified for payments',
        kind: 'checkmark' as const,
        enabled: true,
      },
      {
        id: `${idPrefix}-sync`,
        label: 'Sync account transactions',
        kind: 'toggle' as const,
        enabled: true,
      },
      {
        id: `${idPrefix}-tax`,
        label: 'Import tax document',
        kind: 'toggle' as const,
        enabled: true,
      },
    ]

    const accountTemplates = [
      { suffix: 'checking', name: 'Everyday Checking', range: [800, 8500] },
      { suffix: 'savings', name: 'High-Yield Savings', range: [3500, 24000] },
      { suffix: 'credit', name: 'Rewards Credit Card', range: [-2400, -50] },
    ] as const

    const newInst: Institution = {
      id: `${provider.id}-${stamp}`,
      name: provider.name,
      logoUrl: provider.logoUrl,
      bgColor: provider.bgColor,
      fallbackColor: provider.fallbackColor,
      website: `www.${provider.id}.com`,
      phone: '(800) 000-0000',
      status: 'active',
      accounts: accountTemplates.map((tpl) => {
        const idPrefix = `${provider.id}-${tpl.suffix}-${stamp}`
        return {
          id: idPrefix,
          name: tpl.name,
          lastFour: randLastFour(),
          balance: randBetween(tpl.range[0], tpl.range[1]),
          lastUpdated: `Linked ${today}`,
          intents: intentsFor(idPrefix),
        }
      }),
    }
    setInstitutions((prev) => [...prev, newInst])
  }

  const updateIntent = (
    institutionId: string,
    accountId: string,
    intentId: string,
    enabled: boolean,
  ) => {
    setInstitutions((prev) =>
      prev.map((inst) =>
        inst.id !== institutionId
          ? inst
          : {
              ...inst,
              accounts: inst.accounts.map((acc) =>
                acc.id !== accountId
                  ? acc
                  : {
                      ...acc,
                      intents: acc.intents.map((intent) =>
                        intent.id === intentId
                          ? { ...intent, enabled }
                          : intent,
                      ),
                    },
              ),
            },
      ),
    )
  }

  const unlinkInstitution = (id: string) => {
    const inst = institutions.find((i) => i.id === id)
    if (!inst) return

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    const endText = `You withdrew on ${today}`

    const newRecord: ConsentRecord = {
      id: `unlinked-${inst.id}-${Date.now()}`,
      provider: inst.name,
      start: today,
      end: endText,
      status: 'withdrawn',
      detail: {
        id: inst.id,
        provider: inst.name,
        providerWebsite: inst.website,
        providerPhone: inst.phone,
        providerLogoUrl: inst.logoUrl,
        providerBgColor: inst.bgColor,
        providerFallbackColor: inst.fallbackColor,
        statusLabel: 'Withdrawn',
        statusDetail: endText,
        accounts: inst.accounts.map((a) => ({
          name: a.name,
          lastFour: a.lastFour,
        })),
      },
    }

    setPastConsents((prev) => [newRecord, ...prev])
    setInstitutions((prev) => prev.filter((i) => i.id !== id))
    setUnlinkedName(inst.name)
  }

  const sortedInstitutions = [...institutions].sort((a, b) => {
    const errorStatuses: ConnectionStatus[] = ['expired', 'lapsed']
    const aErr = errorStatuses.includes(a.status) ? 0 : 1
    const bErr = errorStatuses.includes(b.status) ? 0 : 1
    if (aErr !== bErr) return aErr - bErr
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  })

  const groups: { name: string; institutions: Institution[] }[] = []
  for (const inst of sortedInstitutions) {
    const key = inst.name.toLowerCase()
    const existing = groups.find((g) => g.name.toLowerCase() === key)
    if (existing) existing.institutions.push(inst)
    else groups.push({ name: inst.name, institutions: [inst] })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <H1 className={styles.title}>Linked accounts</H1>
        <Button
          priority="primary"
          size="medium"
          onClick={() => setLinkOpen(true)}
        >
          {product === 'creditkarma' ? 'Link more' : 'Link accounts'}
        </Button>
      </header>

      <ul className={styles.list} role="list">
        {groups.map((group) => {
          if (group.institutions.length === 1) {
            const institution = group.institutions[0]
            return (
              <li key={institution.id}>
                <ConnectionRow
                  institution={institution}
                  onOpen={() => setActiveId(institution.id)}
                  onFix={() => setFixId(institution.id)}
                />
              </li>
            )
          }
          const isOpen = expandedGroup === group.name
          return (
            <li key={`group-${group.name}`}>
              <GroupedConnectionRow
                name={group.name}
                institutions={group.institutions}
                expanded={isOpen}
                onToggle={() =>
                  setExpandedGroup(isOpen ? null : group.name)
                }
                onOpenChild={(id) => setActiveId(id)}
                onFixChild={(id) => setFixId(id)}
              />
            </li>
          )
        })}
      </ul>

      {institutions.length === 0 && <LinkedAccountsEmptyState />}

      <B2 as="p" className={styles.footerLink}>
        <a
          className={styles.link}
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setPastConsentsOpen(true)
          }}
        >
          Your past consents
        </a>
      </B2>

      <ManageConnectionModal
        institution={active}
        product={product}
        onClose={() => setActiveId(null)}
        onIntentChange={(accountId, intentId, enabled) =>
          active && updateIntent(active.id, accountId, intentId, enabled)
        }
        onUnlink={unlinkInstitution}
      />

      <ConsentModal
        institution={fixing}
        onClose={() => {
          setFixId(null)
          // If user backs out of consent during a new-link flow, drop the pending provider
          if (pendingNewProvider && pendingNewProvider.id === fixId) {
            setPendingNewProvider(null)
          }
        }}
        variant="gate"
        onAgree={() => {
          if (fixId) {
            setOauthId(fixId)
            setFixId(null)
          }
        }}
      />

      <ProviderOAuthModal
        institution={oauthing}
        onClose={() => {
          setOauthId(null)
          setPendingNewProvider(null)
        }}
        onSuccess={() => {
          if (oauthId) {
            setConnectingId(oauthId)
            setOauthId(null)
          }
        }}
      />

      <ConnectingModal
        institution={connecting}
        onComplete={() => {
          if (pendingNewProvider && pendingNewProvider.id === connectingId) {
            addLinkedInstitution(pendingNewProvider)
            setPendingNewProvider(null)
          } else if (connectingId) {
            reauthenticateInstitution(connectingId)
          }
          setConnectingId(null)
          setReauthSuccessOpen(true)
        }}
      />

      <ReauthSuccessModal
        open={reauthSuccessOpen}
        onClose={() => setReauthSuccessOpen(false)}
      />

      <UnlinkSuccessModal
        open={unlinkedName !== null}
        institutionName={unlinkedName}
        onClose={() => setUnlinkedName(null)}
      />

      <PastConsentsModal
        open={pastConsentsOpen}
        onClose={() => setPastConsentsOpen(false)}
        records={pastConsents}
      />

      <LinkAccountsModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onSelectProvider={(provider) => {
          setPendingNewProvider(provider)
          setFixId(provider.id)
          setLinkOpen(false)
        }}
      />
    </div>
  )
}
