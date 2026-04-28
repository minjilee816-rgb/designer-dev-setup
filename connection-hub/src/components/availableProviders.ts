/**
 * Catalog of providers a user can link to. Each entry is shaped to be
 * compatible with the existing `InstitutionLogo` component (same logoUrl /
 * bgColor / fallbackColor contract).
 */
export type AvailableProvider = {
  id: string
  name: string
  logoUrl: string
  bgColor: string
  fallbackColor?: string
}

export const AVAILABLE_PROVIDERS: AvailableProvider[] = [
  {
    id: 'scotiabank',
    name: 'Scotiabank',
    logoUrl: 'https://logo.clearbit.com/scotiabank.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#E3262F',
  },
  {
    id: 'rbc',
    name: 'Royal Bank of Canada',
    logoUrl: 'https://logo.clearbit.com/rbc.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#0051A5',
  },
  {
    id: 'wellsfargo',
    name: 'Wells Fargo',
    logoUrl: 'https://cdn.simpleicons.org/wellsfargo/FFFFFF',
    bgColor: '#B31B1B',
  },
  {
    id: 'cibc',
    name: 'CIBC',
    logoUrl: 'https://logo.clearbit.com/cibc.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#C41F3E',
  },
  {
    id: 'chase',
    name: 'Chase',
    logoUrl: 'https://cdn.simpleicons.org/chase/FFFFFF',
    bgColor: '#117ACA',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logoUrl: 'https://cdn.simpleicons.org/paypal/FFFFFF',
    bgColor: '#FFC439',
    fallbackColor: '#003087',
  },
  {
    id: 'capitalone',
    name: 'Capital One',
    logoUrl: 'https://logo.clearbit.com/capitalone.com',
    bgColor: '#004878',
    fallbackColor: '#004878',
  },
  {
    id: 'bmo',
    name: 'Bank of Montreal',
    logoUrl: 'https://logo.clearbit.com/bmo.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#0079C1',
  },
  // additional providers shown when "Show more" is clicked
  {
    id: 'amex',
    name: 'American Express',
    logoUrl: 'https://cdn.simpleicons.org/americanexpress/FFFFFF',
    bgColor: '#006FCF',
  },
  {
    id: 'citibank',
    name: 'Citibank',
    logoUrl: 'https://logo.clearbit.com/citibank.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#003D7C',
  },
  {
    id: 'usbank',
    name: 'U.S. Bank',
    logoUrl: 'https://logo.clearbit.com/usbank.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#003DA5',
  },
  {
    id: 'td',
    name: 'TD Bank',
    logoUrl: 'https://logo.clearbit.com/td.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#54B948',
  },
  {
    id: 'ally',
    name: 'Ally Bank',
    logoUrl: 'https://logo.clearbit.com/ally.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#6B1F7C',
  },
  {
    id: 'discover',
    name: 'Discover',
    logoUrl: 'https://cdn.simpleicons.org/discover/FFFFFF',
    bgColor: '#FF6000',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    logoUrl: 'https://cdn.simpleicons.org/venmo/FFFFFF',
    bgColor: '#3D95CE',
  },
  {
    id: 'robinhood',
    name: 'Robinhood',
    logoUrl: 'https://cdn.simpleicons.org/robinhood/FFFFFF',
    bgColor: '#00C805',
  },
]

export const INITIAL_VISIBLE = 8
