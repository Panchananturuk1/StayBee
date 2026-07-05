import { prisma } from '../lib/db.js'
import { createSession, normalizeEmail, serializeUser, verifyPassword } from '../lib/auth.js'
import { methodNotAllowed, readJson, sendError, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    const { email = '', password = '' } = await readJson(req)
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || password.length < 6) {
      return sendError(res, 400, 'Email and password are required (min 6 chars).')
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return sendError(res, 401, 'Invalid email or password.')
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash)
    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid email or password.')
    }

    const token = await createSession(user.id)
    return sendJson(res, 200, { user: serializeUser(user), token })
  } catch (error) {
    console.error('login failed', error)
    return sendError(res, 500, 'Unable to sign in right now.')
  }
}
