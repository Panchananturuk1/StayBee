import {
  calculateStayPricing,
  getRoomAvailability,
} from './availability.js'

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function matchesLocationQuery(hotel, query) {
  const parts = query
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)

  if (parts.length === 0) return true

  // "Koraput, Koraput" means city and district are the same — match that town's hotels.
  if (parts.length >= 2 && parts.every((part) => part === parts[0])) {
    const citySlug = slugify(parts[0])
    return hotel.id.startsWith(`hb-${citySlug}-`)
  }

  const haystack = `${hotel.name} ${hotel.location}`.toLowerCase()
  return parts.every((part) => haystack.includes(part))
}

function serializeReview(review) {
  return {
    id: review.id,
    author: review.author,
    rating: review.rating,
    date: review.date,
    title: review.title,
    body: review.body,
  }
}

function serializeRoom(room, context = {}) {
  const { checkIn, checkOut, bookings = [] } = context
  const availability =
    checkIn && checkOut
      ? getRoomAvailability(room, bookings, checkIn, checkOut)
      : { availableUnits: room.totalUnits, soldOut: false, limited: false }

  const pricing =
    checkIn && checkOut
      ? calculateStayPricing(room, room.priceRules || [], checkIn, checkOut)
      : { averagePerNight: room.basePrice, total: room.basePrice, nights: 1, nightlyPrices: [] }

  return {
    id: room.id,
    name: room.name,
    occupancy: room.occupancy,
    refundable: room.refundable,
    basePrice: room.basePrice,
    pricePerNight: pricing.averagePerNight,
    totalUnits: room.totalUnits,
    availableUnits: availability.availableUnits,
    soldOut: availability.soldOut,
    limited: availability.limited,
    stayTotal: pricing.total,
    images: room.images,
  }
}

export function serializeHotel(hotel, context = {}) {
  const { checkIn, checkOut, bookingsByRoom } = context
  const rooms = (hotel.rooms || []).map((room) =>
    serializeRoom(room, {
      checkIn,
      checkOut,
      bookings: bookingsByRoom?.get?.(room.id) || context.bookings || [],
    }),
  )
  const priceFrom = rooms.length > 0 ? Math.min(...rooms.map((room) => room.pricePerNight)) : 0

  return {
    id: hotel.id,
    name: hotel.name,
    location: hotel.location,
    propertyType: hotel.propertyType,
    images: hotel.images,
    rating: hotel.rating,
    reviewCount: hotel.reviewCount,
    priceFrom,
    amenities: hotel.amenities,
    blurb: hotel.blurb,
    rooms,
    reviews: (hotel.reviews || []).map(serializeReview),
  }
}

export function buildHotelInclude(withReviews = true) {
  return {
    rooms: {
      orderBy: { basePrice: 'asc' },
      include: { priceRules: true },
    },
    reviews: withReviews ? { orderBy: { date: 'desc' } } : false,
  }
}

export function parseSearchFilters(searchParams) {
  const location = searchParams.get('location')?.trim() || ''
  const checkIn = searchParams.get('checkIn')?.trim() || ''
  const checkOut = searchParams.get('checkOut')?.trim() || ''
  const guests = Number(searchParams.get('guests') || 1)
  const sort = searchParams.get('sort') || 'best'
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined
  const amenities = searchParams.get('amenities')?.split(',').filter(Boolean) || []
  const propertyTypes = searchParams.get('propertyTypes')?.split(',').filter(Boolean) || []

  return {
    location,
    checkIn,
    checkOut,
    guests: Number.isFinite(guests) && guests > 0 ? guests : 1,
    sort,
    minPrice,
    maxPrice,
    minRating,
    amenities,
    propertyTypes,
  }
}

export function filterSerializedHotels(hotels, filters) {
  return hotels.filter((hotel) => {
    if (filters.location) {
      if (!matchesLocationQuery(hotel, filters.location)) return false
    }

    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(hotel.propertyType)) {
      return false
    }

    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((amenity) => hotel.amenities.includes(amenity))
      if (!hasAll) return false
    }

    if (typeof filters.minRating === 'number' && hotel.rating < filters.minRating) return false
    if (typeof filters.minPrice === 'number' && hotel.priceFrom < filters.minPrice) return false
    if (typeof filters.maxPrice === 'number' && hotel.priceFrom > filters.maxPrice) return false

    if (filters.guests > 0) {
      const fitsGuests = hotel.rooms.some((room) => !room.soldOut && room.occupancy >= filters.guests)
      if (filters.checkIn && filters.checkOut && !fitsGuests) return false
    }

    if (filters.checkIn && filters.checkOut) {
      const hasAvailableRoom = hotel.rooms.some((room) => !room.soldOut)
      if (!hasAvailableRoom) return false
    }

    return true
  })
}

export function sortSerializedHotels(hotels, sort) {
  const list = [...hotels]
  if (sort === 'priceLow') return list.sort((a, b) => a.priceFrom - b.priceFrom)
  if (sort === 'priceHigh') return list.sort((a, b) => b.priceFrom - a.priceFrom)
  if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating)

  return list.sort((a, b) => {
    const aScore = a.rating * 10 - a.priceFrom / 1000
    const bScore = b.rating * 10 - b.priceFrom / 1000
    return bScore - aScore
  })
}
