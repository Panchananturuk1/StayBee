import { prisma } from '../lib/db.js'
import { createSession, hashPassword, normalizeEmail, serializeUser } from '../lib/auth.js'
import { methodNotAllowed, readJson, sendError, sendJson } from '../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    const { fullName = '', email = '', password = '' } = await readJson(req)
    const normalizedEmail = normalizeEmail(email)
    const trimmedName = fullName.trim()

    if (!trimmedName) {
      return sendError(res, 400, 'Full name is required.')
    }

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return sendError(res, 400, 'Enter a valid email.')
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters.')
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return sendError(res, 409, 'An account with this email already exists.')
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName: trimmedName,
        passwordHash: await hashPassword(password),
      },
    })

    const token = await createSession(user.id)
    return sendJson(res, 201, { user: serializeUser(user), token })
  } catch (error) {
    console.error('signup failed', error)
    return sendError(res, 500, 'Unable to create your account right now.')
  }
}
