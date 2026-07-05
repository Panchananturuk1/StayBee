import { create } from 'zustand'
import { ApiError, apiFetch, getSessionToken } from '@/lib/api'
import type { Booking, BookingGuestInfo, DateRange } from '@/types/stay'

type CreateBookingInput = {
  hotelId: string
  roomId: string
  dateRange: DateRange
  guests: number
  guestInfo: BookingGuestInfo
  totalPrice: number
}

type BookingState = {
  bookings: Booking[]
  isLoading: boolean
  hasLoaded: boolean
  loadBookings: () => Promise<void>
  createBooking: (input: CreateBookingInput) => Promise<{ ok: true; booking: Booking } | { ok: false; message: string }>
  cancelBooking: (bookingId: string) => Promise<{ ok: true } | { ok: false; message: string }>
  reset: () => void
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  bookings: [],
  isLoading: false,
  hasLoaded: false,
  loadBookings: async () => {
    if (!getSessionToken()) {
      set({ bookings: [], hasLoaded: true, isLoading: false })
      return
    }

    set({ isLoading: true })

    try {
      const data = await apiFetch<{ bookings: Booking[] }>('/api/bookings')
      set({ bookings: data.bookings, isLoading: false, hasLoaded: true })
    } catch {
      set({ bookings: [], isLoading: false, hasLoaded: true })
    }
  },
  createBooking: async (input) => {
    set({ isLoading: true })

    try {
      const data = await apiFetch<{ booking: Booking }>('/api/bookings', {
        method: 'POST',
        body: input,
      })

      set({ bookings: [data.booking, ...get().bookings], isLoading: false, hasLoaded: true })
      return { ok: true, booking: data.booking }
    } catch (error) {
      set({ isLoading: false })
      return {
        ok: false,
        message: error instanceof ApiError ? error.message : 'Unable to create your booking right now.',
      }
    }
  },
  cancelBooking: async (bookingId) => {
    set({ isLoading: true })

    try {
      const data = await apiFetch<{ booking: Booking }>(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      })

      set({
        bookings: get().bookings.map((booking) => (booking.id === bookingId ? data.booking : booking)),
        isLoading: false,
        hasLoaded: true,
      })

      return { ok: true }
    } catch (error) {
      set({ isLoading: false })
      return {
        ok: false,
        message: error instanceof ApiError ? error.message : 'Unable to cancel this booking right now.',
      }
    }
  },
  reset: () => set({ bookings: [], isLoading: false, hasLoaded: false }),
}))
