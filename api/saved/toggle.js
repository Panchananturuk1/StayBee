import { prisma } from '../lib/db.js'
import { getAuthenticatedUser } from '../lib/auth.js'
import { methodNotAllowed, readJson, sendError, sendException, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  const auth = await getAuthenticatedUser(req)
  if (!auth) {
    return sendError(res, 401, 'Please sign in to save stays.')
  }

  try {
    const { hotelId = '' } = await readJson(req)
    if (!hotelId) {
      return sendError(res, 400, 'Hotel ID is required.')
    }

    const existing = await prisma.savedHotel.findUnique({
      where: {
        userId_hotelId: {
          userId: auth.user.id,
          hotelId,
        },
      },
    })

    if (existing) {
      await prisma.savedHotel.delete({ where: { id: existing.id } })
      return sendJson(res, 200, { saved: false })
    }

    await prisma.savedHotel.create({
      data: {
        userId: auth.user.id,
        hotelId,
      },
    })

    return sendJson(res, 200, { saved: true })
  } catch (error) {
    console.error('saved toggle failed', error)
    return sendException(res, error, 'Unable to update your saved stays right now.')
  }
}
