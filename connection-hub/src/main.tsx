import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ThemeOrchestrationProvider,
  ThemeProvider,
} from '@design-systems/theme'
import { ColorScheme } from '@ids-tokens/enums'

import '@ids-tokens/intuit/dist/web/css/intuit.css'
import '@ids-ts/typography/dist/main.css'
import '@ids-ts/button/dist/main.css'
import '@ids-ts/badge/dist/main.css'
import '@ids-ts/icon-control/dist/main.css'
import '@ids-ts/switch/dist/main.css'
import '@ids-ts/drawer/dist/main.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeOrchestrationProvider
      tokensUrlMap={{
        intuit: 'https://cdn.intuit.com/tokens/intuit.css',
        quickbooks: 'https://cdn.intuit.com/tokens/quickbooks.css',
        turbotax: 'https://cdn.intuit.com/tokens/turbotax.css',
      }}
      fallbackUrl="https://cdn.intuit.com/tokens/intuit.css"
    >
      <ThemeProvider scope theme="intuit" colorScheme={ColorScheme.LIGHT}>
        <App />
      </ThemeProvider>
    </ThemeOrchestrationProvider>
  </StrictMode>,
)
