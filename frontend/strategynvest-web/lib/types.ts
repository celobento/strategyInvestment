export interface AssetType {
  id: number
  name: string
  description?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  countryId?: number
  countryName?: string
  countryAcronym?: string
}

export interface Sector {
  id: number
  name: string
  description?: string
}

export interface Broker {
  id: number
  name: string
  webSite: string
}

export interface Country {
  id: number
  name: string
  acronym: string
}

export interface Segment {
  id: number
  name: string
  description?: string
}

export type IncomeType = 'FIXED' | 'VARIABLE'

export interface Asset {
  id: number
  name: string
  ticket: string
  description?: string
  country: Country
  category: Category
  sector: Sector
  segment: Segment
  incomeType?: IncomeType
  assetType?: AssetType
  ceilingPrice?: number
  navEstimated?: number
  premiumDiscount?: number
  indicator?: string
  createdDate?: string
  updatedDate?: string
}

export interface User {
  id: number
  createdDate: string
  username: string
  firstAccess: boolean
  email: string
  roles: string[]
}

export interface Wallet {
  id: number
  name?: string
  currentValue: number
  dividendYeld: number
  minAssetPays?: number
  createdDate: string
  user: User
}

export interface WalletAsset {
  id: number
  addedAt?: string
  walletId?: number
  assetId: number
  assetName: string
  assetTicket: string
  categoryName?: string
  sectorName?: string
  segmentName?: string
  countryAcronym?: string
  quantity?: number
  mediumPrice?: number
  currentPrice?: number
  incomeType?: string
  assetTypeName?: string
  indicator?: string
  ceilingPrice?: number
}

export interface WalletStrategy {
  id: number
  createdAt?: string
  categoryId: number
  categoryName: string
  countryName?: string
  countryAcronym?: string
  percent: number
}

export interface DividendEntry {
  id: number
  walletId?: number | null
  category: string
  month: number
  year: number
  value: number
  currency: string
  createdAt?: string
}

export interface FiiAnalysis {
  id: number
  dataCadastro?: string
  ticket: string
  nome?: string
  segmento?: string
  valorAtual?: number
  dividendYield?: number
  precoValorPatrimonial?: number
  fatorRenda?: number
  rendimentoUltimos12m?: number
  rendimentoMedioUltimos12m?: number
  rendimentoMensalMedio24m?: number
  liquidezMediaDiaria?: number
  ultimoRendimento?: number
  dataPagamentoUltimoRendimento?: string
  proximoRendimento?: number
  dataPagamentoProximoRendimento?: string
}

export interface Goal {
  id: number
  description: string
  goalValue: number
  limitDate: string
  startDate: string
  monthlyRate: number
  initialBalance: number
  createdAt?: string
}

export interface Revision {
  id: number
  createdDate: string
  currentValue: number
  dividendYeld: number
  incomeFactor: number
  pVp: number
  lastIncome: number
  dateLastIncome: string
  nextIncome?: number
  dateNextIncome?: string
  notes?: string
  asset: Asset
}
