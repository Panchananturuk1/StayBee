import { prisma } from '../../../lib/db.js'
import { requireAdmin } from '../../../lib/admin.js'
import { buildHotelInclude, serializeHotel } from '../../../lib/hotels.js'
import { methodNotAllowed, readJson, sendError, sendException, sendJson } from '../../../lib/http.js'

function parseHotelInput(body) {
  const errors = []
  const data = {}

  if (body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) errors.push('Hotel name is required.')
    else data.name = name
  }

  if (body.location !== undefined) {
    const location = typeof body.location === 'string' ? body.location.trim() : ''
    if (!location) errors.push('Location is required.')
    else data.location = location
  }

  if (body.propertyType !== undefined) {
    const propertyType = typeof body.propertyType === 'string' ? body.propertyType.trim() : ''
    const allowed = ['hotel', 'resort', 'boutique', 'apartment']
    if (!allowed.includes(propertyType)) errors.push('Property type is invalid.')
    else data.propertyType = propertyType
  }

  if (body.blurb !== undefined) data.blurb = typeof body.blurb === 'string' ? body.blurb.trim() : ''
  if (body.rating !== undefined) data.rating = Number(body.rating) || 0
  if (body.reviewCount !== undefined) data.reviewCount = Number(body.reviewCount) || 0
  if (Array.isArray(body.images)) data.images = body.images.filter((item) => typeof item === 'string')
  if (Array.isArray(body.amenities)) data.amenities = body.amenities.filter((item) => typeof item === 'string')

  return { data, errors }
}

function parseRoomInput(body) {
  return {
    id: typeof body.id === 'string' ? body.id.trim() : '',
    name: typeof body.name === 'string' ? body.name.trim() : '',
    occupancy: Number(body.occupancy) || 1,
    refundable: body.refundable !== false,
    basePrice: Number(body.basePrice ?? body.pricePerNight) || 0,
    totalUnits: Number(body.totalUnits) || 2,
    images: Array.isArray(body.images) ? body.images.filter((item) => typeof item === 'string') : [],
  }
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res, sendError)
  if (!admin) return

  const hotelId = req.query?.hotelId
  if (!hotelId) {
    return sendError(res, 400, 'Hotel id is required.')
  }

  if (req.method === 'GET') {
    try {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: buildHotelInclude(false),
      })

      if (!hotel) {
        return sendError(res, 404, 'Hotel not found.')
      }

      return sendJson(res, 200, { hotel: serializeHotel(hotel) })
    } catch (error) {
      console.error('admin hotel detail failed', error)
      return sendException(res, error, 'Unable to load this hotel right now.')
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = await readJson(req)
      const { data, errors } = parseHotelInput(body)

      if (errors.length > 0) {
        return sendError(res, 400, errors[0])
      }

      const existing = await prisma.hotel.findUnique({ where: { id: hotelId } })
      if (!existing) {
        return sendError(res, 404, 'Hotel not found.')
      }

      await prisma.hotel.update({
        where: { id: hotelId },
        data,
      })

      if (Array.isArray(body.rooms)) {
        const roomPayload = body.rooms.map(parseRoomInput)
        if (roomPayload.some((room) => !room.id || !room.name || room.basePrice <= 0)) {
          return sendError(res, 400, 'Each room needs an id, name, and base price.')
        }

        const incomingIds = roomPayload.map((room) => room.id)
        await prisma.room.deleteMany({
          where: {
            hotelId,
            id: { notIn: incomingIds },
          },
        })

        for (const room of roomPayload) {
          await prisma.room.upsert({
            where: { id: room.id },
            create: { ...room, hotelId },
            update: {
              name: room.name,
              occupancy: room.occupancy,
              refundable: room.refundable,
              basePrice: room.basePrice,
              totalUnits: room.totalUnits,
              images: room.images,
            },
          })
        }
      }

      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: buildHotelInclude(false),
      })

      return sendJson(res, 200, { hotel: serializeHotel(hotel) })
    } catch (error) {
      console.error('admin hotel update failed', error)
      return sendException(res, error, 'Unable to update this hotel right now.')
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.hotel.delete({ where: { id: hotelId } })
      return sendJson(res, 200, { ok: true })
    } catch (error) {
      console.error('admin hotel delete failed', error)
      return sendException(res, error, 'Unable to delete this hotel right now.')
    }
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
}
