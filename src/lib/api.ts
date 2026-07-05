import { storageKeys } from '@/store/storage'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getSessionToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(storageKeys.sessionToken)
}

export function setSessionToken(token: string | null) {
  if (typeof window === 'undefined') return

  if (token) {
    window.localStorage.setItem(storageKeys.sessionToken, token)
    return
  }

  window.localStorage.removeItem(storageKeys.sessionToken)
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

  const response = await fetch(path, {
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
