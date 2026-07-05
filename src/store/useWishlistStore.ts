import { create } from 'zustand'
import { ApiError, apiFetch, getSessionToken } from '@/lib/api'

type WishlistState = {
  hotelIds: string[]
  isLoading: boolean
  hasLoaded: boolean
  loadSaved: () => Promise<void>
  toggle: (hotelId: string) => Promise<{ ok: true; saved: boolean } | { ok: false; message: string }>
  has: (hotelId: string) => boolean
  clear: () => Promise<{ ok: true } | { ok: false; message: string }>
  reset: () => void
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  hotelIds: [],
  isLoading: false,
  hasLoaded: false,
  loadSaved: async () => {
    if (!getSessionToken()) {
      set({ hotelIds: [], hasLoaded: true, isLoading: false })
      return
    }

    set({ isLoading: true })

    try {
      const data = await apiFetch<{ hotelIds: string[] }>('/api/saved')
      set({ hotelIds: data.hotelIds, isLoading: false, hasLoaded: true })
    } catch {
      set({ hotelIds: [], isLoading: false, hasLoaded: true })
    }
  },
  toggle: async (hotelId) => {
    set({ isLoading: true })

    try {
      const data = await apiFetch<{ saved: boolean }>('/api/saved/toggle', {
        method: 'POST',
        body: { hotelId },
      })

      const current = get().hotelIds
      const next = data.saved ? [...new Set([...current, hotelId])] : current.filter((id) => id !== hotelId)

      set({ hotelIds: next, isLoading: false, hasLoaded: true })
      return { ok: true, saved: data.saved }
    } catch (error) {
      set({ isLoading: false })
      return {
        ok: false,
        message: error instanceof ApiError ? error.message : 'Unable to update your saved stays right now.',
      }
    }
  },
  has: (hotelId) => get().hotelIds.includes(hotelId),
  clear: async () => {
    set({ isLoading: true })

    try {
      await apiFetch('/api/saved', { method: 'DELETE' })
      set({ hotelIds: [], isLoading: false, hasLoaded: true })
      return { ok: true }
    } catch (error) {
      set({ isLoading: false })
      return {
        ok: false,
        message: error instanceof ApiError ? error.message : 'Unable to clear your saved stays right now.',
      }
    }
  },
  reset: () => set({ hotelIds: [], isLoading: false, hasLoaded: false }),
}))
