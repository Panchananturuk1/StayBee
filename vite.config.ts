import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

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

          const match =
            pathname === '/api/auth/signup'
              ? { file: 'api/auth/signup.js', query: {} }
              : pathname === '/api/auth/login'
                ? { file: 'api/auth/login.js', query: {} }
                : pathname === '/api/auth/logout'
                  ? { file: 'api/auth/logout.js', query: {} }
                  : pathname === '/api/auth/session'
                    ? { file: 'api/auth/session.js', query: {} }
                    : pathname === '/api/bookings'
                      ? { file: 'api/bookings/index.js', query: {} }
                      : pathname === '/api/saved'
                        ? { file: 'api/saved/index.js', query: {} }
                        : pathname === '/api/saved/toggle'
                          ? { file: 'api/saved/toggle.js', query: {} }
                          : (() => {
                              const bookingCancel = pathname.match(/^\/api\/bookings\/([^/]+)\/cancel$/)
                              if (bookingCancel) {
                                return {
                                  file: 'api/bookings/[bookingId]/cancel.js',
                                  query: { bookingId: bookingCancel[1] },
                                }
                              }
                              return null
                            })()

          if (!match) return next()

          try {
            const handlerUrl = pathToFileURL(path.resolve(process.cwd(), match.file)).href
            const mod = await import(handlerUrl)
            const handler = mod?.default
            if (typeof handler !== 'function') return sendNotFound()

            const anyReq = req as any
            anyReq.query = match.query
            anyReq.method = method

            const anyRes = res as any
            anyRes.status = (code: number) => {
              res.statusCode = code
              return anyRes
            }
            anyRes.send = (body: unknown) => {
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
          } catch {
            res.statusCode = 500
            res.end()
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
