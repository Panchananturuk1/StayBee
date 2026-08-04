import authSignup from './routes/auth/signup.js'
import authLogin from './routes/auth/login.js'
import authLogout from './routes/auth/logout.js'
import authSession from './routes/auth/session.js'
import authForgotPassword from './routes/auth/forgot-password.js'
import authResetPassword from './routes/auth/reset-password.js'
import bookingsIndex from './routes/bookings/index.js'
import bookingCancel from './routes/bookings/[bookingId]/cancel.js'
import savedIndex from './routes/saved/index.js'
import savedToggle from './routes/saved/toggle.js'
import hotelsIndex from './routes/hotels/index.js'
import hotelDetail from './routes/hotels/[hotelId].js'
import hotelAvailability from './routes/hotels/[hotelId]/availability.js'
import adminHotelsIndex from './routes/admin/hotels/index.js'
import adminHotelDetail from './routes/admin/hotels/[hotelId].js'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function attachJsonBody(req, method) {
  if (method === 'GET' || method === 'HEAD') return

  if (req.body && typeof req.body === 'object') return

  const raw = await readRequestBody(req)
  const trimmed = raw.trim()
  if (!trimmed) {
    req.body = {}
    return
  }

  try {
    req.body = JSON.parse(trimmed)
  } catch {
    const error = new Error('Invalid JSON.')
    error.status = 400
    throw error
  }
}

function ensureResponseHelpers(res) {
  if (typeof res.status !== 'function') {
    res.status = (code) => {
      res.statusCode = code
      return res
    }
  }

  if (typeof res.send !== 'function') {
    res.send = (body) => {
      if (body === undefined) {
        res.end()
        return res
      }
      if (typeof body === 'string' || body instanceof Buffer) {
        res.end(body)
        return res
      }
      res.end(String(body))
      return res
    }
  }
}

const staticRoutes = {
  '/api/auth/signup': authSignup,
  '/api/auth/login': authLogin,
  '/api/auth/logout': authLogout,
  '/api/auth/session': authSession,
  '/api/auth/forgot-password': authForgotPassword,
  '/api/auth/reset-password': authResetPassword,
  '/api/bookings': bookingsIndex,
  '/api/saved': savedIndex,
  '/api/saved/toggle': savedToggle,
  '/api/hotels': hotelsIndex,
  '/api/admin/hotels': adminHotelsIndex,
}

function resolveRequestUrl(req) {
  const rawUrl = req.url || '/'
  const url = new URL(rawUrl, 'http://localhost')

  if (url.pathname === '/api') {
    const subpath = url.searchParams.get('__path')
    if (subpath !== null) {
      const pathname = subpath ? `/api/${subpath}` : '/api'
      url.searchParams.delete('__path')
      return new URL(`${pathname}?${url.searchParams}`, 'http://localhost')
    }
  }

  const pathQuery = req.query?.path
  if (pathQuery && (url.pathname === '/api' || url.pathname.endsWith('/api'))) {
    const suffix = Array.isArray(pathQuery) ? pathQuery.join('/') : String(pathQuery)
    const pathname = suffix ? `/api/${suffix}` : '/api'
    return new URL(`${pathname}?${url.searchParams}`, 'http://localhost')
  }

  return url
}

export function matchApiRoute(pathname) {
  if (staticRoutes[pathname]) {
    return { handler: staticRoutes[pathname], query: {} }
  }

  const bookingCancelMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/cancel$/)
  if (bookingCancelMatch) {
    return {
      handler: bookingCancel,
      query: { bookingId: bookingCancelMatch[1] },
    }
  }

  const hotelAvailabilityMatch = pathname.match(/^\/api\/hotels\/([^/]+)\/availability$/)
  if (hotelAvailabilityMatch) {
    return {
      handler: hotelAvailability,
      query: { hotelId: hotelAvailabilityMatch[1] },
    }
  }

  const hotelDetailMatch = pathname.match(/^\/api\/hotels\/([^/]+)$/)
  if (hotelDetailMatch) {
    return {
      handler: hotelDetail,
      query: { hotelId: hotelDetailMatch[1] },
    }
  }

  const adminHotelDetailMatch = pathname.match(/^\/api\/admin\/hotels\/([^/]+)$/)
  if (adminHotelDetailMatch) {
    return {
      handler: adminHotelDetail,
      query: { hotelId: adminHotelDetailMatch[1] },
    }
  }

  return null
}

export async function handleApiRequest(req, res) {
  const method = req.method || 'GET'
  const url = resolveRequestUrl(req)
  const pathname = url.pathname
  req.url = `${url.pathname}${url.search}`
  const match = matchApiRoute(pathname)

  if (!match) {
    res.statusCode = 404
    res.end()
    return
  }

  try {
    ensureResponseHelpers(res)

    const anyReq = req
    anyReq.query = { ...(anyReq.query || {}), ...match.query }
    anyReq.method = method

    await attachJsonBody(anyReq, method)
    await match.handler(anyReq, res)
  } catch (error) {
    console.error(`[staybee-api] ${method} ${pathname} failed`, error)

    if (!res.headersSent) {
      res.statusCode =
        error && typeof error === 'object' && 'status' in error && typeof error.status === 'number'
          ? error.status
          : 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      const message = error instanceof Error && error.message ? error.message : 'Something went wrong.'
      res.end(JSON.stringify({ message }))
    } else {
      res.end()
    }
  }
}
