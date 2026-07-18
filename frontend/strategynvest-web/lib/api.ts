import api from './axios'
import type { AssetType, Category, Sector, Broker, Country, Asset, Revision, Wallet, User, Segment, WalletAsset, WalletStrategy } from './types'

// ── Asset Types ───────────────────────────────────────────────────────────────
export const getAssetTypes = (name?: string) =>
  api.get<AssetType[]>('/asset-types', { params: name ? { name } : {} }).then((r) => r.data)

export const getAssetTypeById = (id: number) =>
  api.get<AssetType>(`/asset-types/${id}`).then((r) => r.data)

export const createAssetType = (data: { name: string; description?: string }) =>
  api.post<AssetType>('/asset-types', data).then((r) => r.data)

export const updateAssetType = (id: number, data: { name: string; description?: string }) =>
  api.put<AssetType>(`/asset-types/${id}`, data).then((r) => r.data)

export const deleteAssetType = (id: number) => api.delete(`/asset-types/${id}`)

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = (name?: string) =>
  api.get<Category[]>('/categories', { params: name ? { name } : {} }).then((r) => r.data)

export const getCategoryById = (id: number) =>
  api.get<Category>(`/categories/${id}`).then((r) => r.data)

export const createCategory = (data: { name: string; description?: string; countryId?: number }) =>
  api.post<Category>('/categories', data).then((r) => r.data)

export const updateCategory = (id: number, data: { name: string; description?: string; countryId?: number }) =>
  api.put<Category>(`/categories/${id}`, data).then((r) => r.data)

export const deleteCategory = (id: number) => api.delete(`/categories/${id}`)

// ── Sectors ───────────────────────────────────────────────────────────────────
export const getSectors = (name?: string) =>
  api.get<Sector[]>('/sectors', { params: name ? { name } : {} }).then((r) => r.data)

export const getSectorById = (id: number) =>
  api.get<Sector>(`/sectors/${id}`).then((r) => r.data)

export const createSector = (data: { name: string; description?: string }) =>
  api.post<Sector>('/sectors', data).then((r) => r.data)

export const deleteSector = (id: number) => api.delete(`/sectors/${id}`)

// ── Brokers ───────────────────────────────────────────────────────────────────
export const getBrokers = (name?: string) =>
  api.get<Broker[]>('/brokers', { params: name ? { name } : {} }).then((r) => r.data)

export const getBrokerById = (id: number) =>
  api.get<Broker>(`/brokers/${id}`).then((r) => r.data)

export const createBroker = (data: { name: string; webSite: string }) =>
  api.post<Broker>('/brokers', data).then((r) => r.data)

// ── Countries ─────────────────────────────────────────────────────────────────
export const getCountries = (name?: string) =>
  api.get<Country[]>('/countries', { params: name ? { name } : {} }).then((r) => r.data)

export const getCountryById = (id: number) =>
  api.get<Country>(`/countries/${id}`).then((r) => r.data)

export const createCountry = (data: { name: string; acronym: string }) =>
  api.post<Country>('/countries', data).then((r) => r.data)

// ── Segments ──────────────────────────────────────────────────────────────────
export const getSegments = () =>
  api.get<Segment[]>('/segments').then((r) => r.data)

// ── Assets ────────────────────────────────────────────────────────────────────
export const getAssets = (name?: string) =>
  api.get<Asset[]>('/assets', { params: name ? { name } : {} }).then((r) => r.data)

export const getAssetById = (id: number) =>
  api.get<Asset>(`/assets/${id}`).then((r) => r.data)

export const createAsset = (data: {
  name: string
  ticket: string
  description?: string
  country: number
  category: number
  sector: number
  segment: number
  incomeType?: string
  assetTypeId?: number
}) => api.post<Asset>('/assets', data).then((r) => r.data)

export const updateAsset = (id: number, data: {
  name: string; ticket: string; description?: string
  country: number; category: number; sector: number; segment: number
  incomeType?: string
  assetTypeId?: number
}) => api.put<Asset>(`/assets/${id}`, data).then((r) => r.data)

export const deleteAsset = (id: number) => api.delete(`/assets/${id}`)

export const updateAssetRecommendation = (
  id: number,
  data: { ceilingPrice?: number; navEstimated?: number; premiumDiscount?: number; indicator?: string }
) => api.patch<Asset>(`/assets/${id}/recommendation`, data).then((r) => r.data)

// ── Revisions ─────────────────────────────────────────────────────────────────
export const getRevisions = () =>
  api.get<Revision[]>('/revisions').then((r) => r.data)

export const getRevisionById = (id: number) =>
  api.get<Revision>(`/revisions/${id}`).then((r) => r.data)

export const createRevision = (data: {
  currentValue: number
  dividendYeld: number
  incomeFactor: number
  pVp: number
  lastIncome: number
  dateLastIncome: string
  nextIncome?: number
  dateNextIncome?: string
  notes?: string
  asset: number
}) => api.post<Revision>('/revisions', data).then((r) => r.data)

export const deleteRevision = (id: number) => api.delete(`/revisions/${id}`)

// ── Wallets ───────────────────────────────────────────────────────────────────
export const getWallets = (name?: string) =>
  api.get<Wallet[]>('/wallets', { params: name ? { name } : {} }).then((r) => r.data)

export const getWalletById = (id: number) =>
  api.get<Wallet[]>('/wallets').then((r) => {
    const w = r.data.find((w) => w.id === id)
    if (!w) throw new Error('Wallet not found')
    return w
  })

export const createWallet = (data: { name?: string; user: number }) =>
  api.post<Wallet>('/wallets', data).then((r) => r.data)

export const deleteWallet = (id: number) => api.delete(`/wallets/${id}`)

export const updateWalletMinAssetPays = (id: number, minAssetPays: number | null) =>
  api.patch<Wallet>(`/wallets/${id}/min-asset-pays`, { minAssetPays }).then((r) => r.data)

// ── Wallet Assets ─────────────────────────────────────────────────────────────
export const getWalletAssets = (walletId: number) =>
  api.get<WalletAsset[]>(`/wallets/${walletId}/assets`).then((r) => r.data)

export const addWalletAsset = (walletId: number, assetId: number) =>
  api.post<WalletAsset>(`/wallets/${walletId}/assets`, { assetId }).then((r) => r.data)

export const removeWalletAsset = (walletId: number, walletAssetId: number) =>
  api.delete(`/wallets/${walletId}/assets/${walletAssetId}`)

export const getMyAssets = () =>
  api.get<WalletAsset[]>('/wallet-assets').then((r) => r.data)

export const updateWalletAssetPosition = (
  walletId: number,
  walletAssetId: number,
  data: { quantity?: number; mediumPrice?: number; currentPrice?: number }
) => api.patch<WalletAsset>(`/wallets/${walletId}/assets/${walletAssetId}`, data).then((r) => r.data)

// ── Wallet Strategy ───────────────────────────────────────────────────────────
export const getWalletStrategies = (walletId: number) =>
  api.get<WalletStrategy[]>(`/wallets/${walletId}/strategies`).then((r) => r.data)

export const addWalletStrategy = (walletId: number, categoryId: number, percent: number) =>
  api.post<WalletStrategy>(`/wallets/${walletId}/strategies`, { categoryId, percent }).then((r) => r.data)

export const updateWalletStrategy = (walletId: number, walletStrategyId: number, percent: number) =>
  api.put<WalletStrategy>(`/wallets/${walletId}/strategies/${walletStrategyId}`, { percent }).then((r) => r.data)

export const removeWalletStrategy = (walletId: number, walletStrategyId: number) =>
  api.delete(`/wallets/${walletId}/strategies/${walletStrategyId}`)

// ── Dividend Entries ──────────────────────────────────────────────────────────
export const getDividendEntries = (year?: number) =>
  api.get<import('./types').DividendEntry[]>('/dividend-entries', { params: year ? { year } : {} }).then((r) => r.data)

export const createDividendEntry = (data: {
  category: string; month: number; year: number; value: number; currency: string
}) => api.post<import('./types').DividendEntry>('/dividend-entries', data).then((r) => r.data)

export const updateDividendEntry = (id: number, data: {
  category: string; month: number; year: number; value: number; currency: string
}) => api.put<import('./types').DividendEntry>(`/dividend-entries/${id}`, data).then((r) => r.data)

export const deleteDividendEntry = (id: number) => api.delete(`/dividend-entries/${id}`)

// ── Exchange rates ────────────────────────────────────────────────────────────
export const getUsdBrlRate = (): Promise<number> =>
  fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
    .then((r) => r.json())
    .then((data) => Number(data.USDBRL.bid))

// ── Users ─────────────────────────────────────────────────────────────────────
export const createUser = (data: {
  username: string
  password: string
  email?: string
  roles: string[]
}) => api.post<User>('/users', data).then((r) => r.data)

export const deleteUser = (id: number) => api.delete(`/users/${id}`)
