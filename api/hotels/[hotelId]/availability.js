import { prisma } from '../../lib/db.js'
import { buildCalendarDays, getMonthBounds } from '../../lib/availability.js'
import { methodNotAllowed, sendError, sendException, sendJson } from '../../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  try {
    const hotelId = req.query?.hotelId
    const url = new URL(req.url || '/', 'http://localhost')
    const roomId = url.searchParams.get('roomId')?.trim() || ''
    const month = url.searchParams.get('month')?.trim() || ''

    if (!hotelId || !roomId || !month) {
      return sendError(res, 400, 'Hotel id, room id, and month are required.')
    }

    const room = await prisma.room.findFirst({
      where: { id: roomId, hotelId },
      include: { priceRules: true },
    })

    if (!room) {
      return sendError(res, 404, 'Room not found.')
    }

    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: 'CONFIRMED',
      },
    })

    const days = buildCalendarDays(room, room.priceRules, bookings, month)
    const bounds = getMonthBounds(month)

    return sendJson(res, 200, {
      hotelId,
      roomId,
      month,
      bounds,
      days,
    })
  } catch (error) {
    console.error('availability calendar failed', error)
    return sendException(res, error, 'Unable to load availability right now.')
  }
}
