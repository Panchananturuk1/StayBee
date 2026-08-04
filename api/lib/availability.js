const MS_PER_DAY = 1000 * 60 * 60 * 24

export function parseDateInput(value) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

export function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysToDateInput(dateISO, days) {
  const date = parseDateInput(dateISO)
  if (!date) return dateISO
  date.setDate(date.getDate() + days)
  return formatDateInput(date)
}

export function eachNight(checkIn, checkOut) {
  const start = parseDateInput(checkIn)
  const end = parseDateInput(checkOut)
  if (!start || !end || start >= end) return []

  const nights = []
  const cursor = new Date(start)
  while (cursor < end) {
    nights.push(formatDateInput(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return nights
}

export function datesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
  return checkInA < checkOutB && checkInB < checkOutA
}

export function countBookingsForNight(bookings, night) {
  const nextDay = addDaysToDateInput(night, 1)
  return bookings.filter((booking) => datesOverlap(booking.checkIn, booking.checkOut, night, nextDay)).length
}

export function getPriceForNight(room, priceRules, dateISO) {
  const dateRule = priceRules.find((rule) => rule.date === dateISO)
  if (dateRule) return dateRule.price

  const date = parseDateInput(dateISO)
  if (!date) return room.basePrice

  const dayOfWeek = date.getDay()
  const dayRule = priceRules.find((rule) => rule.dayOfWeek === dayOfWeek)
  if (dayRule) return dayRule.price

  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return Math.round(room.basePrice * 1.15)
  }

  return room.basePrice
}

export function calculateStayPricing(room, priceRules, checkIn, checkOut) {
  const nights = eachNight(checkIn, checkOut)
  const nightlyPrices = nights.map((night) => ({
    date: night,
    price: getPriceForNight(room, priceRules, night),
  }))

  const total = nightlyPrices.reduce((sum, night) => sum + night.price, 0)
  const averagePerNight = nights.length > 0 ? Math.round(total / nights.length) : room.basePrice

  return {
    nights: nights.length,
    total,
    averagePerNight,
    nightlyPrices,
  }
}

export function getRoomAvailability(room, bookings, checkIn, checkOut) {
  const nights = eachNight(checkIn, checkOut)
  if (nights.length === 0) {
    return {
      availableUnits: room.totalUnits,
      soldOut: false,
      limited: false,
    }
  }

  let minAvailable = room.totalUnits

  for (const night of nights) {
    const bookedCount = countBookingsForNight(bookings, night)
    const available = Math.max(0, room.totalUnits - bookedCount)
    minAvailable = Math.min(minAvailable, available)
  }

  return {
    availableUnits: minAvailable,
    soldOut: minAvailable === 0,
    limited: minAvailable > 0 && minAvailable <= Math.max(1, Math.floor(room.totalUnits / 2)),
  }
}

export function buildCalendarDays(room, priceRules, bookings, monthISO) {
  const [year, month] = monthISO.split('-').map(Number)
  if (!year || !month) return []

  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateISO = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const nextDay = addDaysToDateInput(dateISO, 1)
    const bookedCount = countBookingsForNight(bookings, dateISO)
    const availableUnits = Math.max(0, room.totalUnits - bookedCount)
    const price = getPriceForNight(room, priceRules, dateISO)

    let status = 'available'
    if (availableUnits === 0) status = 'soldout'
    else if (availableUnits <= Math.max(1, Math.floor(room.totalUnits / 2))) status = 'limited'

    days.push({
      date: dateISO,
      price,
      availableUnits,
      totalUnits: room.totalUnits,
      status,
      checkInAllowed: availableUnits > 0,
      checkOutAllowed: true,
    })
  }

  return days
}

export function getMonthBounds(monthISO) {
  const [year, month] = monthISO.split('-').map(Number)
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

export function isValidStayRange(checkIn, checkOut) {
  const start = parseDateInput(checkIn)
  const end = parseDateInput(checkOut)
  if (!start || !end || start >= end) return false
  return true
}

export function nightsBetween(checkIn, checkOut) {
  return eachNight(checkIn, checkOut).length
}

export function msUntilCheckIn(checkIn) {
  const date = parseDateInput(checkIn)
  if (!date) return 0
  return date.getTime() - Date.now()
}
