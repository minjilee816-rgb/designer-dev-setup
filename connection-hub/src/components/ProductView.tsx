import { ThemeProvider } from '@design-systems/theme'
import { ColorScheme } from '@ids-tokens/enums'
import { B2 } from '@ids-ts/typography'
import { Close } from '@design-systems/icons'
import { ConnectionHub } from './ConnectionHub'
import { QuickBooksShell } from './QuickBooksShell'
import { TurboTaxShell } from './TurboTaxShell'
import { CreditKarmaShell } from './CreditKarmaShell'
import type { Product } from './ProductLanding'
import styles from './ProductView.module.css'

interface ProductViewProps {
  product: Product
  onBack: () => void
}

const BRAND: Record<
  Product,
  { theme: 'quickbooks' | 'turbotax' | 'intuit'; name: string; mark: string; markClass: string }
> = {
  quickbooks: {
    theme: 'quickbooks',
    name: 'QuickBooks',
    mark: 'qb',
    markClass: 'brandQb',
  },
  turbotax: {
    theme: 'turbotax',
    name: 'TurboTax',
    mark: 'tt',
    markClass: 'brandTt',
  },
  creditkarma: {
    theme: 'intuit',
    name: 'Credit Karma',
    mark: 'ck',
    markClass: 'brandCk',
  },
}

export function ProductView({ product, onBack }: ProductViewProps) {
  const brand = BRAND[product]
  const isQuickBooks = product === 'quickbooks'
  const isTurboTax = product === 'turbotax'
  const isCreditKarma = product === 'creditkarma'

  if (isQuickBooks) {
    return (
      <ThemeProvider scope theme={brand.theme} colorScheme={ColorScheme.LIGHT}>
        <QuickBooksShell onClose={onBack}>
          <ConnectionHub product={product} />
        </QuickBooksShell>
      </ThemeProvider>
    )
  }

  if (isTurboTax) {
    return (
      <ThemeProvider scope theme={brand.theme} colorScheme={ColorScheme.LIGHT}>
        <TurboTaxShell onClose={onBack}>
          <ConnectionHub product={product} />
        </TurboTaxShell>
      </ThemeProvider>
    )
  }

  if (isCreditKarma) {
    return (
      <ThemeProvider scope theme={brand.theme} colorScheme={ColorScheme.LIGHT}>
        <CreditKarmaShell onClose={onBack}>
          <ConnectionHub product={product} />
        </CreditKarmaShell>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider scope theme={brand.theme} colorScheme={ColorScheme.LIGHT}>
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <div
              className={`${styles.brandMark} ${styles[brand.markClass]}`}
              aria-hidden="true"
            >
              {brand.mark}
            </div>
            <B2 as="span" className={styles.brandName}>
              {brand.name}
            </B2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onBack}
            aria-label="Close and return to product selection"
          >
            <Close size="small" />
          </button>
        </div>
        <ConnectionHub product={product} />
      </div>
    </ThemeProvider>
  )
}
