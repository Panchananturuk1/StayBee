import type { Hotel } from '@/types/stay'
import { staybeeImage } from '@/data/images'

export const hotels: Hotel[] = [
  {
    id: 'hb-aurora-berlin',
    name: 'Hotel Aurora',
    location: 'Berlin, Germany',
    propertyType: 'boutique',
    images: [
      staybeeImage(
        'photorealistic boutique hotel lobby in Berlin, warm amber lighting, dark ink-toned walls, brass accents, modern art, cinematic wide angle, high detail, 35mm photography',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic boutique hotel bedroom, crisp white linens, honey-gold accent lamp, textured headboard, moody evening light, cinematic, ultra detailed',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic hotel breakfast table, artisanal bread, coffee, minimal ceramics, warm morning light, shallow depth of field, magazine photography',
        'landscape_16_9',
      ),
    ],
    rating: 4.7,
    reviewCount: 812,
    priceFrom: 189,
    amenities: ['wifi', 'breakfast', 'parking', 'petFriendly'],
    blurb: 'A quiet, design-forward stay two blocks from the late-night pulse of Mitte.',
    rooms: [
      {
        id: 'aurora-studio',
        name: 'Ink Studio',
        occupancy: 2,
        refundable: true,
        pricePerNight: 189,
        images: [
          staybeeImage(
            'photorealistic small boutique hotel studio room, ink-black accent wall, honey-gold bedside lamp, soft shadows, modern minimal furniture, high detail',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'aurora-deluxe',
        name: 'Honey Deluxe',
        occupancy: 3,
        refundable: true,
        pricePerNight: 239,
        images: [
          staybeeImage(
            'photorealistic boutique hotel deluxe room, warm amber highlights, large window, modern chair, clean lines, cinematic lighting, ultra detailed',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'aurora-suite',
        name: 'Aurora Suite',
        occupancy: 4,
        refundable: false,
        pricePerNight: 319,
        images: [
          staybeeImage(
            'photorealistic boutique hotel suite, cozy lounge corner, velvet sofa, brass table, moody night lighting, cinematic wide angle',
            'landscape_16_9',
          ),
        ],
      },
    ],
    reviews: [
      {
        id: 'r-aur-1',
        author: 'Mara',
        rating: 5,
        date: '2026-03-12',
        title: 'Quiet luxury without the fuss',
        body: 'Perfect location, immaculate room, and the breakfast is genuinely great. Staff is calm and competent.',
      },
      {
        id: 'r-aur-2',
        author: 'Jonas',
        rating: 4,
        date: '2026-01-28',
        title: 'Designy, comfy, worth it',
        body: 'Loved the vibe and the lighting. Would book again. The suite is excellent for a short work trip.',
      },
    ],
  },
  {
    id: 'hb-monsoon-bangkok',
    name: 'Monsoon Riverside',
    location: 'Bangkok, Thailand',
    propertyType: 'resort',
    images: [
      staybeeImage(
        'photorealistic riverside resort in Bangkok at sunset, tropical plants, warm lanterns, reflective water, cinematic, ultra detailed',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic resort pool at night, turquoise water glow, palm silhouettes, warm amber lights, high detail, cinematic',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic resort room balcony view over river, soft rain mood, city lights bokeh, cinematic photography',
        'landscape_16_9',
      ),
    ],
    rating: 4.6,
    reviewCount: 1204,
    priceFrom: 142,
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'parking'],
    blurb: 'Rain-kissed calm on the river—cool tiles, slow mornings, and a pool that stays open late.',
    rooms: [
      {
        id: 'monsoon-garden',
        name: 'Garden King',
        occupancy: 2,
        refundable: true,
        pricePerNight: 142,
        images: [
          staybeeImage(
            'photorealistic tropical resort garden king room, natural textures, warm lighting, minimal decor, high detail',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'monsoon-river',
        name: 'River View Twin',
        occupancy: 3,
        refundable: true,
        pricePerNight: 176,
        images: [
          staybeeImage(
            'photorealistic resort room with twin beds and river view, soft daylight, airy curtains, cinematic, ultra detailed',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'monsoon-suite',
        name: 'Lantern Suite',
        occupancy: 4,
        refundable: false,
        pricePerNight: 228,
        images: [
          staybeeImage(
            'photorealistic resort suite living area, lantern lighting, teak wood, calm luxury, cinematic wide angle',
            'landscape_16_9',
          ),
        ],
      },
    ],
    reviews: [
      {
        id: 'r-mon-1',
        author: 'Kanya',
        rating: 5,
        date: '2026-05-04',
        title: 'Pool nights are everything',
        body: 'Great service, beautiful rooms, and the pool after dark feels unreal. Breakfast spread is generous.',
      },
      {
        id: 'r-mon-2',
        author: 'Diego',
        rating: 4,
        date: '2026-02-19',
        title: 'Relaxing base in the city',
        body: 'It feels like a retreat but still close to everything. Riverside rooms are worth the upgrade.',
      },
    ],
  },
  {
    id: 'hb-slate-ocean-lisbon',
    name: 'Slate Ocean Hotel',
    location: 'Lisbon, Portugal',
    propertyType: 'hotel',
    images: [
      staybeeImage(
        'photorealistic oceanfront hotel in Lisbon, modern facade, Atlantic horizon, bright morning, cinematic, ultra detailed',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic hotel room with sea view, clean modern design, soft sunlight, crisp linens, cinematic photography',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic rooftop terrace bar, ocean breeze mood, warm lights, minimalist furniture, golden hour, high detail',
        'landscape_16_9',
      ),
    ],
    rating: 4.5,
    reviewCount: 634,
    priceFrom: 165,
    amenities: ['wifi', 'breakfast', 'seaView', 'gym'],
    blurb: 'A clean-lined oceanfront stay with rooftop sunsets and excellent espresso.',
    rooms: [
      {
        id: 'slate-compact',
        name: 'Compact Queen',
        occupancy: 2,
        refundable: true,
        pricePerNight: 165,
        images: [
          staybeeImage(
            'photorealistic compact modern hotel room, queen bed, warm accent light, clean lines, high detail, cinematic',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'slate-seaview',
        name: 'Sea View King',
        occupancy: 3,
        refundable: true,
        pricePerNight: 204,
        images: [
          staybeeImage(
            'photorealistic hotel room with large window facing ocean, minimal design, soft coastal light, ultra detailed',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'slate-corner',
        name: 'Corner Studio',
        occupancy: 4,
        refundable: false,
        pricePerNight: 248,
        images: [
          staybeeImage(
            'photorealistic corner studio hotel room, lounge chair, ocean horizon, golden hour light, cinematic wide angle',
            'landscape_16_9',
          ),
        ],
      },
    ],
    reviews: [
      {
        id: 'r-sla-1',
        author: 'Amélia',
        rating: 5,
        date: '2026-04-21',
        title: 'Rooftop + sunrise = yes',
        body: 'The rooftop is a highlight. Rooms are spotless and the sea view is genuinely calming.',
      },
      {
        id: 'r-sla-2',
        author: 'Noah',
        rating: 4,
        date: '2026-02-06',
        title: 'Great value ocean stay',
        body: 'Loved the location and the staff. The gym is small but well-equipped.',
      },
    ],
  },
  {
    id: 'hb-courtyard-kyoto',
    name: 'Courtyard Kyo',
    location: 'Kyoto, Japan',
    propertyType: 'boutique',
    images: [
      staybeeImage(
        'photorealistic boutique ryokan-inspired hotel courtyard in Kyoto, lanterns, rain-wet stone, minimalist wood, cinematic, ultra detailed',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic boutique hotel room in Kyoto, tatami-inspired textures, modern bed, warm lantern light, high detail',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic tea corner in boutique hotel lounge, ceramic cups, soft natural light, shallow depth of field',
        'landscape_16_9',
      ),
    ],
    rating: 4.8,
    reviewCount: 957,
    priceFrom: 214,
    amenities: ['wifi', 'breakfast', 'spa'],
    blurb: 'A calm courtyard, modern comfort, and a tea ritual that slows everything down.',
    rooms: [
      {
        id: 'kyo-twin',
        name: 'Twin Tatami',
        occupancy: 2,
        refundable: true,
        pricePerNight: 214,
        images: [
          staybeeImage(
            'photorealistic boutique hotel twin room with tatami-inspired textures, warm lantern light, minimalist design, cinematic',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'kyo-king',
        name: 'Courtyard King',
        occupancy: 3,
        refundable: true,
        pricePerNight: 262,
        images: [
          staybeeImage(
            'photorealistic boutique hotel king room with view into courtyard, warm lighting, natural wood, ultra detailed',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'kyo-suite',
        name: 'Kyoto Suite',
        occupancy: 4,
        refundable: false,
        pricePerNight: 336,
        images: [
          staybeeImage(
            'photorealistic boutique suite with low seating area, textured walls, calm luxury, cinematic wide angle, high detail',
            'landscape_16_9',
          ),
        ],
      },
    ],
    reviews: [
      {
        id: 'r-kyo-1',
        author: 'Sora',
        rating: 5,
        date: '2026-03-03',
        title: 'Stillness in the best way',
        body: 'The courtyard is stunning after rain. Rooms are comfortable, and everything feels thoughtfully designed.',
      },
      {
        id: 'r-kyo-2',
        author: 'Lina',
        rating: 5,
        date: '2026-01-17',
        title: 'Tea service is a moment',
        body: 'Small details everywhere. I would come back just for the atmosphere.',
      },
    ],
  },
  {
    id: 'hb-grove-austin',
    name: 'The Grove Apartments',
    location: 'Austin, USA',
    propertyType: 'apartment',
    images: [
      staybeeImage(
        'photorealistic modern serviced apartment lobby in Austin, concrete and wood, warm lights, plants, cinematic wide angle, high detail',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic modern apartment living room, mid-century chair, warm amber lamp, clean kitchen, high detail, magazine style',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic coworking lounge in serviced apartment, neon sign subtle, laptops, warm lighting, cinematic',
        'landscape_16_9',
      ),
    ],
    rating: 4.4,
    reviewCount: 488,
    priceFrom: 129,
    amenities: ['wifi', 'gym', 'parking', 'petFriendly'],
    blurb: 'Long-stay comfort with a real kitchen and a coworking lounge that stays quiet.',
    rooms: [
      {
        id: 'grove-studio',
        name: 'Studio Loft',
        occupancy: 2,
        refundable: true,
        pricePerNight: 129,
        images: [
          staybeeImage(
            'photorealistic serviced apartment studio loft, warm lighting, modern kitchen corner, clean minimal design, high detail',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'grove-onebed',
        name: 'One-Bedroom',
        occupancy: 3,
        refundable: true,
        pricePerNight: 159,
        images: [
          staybeeImage(
            'photorealistic one-bedroom serviced apartment, cozy living area, warm lamp, modern decor, cinematic wide angle',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'grove-twobed',
        name: 'Two-Bedroom',
        occupancy: 5,
        refundable: false,
        pricePerNight: 219,
        images: [
          staybeeImage(
            'photorealistic two-bedroom serviced apartment, bright living room, clean modern furniture, high detail, cinematic',
            'landscape_16_9',
          ),
        ],
      },
    ],
    reviews: [
      {
        id: 'r-gro-1',
        author: 'Chris',
        rating: 4,
        date: '2026-05-22',
        title: 'Great for a longer stay',
        body: 'Kitchen setup is legit. Loved having a laundry room. Parking is easy.',
      },
      {
        id: 'r-gro-2',
        author: 'Nina',
        rating: 5,
        date: '2026-02-14',
        title: 'Comfort + coworking',
        body: 'The coworking space is quiet and well lit. The apartment felt safe and clean.',
      },
    ],
  },
  {
    id: 'hb-solstice-cape-town',
    name: 'Solstice Ridge',
    location: 'Cape Town, South Africa',
    propertyType: 'resort',
    images: [
      staybeeImage(
        'photorealistic hillside resort in Cape Town overlooking ocean, dramatic clouds, warm lights, cinematic ultra wide, high detail',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic resort room with panoramic windows, ocean and mountains, moody evening light, cinematic photography',
        'landscape_16_9',
      ),
      staybeeImage(
        'photorealistic resort spa interior, stone and wood, warm lantern light, steam haze, ultra detailed, cinematic',
        'landscape_16_9',
      ),
    ],
    rating: 4.9,
    reviewCount: 301,
    priceFrom: 276,
    amenities: ['wifi', 'pool', 'spa', 'seaView', 'breakfast'],
    blurb: 'High altitude calm with ocean views, a stone-and-wood spa, and sunrise silence.',
    rooms: [
      {
        id: 'solstice-king',
        name: 'Ridge King',
        occupancy: 2,
        refundable: true,
        pricePerNight: 276,
        images: [
          staybeeImage(
            'photorealistic luxury resort king room, panoramic window, warm accent lights, modern natural textures, cinematic, high detail',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'solstice-villa',
        name: 'Pool Villa',
        occupancy: 3,
        refundable: true,
        pricePerNight: 344,
        images: [
          staybeeImage(
            'photorealistic private pool villa terrace at dusk, ocean view, warm lighting, cinematic wide angle, ultra detailed',
            'landscape_16_9',
          ),
        ],
      },
      {
        id: 'solstice-suite',
        name: 'Solstice Suite',
        occupancy: 4,
        refundable: false,
        pricePerNight: 418,
        images: [
          staybeeImage(
            'photorealistic luxury suite living area, textured walls, warm honey-gold lighting, ocean view, cinematic, ultra detailed',
            'landscape_16_9',
          ),
        ],
      },
    ],
    reviews: [
      {
        id: 'r-sol-1',
        author: 'Zola',
        rating: 5,
        date: '2026-04-02',
        title: 'Views that reset your brain',
        body: 'Everywhere you look is stunning. Spa is top-tier. It feels secluded in the best way.',
      },
      {
        id: 'r-sol-2',
        author: 'Ethan',
        rating: 5,
        date: '2026-01-09',
        title: 'Unreal service',
        body: 'From check-in to breakfast to the pool, everything was smooth and warm.',
      },
    ],
  },
]

export function getHotelById(hotelId: string) {
  return hotels.find((h) => h.id === hotelId)
}
