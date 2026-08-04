import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PrismaClient, PropertyType } from '@prisma/client'
import { staybeeImage } from '../src/data/images'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL,
    },
  },
})

type KoraputHotelJson = {
  name: string
  city: string
  district: string
  state: string
  country: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function hotelId(entry: KoraputHotelJson) {
  return `hb-${slugify(entry.city)}-${slugify(entry.name)}`
}

function inferPropertyType(name: string): PropertyType {
  const lower = name.toLowerCase()
  if (lower.includes('resort') || lower.includes('farmstay')) return 'resort'
  if (lower.includes('homestay') || lower.includes('escapes')) return 'boutique'
  if (lower.includes('apartment')) return 'apartment'
  return 'hotel'
}

function priceForIndex(index: number, offset = 0) {
  const tiers = [999, 1499, 1999, 2499, 2999, 3499, 3999, 4599, 4999, 5499]
  return tiers[(index + offset) % tiers.length]
}

function ratingForIndex(index: number) {
  return Math.round((4.1 + (index % 8) * 0.1) * 10) / 10
}

function buildImage(name: string, city: string) {
  return staybeeImage(
    `photorealistic ${name} hotel in ${city}, Koraput Odisha India, warm lighting, clean lobby, hills in background, cinematic, high detail`,
    'landscape_16_9',
  )
}

async function main() {
  const filePath = resolve(process.cwd(), 'Koraput_hotels.json')
  const raw = readFileSync(filePath, 'utf8')
  const entries = JSON.parse(raw) as KoraputHotelJson[]

  console.log(`Importing ${entries.length} Koraput hotels…`)

  for (const [index, entry] of entries.entries()) {
    const id = hotelId(entry)
    const location = `${entry.city}, ${entry.district}, ${entry.state}, ${entry.country}`
    const propertyType = inferPropertyType(entry.name)
    const coverImage = buildImage(entry.name, entry.city)
    const standardPrice = priceForIndex(index)
    const deluxePrice = priceForIndex(index, 2)
    const rating = ratingForIndex(index)

    const standardRoomId = `${id}-standard`
    const deluxeRoomId = `${id}-deluxe`

    await prisma.review.deleteMany({ where: { hotelId: id } })
    await prisma.roomPriceRule.deleteMany({
      where: { room: { hotelId: id } },
    })
    await prisma.room.deleteMany({ where: { hotelId: id } })

    await prisma.hotel.upsert({
      where: { id },
      create: {
        id,
        name: entry.name,
        location,
        propertyType,
        blurb: `Comfortable stay in ${entry.city}, Koraput district — well suited for travellers exploring Odisha's hills and tribal heritage.`,
        rating,
        reviewCount: 40 + (index % 120),
        images: [coverImage],
        amenities: ['wifi', 'breakfast', 'parking'],
      },
      update: {
        name: entry.name,
        location,
        propertyType,
        blurb: `Comfortable stay in ${entry.city}, Koraput district — well suited for travellers exploring Odisha's hills and tribal heritage.`,
        rating,
        reviewCount: 40 + (index % 120),
        images: [coverImage],
        amenities: ['wifi', 'breakfast', 'parking'],
      },
    })

    await prisma.room.createMany({
      data: [
        {
          id: standardRoomId,
          hotelId: id,
          name: 'Standard Room',
          occupancy: 2,
          refundable: true,
          basePrice: standardPrice,
          totalUnits: 2,
          images: [coverImage],
        },
        {
          id: deluxeRoomId,
          hotelId: id,
          name: 'Deluxe Room',
          occupancy: 3,
          refundable: true,
          basePrice: deluxePrice,
          totalUnits: 2,
          images: [coverImage],
        },
      ],
    })

    await prisma.review.create({
      data: {
        hotelId: id,
        author: 'Guest',
        rating: Math.min(5, rating + 0.2),
        date: '2026-06-01',
        title: `Good stay in ${entry.city}`,
        body: `Clean rooms and a convenient location in ${entry.city}. Helpful for Koraput visits.`,
      },
    })

    for (const [roomId, basePrice] of [
      [standardRoomId, standardPrice],
      [deluxeRoomId, deluxePrice],
    ] as const) {
      await prisma.roomPriceRule.deleteMany({
        where: { roomId, dayOfWeek: { in: [5, 6] } },
      })

      await prisma.roomPriceRule.createMany({
        data: [
          {
            roomId,
            label: 'Friday',
            dayOfWeek: 5,
            price: Math.round(basePrice * 1.15),
          },
          {
            roomId,
            label: 'Saturday',
            dayOfWeek: 6,
            price: Math.round(basePrice * 1.15),
          },
        ],
      })
    }

    console.log(`  ✓ ${entry.name} (${entry.city})`)
  }

  const total = await prisma.hotel.count()
  console.log(`Done. ${total} hotels now in the database.`)
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
