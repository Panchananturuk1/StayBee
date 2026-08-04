import { prisma } from '../../lib/db.js'
import { buildHotelInclude, serializeHotel } from '../../lib/hotels.js'
import { methodNotAllowed, sendError, sendException, sendJson } from '../../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  try {
    const hotelId = req.query?.hotelId
    if (!hotelId) {
      return sendError(res, 400, 'Hotel id is required.')
    }

    const url = new URL(req.url || '/', 'http://localhost')
    const checkIn = url.searchParams.get('checkIn')?.trim() || ''
    const checkOut = url.searchParams.get('checkOut')?.trim() || ''

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: buildHotelInclude(true),
    })

    if (!hotel) {
      return sendError(res, 404, 'Hotel not found.')
    }

    const bookings = await prisma.booking.findMany({
      where: {
        roomId: { in: hotel.rooms.map((room) => room.id) },
        status: 'CONFIRMED',
      },
    })

    const bookingsByRoom = new Map()
    for (const room of hotel.rooms) {
      bookingsByRoom.set(
        room.id,
        bookings.filter((booking) => booking.roomId === room.id),
      )
    }

    return sendJson(
      res,
      200,
      serializeHotel(hotel, {
        checkIn,
        checkOut,
        bookingsByRoom,
      }),
    )
  } catch (error) {
    console.error('hotel detail failed', error)
    return sendException(res, error, 'Unable to load this hotel right now.')
  }
}
