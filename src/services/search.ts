import type { Hotel } from '@/types/stay'
import type { SearchFilters, SearchState } from '@/store/useSearchStore'
import { clampNumber } from '@/utils/format'

export function filterHotels(hotels: Hotel[], basics: Pick<SearchState, 'location'>, filters: SearchFilters) {
  const query = basics.location.trim().toLowerCase()
  return hotels.filter((h) => {
    if (query) {
      const hay = `${h.name} ${h.location}`.toLowerCase()
      if (!hay.includes(query)) return false
    }

    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(h.propertyType)) return false

    if (filters.amenities.length > 0) {
      const ok = filters.amenities.every((a) => h.amenities.includes(a))
      if (!ok) return false
    }

    if (typeof filters.minRating === 'number' && h.rating < filters.minRating) return false

    const minPrice = typeof filters.minPrice === 'number' ? filters.minPrice : undefined
    const maxPrice = typeof filters.maxPrice === 'number' ? filters.maxPrice : undefined
    if (typeof minPrice === 'number' && h.priceFrom < minPrice) return false
    if (typeof maxPrice === 'number' && h.priceFrom > maxPrice) return false

    return true
  })
}

export function sortHotels(hotels: Hotel[], sort: SearchState['sort']) {
  const list = [...hotels]
  if (sort === 'priceLow') return list.sort((a, b) => a.priceFrom - b.priceFrom)
  if (sort === 'priceHigh') return list.sort((a, b) => b.priceFrom - a.priceFrom)
  if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating)

  return list.sort((a, b) => {
    const aScore = clampNumber(a.rating, 0, 5) * 10 - a.priceFrom / 100
    const bScore = clampNumber(b.rating, 0, 5) * 10 - b.priceFrom / 100
    return bScore - aScore
  })
}

