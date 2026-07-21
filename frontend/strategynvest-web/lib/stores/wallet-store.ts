import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletStore {
  selectedWalletId: number | null
  setSelectedWalletId: (id: number | null) => void
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      selectedWalletId: null,
      setSelectedWalletId: (id) => set({ selectedWalletId: id }),
    }),
    { name: 'wallet-store' }
  )
)
