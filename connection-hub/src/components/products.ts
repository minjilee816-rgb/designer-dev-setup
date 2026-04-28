export type ConnectionStatus = 'active' | 'lapsed' | 'expired' | 'canceled'

export type Intent = {
  id: string
  label: string
  kind: 'checkmark' | 'toggle'
  enabled: boolean
}

export type Account = {
  id: string
  name: string
  lastFour: string
  balance: number
  lastUpdated: string
  intents: Intent[]
  hasError?: boolean
}

export type ReauthNotice = {
  errorCode: string
  message: string
  affectedLastFour: string[]
}

export type Institution = {
  id: string
  name: string
  logoUrl: string
  bgColor: string
  fallbackColor?: string
  website: string
  phone: string
  status: ConnectionStatus
  accounts: Account[]
  reauthNotice?: ReauthNotice
}

const defaultIntents = (idPrefix: string): Intent[] => [
  {
    id: `${idPrefix}-verified`,
    label: 'Account verified for payments',
    kind: 'checkmark',
    enabled: true,
  },
  {
    id: `${idPrefix}-sync`,
    label: 'Sync account transactions',
    kind: 'toggle',
    enabled: true,
  },
  {
    id: `${idPrefix}-tax`,
    label: 'Import tax document',
    kind: 'toggle',
    enabled: true,
  },
]

export const INSTITUTIONS: Institution[] = [
  {
    id: 'binance',
    name: 'Binance.us',
    logoUrl: 'https://cdn.simpleicons.org/binance/F0B90B',
    bgColor: '#0B0E11',
    website: 'www.binance.us',
    phone: '(800) 316-7447',
    status: 'active',
    accounts: [
      {
        id: 'binance-spot',
        name: 'Spot Wallet',
        lastFour: '4201',
        balance: 2314.58,
        lastUpdated: 'Updated 5 mins ago',
        intents: defaultIntents('binance-spot'),
      },
      {
        id: 'binance-usd',
        name: 'USD Wallet',
        lastFour: '8890',
        balance: 1245.00,
        lastUpdated: 'Updated 5 mins ago',
        intents: defaultIntents('binance-usd'),
      },
      {
        id: 'binance-staking',
        name: 'Staking Rewards',
        lastFour: '3356',
        balance: 482.31,
        lastUpdated: 'Updated 8 mins ago',
        intents: defaultIntents('binance-staking'),
      },
    ],
  },
  {
    id: 'chase',
    name: 'Chase',
    logoUrl: 'https://cdn.simpleicons.org/chase/FFFFFF',
    bgColor: '#117ACA',
    website: 'www.chase.com',
    phone: '(898) 342-2341',
    status: 'active',
    accounts: [
      {
        id: 'chase-checking',
        name: 'Personal Checking',
        lastFour: '1234',
        balance: 5325.43,
        lastUpdated: 'Updated 2 mins ago',
        intents: defaultIntents('chase-checking'),
      },
      {
        id: 'chase-savings',
        name: 'Business Savings',
        lastFour: '1605',
        balance: 14266.85,
        lastUpdated: 'Updated 15 mins ago',
        intents: defaultIntents('chase-savings'),
      },
      {
        id: 'chase-credit',
        name: 'Business Credit Card',
        lastFour: '6875',
        balance: 7225.43,
        lastUpdated: 'Updated 15 mins ago',
        intents: defaultIntents('chase-credit'),
      },
      {
        id: 'chase-sapphire',
        name: 'Sapphire Reserve',
        lastFour: '4412',
        balance: -1248.92,
        lastUpdated: 'Updated 1 hour ago',
        intents: defaultIntents('chase-sapphire'),
      },
    ],
  },
  {
    id: 'fidelity',
    name: 'Fidelity',
    logoUrl: 'https://logo.clearbit.com/fidelity.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#368727',
    website: 'www.fidelity.com',
    phone: '(800) 343-3548',
    status: 'expired',
    reauthNotice: {
      errorCode: '350',
      message:
        'You need to reauthenticate to continue seeing account updates for your accounts ending in 9021, 4487.',
      affectedLastFour: ['9021', '4487'],
    },
    accounts: [
      {
        id: 'fidelity-brokerage',
        name: 'Brokerage',
        lastFour: '9021',
        balance: 42610.12,
        lastUpdated: 'Updated 3 months ago',
        intents: defaultIntents('fidelity-brokerage'),
        hasError: true,
      },
      {
        id: 'fidelity-roth',
        name: 'Roth IRA',
        lastFour: '4487',
        balance: 18204.55,
        lastUpdated: 'Updated 3 months ago',
        intents: defaultIntents('fidelity-roth'),
        hasError: true,
      },
      {
        id: 'fidelity-401k',
        name: '401(k) Rollover',
        lastFour: '7732',
        balance: 112480.67,
        lastUpdated: 'Updated 3 months ago',
        intents: defaultIntents('fidelity-401k'),
      },
      {
        id: 'fidelity-hsa',
        name: 'Health Savings Account',
        lastFour: '2208',
        balance: 6382.19,
        lastUpdated: 'Updated 3 months ago',
        intents: defaultIntents('fidelity-hsa'),
      },
    ],
  },
  {
    id: 'sofi',
    name: 'SoFi',
    logoUrl: 'https://logo.clearbit.com/sofi.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#00A4E4',
    website: 'www.sofi.com',
    phone: '(855) 456-7634',
    status: 'active',
    accounts: [
      {
        id: 'sofi-money',
        name: 'SoFi Money',
        lastFour: '3388',
        balance: 1850.23,
        lastUpdated: 'Updated 32 mins ago',
        intents: defaultIntents('sofi-money'),
      },
      {
        id: 'sofi-invest',
        name: 'SoFi Invest',
        lastFour: '7104',
        balance: 8942.77,
        lastUpdated: 'Updated 32 mins ago',
        intents: defaultIntents('sofi-invest'),
      },
      {
        id: 'sofi-credit',
        name: 'Credit Card',
        lastFour: '2265',
        balance: -352.18,
        lastUpdated: 'Updated 1 hour ago',
        intents: defaultIntents('sofi-credit'),
      },
    ],
  },
  {
    id: 'statefarm',
    name: 'State Farm',
    logoUrl: 'https://logo.clearbit.com/statefarm.com',
    bgColor: '#FFFFFF',
    fallbackColor: '#E01925',
    website: 'www.statefarm.com',
    phone: '(800) 782-8332',
    status: 'active',
    accounts: [
      {
        id: 'statefarm-auto',
        name: 'Auto Policy',
        lastFour: '5512',
        balance: 0,
        lastUpdated: 'Updated 2 days ago',
        intents: defaultIntents('statefarm-auto'),
      },
      {
        id: 'statefarm-home',
        name: 'Homeowners Policy',
        lastFour: '8841',
        balance: 0,
        lastUpdated: 'Updated 2 days ago',
        intents: defaultIntents('statefarm-home'),
      },
      {
        id: 'statefarm-life',
        name: 'Term Life Insurance',
        lastFour: '3067',
        balance: 0,
        lastUpdated: 'Updated 5 days ago',
        intents: defaultIntents('statefarm-life'),
      },
    ],
  },
  {
    id: 'wellsfargo',
    name: 'Wells Fargo',
    logoUrl: 'https://cdn.simpleicons.org/wellsfargo/FFFFFF',
    bgColor: '#B31B1B',
    website: 'www.wellsfargo.com',
    phone: '(800) 869-3557',
    status: 'active',
    accounts: [
      {
        id: 'wf-checking',
        name: 'Everyday Checking',
        lastFour: '8834',
        balance: 3220.44,
        lastUpdated: 'Updated 15 mins ago',
        intents: defaultIntents('wf-checking'),
      },
      {
        id: 'wf-credit',
        name: 'Active Cash',
        lastFour: '2217',
        balance: -412.01,
        lastUpdated: 'Updated 15 mins ago',
        intents: defaultIntents('wf-credit'),
      },
      {
        id: 'wf-savings',
        name: 'Way2Save Savings',
        lastFour: '5560',
        balance: 12840.09,
        lastUpdated: 'Updated 15 mins ago',
        intents: defaultIntents('wf-savings'),
      },
      {
        id: 'wf-mortgage',
        name: 'Home Mortgage',
        lastFour: '9903',
        balance: -284320.00,
        lastUpdated: 'Updated 1 day ago',
        intents: defaultIntents('wf-mortgage'),
      },
    ],
  },
]
