import { addDaysToDateInput, toDateInputValue, todayDateInputValue } from '@/utils/format'

export type DateRangeInput = { checkIn: string; checkOut: string }

export function tonightRange(): DateRangeInput {
  const checkIn = todayDateInputValue()
  return { checkIn, checkOut: addDaysToDateInput(checkIn, 1) }
}

/** The Friday of the current week, or today when it is already Friday. */
export function upcomingWeekendRange(): DateRangeInput {
  const today = new Date()
  const daysUntilFriday = (5 - today.getDay() + 7) % 7
  const friday = new Date(today)
  friday.setDate(today.getDate() + daysUntilFriday)

  const checkIn = toDateInputValue(friday)
  return { checkIn, checkOut: addDaysToDateInput(checkIn, 2) }
}

export function nextWeekRange(): DateRangeInput {
  const checkIn = addDaysToDateInput(todayDateInputValue(), 7)
  return { checkIn, checkOut: addDaysToDateInput(checkIn, 2) }
}
