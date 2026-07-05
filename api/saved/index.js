import { prisma } from '../lib/db.js'
import { getAuthenticatedUser } from '../lib/auth.js'
import { methodNotAllowed, sendError, sendException, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  const auth = await getAuthenticatedUser(req)
  if (!auth) {
    return sendError(res, 401, 'Please sign in to manage saved stays.')
  }

  if (req.method === 'GET') {
    try {
      const savedHotels = await prisma.savedHotel.findMany({
        where: { userId: auth.user.id },
        orderBy: { createdAt: 'desc' },
      })

      return sendJson(res, 200, {
        hotelIds: savedHotels.map((entry) => entry.hotelId),
      })
    } catch (error) {
      console.error('saved list failed', error)
      return sendException(res, error, 'Unable to load your saved stays right now.')
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.savedHotel.deleteMany({
        where: { userId: auth.user.id },
      })

      return sendJson(res, 200, { hotelIds: [] })
    } catch (error) {
      console.error('saved clear failed', error)
      return sendException(res, error, 'Unable to clear your saved stays right now.')
    }
  }

  return methodNotAllowed(res, ['GET', 'DELETE'])
}
