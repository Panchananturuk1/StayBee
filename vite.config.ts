import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

function readRequestBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function attachJsonBody(req: IncomingMessage & { body?: unknown }, method: string) {
  if (method === 'GET' || method === 'HEAD') return Promise.resolve()

  return readRequestBody(req).then((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) {
      req.body = {}
      return
    }

    try {
      req.body = JSON.parse(trimmed)
    } catch {
      const error = new Error('Invalid JSON.')
      ;(error as Error & { status?: number }).status = 400
      throw error
    }
  })
}

function matchApiRoute(pathname: string) {
  const staticRoutes: Record<string, string> = {
    '/api/auth/signup': 'api/auth/signup.js',
    '/api/auth/login': 'api/auth/login.js',
    '/api/auth/logout': 'api/auth/logout.js',
    '/api/auth/session': 'api/auth/session.js',
    '/api/auth/forgot-password': 'api/auth/forgot-password.js',
    '/api/auth/reset-password': 'api/auth/reset-password.js',
    '/api/bookings': 'api/bookings/index.js',
    '/api/saved': 'api/saved/index.js',
    '/api/saved/toggle': 'api/saved/toggle.js',
    '/api/hotels': 'api/hotels/index.js',
    '/api/admin/hotels': 'api/admin/hotels/index.js',
  }

  if (staticRoutes[pathname]) {
    return { file: staticRoutes[pathname], query: {} }
  }

  const bookingCancel = pathname.match(/^\/api\/bookings\/([^/]+)\/cancel$/)
  if (bookingCancel) {
    return {
      file: 'api/bookings/[bookingId]/cancel.js',
      query: { bookingId: bookingCancel[1] },
    }
  }

  const hotelAvailability = pathname.match(/^\/api\/hotels\/([^/]+)\/availability$/)
  if (hotelAvailability) {
    return {
      file: 'api/hotels/[hotelId]/availability.js',
      query: { hotelId: hotelAvailability[1] },
    }
  }

  const hotelDetail = pathname.match(/^\/api\/hotels\/([^/]+)$/)
  if (hotelDetail) {
    return {
      file: 'api/hotels/[hotelId].js',
      query: { hotelId: hotelDetail[1] },
    }
  }

  const adminHotelDetail = pathname.match(/^\/api\/admin\/hotels\/([^/]+)$/)
  if (adminHotelDetail) {
    return {
      file: 'api/admin/hotels/[hotelId].js',
      query: { hotelId: adminHotelDetail[1] },
    }
  }

  return null
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    {
      name: 'staybee-api',
      configureServer(server) {
        let envLoaded = false

        function loadDotEnv() {
          if (envLoaded) return
          envLoaded = true

          const envPath = path.resolve(process.cwd(), '.env')
          if (!fs.existsSync(envPath)) return

          const raw = fs.readFileSync(envPath, 'utf8')
          for (const line of raw.split('\n')) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) continue
            const idx = trimmed.indexOf('=')
            if (idx === -1) continue
            const key = trimmed.slice(0, idx).trim()
            let value = trimmed.slice(idx + 1).trim()
            if (
              (value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))
            ) {
              value = value.slice(1, -1)
            }
            if (!process.env[key]) process.env[key] = value
          }
        }

        server.middlewares.use(async (req, res, next) => {
          loadDotEnv()

          const method = req.method || 'GET'
          const url = new URL(req.url || '/', 'http://localhost')
          const pathname = url.pathname

          if (!pathname.startsWith('/api/')) return next()

          const sendNotFound = () => {
            res.statusCode = 404
            res.end()
          }

          const match = matchApiRoute(pathname)

          if (!match) return next()

          try {
            const handlerUrl = `${pathToFileURL(path.resolve(process.cwd(), match.file)).href}?t=${Date.now()}`
            const mod = await import(handlerUrl)
            const handler = mod?.default
            if (typeof handler !== 'function') return sendNotFound()

            const anyReq = req as IncomingMessage & { query?: Record<string, string>; body?: unknown }
            anyReq.query = match.query
            anyReq.method = method

            await attachJsonBody(anyReq, method)

            const anyRes = res as ServerResponse & {
              status: (code: number) => ServerResponse
              send: (body?: unknown) => ServerResponse
            }
            anyRes.status = (code: number) => {
              res.statusCode = code
              return anyRes
            }
            anyRes.send = (body?: unknown) => {
              if (body === undefined) {
                res.end()
                return anyRes
              }
              if (typeof body === 'string' || body instanceof Buffer) {
                res.end(body)
                return anyRes
              }
              res.end(String(body))
              return anyRes
            }

            await handler(anyReq, anyRes)
          } catch (error) {
            console.error(`[staybee-api] ${method} ${pathname} failed`, error)
            if (!res.headersSent) {
              res.statusCode =
                error && typeof error === 'object' && 'status' in error && typeof error.status === 'number'
                  ? error.status
                  : 500
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              const message =
                error instanceof Error && error.message ? error.message : 'Something went wrong.'
              res.end(JSON.stringify({ message }))
            } else {
              res.end()
            }
          }
        })
      },
    },
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
})
