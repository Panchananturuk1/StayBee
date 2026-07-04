export type Amenity =
  | 'wifi'
  | 'breakfast'
  | 'pool'
  | 'spa'
  | 'gym'
  | 'parking'
  | 'petFriendly'
  | 'seaView'

export type PropertyType = 'hotel' | 'resort' | 'boutique' | 'apartment'

export type Room = {
  id: string
  name: string
  occupancy: number
  refundable: boolean
  pricePerNight: number
  images: string[]
}

export type Review = {
  id: string
  author: string
  rating: number
  date: string
  title: string
  body: string
}

export type Hotel = {
  id: string
  name: string
  location: string
  propertyType: PropertyType
  images: string[]
  rating: number
  reviewCount: number
  priceFrom: number
  amenities: Amenity[]
  rooms: Room[]
  reviews: Review[]
  blurb: string
}

export type DateRange = {
  checkIn: string
  checkOut: string
}

export type BookingStatus = 'confirmed' | 'cancelled'

export type BookingGuestInfo = {
  fullName: string
  email: string
  phone: string
}

export type Booking = {
  id: string
  hotelId: string
  roomId: string
  dateRange: DateRange
  guests: number
  guestInfo: BookingGuestInfo
  totalPrice: number
  status: BookingStatus
  createdAt: string
}
