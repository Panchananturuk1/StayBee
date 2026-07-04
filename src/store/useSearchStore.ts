import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Amenity, PropertyType } from '@/types/stay'

export type SearchFilters = {
  minPrice?: number
  maxPrice?: number
  minRating?: number
  amenities: Amenity[]
  propertyTypes: PropertyType[]
}

export type SearchState = {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  sort: 'best' | 'priceLow' | 'priceHigh' | 'rating'
  filters: SearchFilters
  setBasics: (next: Partial<Pick<SearchState, 'location' | 'checkIn' | 'checkOut' | 'guests'>>) => void
  setSort: (sort: SearchState['sort']) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  toggleAmenity: (amenity: Amenity) => void
  togglePropertyType: (propertyType: PropertyType) => void
  reset: () => void
}

const defaultFilters: SearchFilters = {
  amenities: [],
  propertyTypes: [],
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
}

const defaultState = {
  location: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  sort: 'best' as const,
  filters: defaultFilters,
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setBasics: (next) => set((s) => ({ ...s, ...next })),
      setSort: (sort) => set({ sort }),
      setFilters: (filters) =>
        set((s) => ({
          ...s,
          filters: {
            ...s.filters,
            ...filters,
          },
        })),
      toggleAmenity: (amenity) => {
        const current = get().filters.amenities
        const next = current.includes(amenity)
          ? current.filter((a) => a !== amenity)
          : [...current, amenity]
        set((s) => ({ ...s, filters: { ...s.filters, amenities: next } }))
      },
      togglePropertyType: (propertyType) => {
        const current = get().filters.propertyTypes
        const next = current.includes(propertyType)
          ? current.filter((p) => p !== propertyType)
          : [...current, propertyType]
        set((s) => ({ ...s, filters: { ...s.filters, propertyTypes: next } }))
      },
      reset: () => set(defaultState),
    }),
    { name: 'staybee_search' },
  ),
)

