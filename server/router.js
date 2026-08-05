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

export function matchApiRoute(pathname) {
  const staticRoutes = {
    '/api/auth/signup': './routes/auth/signup.js',
    '/api/auth/login': './routes/auth/login.js',
    '/api/auth/logout': './routes/auth/logout.js',
    '/api/auth/session': './routes/auth/session.js',
    '/api/auth/forgot-password': './routes/auth/forgot-password.js',
    '/api/auth/reset-password': './routes/auth/reset-password.js',
    '/api/bookings': './routes/bookings/index.js',
    '/api/saved': './routes/saved/index.js',
    '/api/saved/toggle': './routes/saved/toggle.js',
    '/api/hotels': './routes/hotels/index.js',
    '/api/admin/hotels': './routes/admin/hotels/index.js',
  }

  if (staticRoutes[pathname]) {
    return { module: staticRoutes[pathname], query: {} }
  }

  const bookingCancel = pathname.match(/^\/api\/bookings\/([^/]+)\/cancel$/)
  if (bookingCancel) {
    return {
      module: './routes/bookings/[bookingId]/cancel.js',
      query: { bookingId: bookingCancel[1] },
    }
  }

  const hotelAvailability = pathname.match(/^\/api\/hotels\/([^/]+)\/availability$/)
  if (hotelAvailability) {
    return {
      module: './routes/hotels/[hotelId]/availability.js',
      query: { hotelId: hotelAvailability[1] },
    }
  }

  const hotelDetail = pathname.match(/^\/api\/hotels\/([^/]+)$/)
  if (hotelDetail) {
    return {
      module: './routes/hotels/[hotelId].js',
      query: { hotelId: hotelDetail[1] },
    }
  }

  const adminHotelDetail = pathname.match(/^\/api\/admin\/hotels\/([^/]+)$/)
  if (adminHotelDetail) {
    return {
      module: './routes/admin/hotels/[hotelId].js',
      query: { hotelId: adminHotelDetail[1] },
    }
  }

  return null
}

export async function handleApiRequest(req, res) {
  const method = req.method || 'GET'
  const url = new URL(req.url || '/', 'http://localhost')
  const pathname = url.pathname
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

    const mod = await import(new URL(match.module, import.meta.url).href)
    const handler = mod?.default

    if (typeof handler !== 'function') {
      res.statusCode = 404
      res.end()
      return
    }

    await handler(anyReq, res)
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
