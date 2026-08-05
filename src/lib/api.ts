import { getSessionToken, setSessionToken } from '@/lib/tokenStorage'

export { getSessionToken, setSessionToken }

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export function resolveApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath
}

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const headers = new Headers(options.headers)
  const token = getSessionToken()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(resolveApiUrl(path), {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong.', response.status)
  }

  return data as T
}
