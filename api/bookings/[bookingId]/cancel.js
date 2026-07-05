import { prisma } from '../../lib/db.js'
import { getAuthenticatedUser } from '../../lib/auth.js'
import { methodNotAllowed, sendError, sendException, sendJson } from '../../lib/http.js'

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
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  const auth = await getAuthenticatedUser(req)
  if (!auth) {
    return sendError(res, 401, 'Please sign in to manage bookings.')
  }

  try {
    const bookingId = req.query.bookingId
    const existing = await prisma.booking.findFirst({
      where: {
        id: String(bookingId),
        userId: auth.user.id,
      },
    })

    if (!existing) {
      return sendError(res, 404, 'Booking not found.')
    }

    const booking = await prisma.booking.update({
      where: { id: existing.id },
      data: { status: 'CANCELLED' },
    })

    return sendJson(res, 200, { booking: serializeBooking(booking) })
  } catch (error) {
    console.error('booking cancel failed', error)
    return sendException(res, error, 'Unable to cancel this booking right now.')
  }
}
