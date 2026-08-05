import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PrismaClient, PropertyType } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL,
    },
  },
})

type EnrichedHotel = {
  name: string
  city: string
  district: string
  state: string
  country: string
  address: string
  phone?: string
  website?: string
  rating: number
  reviewCount: number
  googleMapsUrl?: string
  blurb: string
  amenities: string[]
  propertyType?: PropertyType
  standardPrice: number
  deluxePrice: number
  reviewTitle: string
  reviewBody: string
  images: string[]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function hotelId(entry: Pick<EnrichedHotel, 'city' | 'name'>) {
  return `hb-${slugify(entry.city)}-${slugify(entry.name)}`
}

function inferPropertyType(name: string, override?: PropertyType): PropertyType {
  if (override) return override
  const lower = name.toLowerCase()
  if (lower.includes('resort') || lower.includes('farmstay')) return 'resort'
  if (lower.includes('homestay') || lower.includes('escapes')) return 'boutique'
  if (lower.includes('apartment')) return 'apartment'
  return 'hotel'
}

async function upsertWeekendRules(roomId: string, basePrice: number) {
  await prisma.roomPriceRule.deleteMany({
    where: { roomId, dayOfWeek: { in: [5, 6] } },
  })

  await prisma.roomPriceRule.createMany({
    data: [
      { roomId, label: 'Friday', dayOfWeek: 5, price: Math.round(basePrice * 1.15) },
      { roomId, label: 'Saturday', dayOfWeek: 6, price: Math.round(basePrice * 1.15) },
    ],
  })
}

async function main() {
  const filePath = resolve(process.cwd(), 'data/koraput-town-google.json')
  const entries = JSON.parse(readFileSync(filePath, 'utf8')) as EnrichedHotel[]

  console.log(`Updating ${entries.length} Koraput town hotels from Google-sourced data…`)

  for (const entry of entries) {
    const id = hotelId(entry)
    const location = `${entry.address} (${entry.city}, ${entry.district}, ${entry.state})`
    const propertyType = inferPropertyType(entry.name, entry.propertyType)
    const images = entry.images.filter(Boolean)
    const coverImage = images[0]
    const standardRoomId = `${id}-standard`
    const deluxeRoomId = `${id}-deluxe`

    const existing = await prisma.hotel.findUnique({ where: { id } })
    if (!existing) {
      console.warn(`  ⚠ Skipping ${entry.name} — not found in database (${id})`)
      continue
    }

    await prisma.review.deleteMany({ where: { hotelId: id } })
    await prisma.roomPriceRule.deleteMany({ where: { room: { hotelId: id } } })
    await prisma.room.deleteMany({ where: { hotelId: id } })

    await prisma.hotel.update({
      where: { id },
      data: {
        name: entry.name,
        location,
        propertyType,
        blurb: entry.blurb,
        rating: entry.rating,
        reviewCount: entry.reviewCount,
        images,
        amenities: entry.amenities,
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
          basePrice: entry.standardPrice,
          totalUnits: 2,
          images: [coverImage],
        },
        {
          id: deluxeRoomId,
          hotelId: id,
          name: 'Deluxe Room',
          occupancy: 3,
          refundable: true,
          basePrice: entry.deluxePrice,
          totalUnits: 2,
          images: [coverImage],
        },
      ],
    })

    await prisma.review.create({
      data: {
        hotelId: id,
        author: 'Google reviewer',
        rating: Math.min(5, entry.rating + 0.1),
        date: '2026-06-01',
        title: entry.reviewTitle,
        body: entry.reviewBody,
      },
    })

    await upsertWeekendRules(standardRoomId, entry.standardPrice)
    await upsertWeekendRules(deluxeRoomId, entry.deluxePrice)

    console.log(`  ✓ ${entry.name} — ${entry.rating}★ (${entry.reviewCount} reviews)`)
  }

  console.log('Done.')
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
