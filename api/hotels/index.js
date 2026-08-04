import { prisma } from '../lib/db.js'
import {
  buildHotelInclude,
  filterSerializedHotels,
  parseSearchFilters,
  serializeHotel,
  sortSerializedHotels,
} from '../lib/hotels.js'
import { methodNotAllowed, sendError, sendException, sendJson } from '../lib/http.js'

async function loadBookingsByRoomIds(roomIds) {
  const map = new Map()
  for (const roomId of roomIds) {
    map.set(roomId, [])
  }

  if (roomIds.length === 0) return map

  const bookings = await prisma.booking.findMany({
    where: {
      roomId: { in: roomIds },
      status: 'CONFIRMED',
    },
  })

  for (const booking of bookings) {
    map.get(booking.roomId)?.push(booking)
  }

  return map
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const filters = parseSearchFilters(url.searchParams)

    const hotels = await prisma.hotel.findMany({
      include: buildHotelInclude(true),
      orderBy: { name: 'asc' },
    })

    const roomIds = hotels.flatMap((hotel) => hotel.rooms.map((room) => room.id))
    const bookingsByRoom = await loadBookingsByRoomIds(roomIds)

    const serialized = hotels.map((hotel) =>
      serializeHotel(hotel, {
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        bookingsByRoom,
      }),
    )

    const filtered = filterSerializedHotels(serialized, filters)
    const sorted = sortSerializedHotels(filtered, filters.sort)

    return sendJson(res, 200, { hotels: sorted, total: sorted.length })
  } catch (error) {
    console.error('hotel search failed', error)
    return sendException(res, error, 'Unable to load hotels right now.')
  }
}
