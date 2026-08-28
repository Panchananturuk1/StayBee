import { useEffect, useState } from 'react'
import { AVAILABILITY_PREVIEW_DAYS } from '@/constants/availability'
import type { CalendarDay } from '@/types/stay'
import { fetchRoomAvailability } from '@/services/hotels'
import { addDaysToDateInput } from '@/utils/format'

export function previewDates(startDate: string) {
  if (!startDate) return []
  return Array.from({ length: AVAILABILITY_PREVIEW_DAYS }, (_, offset) =>
    addDaysToDateInput(startDate, offset),
  )
}

export function useRoomAvailability(hotelId: string, roomId: string, startDate: string) {
  const [days, setDays] = useState<CalendarDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hotelId || !roomId || !startDate) {
      setDays([])
      return
    }

    const wanted = previewDates(startDate)
    // The preview window can straddle a month boundary, so fetch each month it touches.
    const months = [...new Set(wanted.map((date) => date.slice(0, 7)))]

    let cancelled = false
    setIsLoading(true)
    setError(null)

    void Promise.all(months.map((month) => fetchRoomAvailability(hotelId, roomId, month)))
      .then((responses) => {
        if (cancelled) return
        const wantedSet = new Set(wanted)
        const merged = responses
          .flatMap((response) => response.days)
          .filter((day) => wantedSet.has(day.date))
          .sort((a, b) => a.date.localeCompare(b.date))
        setDays(merged)
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
  }, [hotelId, roomId, startDate])

  return { days, isLoading, error }
}
