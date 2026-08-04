import { randomBytes } from 'node:crypto'
import { prisma } from './db.js'

const RESET_TTL_MS = 1000 * 60 * 60

export async function createPasswordResetToken(userId) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TTL_MS)

  await prisma.passwordResetToken.deleteMany({ where: { userId } })

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  return token
}

export async function getValidPasswordResetToken(token) {
  if (!token) return null

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!record) return null

  if (record.expiresAt.getTime() <= Date.now()) {
    await prisma.passwordResetToken.delete({ where: { token } }).catch(() => undefined)
    return null
  }

  return record
}
