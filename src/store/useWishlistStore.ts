import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageKeys } from '@/store/storage'

type WishlistState = {
  hotelIds: string[]
  toggle: (hotelId: string) => void
  has: (hotelId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      hotelIds: [],
      toggle: (hotelId) => {
        const current = get().hotelIds
        const next = current.includes(hotelId)
          ? current.filter((id) => id !== hotelId)
          : [...current, hotelId]
        set({ hotelIds: next })
      },
      has: (hotelId) => get().hotelIds.includes(hotelId),
      clear: () => set({ hotelIds: [] }),
    }),
    { name: storageKeys.wishlist },
  ),
)

