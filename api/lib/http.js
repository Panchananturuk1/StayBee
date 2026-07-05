export async function readJson(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    try {
      return req.body.trim() ? JSON.parse(req.body) : {}
    } catch {
      const error = new Error('Invalid JSON.')
      error.status = 400
      throw error
    }
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  if (chunks.length === 0) return {}

  const raw = Buffer.concat(chunks).toString('utf8').trim()
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    const error = new Error('Invalid JSON.')
    error.status = 400
    throw error
  }
}

export function sendJson(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(data))
}

export function sendError(res, status, message) {
  return sendJson(res, status, { message })
}

export function sendException(res, error, fallbackMessage) {
  if (error && typeof error === 'object') {
    if ('status' in error && typeof error.status === 'number') {
      const message = typeof error.message === 'string' && error.message ? error.message : fallbackMessage
      return sendError(res, error.status, message)
    }

    if ('code' in error && typeof error.code === 'string') {
      if (error.code === 'P2002') {
        return sendError(res, 409, 'A record with these details already exists.')
      }

      if (error.code === 'P2021' || error.code === 'P2022') {
        return sendError(res, 500, 'Database is not initialized.')
      }
    }
  }

  if (typeof error?.message === 'string') {
    if (error.message.includes('Environment variable not found')) {
      return sendError(res, 500, 'Database is not configured.')
    }
  }

  return sendError(res, 500, fallbackMessage)
}

export function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods.join(', '))
  return sendError(res, 405, 'Method not allowed.')
}
