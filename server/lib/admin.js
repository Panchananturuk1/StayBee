import { getAuthenticatedUser } from './auth.js'

export function isAdminUser(user) {
  if (!user) return false
  if (user.role === 'ADMIN') return true

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

  return adminEmails.includes(user.email.toLowerCase())
}

export async function requireAdmin(req, res, sendError) {
  const auth = await getAuthenticatedUser(req)
  if (!auth) {
    sendError(res, 401, 'Please sign in as an admin.')
    return null
  }

  if (!isAdminUser(auth.user)) {
    sendError(res, 403, 'Admin access is required.')
    return null
  }

  return auth
}
