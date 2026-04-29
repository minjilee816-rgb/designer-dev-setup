import { useEffect, useState } from 'react'
import { ProductLanding, type Product } from './components/ProductLanding'
import { ProductView } from './components/ProductView'
import './App.css'

const PRODUCT_FROM_HASH: Record<string, Product> = {
  '#/quickbooks': 'quickbooks',
  '#/turbotax': 'turbotax',
  '#/creditkarma': 'creditkarma',
}

const HASH_FROM_PRODUCT: Record<Product, string> = {
  quickbooks: '#/quickbooks',
  turbotax: '#/turbotax',
  creditkarma: '#/creditkarma',
}

function readProductFromHash(): Product | null {
  return PRODUCT_FROM_HASH[window.location.hash] ?? null
}

function App() {
  const [selected, setSelected] = useState<Product | null>(readProductFromHash)

  useEffect(() => {
    const onHashChange = () => setSelected(readProductFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const selectProduct = (product: Product) => {
    window.location.hash = HASH_FROM_PRODUCT[product]
    setSelected(product)
  }

  const goHome = () => {
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search)
    }
    setSelected(null)
  }

  if (selected) {
    return <ProductView product={selected} onBack={goHome} />
  }

  return <ProductLanding onSelect={selectProduct} />
}

export default App
