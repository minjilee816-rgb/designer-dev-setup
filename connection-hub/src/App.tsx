import { useState } from 'react'
import { ProductLanding, type Product } from './components/ProductLanding'
import { ProductView } from './components/ProductView'
import './App.css'

function App() {
  const [selected, setSelected] = useState<Product | null>(null)

  if (selected) {
    return <ProductView product={selected} onBack={() => setSelected(null)} />
  }

  return <ProductLanding onSelect={setSelected} />
}

export default App
