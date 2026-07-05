import { deleteSession, getSessionToken } from '../lib/auth.js'
import { methodNotAllowed, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    await deleteSession(getSessionToken(req))
    return sendJson(res, 200, { ok: true })
  } catch (error) {
    console.error('logout failed', error)
    return sendJson(res, 200, { ok: true })
  }
}
