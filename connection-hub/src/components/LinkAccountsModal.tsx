import { useEffect, useMemo, useState } from 'react'
import { H2, B2 } from '@ids-ts/typography'
import { Button } from '@ids-ts/button'
import { Close, Search } from '@design-systems/icons'
import { InstitutionLogo } from './InstitutionLogo'
import type { Institution } from './products'
import {
  AVAILABLE_PROVIDERS,
  INITIAL_VISIBLE,
  type AvailableProvider,
} from './availableProviders'
import styles from './LinkAccountsModal.module.css'

interface LinkAccountsModalProps {
  open: boolean
  onClose: () => void
  onSelectProvider: (provider: AvailableProvider) => void
}

export function LinkAccountsModal({
  open,
  onClose,
  onSelectProvider,
}: LinkAccountsModalProps) {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setShowAll(false)
      return
    }
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return showAll
        ? AVAILABLE_PROVIDERS
        : AVAILABLE_PROVIDERS.slice(0, INITIAL_VISIBLE)
    }
    return AVAILABLE_PROVIDERS.filter((p) =>
      p.name.toLowerCase().includes(q),
    )
  }, [query, showAll])

  const hasMore =
    !query && !showAll && AVAILABLE_PROVIDERS.length > INITIAL_VISIBLE

  if (!open) return null

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-accounts-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
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
          <H2 as="h1" id="link-accounts-title" className={styles.title}>
            Let's find your account
          </H2>
          <B2 as="p" className={styles.subtitle}>
            Look up your provider by name or browse some of our suggestions.
          </B2>

          <div className={styles.search}>
            <Search size="small" className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name or sign-in URL"
              aria-label="Search providers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <B2 as="p" className={styles.empty}>
              No providers match "{query}". Try a different search term.
            </B2>
          ) : (
            <ul className={styles.grid} role="list">
              {filtered.map((provider) => (
                <li key={provider.id}>
                  <button
                    type="button"
                    className={styles.providerCard}
                    onClick={() => onSelectProvider(provider)}
                  >
                    <InstitutionLogo
                      institution={provider as unknown as Institution}
                      className={styles.providerLogo}
                    />
                    <span className={styles.providerName}>{provider.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasMore && (
          <div className={styles.footer}>
            <Button
              priority="secondary"
              size="medium"
              onClick={() => setShowAll(true)}
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
