import { H1, H2, B2, B3 } from '@ids-ts/typography'
import { ChevronRight } from '@design-systems/icons'
import styles from './ProductLanding.module.css'

export type Product = 'quickbooks' | 'turbotax' | 'creditkarma'

interface ProductLandingProps {
  onSelect: (product: Product) => void
}

type ProductCard = {
  id: Product
  name: string
  mark: string
  markClass: string
  description: string
  available: boolean
}

const PRODUCTS: ProductCard[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    mark: 'qb',
    markClass: 'brandQb',
    description:
      'Manage bank connections used for bookkeeping, reconciliation, and reporting.',
    available: true,
  },
  {
    id: 'turbotax',
    name: 'TurboTax',
    mark: 'tt',
    markClass: 'brandTt',
    description:
      'Link financial accounts and import tax documents for faster filing.',
    available: true,
  },
  {
    id: 'creditkarma',
    name: 'Credit Karma',
    mark: 'ck',
    markClass: 'brandCk',
    description:
      'Connect accounts to track spending, credit, and recommendations.',
    available: true,
  },
]

export function ProductLanding({ onSelect }: ProductLandingProps) {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <H1 className={styles.title}>Connection Hub</H1>
          <B2 as="p" className={styles.subtitle}>
            Choose a product to manage its linked accounts.
          </B2>
        </div>

        <div className={styles.grid} role="list">
          {PRODUCTS.map((product) => {
            const disabled = !product.available
            return (
              <button
                key={product.id}
                type="button"
                role="listitem"
                className={`${styles.card} ${disabled ? styles.cardDisabled : ''}`}
                onClick={() => !disabled && onSelect(product.id)}
                aria-disabled={disabled}
                aria-label={
                  disabled
                    ? `${product.name} — Coming soon`
                    : `Open ${product.name} connection hub`
                }
              >
                <div className={styles.brand}>
                  <div
                    className={`${styles.brandMark} ${styles[product.markClass]}`}
                    aria-hidden="true"
                  >
                    {product.mark}
                  </div>
                  <H2 as="span" className={styles.brandName}>
                    {product.name}
                  </H2>
                </div>

                {disabled && (
                  <span className={styles.comingSoonBadge}>Coming soon</span>
                )}

                <B3 as="p" className={styles.description}>
                  {product.description}
                </B3>

                <div className={styles.footerRow}>
                  {disabled ? (
                    <B2 as="span" className={styles.ctaMuted}>
                      Not available yet
                    </B2>
                  ) : (
                    <B2 as="span" className={styles.cta}>
                      Open
                      <ChevronRight size="small" />
                    </B2>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
