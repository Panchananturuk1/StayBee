import { useEffect, useState } from 'react'
import type { CalendarDay } from '@/types/stay'
import { fetchRoomAvailability } from '@/services/hotels'

export function useRoomAvailability(hotelId: string, roomId: string, month: string) {
  const [days, setDays] = useState<CalendarDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hotelId || !roomId || !month) {
      setDays([])
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    void fetchRoomAvailability(hotelId, roomId, month)
      .then((data) => {
        if (cancelled) return
        setDays(data.days)
      })
      .catch(() => {
        if (cancelled) return
        setError('Unable to load availability right now.')
        setDays([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [hotelId, month, roomId])

  return { days, isLoading, error }
}
