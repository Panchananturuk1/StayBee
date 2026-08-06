import { useEffect, useState } from 'react'
import { AVAILABILITY_PREVIEW_DAYS } from '@/constants/availability'
import type { CalendarDay } from '@/types/stay'
import { fetchRoomAvailability } from '@/services/hotels'
import { addDaysToDateInput, todayDateInputValue } from '@/utils/format'

export function useRoomAvailability(hotelId: string, roomId: string) {
  const [days, setDays] = useState<CalendarDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hotelId || !roomId) {
      setDays([])
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    const today = todayDateInputValue()
    const lastPreviewDay = addDaysToDateInput(today, AVAILABILITY_PREVIEW_DAYS - 1)
    const months = [...new Set([today.slice(0, 7), lastPreviewDay.slice(0, 7)])]

    void Promise.all(months.map((month) => fetchRoomAvailability(hotelId, roomId, month)))
      .then((results) => {
        if (cancelled) return
        const merged = results.flatMap((result) => result.days)
        const uniqueDays = [...new Map(merged.map((day) => [day.date, day])).values()]
        setDays(uniqueDays)
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
  }, [hotelId, roomId])

  return { days, isLoading, error }
}
