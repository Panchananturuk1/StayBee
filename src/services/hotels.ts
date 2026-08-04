import { apiFetch } from '@/lib/api'
import type { SearchFilters } from '@/store/useSearchStore'
import type { CalendarDay, Hotel } from '@/types/stay'

type SearchInput = {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  sort?: string
  filters?: SearchFilters
}

function buildSearchParams(input: SearchInput = {}) {
  const params = new URLSearchParams()

  if (input.location) params.set('location', input.location)
  if (input.checkIn) params.set('checkIn', input.checkIn)
  if (input.checkOut) params.set('checkOut', input.checkOut)
  if (input.guests) params.set('guests', String(input.guests))
  if (input.sort) params.set('sort', input.sort)

  const filters = input.filters
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters?.minRating !== undefined) params.set('minRating', String(filters.minRating))
  if (filters?.amenities?.length) params.set('amenities', filters.amenities.join(','))
  if (filters?.propertyTypes?.length) params.set('propertyTypes', filters.propertyTypes.join(','))

  return params
}

export async function fetchHotels(input: SearchInput = {}) {
  const params = buildSearchParams(input)
  const query = params.toString()
  const data = await apiFetch<{ hotels: Hotel[]; total: number }>(`/api/hotels${query ? `?${query}` : ''}`)
  return data.hotels
}

export async function fetchHotelById(hotelId: string, checkIn = '', checkOut = '') {
  const params = new URLSearchParams()
  if (checkIn) params.set('checkIn', checkIn)
  if (checkOut) params.set('checkOut', checkOut)
  const query = params.toString()
  return apiFetch<Hotel>(`/api/hotels/${hotelId}${query ? `?${query}` : ''}`)
}

export async function fetchHotelsByIds(hotelIds: string[]) {
  if (hotelIds.length === 0) return []

  const results = await Promise.allSettled(hotelIds.map((id) => fetchHotelById(id)))
  return results
    .filter((result): result is PromiseFulfilledResult<Hotel> => result.status === 'fulfilled')
    .map((result) => result.value)
}

export async function fetchRoomAvailability(hotelId: string, roomId: string, month: string) {
  const params = new URLSearchParams({ roomId, month })
  return apiFetch<{ days: CalendarDay[]; month: string }>(
    `/api/hotels/${hotelId}/availability?${params.toString()}`,
  )
}

export async function fetchAdminHotels() {
  const data = await apiFetch<{ hotels: Hotel[] }>('/api/admin/hotels')
  return data.hotels
}

export async function saveAdminHotel(hotel: Hotel, mode: 'create' | 'edit') {
  const payload = {
    id: hotel.id,
    name: hotel.name,
    location: hotel.location,
    propertyType: hotel.propertyType,
    blurb: hotel.blurb,
    rating: hotel.rating,
    reviewCount: hotel.reviewCount,
    images: hotel.images,
    amenities: hotel.amenities,
    rooms: hotel.rooms.map((room) => ({
      id: room.id,
      name: room.name,
      occupancy: room.occupancy,
      refundable: room.refundable,
      basePrice: room.basePrice ?? room.pricePerNight,
      totalUnits: room.totalUnits ?? 2,
      images: room.images,
    })),
  }

  if (mode === 'create') {
    const data = await apiFetch<{ hotel: Hotel }>('/api/admin/hotels', {
      method: 'POST',
      body: payload,
    })
    return data.hotel
  }

  const data = await apiFetch<{ hotel: Hotel }>(`/api/admin/hotels/${hotel.id}`, {
    method: 'PUT',
    body: payload,
  })
  return data.hotel
}

export async function deleteAdminHotel(hotelId: string) {
  await apiFetch(`/api/admin/hotels/${hotelId}`, { method: 'DELETE' })
}
