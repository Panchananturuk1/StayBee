import { prisma } from '../../../lib/db.js'
import { requireAdmin } from '../../../lib/admin.js'
import { buildHotelInclude, serializeHotel } from '../../../lib/hotels.js'
import { methodNotAllowed, readJson, sendError, sendException, sendJson } from '../../../lib/http.js'

function parseHotelInput(body, { partial = false } = {}) {
  const errors = []
  const data = {}

  if (!partial || body.id !== undefined) {
    const id = typeof body.id === 'string' ? body.id.trim() : ''
    if (!id) errors.push('Hotel id is required.')
    else data.id = id
  }

  if (!partial || body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) errors.push('Hotel name is required.')
    else data.name = name
  }

  if (!partial || body.location !== undefined) {
    const location = typeof body.location === 'string' ? body.location.trim() : ''
    if (!location) errors.push('Location is required.')
    else data.location = location
  }

  if (!partial || body.propertyType !== undefined) {
    const propertyType = typeof body.propertyType === 'string' ? body.propertyType.trim() : ''
    const allowed = ['hotel', 'resort', 'boutique', 'apartment']
    if (!allowed.includes(propertyType)) errors.push('Property type is invalid.')
    else data.propertyType = propertyType
  }

  if (!partial || body.blurb !== undefined) {
    data.blurb = typeof body.blurb === 'string' ? body.blurb.trim() : ''
  }

  if (body.rating !== undefined) data.rating = Number(body.rating) || 0
  if (body.reviewCount !== undefined) data.reviewCount = Number(body.reviewCount) || 0
  if (Array.isArray(body.images)) data.images = body.images.filter((item) => typeof item === 'string')
  if (Array.isArray(body.amenities)) data.amenities = body.amenities.filter((item) => typeof item === 'string')

  if (Array.isArray(body.rooms)) {
    data.rooms = body.rooms.map((room) => ({
      id: typeof room.id === 'string' ? room.id.trim() : '',
      name: typeof room.name === 'string' ? room.name.trim() : '',
      occupancy: Number(room.occupancy) || 1,
      refundable: room.refundable !== false,
      basePrice: Number(room.basePrice ?? room.pricePerNight) || 0,
      totalUnits: Number(room.totalUnits) || 2,
      images: Array.isArray(room.images) ? room.images.filter((item) => typeof item === 'string') : [],
    }))
  }

  return { data, errors }
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res, sendError)
  if (!admin) return

  if (req.method === 'GET') {
    try {
      const hotels = await prisma.hotel.findMany({
        include: buildHotelInclude(false),
        orderBy: { name: 'asc' },
      })

      return sendJson(res, 200, {
        hotels: hotels.map((hotel) => serializeHotel(hotel)),
      })
    } catch (error) {
      console.error('admin hotel list failed', error)
      return sendException(res, error, 'Unable to load hotels right now.')
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readJson(req)
      const { data, errors } = parseHotelInput(body)

      if (errors.length > 0) {
        return sendError(res, 400, errors[0])
      }

      if (!Array.isArray(data.rooms) || data.rooms.length === 0) {
        return sendError(res, 400, 'At least one room is required.')
      }

      if (data.rooms.some((room) => !room.id || !room.name || room.basePrice <= 0)) {
        return sendError(res, 400, 'Each room needs an id, name, and base price.')
      }

      const hotel = await prisma.hotel.create({
        data: {
          id: data.id,
          name: data.name,
          location: data.location,
          propertyType: data.propertyType,
          blurb: data.blurb || '',
          rating: data.rating ?? 4.5,
          reviewCount: data.reviewCount ?? 0,
          images: data.images || [],
          amenities: data.amenities || [],
          rooms: {
            create: data.rooms.map((room) => ({
              id: room.id,
              name: room.name,
              occupancy: room.occupancy,
              refundable: room.refundable,
              basePrice: room.basePrice,
              totalUnits: room.totalUnits,
              images: room.images,
            })),
          },
        },
        include: buildHotelInclude(false),
      })

      return sendJson(res, 201, { hotel: serializeHotel(hotel) })
    } catch (error) {
      console.error('admin hotel create failed', error)
      return sendException(res, error, 'Unable to create this hotel right now.')
    }
  }

  return methodNotAllowed(res, ['GET', 'POST'])
}
