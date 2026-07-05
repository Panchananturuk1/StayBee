import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from './db.js'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}

export async function createSession(userId) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  return token
}

export function getSessionToken(req) {
  const header = req.headers.authorization || req.headers.Authorization
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim()
  }

  return null
}

export async function getAuthenticatedUser(req) {
  const token = getSessionToken(req)
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) return null

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { token } }).catch(() => undefined)
    return null
  }

  return {
    sessionToken: token,
    user: session.user,
  }
}

export async function deleteSession(token) {
  if (!token) return
  await prisma.session.deleteMany({ where: { token } })
}
