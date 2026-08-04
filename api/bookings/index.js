import { prisma } from '../lib/db.js'
import { getAuthenticatedUser } from '../lib/auth.js'
import {
  calculateStayPricing,
  getRoomAvailability,
  isValidStayRange,
} from '../lib/availability.js'
import { loadBookingLookups, serializeBooking } from '../lib/bookings.js'
import { methodNotAllowed, readJson, sendError, sendException, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  const auth = await getAuthenticatedUser(req)
  if (!auth) {
    return sendError(res, 401, 'Please sign in to manage bookings.')
  }

  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId: auth.user.id },
        orderBy: { createdAt: 'desc' },
      })

      const lookups = await loadBookingLookups(bookings)

      return sendJson(res, 200, {
        bookings: bookings.map((booking) => serializeBooking(booking, lookups)),
      })
    } catch (error) {
      console.error('booking list failed', error)
      return sendException(res, error, 'Unable to load your bookings right now.')
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        hotelId = '',
        roomId = '',
        dateRange = {},
        guests = 1,
        guestInfo = {},
        totalPrice = 0,
      } = await readJson(req)

      const checkIn = typeof dateRange.checkIn === 'string' ? dateRange.checkIn : ''
      const checkOut = typeof dateRange.checkOut === 'string' ? dateRange.checkOut : ''
      const guestFullName = typeof guestInfo.fullName === 'string' ? guestInfo.fullName.trim() : ''
      const guestEmail = typeof guestInfo.email === 'string' ? guestInfo.email.trim().toLowerCase() : ''
      const guestPhone = typeof guestInfo.phone === 'string' ? guestInfo.phone.trim() : ''

      if (!hotelId || !roomId || !checkIn || !checkOut) {
        return sendError(res, 400, 'Hotel, room, and stay dates are required.')
      }

      if (!guestFullName || !guestEmail || !guestEmail.includes('@') || !guestPhone) {
        return sendError(res, 400, 'Guest name, email, and phone are required.')
      }

      if (!isValidStayRange(checkIn, checkOut)) {
        return sendError(res, 400, 'Select a valid check-in and check-out range.')
      }

      const room = await prisma.room.findFirst({
        where: { id: roomId, hotelId },
        include: { priceRules: true },
      })

      if (!room) {
        return sendError(res, 400, 'Selected room was not found.')
      }

      if (guests > room.occupancy) {
        return sendError(res, 400, `This room supports up to ${room.occupancy} guests.`)
      }

      const existingBookings = await prisma.booking.findMany({
        where: {
          roomId,
          status: 'CONFIRMED',
        },
      })

      const availability = getRoomAvailability(room, existingBookings, checkIn, checkOut)
      if (availability.soldOut) {
        return sendError(res, 409, 'This room is sold out for the selected dates.')
      }

      const pricing = calculateStayPricing(room, room.priceRules, checkIn, checkOut)
      const expectedTotal = pricing.total
      const submittedTotal = Number(totalPrice) || 0

      if (Math.abs(submittedTotal - expectedTotal) > 1) {
        return sendError(res, 400, 'The booking total changed. Refresh the page and try again.')
      }

      const booking = await prisma.booking.create({
        data: {
          userId: auth.user.id,
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests: Number(guests) || 1,
          guestFullName,
          guestEmail,
          guestPhone,
          totalPrice: expectedTotal,
        },
      })

      const lookups = await loadBookingLookups([booking])

      return sendJson(res, 201, { booking: serializeBooking(booking, lookups) })
    } catch (error) {
      console.error('booking create failed', error)
      return sendException(res, error, 'Unable to create your booking right now.')
    }
  }

  return methodNotAllowed(res, ['GET', 'POST'])
}
