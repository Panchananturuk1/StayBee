export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const storageKeys = {
  sessionToken: 'staybee_session_token',
  wishlist: 'staybee_wishlist',
  bookings: 'staybee_bookings',
} as const
