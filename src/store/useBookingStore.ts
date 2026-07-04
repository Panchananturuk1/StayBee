import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageKeys } from '@/store/storage'
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
  createBooking: (input: CreateBookingInput) => Booking
  cancelBooking: (bookingId: string) => void
  clear: () => void
}

function bookingId() {
  return `b_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      createBooking: (input) => {
        const newBooking: Booking = {
          id: bookingId(),
          hotelId: input.hotelId,
          roomId: input.roomId,
          dateRange: input.dateRange,
          guests: input.guests,
          guestInfo: input.guestInfo,
          totalPrice: input.totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        }
        set({ bookings: [newBooking, ...get().bookings] })
        return newBooking
      },
      cancelBooking: (bookingId) =>
        set({
          bookings: get().bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)),
        }),
      clear: () => set({ bookings: [] }),
    }),
    { name: storageKeys.bookings },
  ),
)

