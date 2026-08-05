import { PrismaClient } from '@prisma/client'
import { hotels } from '../src/data/stays'

const prisma = new PrismaClient()

async function main() {
  for (const hotel of hotels) {
    await prisma.hotel.upsert({
      where: { id: hotel.id },
      create: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        propertyType: hotel.propertyType,
        blurb: hotel.blurb,
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        images: hotel.images,
        amenities: hotel.amenities,
        rooms: {
          create: hotel.rooms.map((room) => ({
            id: room.id,
            name: room.name,
            occupancy: room.occupancy,
            refundable: room.refundable,
            basePrice: room.pricePerNight,
            totalUnits: 2,
            images: room.images,
          })),
        },
        reviews: {
          create: hotel.reviews.map((review) => ({
            author: review.author,
            rating: review.rating,
            date: review.date,
            title: review.title,
            body: review.body,
          })),
        },
      },
      update: {
        name: hotel.name,
        location: hotel.location,
        propertyType: hotel.propertyType,
        blurb: hotel.blurb,
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        images: hotel.images,
        amenities: hotel.amenities,
      },
    })

    for (const room of hotel.rooms) {
      await prisma.room.upsert({
        where: { id: room.id },
        create: {
          id: room.id,
          hotelId: hotel.id,
          name: room.name,
          occupancy: room.occupancy,
          refundable: room.refundable,
          basePrice: room.pricePerNight,
          totalUnits: 2,
          images: room.images,
        },
        update: {
          name: room.name,
          occupancy: room.occupancy,
          refundable: room.refundable,
          basePrice: room.pricePerNight,
          totalUnits: 2,
          images: room.images,
        },
      })

      await prisma.roomPriceRule.deleteMany({
        where: {
          roomId: room.id,
          dayOfWeek: { in: [5, 6] },
        },
      })

      await prisma.roomPriceRule.createMany({
        data: [
          {
            roomId: room.id,
            label: 'Friday',
            dayOfWeek: 5,
            price: Math.round(room.pricePerNight * 1.15),
          },
          {
            roomId: room.id,
            label: 'Saturday',
            dayOfWeek: 6,
            price: Math.round(room.pricePerNight * 1.15),
          },
        ],
      })
    }

    await prisma.review.deleteMany({ where: { hotelId: hotel.id } })
    await prisma.review.createMany({
      data: hotel.reviews.map((review) => ({
        hotelId: hotel.id,
        author: review.author,
        rating: review.rating,
        date: review.date,
        title: review.title,
        body: review.body,
      })),
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
