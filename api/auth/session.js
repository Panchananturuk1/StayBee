import { getAuthenticatedUser, serializeUser } from '../lib/auth.js'
import { methodNotAllowed, sendError, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  try {
    const auth = await getAuthenticatedUser(req)
    if (!auth) {
      return sendError(res, 401, 'Your session has expired. Please sign in again.')
    }

    return sendJson(res, 200, { user: serializeUser(auth.user) })
  } catch (error) {
    console.error('session lookup failed', error)
    return sendError(res, 500, 'Unable to load your session right now.')
  }
}
