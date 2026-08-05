import { prisma } from './db.js'

export async function loadBookingLookups(bookings) {
  const hotelIds = [...new Set(bookings.map((booking) => booking.hotelId))]
  const roomIds = [...new Set(bookings.map((booking) => booking.roomId))]

  const [hotels, rooms] = await Promise.all([
    hotelIds.length
      ? prisma.hotel.findMany({
          where: { id: { in: hotelIds } },
          select: { id: true, name: true, location: true, images: true },
        })
      : [],
    roomIds.length
      ? prisma.room.findMany({
          where: { id: { in: roomIds } },
          select: { id: true, name: true },
        })
      : [],
  ])

  return {
    hotelById: new Map(hotels.map((hotel) => [hotel.id, hotel])),
    roomById: new Map(rooms.map((room) => [room.id, room])),
  }
}

export function serializeBooking(booking, lookups = {}) {
  const hotel = lookups.hotelById?.get(booking.hotelId)
  const room = lookups.roomById?.get(booking.roomId)

  return {
    id: booking.id,
    hotelId: booking.hotelId,
    roomId: booking.roomId,
    dateRange: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
    guests: booking.guests,
    guestInfo: {
      fullName: booking.guestFullName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
    },
    totalPrice: booking.totalPrice,
    status: booking.status === 'CANCELLED' ? 'cancelled' : 'confirmed',
    createdAt: booking.createdAt.toISOString(),
    hotel: hotel
      ? {
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          images: hotel.images,
        }
      : null,
    room: room
      ? {
          id: room.id,
          name: room.name,
        }
      : null,
  }
}
