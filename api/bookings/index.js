import { prisma } from '../lib/db.js'
import { getAuthenticatedUser } from '../lib/auth.js'
import { methodNotAllowed, readJson, sendError, sendJson } from '../lib/http.js'

function serializeBooking(booking) {
  return {
    id: booking.id,
    hotelId: booking.hotelId,
    roomId: booking.roomId,
    dateRange: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
    guests: booking.guests,
    guestInfo: {
      fullName: booking.guestFullName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
    },
    totalPrice: booking.totalPrice,
    status: booking.status === 'CANCELLED' ? 'cancelled' : 'confirmed',
    createdAt: booking.createdAt.toISOString(),
  }
}

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

      return sendJson(res, 200, { bookings: bookings.map(serializeBooking) })
    } catch (error) {
      console.error('booking list failed', error)
      return sendError(res, 500, 'Unable to load your bookings right now.')
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
          totalPrice: Number(totalPrice) || 0,
        },
      })

      return sendJson(res, 201, { booking: serializeBooking(booking) })
    } catch (error) {
      console.error('booking create failed', error)
      return sendError(res, 500, 'Unable to create your booking right now.')
    }
  }

  return methodNotAllowed(res, ['GET', 'POST'])
}
