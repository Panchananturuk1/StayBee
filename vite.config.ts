import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import fs from 'node:fs'
import path from 'node:path'
import { handleApiRequest } from './server/router.js'

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

          const pathname = new URL(req.url || '/', 'http://localhost').pathname
          if (!pathname.startsWith('/api/')) return next()

          try {
            await handleApiRequest(req, res)
          } catch (error) {
            console.error(`[staybee-api] ${req.method || 'GET'} ${pathname} failed`, error)
            next(error)
          }
        })
      },
    },
    react(),
    tsconfigPaths()
  ],
})
