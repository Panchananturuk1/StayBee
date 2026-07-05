export async function readJson(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    return req.body.trim() ? JSON.parse(req.body) : {}
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  if (chunks.length === 0) return {}

  const raw = Buffer.concat(chunks).toString('utf8').trim()
  return raw ? JSON.parse(raw) : {}
}

export function sendJson(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(data))
}

export function sendError(res, status, message) {
  return sendJson(res, status, { message })
}

export function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods.join(', '))
  return sendError(res, 405, 'Method not allowed.')
}
