import { prisma } from '../../lib/db.js'
import { getValidPasswordResetToken } from '../../lib/password-reset.js'
import { hashPassword } from '../../lib/auth.js'
import { methodNotAllowed, readJson, sendError, sendException, sendJson } from '../../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    const { token = '', password = '' } = await readJson(req)

    if (!token) {
      return sendError(res, 400, 'Reset token is required.')
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters.')
    }

    const record = await getValidPasswordResetToken(token)
    if (!record) {
      return sendError(res, 400, 'This reset link is invalid or has expired.')
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: {
        passwordHash: await hashPassword(password),
      },
    })

    await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } })
    await prisma.session.deleteMany({ where: { userId: record.userId } })

    return sendJson(res, 200, {
      message: 'Password updated. You can sign in with your new password.',
    })
  } catch (error) {
    console.error('reset password failed', error)
    return sendException(res, error, 'Unable to reset your password right now.')
  }
}
