import { prisma } from '../../lib/db.js'
import { createPasswordResetToken } from '../../lib/password-reset.js'
import { normalizeEmail } from '../../lib/auth.js'
import { methodNotAllowed, readJson, sendError, sendException, sendJson } from '../../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    const { email = '' } = await readJson(req)
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return sendError(res, 400, 'Enter a valid email.')
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    const response = {
      message:
        'If an account exists for this email, use the reset link below to choose a new password.',
    }

    if (user) {
      const token = await createPasswordResetToken(user.id)
      response.resetPath = `/auth/reset-password?token=${token}`
    }

    return sendJson(res, 200, response)
  } catch (error) {
    console.error('forgot password failed', error)
    return sendException(res, error, 'Unable to process your reset request right now.')
  }
}
